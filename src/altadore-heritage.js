const ALTADORE_IMAGES=[
'/altadore-hero.jpg',
'/altadore-photo.jpeg',
'/altadore-garden.jpeg',
'/altadore-unified-hero.jpg'
]
const sourceUrl='https://irishhistorichouses.com/2020/06/25/altidore-castle-kilpeddar-greystones-county-wicklow/'
function installAltadore(){
 if(new URLSearchParams(location.search).get('view')) return false
 const hero=document.querySelector('.hero')
 if(!hero||hero.dataset.altadore==='approved') return false
 hero.dataset.altadore='approved'
 hero.className='hero altadore-approved'
 hero.removeAttribute('style')
 hero.innerHTML=`<div class="altadore-approved-left"><div class="altadore-simple-mark" aria-hidden="true"></div><h1 class="altadore-approved-title"><span>The</span><strong>Metcalfe &amp;<br>Kavanagh</strong><span>Family</span></h1><div class="altadore-approved-tag">OUR FAMILY HISTORY<br>• &nbsp; OUR STORIES &nbsp; •<br>OUR HERITAGE</div></div><div class="altadore-approved-scene"><img class="altadore-hero-photo" src="/altadore-photo.jpeg?v=20260913-1" alt="Altidore Estate in County Wicklow, viewed across the pond"><div class="altadore-approved-right"><blockquote>“A place<br>in our family<br>story”</blockquote><div class="altadore-approved-place">ALTIDORE ESTATE<br>COUNTY WICKLOW</div><p>Enoch Medcalf was born at Altidore, where his father Anthony was a gardener.</p></div><a class="altadore-approved-btn" href="/?view=tree">Explore Our Family Tree <span>→</span></a></div>`
 const featureSection=hero.nextElementSibling
 if(!document.querySelector('.altadore-heritage')){
  const section=document.createElement('section');section.className='altadore-heritage'
  section.innerHTML=`<div class="wrap"><div class="altadore-copy"><div class="eyebrow">A place in our family story</div><h2>Altidore Estate, County Wicklow</h2><p>Altidore is an important place in the Medcalf family story. Enoch Medcalf was born there in 1874, and his father, Anthony Metcalf, was a gardener.</p></div><div class="altadore-gallery">${ALTADORE_IMAGES.map((src,i)=>`<figure class="altadore-photo"><img src="${src}" alt="${['Altidore house and garden','Altidore house beside the estate water garden','Altidore garden','Altidore estate gardens'][i]}" loading="lazy"><span>${['House & garden','House & water garden','Garden','Estate grounds'][i]}</span></figure>`).join('')}</div><p class="altadore-source">Historical location imagery: <a href="${sourceUrl}" target="_blank" rel="noopener">Irish Historic Houses — Altidore Castle</a></p></div>`
  if(featureSection) featureSection.after(section); else hero.after(section)
 }
 return true
}
if(!installAltadore()){
 const observer=new MutationObserver(()=>{if(installAltadore()) observer.disconnect()})
 observer.observe(document.getElementById('app')||document.body,{childList:true,subtree:true})
 setTimeout(()=>observer.disconnect(),10000)
}
