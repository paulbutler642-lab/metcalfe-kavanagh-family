const ALTADORE_IMAGES=[
'https://irishhistorichouses.com/wp-content/uploads/2021/10/dsc_0659-1.jpeg?w=1600',
'https://irishhistorichouses.com/wp-content/uploads/2021/10/dsc_0661-1.jpeg?w=1600',
'https://irishhistorichouses.com/wp-content/uploads/2021/10/dsc_0663-1.jpeg?w=1600',
'https://irishhistorichouses.com/wp-content/uploads/2021/10/dsc_0668.jpeg?w=1600'
]
const sourceUrl='https://irishhistorichouses.com/2020/06/25/altidore-castle-kilpeddar-greystones-county-wicklow/'
async function loadHeroArtwork(img){
 try{
  const response=await fetch('/landing-hero-image.b64?v=20260913-2',{cache:'no-store'})
  if(!response.ok) throw new Error('hero source unavailable')
  const b64=(await response.text()).trim()
  if(!b64.startsWith('/9j/')) throw new Error('invalid hero source')
  img.src=`data:image/jpeg;base64,${b64}`
 }catch(err){
  img.src='/landing-hero.jpg?v=20260913-2'
 }
}
function installAltadore(){
 if(new URLSearchParams(location.search).get('view')) return false
 const hero=document.querySelector('.hero')
 if(!hero||hero.dataset.altadore==='1') return false
 hero.dataset.altadore='1'; hero.classList.add('altadore-hero','altadore-art-hero')
 hero.removeAttribute('style')
 hero.innerHTML=`<a class="altadore-art-link" href="/?view=tree" aria-label="Explore our family tree"><img class="altadore-art-image" alt="The Metcalfe and Kavanagh Family — Altadore Estate, County Wicklow"><span class="altadore-art-cta">Explore Our Family Tree →</span></a>`
 loadHeroArtwork(hero.querySelector('.altadore-art-image'))
 const featureSection=hero.nextElementSibling
 const section=document.createElement('section'); section.className='altadore-heritage'
 section.innerHTML=`<div class="wrap"><div class="altadore-copy"><div class="eyebrow">A place in our family story</div><h2>Altadore Estate, County Wicklow</h2><p>Altadore is an important place in the Medcalf family story. Enoch Medcalf was born at Altadore in 1874, and his father, Anthony Metcalf, is documented as a gardener. Family history records that Enoch and his father tended and helped create the gardens at Altadore. These photographs preserve a view of the house, gardens and landscape so closely connected with their lives.</p></div><div class="altadore-gallery">${ALTADORE_IMAGES.map((src,i)=>`<figure class="altadore-photo"><img src="${src}" alt="${['Altadore house and garden','Altadore house beside the estate water garden','Altadore garden','Altadore estate gardens'][i]}" loading="lazy"><span>${['House & garden','House & water garden','Garden','Estate grounds'][i]}</span></figure>`).join('')}</div><p class="altadore-source">Family history records that Enoch and his father Anthony tended and helped create the gardens at Altadore. Historical location imagery: <a href="${sourceUrl}" target="_blank" rel="noopener">Irish Historic Houses — Altidore Castle</a></p></div>`
 if(featureSection) featureSection.after(section); else hero.after(section)
 return true
}
installAltadore(); const observer=new MutationObserver(()=>{if(installAltadore()) observer.disconnect()}); observer.observe(document.getElementById('app')||document.body,{childList:true,subtree:true}); setTimeout(()=>observer.disconnect(),8000)
