import assert from 'node:assert/strict';
function score(s,event,q){const t=[s.title,s.record_type,s.summary,s.transcription,s.event_date_text,s.place_text].filter(Boolean).join(' ').toLowerCase(),type=(s.record_type||'').toLowerCase();let n=0;if(event){if(type===event||t.includes(event))n+=30;else n-=12;if(event==='birth'&&/civil birth|birth register|birth index/.test(t))n+=15;if(event==='death'&&/civil death|death register/.test(t))n+=15}if((s.evidence_status||'').toLowerCase()==='verified')n+=8;if(s.external_url)n+=4;for(const w of q.toLowerCase().match(/[a-z]{4,}/g)||[])if(t.includes(w))n++;return n}
const q="What evidence proves Hannah Medcalf's date of birth?";
const birth={id:'birth',title:'Irish civil birth — Hanna Metcalf',record_type:'birth',event_date_text:'21 June 1906',place_text:'Dublin',repository:'Irish Genealogy',evidence_status:'verified',external_url:'https://example.test/birth',summary:"Civil birth index entry. Mother's birth surname is King."};
const death={id:'death',title:'Irish civil death — Hannah Metcalfe',record_type:'death',event_date_text:'1 April 1933',evidence_status:'verified',external_url:'https://example.test/death'};
const census={id:'census',title:'1926 Census — Enoch Medcalf household',record_type:'census',event_date_text:'18 April 1926',evidence_status:'verified',external_url:'https://example.test/census'};
const ranked=[birth,death,census].map(s=>({id:s.id,n:score(s,'birth',q)})).sort((a,b)=>b.n-a.n);
assert.equal(ranked[0].id,'birth','Civil birth evidence must outrank death/census for a birth-proof question');
assert.ok(score(birth,'birth',q)>score(death,'birth',q));
assert.ok(score(birth,'birth',q)>score(census,'birth',q));
const transcription="Name: Hanna Metcalf; Date of Birth: 21 June 1906; Mother's Birth Surname: King.";
const mother=transcription.match(/mother(?:'s)?(?: birth)? surname[:\s]+([A-Za-z'-]+)/i);
assert.equal(mother?.[1],'King');
console.log('Family Historian event-specific evidence ranking tests passed');
