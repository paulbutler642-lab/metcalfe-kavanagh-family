import assert from 'node:assert/strict';

const clean=s=>String(s??'').replace(/[\u0000-\u001f]+/g,' ').trim();
const take=(a,n)=>Array.isArray(a)?a.slice(0,n):[];
const humanText=v=>{if(typeof v==='string')return clean(v);if(typeof v==='number'||typeof v==='boolean')return String(v);if(!v||typeof v!=='object')return'';for(const k of ['text','fact','claim','statement','description','detail','value'])if(typeof v[k]==='string'&&clean(v[k]))return clean(v[k]);const parts=['name','date','place'].map(k=>typeof v[k]==='string'?clean(v[k]):'').filter(Boolean);return parts.join(' • ')};
const textList=(v,n)=>{const seen=new Set(),out=[];for(const item of take(Array.isArray(v)?v:[],n*2)){const text=humanText(item);if(text&&!seen.has(text)){seen.add(text);out.push(text)}if(out.length>=n)break}return out};
const idList=(v,n)=>{const seen=new Set(),out=[];for(const item of take(Array.isArray(v)?v:[],n*2)){let id='';if(typeof item==='string'||typeof item==='number')id=clean(item);else if(item&&typeof item==='object')id=clean(item.id??item.sourceId??item.source_id);if(id&&!seen.has(id)){seen.add(id);out.push(id)}if(out.length>=n)break}return out};
const normalizeAnswer=out=>({title:humanText(out?.title)||'Family-history answer',summary:humanText(out?.summary),verifiedFacts:textList(out?.verifiedFacts,12),interpretations:textList(out?.interpretations,8),unknowns:textList(out?.unknowns,8),sourceIds:idList(out?.sourceIds,20)});

const objectResponse=normalizeAnswer({
 title:'Birthplaces of Enoch Medcalf’s Children',summary:'The records show several birthplaces.',
 verifiedFacts:[{fact:'William Metcalfe was born in Templeville.'},{statement:'John Medcalf was born in Mountmellick.'},{name:'Edward Medcalf',date:'24 October 1900',place:'Galloping Green'},null,{}],
 interpretations:[{claim:'The records show the household location changed over time.'}],
 unknowns:[{text:'The evidence does not establish why the family moved.'}],
 sourceIds:[{sourceId:'abc'},'def',{source_id:'ghi'}]
});
assert.deepEqual(objectResponse.verifiedFacts,['William Metcalfe was born in Templeville.','John Medcalf was born in Mountmellick.','Edward Medcalf • 24 October 1900 • Galloping Green']);
assert.deepEqual(objectResponse.interpretations,['The records show the household location changed over time.']);
assert.deepEqual(objectResponse.unknowns,['The evidence does not establish why the family moved.']);
assert.deepEqual(objectResponse.sourceIds,['abc','def','ghi']);
assert.equal(objectResponse.verifiedFacts.some(x=>x.includes('[object Object]')),false);

const duplicates=normalizeAnswer({summary:'x',verifiedFacts:['Same fact','Same fact','',null],interpretations:[],unknowns:[],sourceIds:['a','a']});
assert.deepEqual(duplicates.verifiedFacts,['Same fact']);
assert.deepEqual(duplicates.sourceIds,['a']);

const malformed=normalizeAnswer({summary:'Still safe',verifiedFacts:[{},[],null],interpretations:[{unexpected:true}],unknowns:[]});
assert.deepEqual(malformed.verifiedFacts,[]);
assert.deepEqual(malformed.interpretations,[]);

console.log('Family Historian normalization regression tests passed');
