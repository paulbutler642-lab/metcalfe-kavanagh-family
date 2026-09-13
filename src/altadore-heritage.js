const ALTADORE_IMAGES=[
'https://irishhistorichouses.com/wp-content/uploads/2021/10/dsc_0659-1.jpeg?w=1600',
'https://irishhistorichouses.com/wp-content/uploads/2021/10/dsc_0661-1.jpeg?w=1600',
'https://irishhistorichouses.com/wp-content/uploads/2021/10/dsc_0663-1.jpeg?w=1600',
'https://irishhistorichouses.com/wp-content/uploads/2021/10/dsc_0668.jpeg?w=1600'
]
const sourceUrl='https://irishhistorichouses.com/2020/06/25/altidore-castle-kilpeddar-greystones-county-wicklow/'
function installAltadore(){
 if(new URLSearchParams(location.search).get('view')) return false
 const hero=document.querySelector('.hero')
 if(!hero||hero.dataset.altadore==='approved') return false
 hero.dataset.altadore='approved'
 hero.className='hero altadore-approved'
 hero.removeAttribute('style')
 hero.innerHTML=`<div class="altadore-approved-left"><img class="altadore-approved-crest" src="/family-shield.svg?v=20260913-2" alt="Metcalfe and Kavanagh family tree shield"><div class="altadore-approved-title"><span>The</span><strong>Metcalfe &amp;<br>Kavanagh</strong><span>Family</span></div><div class="altadore-approved-tag">OUR FAMILY HISTORY<br>• &nbsp; OUR STORIES &nbsp; •<br>OUR HERITAGE</div></div><div class="altadore-approved-scene"><div class="altadore-approved-right"><blockquote>“A place<br>in our family<br>story”</blockquote><div class="altadore-approved-place">ALTADORE ESTATE<br>COUNTY WICKLOW</div><p>Family history records that<br>Enoch and his father tended<br>and helped create the gardens<br>at Altadore.</p></div><a class="altadore-approved-btn" href="/?view=tree">Explore Our Family Tree <span>→</span></a></div>`
 const featureSection=hero.nextElementSibling
 if(!document.querySelector('.altadore-heritage')){
  const section=document.createElement('section');section.className='altadore-heritage'
  section.innerHTML=`<div class="wrap"><div class="altadore-copy"><div class="eyebrow">A place in our family story</div><h2>Altadore Estate, County Wicklow</h2><p>Altadore is an important place in the Medcalf family story. Enoch Medcalf was born at Altadore in 1874, and his father, Anthony Metcalf, is documented as a gardener. Family history records that Enoch and his father tended and helped create the gardens at Altadore.</p></div><div class="altadore-gallery">${ALTADORE_IMAGES.map((src,i)=>`<figure class="altadore-photo"><img src="${src}" alt="${['Altadore house and garden','Altadore house beside the estate water garden','Altadore garden','Altadore estate gardens'][i]}" loading="lazy"><span>${['House & garden','House & water garden','Garden','Estate grounds'][i]}</span></figure>`).join('')}</div><p class="altadore-source">Historical location imagery: <a href="${sourceUrl}" target="_blank" rel="noopener">Irish Historic Houses — Altidore Castle</a></p></div>`
  if(featureSection) featureSection.after(section); else hero.after(section)
 }
 return true
}
if(!installAltadore()){
 const observer=new MutationObserver(()=>{if(installAltadore()) observer.disconnect()})
 observer.observe(document.getElementById('app')||document.body,{childList:true,subtree:true})
 setTimeout(()=>observer.disconnect(),10000)
}
