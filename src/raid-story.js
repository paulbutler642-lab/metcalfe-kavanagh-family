const RAID_SOURCE='https://www.youwho.ie/raid.html';
const people={
  'anthony-medcalf':'Enoch Medcalf',
  'william-metcalfe':'William Metcalfe',
  'john-medcalf-enoch-son':'John Medcalf'
};

function story(){return `<section class="card profile-panel raid-story" id="stillorgan-raid-story"><div class="profile-section-head"><div><span class="section-kicker">Family story · War of Independence</span><h2>The Stillorgan Military Raid — 26 March 1921</h2></div></div><p>In the early hours of <strong>26 March 1921</strong>, Stillorgan was subjected to a major military raid. At about <strong>2:30 a.m.</strong>, a force arriving in approximately <strong>40 lorries and armoured cars</strong> cordoned off a triangle running from <strong>Galloping Green to St Joseph’s Convent and Thornhill</strong>. Lewis guns were placed in position and the village was isolated.</p><p>The surviving account describes the men of the village being awakened, ordered to dress and marched to <strong>Glenalbyn Road</strong>, where they were lined up. A lorry carrying Auxiliaries drove up and down the line while the men were questioned about possible involvement with the <strong>Irish Volunteers</strong>. They were held there until about <strong>10 a.m.</strong>.</p><p>The military also searched the surrounding fields, although the account reports that nothing was discovered. <strong>Ten men were arrested and taken to Portobello Barracks</strong>; the historical reconstruction states that these men were already on a wanted list.</p><div class="auto-record-why"><strong>The Medcalf family at 5 Kilmacud Road</strong><p>The reconstructed list of local residents caught up in the raid records <strong>E. Medcalf, Wm. Medcalf and J. Medcalf</strong> together at <strong>5 Kilmacud Road, Stillorgan</strong>. Established family evidence, together with family identification, identifies them as <strong>Enoch Medcalf and his sons William and John</strong>.</p></div><p>This record gives a rare snapshot of Enoch and two of his sons together in Stillorgan during the Irish War of Independence. The source places them at the address and among the local men affected by the operation. <strong>It does not establish that Enoch, William or John were among the ten men arrested, nor does it establish IRA membership</strong>, so neither claim is made here.</p><p><a class="chapter-record-link" href="${RAID_SOURCE}" target="_blank" rel="noopener">View the Stillorgan raid research source ↗</a></p><p class="muted"><small>Evidence note: the historical source records the initials, surname and shared address. Identification of E., Wm. and J. Medcalf as Enoch, William and John is supported by the established family record and family knowledge.</small></p></section>`}

async function run(){
  const q=new URLSearchParams(location.search);
  if(q.get('view')!=='profile'||!people[q.get('id')]||document.getElementById('stillorgan-raid-story'))return;
  let tries=0;
  while(!document.querySelector('.profile-v1-content')&&tries++<50)await new Promise(r=>setTimeout(r,100));
  const host=document.querySelector('.profile-v1-content');if(!host)return;
  const section=document.createElement('div');section.innerHTML=story();
  const node=section.firstElementChild;
  const life=[...host.querySelectorAll('h2')].find(h=>/life story/i.test(h.textContent||''))?.closest('section');
  if(life)life.after(node);else host.append(node);
}
run();
