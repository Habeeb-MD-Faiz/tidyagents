// Optional Claude Code PreToolUse hook. Does not implement a shell sandbox.
// Do not log stdin, tool arguments, paths, environment values, or rejected content.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {secretName, inside, stat, absolute, regular} from '../lib/safety.mjs';

function decision(kind, reason) {
  return {hookSpecificOutput:{hookEventName:'PreToolUse',permissionDecision:kind,permissionDecisionReason:reason}};
}
function roots(value) {
  if(!Array.isArray(value)) throw new Error('Invalid roots');
  return value.map(p=>absolute(p));
}
function policy(file) {
  regular(file);
  const p=JSON.parse(fs.readFileSync(file,'utf8'));
  if(p.version!==1 || Object.keys(p).some(k=>!['version','secretRoots','configRoots'].includes(k))) throw new Error('Invalid policy');
  return {secretRoots:roots(p.secretRoots),configRoots:roots(p.configRoots)};
}
function classify(raw, cwd, p) {
  if(typeof raw!=='string'||!raw||raw.includes('\0')||/[<>]/.test(raw)) return 'unknown';
  // Do not expand variables or guess shell syntax.
  if (/[$%~*?]/.test(raw)) return 'unknown';
  let full=path.resolve(cwd,raw);
  const isSecret=v=>secretName(v)||p.secretRoots.some(r=>inside(v,r));
  if(isSecret(full)) return 'secret';
  try {
    const parsed=path.parse(full);
    let current=parsed.root;
    const segments=full.slice(parsed.root.length).split(path.sep).filter(Boolean);
    let hops=0;
    for(let i=0;i<segments.length;i++) {
      current=path.join(current,segments[i]);
      const s=stat(current);
      if(s?.isSymbolicLink()) {
        if(++hops>8) return 'unknown';
        const resolved=path.resolve(path.dirname(current),fs.readlinkSync(current),...segments.slice(i+1));
        if(isSecret(resolved)) return 'secret';
        // A non-secret link is still not a proven safe content path.
        return 'unknown';
      }
    }
    if(p.configRoots.some(r=>inside(full,r)) || /(?:^|[\\/])\.(?:claude|codex|gemini|cursor|agents)(?:[\\/]|$)/i.test(full) ||
      /^(?:AGENTS(?:\.override)?\.md|CLAUDE(?:\.local)?\.md|GEMINI\.md|SCOPE\.md|\.mcp\.json)$/i.test(path.basename(full))) return 'config';
    return stat(full)?.isDirectory()?'directory':'ordinary';
  } catch {return 'unknown';}
}
export function evaluate(event, p) {
  if(!event || event.hook_event_name!=='PreToolUse' || typeof event.tool_name!=='string' ||
     !event.tool_input || typeof event.tool_input!=='object' || Array.isArray(event.tool_input) ||
     typeof event.cwd!=='string' || !path.isAbsolute(event.cwd))
    return decision('deny','Invalid hook input; repair the hook before continuing.');
  const name=event.tool_name, input=event.tool_input;
  const values=[input.file_path,input.path,input.notebook_path].filter(x=>x!==undefined);
  const kinds=values.map(v=>classify(v,event.cwd,p));
  if(kinds.includes('secret')) return decision('deny','Opaque secret path. Use an owner-controlled capability instead.');
  if(name==='Bash') {
    const command=input.command;
    if(typeof command!=='string') return decision('deny','Invalid shell input.');
    // This only catches obvious references. All remaining commands still require review.
    const tokens=command.replace(/['"`^]/g,'').split(/\s+|[;&|()]/);
    if(tokens.some(t=>secretName(t)||p.secretRoots.some(r=>t.toLowerCase().includes(r.toLowerCase()))))
      return decision('deny','Shell command references an opaque secret path.');
    return decision('ask','Review this shell command, including system changes and indirect file access.');
  }
  if(['Grep','Glob'].includes(name)) return decision('ask','Review the exact search scope and exclusions before searching.');
  if(name==='Read' && kinds.length===1 && ['ordinary','config'].includes(kinds[0])) return {};
  if(['Write','Edit','MultiEdit','NotebookEdit'].includes(name)) {
    if(kinds.length===0 || kinds.some(k=>k==='unknown'||k==='directory'))
      return decision('ask','Review the unresolved write target.');
    if(kinds.includes('config')) return decision('ask','Review the exact configuration change and its backup.');
    return decision('ask','Review this write, including possible system configuration effects.');
  }
  return decision('ask','This tool has no reviewed capability rule. Inspect its arguments and effects.');
}
const main=process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url);
if(main) {
  let bytes=0, chunks=[], rejected=false;
  process.stdin.on('data',chunk=>{
    bytes+=chunk.length;
    if(bytes>1024*1024) {rejected=true;chunks=[];} else if(!rejected) chunks.push(chunk);
  });
  process.stdin.on('error',()=>{rejected=true;});
  process.stdin.on('end',()=>{
    let result;
    try {
      if(rejected || process.argv.length!==4 || process.argv[2]!=='--policy') throw new Error('Invalid invocation');
      const p=policy(process.argv[3]);
      result=evaluate(JSON.parse(Buffer.concat(chunks).toString('utf8')),p);
    } catch {
      result=decision('deny','Guard input or policy is invalid. Repair it before continuing.');
    }
    process.stdout.write(JSON.stringify(result)+'\n');
  });
}

