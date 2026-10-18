import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
export const key = p => process.platform === 'win32' ? path.resolve(p).toLowerCase() : path.resolve(p);
export const inside = (p, root) => {
  const parent = key(root), child = key(p);
  return child === parent || child.startsWith(parent.endsWith(path.sep) ? parent : parent + path.sep);
};
export function absolute(p) {
  if (typeof p !== 'string' || !path.isAbsolute(p) || /[<>\x00-\x1f]/.test(p) ||
      /^\\\\/.test(p) || (process.platform === 'win32' && p.slice(2).includes(':')))
    throw new Error('Require a concrete absolute local path without control characters');
  return path.normalize(p);
}
export function secretName(p) {
  const parts = String(p).replaceAll('\\', '/').toLowerCase().split('/');
  return parts.some(n => /^(?:_?vault|\.?secrets?|\.ssh|\.aws|\.gnupg|\.azure)$/.test(n) ||
    /^\.env(?:$|[.-])/.test(n) || /\.env$/.test(n) ||
    /^(?:\.?credentials?|\.?creds|\.?tokens?|auth|api[_-]?keys?|access[_-]?keys?)(?:$|[._-])/.test(n) ||
    /(?:^|[._-])(?:credentials?|tokens?|secrets?)(?:[._-]|$)/.test(n) ||
    /\.(?:pem|key|p12|pfx|p8|kdbx)$/.test(n) ||
    /^(?:\.claude\.json(?:\..*)?|\.git-credentials|\.npmrc|\.pypirc|\.netrc|id_rsa|id_ed25519)$/.test(n)) ||
    /(?:^|\/)\.docker\/config\.json$/.test(parts.join('/'));
}
export function stat(p) {
  try { return fs.lstatSync(p); } catch (e) { if (e.code === 'ENOENT') return null; throw e; }
}
export function chain(p, allowLeafLink = false) {
  p = absolute(p);
  const parsed = path.parse(p);
  let current = parsed.root;
  const segments = p.slice(parsed.root.length).split(path.sep).filter(Boolean);
  for (let i = 0; i < segments.length; i++) {
    current = path.join(current, segments[i]);
    const s = stat(current);
    if (s?.isSymbolicLink() && !(allowLeafLink && i === segments.length - 1))
      throw new Error('A path ancestor is a link; use its reviewed physical path');
  }
  return p;
}
export function safe(p, allowLeafLink = false) {
  p = absolute(p);
  if (secretName(p)) throw new Error('Opaque path refused');
  return chain(p, allowLeafLink);
}
export function regular(p) {
  safe(p);
  const s = stat(p);
  if (!s?.isFile() || s.nlink !== 1) throw new Error('Require one ordinary file, without hardlinks');
  return s;
}
export function digest(p) {
  regular(p);
  const before = fs.statSync(p);
  const h = sha(fs.readFileSync(p));
  const after = fs.statSync(p);
  if (before.size !== after.size || before.mtimeMs !== after.mtimeMs || before.ino !== after.ino)
    throw new Error('File changed during hashing');
  return h;
}
export function fingerprint(p) {
  safe(p);
  const s = stat(p);
  if (s?.isFile()) return digest(p);
  if (!s?.isDirectory()) throw new Error('Source is missing or unsupported');
  const records = [];
  function walk(dir, rel) {
    for (const name of fs.readdirSync(dir).sort()) {
      const full = path.join(dir, name), relative = rel ? rel + '/' + name : name;
      safe(full);
      const st = stat(full);
      if (st?.isDirectory()) { records.push(['directory', relative]); walk(full, relative); }
      else if (st?.isFile()) records.push(['file', relative, digest(full)]);
      else throw new Error('Directory contains a link or special file');
    }
  }
  walk(p, '');
  return sha(JSON.stringify(records));
}
export function parseCsv(input) {
  input = input.replace(/^\uFEFF/, '');
  const rows = [];
  let row = [], field = '', quoted = false, closed = false, start = true;
  const finishField = () => { row.push(field); field = ''; closed = false; start = true; };
  const finishRow = () => { finishField(); if (row.some(x => x !== '')) rows.push(row); row = []; };
  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    if (!quoted && row.length === 0 && field === '' && start && c === '#') {
      while (i < input.length && input[i] !== '\n') i++;
      continue;
    }
    if (quoted) {
      if (c === '"') {
        if (input[i + 1] === '"') { field += '"'; i++; }
        else { quoted = false; closed = true; }
      } else field += c;
    } else if (c === '"' && start) { quoted = true; start = false; }
    else if (c === ',') finishField();
    else if (c === '\n') finishRow();
    else if (c === '\r' && input[i + 1] === '\n') { finishRow(); i++; }
    else {
      if (closed || c === '"' || c === '\r') throw new Error('Malformed CSV quoting');
      field += c; start = false;
    }
  }
  if (quoted) throw new Error('Unclosed CSV field');
  if (field || row.length || closed) finishRow();
  if (!rows.length) throw new Error('CSV has no header');
  const header = rows.shift();
  if (new Set(header).size !== header.length || header.some(x => !x)) throw new Error('Invalid CSV header');
  return {header, rows: rows.map(r => {
    if (r.length !== header.length) throw new Error('CSV column count mismatch');
    return Object.fromEntries(header.map((h, i) => [h, r[i]]));
  })};
}
export function readCsv(p, header) {
  regular(p);
  const parsed = parseCsv(fs.readFileSync(p, 'utf8'));
  if (header && JSON.stringify(parsed.header) !== JSON.stringify(header)) throw new Error('Unexpected CSV columns');
  return parsed.rows;
}
export function csv(header, rows) {
  const cell = v => '"' + String(v ?? '').replaceAll('"', '""') + '"';
  return [header, ...rows.map(r => header.map(h => r[h]))].map(r => r.map(cell).join(',')).join('\r\n') + '\r\n';
}
export function newFile(p, bytes) {
  safe(p);
  if (!stat(path.dirname(p))?.isDirectory()) throw new Error('Output parent must already exist');
  fs.writeFileSync(p, bytes, {flag:'wx'});
}
export function args(argv, allowed) {
  const result = {};
  for (let i = 0; i < argv.length; i++) {
    const name = argv[i];
    if (!allowed.includes(name) || name in result) throw new Error('Unknown or duplicate option');
    if (name === '--execute') result[name] = true;
    else {
      if (argv[i + 1] === undefined || argv[i + 1].startsWith('--')) throw new Error('Missing option value');
      result[name] = argv[++i];
    }
  }
  return result;
}

