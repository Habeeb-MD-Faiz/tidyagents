import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {csv,sha,secretName,parseCsv,fingerprint,safe,stat,inside} from '../skills/tidyagents/scripts/lib/safety.mjs';

const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const scripts=path.join(root,'skills','tidyagents','scripts');
const work=safe(process.argv[2]);
assert(inside(work,path.parse(work).root),'Containment must handle a volume root');
assert(!stat(work),'WorkDir must be new; tests never clean old runs');
fs.mkdirSync(work,{recursive:true});
const home=path.join(work,'fake home'), repo=path.join(work,'fake repo'), source=path.join(work,'canonical'), reports=path.join(work,'reports');
for(const dir of [home,repo,source,reports]) fs.mkdirSync(dir);
function write(p,text) {fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,text,{flag:'wx'});}
function ps(script,args=[],code=0) {
  const r=spawnSync('powershell.exe',['-NoProfile','-File',path.join(scripts,script),...args],{encoding:'utf8',windowsHide:true});
  assert.equal(r.status,code,script+': '+r.stdout+' '+r.stderr);
  return r.stdout;
}
function engine(args,code=0) {
  const r=spawnSync(process.execPath,[path.join(scripts,'engine.mjs'),...args],{encoding:'utf8',windowsHide:true});
  assert.equal(r.status,code,'engine: '+r.stdout+' '+r.stderr);
  return r.stdout.trim();
}
function snapshot(p) {
  const rows=[];
  function walk(d) {
    for(const name of fs.readdirSync(d).sort()) {
      const full=path.join(d,name),s=fs.lstatSync(full),rel=path.relative(p,full);
      if(s.isSymbolicLink()) rows.push([rel,'link',fs.readlinkSync(full)]);
      else if(s.isDirectory()) {rows.push([rel,'directory']); if(!secretName(full)) walk(full);}
      else rows.push([rel,s.size,secretName(full)?'opaque':sha(fs.readFileSync(full))]);
    }
  }
  walk(p);return JSON.stringify(rows);
}
const old=path.join(home,'.claude','CLAUDE.md'), original='Original local guidance\r\n';
write(old,original);
write(path.join(home,'.claude','settings.json'),'{}\n');
write(path.join(home,'.codex','config.toml'),'model = "fixture-model"\n');
write(path.join(home,'.gemini','GEMINI.md'),'Fixture context\n');
write(path.join(home,'.cursor','mcp.json'),'{"mcpServers":{}}\n');
write(path.join(home,'.claude','.env'),'opaque synthetic fixture; contains no credential');
write(path.join(home,'.claude','.ssh','untouched.txt'),'opaque directory fixture');
write(path.join(home,'.claude','history.jsonl'),'{"type":"fixture"}\n');
write(path.join(repo,'AGENTS.md'),'Repository instruction fixture\n');
write(path.join(repo,'nested','.cursor','rules','fixture.mdc'),'---\nalwaysApply: true\n---\nFixture\n');
const canonical=path.join(source,'owner, rules.md');
write(canonical,'Canonical fixture guidance\n');
const skillDir=path.join(source,'skills');
write(path.join(skillDir,'fixture','SKILL.md'),'---\nname: fixture\ndescription: Fixture only\n---\nRead the fixture.\n');
const linkTarget=path.join(home,'.claude','skills');
const copyTarget=path.join(home,'.codex','AGENTS.md');
const cols=['id','tool','profile','operation','source','target','source_sha256','expected_target','reviewed','decision','content_reviewed'];
const base={tool:'fixture',profile:'fixture',operation:'copy',source:canonical,source_sha256:sha(fs.readFileSync(canonical)),expected_target:'absent',reviewed:'yes',decision:'fixture-owner-review',content_reviewed:'yes'};
const rows=[
  {...base,id:'replace',target:old,expected_target:sha(Buffer.from(original))},
  {...base,id:'new-copy',target:copyTarget},
  {...base,id:'skills',operation:'junction',source:skillDir,source_sha256:fingerprint(skillDir),target:linkTarget}
];
const plan=path.join(reports,'plan.csv');
write(plan,csv(cols,rows));
const inventory=path.join(reports,'inventory.csv'), initial=snapshot(home);
ps('discover.ps1',['-HomeRoot',home,'-RepoRoot',repo,'-OutputCsv',inventory]);
assert.equal(snapshot(home),initial);
const found=parseCsv(fs.readFileSync(inventory,'utf8')).rows;
for(const tool of ['Claude Code','Codex','Gemini CLI','Cursor']) assert(found.some(r=>r.tool===tool&&r.kind==='file'));
assert(found.some(r=>r.path.endsWith('fixture.mdc')));
const opaque=found.find(r=>r.path.endsWith('.env'));
assert.equal(opaque.status,'name-only');assert.equal(opaque.sha256,'');assert.equal(opaque.size,'');assert.equal(opaque.last_write_utc,'');
assert(!found.some(r=>r.path.endsWith('untouched.txt')));
assert(found.filter(r=>r.kind==='file').every(r=>!r.sha256));
const approved=path.join(reports,'approved.csv');
write(approved,csv(['path'],[{path:old}]));
const hashInventory=ps('discover.ps1',['-HomeRoot',home,'-ApprovedFilesCsv',approved]);
assert.equal(parseCsv(hashInventory).rows.find(r=>r.path===old).sha256,sha(Buffer.from(original)));
console.log('DISCOVER: PASS (metadata, explicit hashes, opaque names, nested rules)');
const dryRunDir=path.join(work,'dry output');
const beforeDry=snapshot(work);
const dry=ps('apply.ps1',['-Plan',plan,'-RunDir',dryRunDir]);
assert(dry.includes('DRY-RUN'));assert(!stat(dryRunDir));assert.equal(snapshot(work),beforeDry);
console.log('DRY RUN: PASS (zero filesystem changes)');
const pinned=sha(fs.readFileSync(plan));
ps('apply.ps1',['-Plan',plan,'-RunDir',path.join(work,'missing approval'),'-Execute'],2);
assert.equal(snapshot(work),beforeDry);
const applied=path.join(work,'apply output');
ps('apply.ps1',['-Plan',plan,'-RunDir',applied,'-ReviewedPlanSha256',pinned,'-Execute']);
const manifest=parseCsv(fs.readFileSync(path.join(applied,'archive-manifest.csv'),'utf8')).rows;
const backup=manifest.find(r=>r.status==='archived');
assert(backup);assert.equal(fs.readFileSync(backup.backup,'utf8'),original);
assert.equal(fs.readFileSync(backup.retained_original,'utf8'),original);
assert.equal(fs.readFileSync(old,'utf8'),fs.readFileSync(canonical,'utf8'));
assert(stat(path.join(home,'.claude','history.jsonl')));
assert(stat(path.join(home,'.claude','.env')));
for(const entry of JSON.parse(initial)) {
  const p=path.join(home,entry[0]);
  assert(stat(p),'An original path disappeared');
  if(p===old || entry[1]==='directory') continue;
  assert.equal(stat(p).size,entry[1],'An unrelated original changed size');
  if(entry[2]!=='opaque') assert.equal(sha(fs.readFileSync(p)),entry[2],'An unrelated original changed bytes');
}
const doctor=path.join(reports,'doctor-pass.csv');
ps('doctor.ps1',['-Plan',plan,'-OutputCsv',doctor]);
assert(parseCsv(fs.readFileSync(doctor,'utf8')).rows.every(r=>r.status==='PASS'));
const beforeAgain=snapshot(work);
const again=ps('bootstrap.ps1',['-Plan',plan,'-RunDir',path.join(work,'no-op output'),'-ReviewedPlanSha256',pinned,'-Execute']);
assert(again.includes('NO-OP'));assert.equal(snapshot(work),beforeAgain);
console.log('APPLY / BOOTSTRAP: PASS (backup, retained original, links, idempotence)');
const linkedScan=ps('discover.ps1',['-HomeRoot',home]);
assert(parseCsv(linkedScan).rows.some(r=>r.path===linkTarget&&r.status==='not-followed'));
fs.appendFileSync(copyTarget,'Deliberate drift\n');
ps('doctor.ps1',['-Plan',plan],1);
console.log('DOCTOR: PASS (clean pass and deliberate drift failure)');
const wrongDir=path.join(work,'wrong directory');fs.mkdirSync(wrongDir);
const wrongLink=path.join(home,'.claude','wrong link');fs.symlinkSync(wrongDir,wrongLink,'junction');
const wrongPlan=path.join(reports,'wrong-link.csv');
write(wrongPlan,csv(cols,[{...rows[2],id:'wrong-link',target:wrongLink}]));
ps('doctor.ps1',['-Plan',wrongPlan],1);
function rejected(name,mutation) {
  const p=path.join(reports,name+'.csv'), changed=rows.map(r=>({...r}));
  mutation(changed);write(p,csv(cols,changed));
  const before=snapshot(work);
  ps('apply.ps1',['-Plan',p,'-RunDir',path.join(work,name),'-ReviewedPlanSha256',sha(fs.readFileSync(p)),'-Execute'],2);
  assert.equal(snapshot(work),before);
}
rejected('source-drift',r=>{r[0].source_sha256='0'.repeat(64);});
rejected('target-conflict',r=>{r[1].expected_target='absent';});
rejected('opaque-source',r=>{r[0].source=path.join(home,'.claude','.env');});
rejected('overlap',r=>{r[1].target=r[0].target;});
rejected('source-target-cross',r=>{r[1].source=old;r[1].source_sha256=fingerprint(old);});
rejected('linked-parent',r=>{r[1].target=path.join(linkTarget,'new.md');});
rejected('no-review',r=>{r[0].reviewed='no';});
const missingParentPlan=path.join(reports,'missing-parent.csv');
write(missingParentPlan,csv(cols,[{...base,id:'parent',target:path.join(work,'absent parent','file.md')}]));
const beforeMissing=snapshot(work);
ps('apply.ps1',['-Plan',missingParentPlan],2);
assert.equal(snapshot(work),beforeMissing);
const badTree=path.join(source,'opaque tree');
write(path.join(badTree,'.env'),'opaque synthetic fixture');
engine(['fingerprint','--path',badTree,'--content-reviewed','yes'],2);
const hardlinked=path.join(source,'hardlinked.md');
fs.linkSync(canonical,hardlinked);
engine(['fingerprint','--path',hardlinked,'--content-reviewed','yes'],2);
assert.throws(()=>parseCsv('a,a\n1,2\n'));
assert.throws(()=>parseCsv('a,b\n"x,2\n'));
assert.equal(parseCsv('# comment\na,b\n"x,y","line1\nline2"\n').rows[0].b,'line1\nline2');
// Restore an ordinary file through a NEW reviewed plan, retaining its changed successor.
const restore=path.join(reports,'restore.csv');
write(restore,csv(cols,[{...base,id:'restore-original',source:backup.backup,source_sha256:sha(Buffer.from(original)),target:old,expected_target:fingerprint(old)}]));
ps('bootstrap.ps1',['-Plan',restore,'-RunDir',path.join(work,'restore output'),'-ReviewedPlanSha256',sha(fs.readFileSync(restore)),'-Execute']);
assert.equal(fs.readFileSync(old,'utf8'),original);
console.log('REFUSALS / RESTORE: PASS (conflicts, opaque paths, overlap, review, CSV, retained successor)');
const guard=path.join(scripts,'guard','guard.mjs'), policy=path.join(reports,'policy.json');
write(policy,JSON.stringify({version:1,secretRoots:[path.join(work,'private boundary')],configRoots:[source]}));
function event(tool_name,tool_input) {return {hook_event_name:'PreToolUse',tool_name,tool_input,cwd:repo};}
function hook(input,decision,policyFile=policy) {
  const r=spawnSync(process.execPath,[guard,'--policy',policyFile],{input:typeof input==='string'?input:JSON.stringify(input),encoding:'utf8',windowsHide:true});
  assert.equal(r.status,0);assert.equal(r.stderr,'');
  const out=JSON.parse(r.stdout);
  assert.equal(out.hookSpecificOutput?.permissionDecision,decision);
  assert(!r.stdout.includes(home));return out;
}
hook(event('Read',{file_path:path.join(home,'.claude','.env')}),'deny');
hook(event('Read',{file_path:path.join(home,'.claude','.ssh')}),'deny');
hook(event('Read',{file_path:path.join(work,'private boundary','document.txt')}),'deny');
hook(event('Read',{file_path:path.join(repo,'AGENTS.md')}),undefined);
hook(event('Read',{file_path:path.join(repo,'tokenizer.mjs')}),undefined);
hook(event('Write',{file_path:canonical,content:'fixture'}),'ask');
hook(event('Bash',{command:'node -e "ordinary code"'}),'ask');
hook(event('Bash',{command:"type .e''nv"}),'deny');
hook(event('Bash',{command:'powershell -EncodedCommand opaque-fixture'}),'ask');
hook(event('Write',{file_path:path.join(repo,'ordinary.txt'),content:'fixture'}),'ask');
hook(event('Read',{file_path:path.join(repo,'creds.json')}),'deny');
hook(event('Bash',{command:'type .env'}),'deny');
hook(event('Bash',{command:'install something'}),'ask');
hook(event('Grep',{path:repo,pattern:'fixture'}),'ask');
hook(event('mcp__fixture__write',{}),'ask');
hook(event('Read',{file_path:linkTarget}),'ask');
hook('{broken','deny');
hook(event('Read',{file_path:'README.md'}),'deny',path.join(reports,'missing-policy.json'));
const invalidPolicy=path.join(reports,'invalid-policy.json');
write(invalidPolicy,'{"version":2}');hook(event('Read',{file_path:'README.md'}),'deny',invalidPolicy);
const secretLink=path.join(repo,'opaque-link');
fs.symlinkSync(path.join(home,'.claude','.ssh'),secretLink,'junction');
hook(event('Read',{file_path:path.join(secretLink,'untouched.txt')}),'deny');
console.log('GUARD: PASS (direct secrets, linked secrets, asks, unknown tools, malformed input)');
console.log('RETENTION: PASS (all synthetic originals and test artifacts kept)');
console.log('SCOPE: synthetic Windows checks only; no live provider sessions tested');

