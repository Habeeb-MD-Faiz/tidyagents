// Shared dependency-free engine. Wrappers do not change the safety contract.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {sha,key,inside,absolute,secretName,stat,chain,safe,regular,digest,fingerprint,parseCsv,readCsv,csv,newFile,args} from './lib/safety.mjs';

const PLAN = ['id','tool','profile','operation','source','target','source_sha256','expected_target','reviewed','decision','content_reviewed'];
const INVENTORY = ['path','tool','kind','size','sha256','link_target','last_write_utc','status'];
const REPORT = ['id','tool','target','status','detail'];
const LOG = ['time_utc','id','action','target','detail'];
const ARCHIVE = ['id','original','backup','retained_original','sha256','status'];
const hashPattern = /^[a-f0-9]{64}$/i;
function output(text, out, roots = []) {
  if (!out) { process.stdout.write(text); return; }
  out = safe(out);
  if (roots.some(r => inside(out, r))) throw new Error('Report must be outside scanned or planned trees');
  newFile(out, text);
}
function discovery(opts) {
  const home = safe(opts['--home'] || os.homedir());
  const explicitHome = Boolean(opts['--home']);
  const repo = opts['--repo'] ? safe(opts['--repo']) : null;
  if (opts['--ancestor-root'] && !repo) throw new Error('Ancestor root requires a repository');
  const boundary = repo ? safe(opts['--ancestor-root'] || (explicitHome && inside(repo,home) ? home : repo)) : null;
  if (repo && !inside(repo,boundary)) throw new Error('Repository must be inside ancestor root');
  const roots = [
    [path.join(home,'.claude'),'Claude Code'],
    [path.join(home,'.claude.json'),'Claude Code'],
    [path.join(home,'.codex'),'Codex'],
    [path.join(home,'.agents','skills'),'shared'],
    [path.join(home,'.gemini'),'Gemini CLI'],
    [path.join(home,'.cursor'),'Cursor']
  ];
  // Explicit fake/alternate home never inherits the caller's real profile overrides.
  if (!explicitHome) for (const [variable, tool] of [['CLAUDE_CONFIG_DIR','Claude Code'],['CODEX_HOME','Codex']]) {
    if (process.env[variable]) roots.push([absolute(process.env[variable]),tool]);
  }
  if (opts['--roots']) for (const r of readCsv(opts['--roots'], ['path','tool'])) roots.push([absolute(r.path),r.tool]);
  if (repo) {
    roots.push([repo,'repository']);
    // Discovery is bounded independently of chain() lstat safety checks.
    let parent = repo;
    while (key(parent) !== key(boundary)) {
      parent = path.dirname(parent);
      for (const name of ['AGENTS.md','AGENTS.override.md','CLAUDE.md','CLAUDE.local.md','GEMINI.md'])
        roots.push([path.join(parent,name),'ancestor']);
    }
  }
  const approved = new Set(opts['--approved-files'] ?
    readCsv(opts['--approved-files'],['path']).map(r => key(safe(r.path))) : []);
  const rows = [], seen = new Set();
  let incomplete = false, count = 0, capped = false;
  const excluded = new Set(['.git','node_modules','runs','.tidyagents-archive','archive','archives']);
  const known = /^(?:AGENTS(?:\.override)?\.md|CLAUDE(?:\.local)?\.md|GEMINI\.md|SCOPE\.md|\.cursorrules|\.mcp\.json)$/i;
  function walk(p, tool, inConfig = true) {
    if (capped) return;
    if (seen.has(key(p))) return;
    seen.add(key(p));
    if (++count > 50000) {
      capped = true; incomplete = true;
      rows.push({path:p,tool,kind:'unknown',status:'scan-limit-use-narrower-roots'});
      return;
    }
    if (secretName(p)) {
      try {
        chain(p,true);
        rows.push(stat(p) ? {path:p,tool,kind:'opaque',status:'name-only'} : {path:p,tool,kind:'missing',status:'absent'});
      } catch { rows.push({path:p,tool,kind:'opaque',status:'name-only-unchecked'}); incomplete = true; }
      return;
    }
    let st;
    try { chain(p,true); st = stat(p); }
    catch { rows.push({path:p,tool,kind:'unknown',status:'unreadable-or-linked-ancestor'}); incomplete = true; return; }
    if (!st) { if (inConfig) rows.push({path:p,tool,kind:'missing',status:'absent'}); return; }
    if (st.isSymbolicLink()) {
      let target = '';
      try { target = fs.readlinkSync(p); } catch { incomplete = true; }
      rows.push({path:p,tool,kind:'link',link_target:target,status:'not-followed'});
      return;
    }
    if (st.isDirectory()) {
      if (excluded.has(path.basename(p).toLowerCase())) {
        rows.push({path:p,tool,kind:'directory',status:'excluded'}); return;
      }
      let names;
      try { names = fs.readdirSync(p).sort(); }
      catch { rows.push({path:p,tool,kind:'directory',status:'unreadable'}); incomplete = true; return; }
      for (const name of names) {
        const childConfig = inConfig || ['.claude','.codex','.gemini','.cursor','.agents'].includes(name);
        walk(path.join(p,name),tool,childConfig);
      }
    } else if (inConfig || known.test(path.basename(p))) {
      const row = {path:p,tool,kind:st.isFile()?'file':'special',size:st.size,last_write_utc:st.mtime.toISOString(),status:'metadata-only'};
      if (st.isFile() && approved.has(key(p))) {
        try { row.sha256 = digest(p); row.status = 'hashed-approved'; }
        catch { row.status = 'hash-refused'; incomplete = true; }
      }
      rows.push(row);
    }
  }
  // Repository files are selected by config directory/name; arbitrary project contents stay unread.
  for (const [root, tool] of roots) walk(root,tool,tool !== 'repository');
  output(csv(INVENTORY,rows),opts['--output'],roots.map(r => r[0]));
  return incomplete ? 2 : 0;
}
function loadPlan(file) {
  file = safe(file);
  const rows = readCsv(file, PLAN);
  if (!rows.length) throw new Error('Plan must have at least one row');
  const ids = new Set();
  for (const r of rows) {
    if (!/^[a-z0-9][a-z0-9_-]{0,63}$/.test(r.id) || ids.has(r.id)) throw new Error('Plan ids must be unique safe names');
    ids.add(r.id);
    if (!['copy','symlink','junction'].includes(r.operation)) throw new Error('Unsupported operation');
    if (r.reviewed !== 'yes' || r.content_reviewed !== 'yes' || !r.decision.trim()) throw new Error('Plan needs owner review and content clearance');
    r.source = safe(r.source); r.target = safe(r.target,true);
    if (!hashPattern.test(r.source_sha256) || !(r.expected_target === 'absent' || hashPattern.test(r.expected_target)))
      throw new Error('Require pinned SHA-256 values or absent target');
    if (inside(file,r.target) || inside(r.source,r.target) || inside(r.target,r.source))
      throw new Error('Plan/source/target paths overlap');
    if (r.operation === 'junction' && process.platform !== 'win32') throw new Error('Junctions require Windows');
  }
  for (let i=0;i<rows.length;i++) for(let j=i+1;j<rows.length;j++) {
    const a=rows[i],b=rows[j];
    if (inside(a.target,b.target)||inside(b.target,a.target)||inside(a.source,b.target)||inside(b.target,a.source)||
        inside(b.source,a.target)||inside(a.target,b.source))
      throw new Error('Plan rows overlap');
  }
  return rows;
}
function assess(r) {
  safe(r.source); safe(r.target,true);
  if (fingerprint(r.source).toLowerCase() !== r.source_sha256.toLowerCase()) throw new Error('Source drift');
  const sourceStat=stat(r.source), targetStat=stat(r.target);
  if (r.operation === 'copy' && !sourceStat.isFile()) throw new Error('Copy supports ordinary files only');
  if (r.operation === 'junction' && !sourceStat.isDirectory()) throw new Error('Junction source must be a directory');
  if (targetStat?.isSymbolicLink()) {
    const actual=path.resolve(path.dirname(r.target),fs.readlinkSync(r.target));
    if (r.operation !== 'copy' && key(actual) === key(r.source)) return 'current';
    throw new Error('Conflicting link; retain it and review a separate relocation');
  }
  if (targetStat && !targetStat.isFile()) throw new Error('Existing target must be an ordinary file');
  if (targetStat && digest(r.target).toLowerCase() === r.source_sha256.toLowerCase() && r.operation === 'copy') return 'current';
  if (targetStat) {
    if (r.operation !== 'copy') throw new Error('Link creation requires an absent target');
    if (r.expected_target === 'absent' || digest(r.target).toLowerCase() !== r.expected_target.toLowerCase())
      throw new Error('Target conflict');
  } else if (r.expected_target !== 'absent') throw new Error('Expected original is missing');
  return 'change';
}
function doctor(opts) {
  const rows=loadPlan(opts['--plan']), report=[];
  let blocked=0, deferred=0;
  const coverage=Boolean(opts['--findings'] || opts['--deferred']);
  for (const option of ['--findings','--deferred']) {
    if (!opts[option]) continue;
    regular(opts[option]); // Only owner-cleared non-secret run records belong here.
    const record=parseCsv(fs.readFileSync(opts[option],'utf8'));
    if (!['id','status'].every(h=>record.header.includes(h))) throw new Error('Run records require id and status columns');
    for (const item of record.rows) {
      const status=item.status.trim().toLowerCase();
      if (!item.id.trim()) throw new Error('Run records require an item id');
      if (status==='deferred') deferred++;
      else if (['open','accepted','blocked'].includes(status)) blocked++;
      else if (!['fixed','resolved','closed'].includes(status)) throw new Error('Unknown run item status');
    }
  }
  for(const r of rows) {
    try {
      const state=assess(r);
      report.push({id:r.id,tool:r.tool,target:r.target,status:state==='current'?'PASS':'DRIFT',detail:state==='current'?'matches plan':'not applied'});
    } catch(e) { report.push({id:r.id,tool:r.tool,target:r.target,status:'DRIFT',detail:e.message}); }
  }
  output(csv(REPORT,report),opts['--output'],rows.flatMap(r=>[r.source,r.target]));
  const passed=report.filter(r=>r.status==='PASS').length;
  const state=passed!==rows.length || blocked ? 'BLOCKED' : deferred ? 'DEFERRED' : 'NOT VERIFIED';
  process.stderr.write('RUN SUMMARY: adapters PASS '+passed+'/'+rows.length+'; '+
    (coverage ? 'blocked '+blocked+'; deferred '+deferred : 'findings/deferred not supplied')+
    '; reconciliation '+state+' (file integrity only)\n');
  return passed===rows.length?0:1;
}
function apply(opts) {
  const file=safe(opts['--plan']), rows=loadPlan(file), planHash=digest(file);
  const states=rows.map(r=>assess(r)); // Preflight every row before any write.
  // A preview must catch missing parents too, before execution is requested.
  for(const r of rows) if(!stat(path.dirname(r.target))?.isDirectory()) throw new Error('Target parent must exist');
  if (!opts['--execute']) {
    process.stdout.write(csv(REPORT,rows.map((r,i)=>({id:r.id,tool:r.tool,target:r.target,status:'DRY-RUN',detail:states[i]}))));
    process.stdout.write('PLAN SHA256 '+planHash+'\n');
    return 0;
  }
  if (!hashPattern.test(opts['--reviewed-plan-sha256']||'') || opts['--reviewed-plan-sha256'].toLowerCase()!==planHash)
    throw new Error('Execute requires the exact reviewed plan SHA-256');
  if (states.every(s=>s==='current')) { process.stdout.write('APPLY NO-OP: all rows already match\n'); return 0; }
  const run=safe(opts['--run']);
  if(stat(run)) throw new Error('Run directory must be new');
  if(rows.some(r=>inside(run,r.source)||inside(r.source,run)||inside(run,r.target)||inside(r.target,run))||inside(file,run))
    throw new Error('Run directory overlaps planned data');
  if(!stat(path.dirname(run))?.isDirectory()) throw new Error('Run parent must exist');
  fs.mkdirSync(run);
  const log=path.join(run,'change-log.csv'), manifest=path.join(run,'archive-manifest.csv');
  newFile(log,csv(LOG,[])); newFile(manifest,csv(ARCHIVE,[]));
  newFile(path.join(run,'reviewed-plan.csv'),fs.readFileSync(file));
  const append=(p,cols,row)=>fs.appendFileSync(p,csv(cols,[row]).split('\r\n').slice(1).join('\r\n'));
  const record=(r,action,detail='')=>append(log,LOG,{time_utc:new Date().toISOString(),id:r.id,action,target:r.target,detail});
  for(const r of rows) {
    try {
      if(digest(file)!==planHash) throw new Error('Plan changed during apply');
      if(assess(r)==='current') {record(r,'no-op');continue;}
      record(r,'intent');
      if(stat(r.target)) {
        const before=digest(r.target), backup=path.join(run,r.id+'.backup');
        fs.copyFileSync(r.target,backup,fs.constants.COPYFILE_EXCL);
        if(digest(backup)!==before) throw new Error('Backup mismatch');
        const archiveRoot=path.join(path.dirname(r.target),'.tidyagents-archive');
        safe(archiveRoot);
        if(!stat(archiveRoot)) fs.mkdirSync(archiveRoot);
        if(!stat(archiveRoot)?.isDirectory()) throw new Error('Archive parent is not a directory');
        const retainedDir=path.join(archiveRoot,path.basename(run)+'-'+r.id);
        if(stat(retainedDir)) throw new Error('Archive conflict');
        fs.mkdirSync(retainedDir);
        const retained=path.join(retainedDir,path.basename(r.target));
        append(manifest,ARCHIVE,{id:r.id,original:r.target,backup,retained_original:retained,sha256:before,status:'prepared'});
        if(assess(r)!=='change'||digest(r.target)!==before) throw new Error('Target changed after backup');
        // Move only this checked ordinary file, on the same volume. No recursive moves.
        if(stat(retained)) throw new Error('Archive conflict');
        fs.renameSync(r.target,retained);
        if(digest(retained)!==before) throw new Error('Retained original mismatch');
        append(manifest,ARCHIVE,{id:r.id,original:r.target,backup,retained_original:retained,sha256:before,status:'archived'});
        record(r,'archived',retained);
      }
      safe(r.target);
      if(stat(r.target)) throw new Error('Target appeared during apply');
      if(fingerprint(r.source)!==r.source_sha256.toLowerCase()) throw new Error('Source changed before creation');
      if(r.operation==='copy') fs.copyFileSync(r.source,r.target,fs.constants.COPYFILE_EXCL);
      else fs.symlinkSync(r.source,r.target,r.operation==='junction'?'junction':stat(r.source).isDirectory()?'dir':'file');
      if(assess(r)!=='current') throw new Error('Post-apply check failed');
      record(r,'applied');
    } catch(e) {record(r,'failed',e.message);throw e;}
  }
  process.stdout.write('APPLY PASS: checked '+rows.length+' rows; originals retained\n');
  return 0;
}
try {
  const command=process.argv[2];
  const options={
    discover:['--home','--repo','--ancestor-root','--roots','--approved-files','--output'],
    doctor:['--plan','--output','--findings','--deferred'],
    apply:['--plan','--run','--execute','--reviewed-plan-sha256'],
    fingerprint:['--path','--content-reviewed']
  };
  const opts=args(process.argv.slice(3),options[command] || []);
  let code;
  if(command==='discover') code=discovery(opts);
  else if(command==='doctor') code=doctor(opts);
  else if(command==='apply') code=apply(opts);
  else if(command==='fingerprint') {
    if(opts['--content-reviewed']!=='yes') throw new Error('Fingerprint requires content clearance');
    process.stdout.write(fingerprint(safe(opts['--path']))+'\n');code=0;
  } else throw new Error('Expected discover, doctor, apply, or fingerprint');
  process.exitCode=code;
} catch(e) { process.stderr.write('STOP: '+(e.code || e.message)+'\n');process.exitCode=2; }

