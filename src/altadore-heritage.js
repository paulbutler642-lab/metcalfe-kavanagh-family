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
 if(!hero||hero.dataset.altadore==='1') return false
 hero.dataset.altadore='1'; hero.classList.add('altadore-hero')
 let n=0
 const positions=['center 45%','center 50%','center 58%','center 52%']
 const show=()=>{hero.style.backgroundPosition=positions[n];hero.style.backgroundImage=`linear-gradient(rgba(16,48,39,.40),rgba(16,48,39,.66)),url("${ALTADORE_IMAGES[n]}")`;n=(n+1)%ALTADORE_IMAGES.length}
 show(); const timer=setInterval(show,7000); window.addEventListener('pagehide',()=>clearInterval(timer),{once:true})
 const featureSection=hero.nextElementSibling
 const section=document.createElement('section'); section.className='altadore-heritage'
 section.innerHTML=`<div class="wrap"><div class="altadore-copy"><div class="eyebrow">A place in our family story</div><h2>Altadore Estate, County Wicklow</h2><p>Altadore is an important place in the Medcalf family story. Enoch Medcalf was born at Altadore in 1874, and his father, Anthony Metcalf, is documented as a gardener. Family history records that Enoch and his father tended and helped create the gardens at Altadore. These photographs preserve a view of the house, gardens and landscape so closely connected with their lives.</p></div><div class="altadore-gallery">${ALTADORE_IMAGES.map((src,i)=>`<figure class="altadore-photo"><img src="${src}" alt="${['Altadore house and garden','Altadore house beside the estate water garden','Altadore garden','Altadore estate gardens'][i]}" loading="lazy"><span>${['House & garden','House & water garden','Garden','Estate grounds'][i]}</span></figure>`).join('')}</div><p class="altadore-source">Family connection: Enoch and Anthony Metcalf tended the gardens at Altadore. Historical location imagery: <a href="${sourceUrl}" target="_blank" rel="noopener">Irish Historic Houses — Altidore Castle</a></p></div>`
 if(featureSection) featureSection.after(section); else hero.after(section)
 return true
}
installAltadore(); const observer=new MutationObserver(()=>{if(installAltadore()) observer.disconnect()}); observer.observe(document.getElementById('app')||document.body,{childList:true,subtree:true}); setTimeout(()=>observer.disconnect(),8000)
