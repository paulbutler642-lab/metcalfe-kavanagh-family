import assert from 'node:assert/strict';
const clean=s=>String(s??'').trim();
const linkSourceId=l=>l.source_id??l.research_source_id;
function residenceFacts(sourceLinks,sources,personId){const allowed=new Set(sources.map(s=>String(s.id))),seen=new Set(),facts=[];for(const l of sourceLinks){if(l.person_id!==personId||!allowed.has(String(linkSourceId(l))))continue;const residence=clean(l.residence);if(!residence)continue;const s=sources.find(x=>String(x.id)===String(linkSourceId(l))),date=clean(s?.event_date_text),key=`${date}|${residence}`.toLowerCase();if(seen.has(key))continue;seen.add(key);facts.push({text:`${date?date+': ':''}${residence}`,sourceId:String(linkSourceId(l))})}return facts}
const sources=[{id:'1901',event_date_text:'31 March 1901',record_type:'census'},{id:'1911',event_date_text:'2 April 1911',record_type:'census'},{id:'birth',event_date_text:'6 May 1896',record_type:'birth'}];
const links=[{source_id:'1901',person_id:'william',residence:'6 Galloping Green, Stillorgan'},{source_id:'1911',person_id:'william',residence:'33 Stillorgan Road'},{source_id:'birth',person_id:'william',residence:''},{source_id:'1901',person_id:'william',residence:'6 Galloping Green, Stillorgan'},{source_id:'1911',person_id:'other',residence:'33 Stillorgan Road'}];
assert.deepEqual(residenceFacts(links,sources,'william'),[{text:'31 March 1901: 6 Galloping Green, Stillorgan',sourceId:'1901'},{text:'2 April 1911: 33 Stillorgan Road',sourceId:'1911'}]);
assert.equal(residenceFacts(links,sources,'william').some(x=>x.text.includes('6 May 1896')),false,'Birth event without explicit residence must not become a residence');
console.log('Family Historian residence evidence tests passed');
