export const norm=s=>String(s??'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
export const year=s=>Number(String(s||'').match(/\b(?:1[5-9]|20)\d{2}\b/)?.[0])||0;
export function surnames(s){const n=norm(s);return /^(metcalfe?|medcalfe?)$/.test(n)?['metcalfe','metcalf','medcalf','medcalfe']:[s];}
export function nameParts(p){const words=String(p.name||'').trim().split(/\s+/);return {first:p.given_names||words.slice(0,-1).join(' '),surname:p.surname||words.at(-1)||''};}
const words=s=>norm(s).split(' ').filter(Boolean);
function givenEqual(a,b){return words(a).some(w=>words(b).includes(w)||(['enoch','enock'].includes(w)&&words(b).some(x=>['enoch','enock'].includes(x))));}
export function compatibleName(a,b){const aa=nameParts({name:a}),bb=nameParts({name:b});return givenEqual(aa.first,bb.first)&&surnames(aa.surname).some(s=>norm(s)===norm(bb.surname));}
function parentEqual(actual,parent,label){const expected=nameParts(parent),tokens=words(actual);return givenEqual(actual,expected.first)&&(label==='mother'||tokens.length===1||surnames(expected.surname).some(s=>tokens.includes(norm(s))));}
function parentField(fields,label){
 const entries=Object.entries(fields||{}).filter(([key])=>new RegExp(`^${label}(?:['’]s)?(?:\\s+(?:name|forename|surname|given name|first name|last name|birth surname|maiden name))?$`,'i').test(key));
 if(!entries.some(([key])=>!/(?:surname|last name|maiden name)$/i.test(key)))return '';
 return entries.map(([,v])=>String(v)).filter(Boolean).join(' ');
}
export function assessRecord(row,person,context={}){
 const reasons=[],conflicts=[],p=nameParts(person),names=row.names||[row.name],nameMatch=names.some(n=>compatibleName(n,person.name));
 if(nameMatch)reasons.push('Given name and surname variant match');else conflicts.push('Name does not agree with this profile');
 const born=year(person.birth_date||person.birth_date_text),died=year(person.death_date||person.death_date_text),eventYear=year(row.date)||row.year;let dateMatch=false,familyMatch=false;
 if(row.event==='census'){
  if(born&&eventYear<born)conflicts.push('Census predates the recorded birth');if(died&&eventYear>died)conflicts.push('Census is after the recorded death');
  if(born&&row.age!==null&&row.age!==undefined&&String(row.age)!==''){
   const difference=Math.abs((eventYear-Number(row.age))-born);if(difference<=2){dateMatch=true;reasons.push('Census age agrees with the birth year (within two years)');}else conflicts.push('Census age conflicts with the recorded birth year');
  }
  const matches=(context.relatives||[]).filter(rel=>(row.members||[]).some(m=>String(m.id)!==String(row.id)&&compatibleName(m.name,rel.name)));
  if(matches.length){familyMatch=true;reasons.push(`Household includes known relatives: ${matches.map(x=>x.name).join(', ')}`);}
 }else{
  const expected=['birth','baptism'].includes(row.event)?born:['death','burial'].includes(row.event)?died:0;
  if(expected&&eventYear){if(Math.abs(eventYear-expected)<=2){dateMatch=true;reasons.push('Event year agrees with the profile');}else if(row.event==='baptism'&&eventYear>expected)reasons.push('Later baptism: check the recorded birth date');else conflicts.push('Event year conflicts with the profile');}
  if(born&&eventYear&&eventYear<born-2)conflicts.push('Event predates the recorded birth');
  if(died&&eventYear&&eventYear>died+2)conflicts.push('Event is after the recorded death');
  for(const label of ['father','mother']){
   const actual=parentField(row.fields,label);
   const expectedParents=(context.parents||[]).filter(x=>!(x.sex||x.gender)||(label==='father'?/^m(?:ale)?$/i.test(x.sex||x.gender):/^f(?:emale)?$/i.test(x.sex||x.gender)));
   if(actual&&expectedParents.length){if(expectedParents.some(parent=>parentEqual(actual,parent,label))){familyMatch=true;reasons.push(`${label[0].toUpperCase()+label.slice(1)} matches the family tree`);}else conflicts.push(`Recorded ${label} (${actual}) conflicts with ${expectedParents.map(x=>x.name).join(' / ')}`);}
  }
  if(row.event==='marriage'&&(context.spouses||[]).some(s=>names.some(n=>compatibleName(n,s.name)))){familyMatch=true;reasons.push('Spouse matches the family tree');}
 }
 const places=[person.birth_place,person.birth_place_text,person.death_place,person.death_place_text].map(norm).filter(Boolean),recordPlace=norm([row.place,...Object.values(row.fields||{})].join(' '));
 if(places.some(place=>recordPlace.includes(place)))reasons.push('Place agrees with the profile');
 return {...row,reasons,conflicts,status:conflicts.length?'conflict':nameMatch&&dateMatch&&familyMatch?'strong':'possible'};
}
export function searchPlan(person){const born=year(person.birth_date||person.birth_date_text),died=year(person.death_date||person.death_date_text);return [1821,1831,1841,1851,1901,1911,1926].filter(y=>(!born||y>=born)&&(!died||y<=died)).map(y=>({source:'census',year:y,label:`${y} Census${y<1901?' (surviving fragments)':''}`})).concat([{source:'vital',label:'Births, baptisms, marriages, deaths & burials',start:born?Math.max(1500,born-2):0,end:died?Math.min(2026,died+2):0}]);}

export function nameQueries(person){const p=nameParts(person),names=[p];if(person.birth_name)names.push(nameParts({name:person.birth_name}));const queries=names.flatMap(n=>surnames(n.surname).map(surname=>({first:n.first.split(/\s+/)[0],surname}))).filter(n=>n.first&&n.surname);return [...new Map(queries.map(n=>[`${norm(n.first)}:${norm(n.surname)}`,n])).values()];}
