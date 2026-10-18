// Read-only source/package check. Optional argv[2] is a private identifier regex.
// Never save the private pattern or matched content in this repository.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {secretName,parseCsv} from '../skills/tidyagents/scripts/lib/safety.mjs';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const files=[];
function walk(dir) {
  for(const item of fs.readdirSync(dir,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))) {
    if(['.git','runs'].includes(item.name)) continue;
    const p=path.join(dir,item.name);
    assert(!item.isSymbolicLink(),'Unexpected release link');
    assert(!secretName(p),'Opaque release filename: '+path.relative(root,p));
    if(item.isDirectory())walk(p);else files.push(p);
  }
}
walk(root);
const privatePattern=process.argv[2]?new RegExp(process.argv[2],'i'):null;
const domains=new Set(['code.claude.com','learn.chatgpt.com','developers.openai.com','geminicli.com','cursor.com']);
let links=0, sources=0;
for(const file of files) {
  const text=fs.readFileSync(file,'utf8'),rel=path.relative(root,file);
  assert(!/\b[A-Za-z]:[\\/]/.test(text),'Literal drive path: '+rel);
  assert(!/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(text),'Email-like content: '+rel);
  assert(!/\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/i.test(text),'UUID-like content: '+rel);
  assert(!privatePattern?.test(text),'Private identifier match: '+rel);
  if(file.endsWith('.md')) {
    assert(!text.includes(String.fromCharCode(0x2013))&&!text.includes(String.fromCharCode(0x2014)),'Typographic dash: '+rel);
    for(const match of text.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
      const target=match[1].split('#')[0];
      if(!target)continue;
      if(target.startsWith('https://')) {
        assert(domains.has(new URL(target).hostname),'Non-vendor URL: '+rel);sources++;
      } else {assert(fs.existsSync(path.resolve(path.dirname(file),target)),'Broken local link in '+rel+': '+target);links++;}
    }
  }
  if(file.endsWith('.json'))JSON.parse(text);
  if(file.endsWith('.csv'))assert.equal(parseCsv(text).rows.length,1,'Template needs one example row');
  if(file.endsWith('.ps1'))assert(!/[^\x00-\x7f]/.test(text),'PowerShell source must be ASCII');
}
const skill=fs.readFileSync(path.join(root,'skills','tidyagents','SKILL.md'),'utf8');
assert(skill.split('\n').length<350,'Skill length exceeds budget');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'.claude-plugin','plugin.json'),'utf8'));
const marketplace=JSON.parse(fs.readFileSync(path.join(root,'.claude-plugin','marketplace.json'),'utf8'));
assert.equal(manifest.name,'tidyagents');assert.equal(manifest.version,'0.1.0');
assert.equal(marketplace.plugins[0].source,'./');
assert.equal(marketplace.plugins[0].name,manifest.name);
console.log('RELEASE CHECK: PASS ('+files.length+' source files; '+links+' local links; '+sources+' official-source links)');
console.log('ANONYMITY: PASS (drive paths, email patterns, UUID patterns'+(privatePattern?', supplied private identifiers':'')+')');
console.log('BOUNDARY: .git and retained private runs excluded from the release scan');
console.log('PACKAGE: PASS (JSON, CSV examples, skill length, PowerShell ASCII, prose dash checks)');

