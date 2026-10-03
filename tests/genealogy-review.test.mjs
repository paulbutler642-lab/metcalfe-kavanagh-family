import test from 'node:test';
import assert from 'node:assert/strict';
import {alreadyVerified,sourceDraft} from '../src/genealogy-review.js';
const person={id:'edward-medcalf',name:'Edward Metcalfe'};
const row={provider:'census',id:454245,year:1911,event:'census',date:'1911',name:'Edward Medcalf',age:10,place:'33 Stillorgan Road',url:'https://nationalarchives.ie/collections/search-the-census/census-record/#id=454245',members:[{id:454237,name:'Enoch Medcalf'}]};
test('excludes static verified household referenced through a parent',()=>assert.equal(alreadyVerified(row,person,[],[{title:'1911 Census',url:'https://nationalarchives.ie/collections/search-the-census/census-record/#id=454237&c20_year=1911'}]),true));
test('excludes database verified source linked to this person',()=>assert.equal(alreadyVerified(row,person,[{evidence_type:'verified_primary',evidence_status:'published',external_url:row.url,research_source_people:[{person_id:person.id}]}]),true));
test('does not exclude another household, year or unverified source',()=>{assert.equal(alreadyVerified(row,person,[],[{title:'1911 Census',url:'https://nationalarchives.ie/collections/search-the-census/census-record/#id=999'}]),false);assert.equal(alreadyVerified(row,person,[],[{title:'1901 Census',url:'https://nationalarchives.ie/collections/search-the-census/census-record/#id=454237&c20_year=1901'}]),false);assert.equal(alreadyVerified(row,person,[{external_url:row.url,evidence_type:'research_lead',research_source_people:[{person_id:person.id}]}]),false);});
test('record IDs from different census collections cannot collide',()=>assert.equal(alreadyVerified(row,person,[],[{title:'1926 Census',url:'https://nationalarchives.ie/collections/search-the-1926-census/census-record/#a_id=454245'}]),false));
test('reviewed source draft preserves original citation and uses supported verified evidence fields',()=>{const p=sourceDraft(row,person);assert.equal(p.evidence_type,'verified_primary');assert.equal(p.evidence_status,'published');assert.equal(p.external_url,row.url);assert.match(p.summary,/Age: 10/);assert.match(p.citation,/454245/);});
import {saveReviewedSource} from '../src/genealogy-review.js';
function fakeDB({existing=[],linkError=null}={}){
 const writes=[];
 return {writes,from(table){return {
  select:async()=>({data:existing,error:null}),
  insert(payload){writes.push({table,payload});if(table==='research_source_people')return Promise.resolve({error:linkError});return {select:()=>({single:async()=>({data:{id:'new-source',...payload},error:null})})};},
  delete(){return {eq:async(_,id)=>{writes.push({delete:id});return {error:null};}};}
 };}};
}
test('review save creates verified source and links selected person',async()=>{const db=fakeDB();const result=await saveReviewedSource(db,row,person,sourceDraft(row,person));assert.equal(result.source.evidence_type,'verified_primary');assert.equal(db.writes[1].payload[0].person_id,person.id);assert.equal(result.source.research_source_people[0].source_id,'new-source');});
test('review save rereads database and refuses duplicate without writing',async()=>{const db=fakeDB({existing:[{id:'already',external_url:row.url}]});assert.equal((await saveReviewedSource(db,row,person,sourceDraft(row,person))).existing,true);assert.equal(db.writes.length,0);});
test('link failure removes only the newly inserted source and reports failure',async()=>{const db=fakeDB({linkError:Error('link failed')});await assert.rejects(saveReviewedSource(db,row,person,sourceDraft(row,person)),/link failed/);assert.deepEqual(db.writes.at(-1),{delete:'new-source'});});
