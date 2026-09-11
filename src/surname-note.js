const params=new URLSearchParams(location.search);
const currentView=params.get('view')||'home';
const app=document.getElementById('app');
const noteHtml=`<div class="card surname-note"><strong>Surname note</strong><p>Medcalf, Metcalf and Metcalfe are historical spelling variants of the same family surname in these records.</p></div>`;

function insertNote(){
  if(!app) return false;
  if(app.querySelector('.surname-note')) return true;

  if(currentView==='tree'){
    const wrap=app.querySelector('.tree-scroll')?.parentElement;
    if(wrap){
      wrap.insertAdjacentHTML('afterbegin',noteHtml);
      return true;
    }
  }

  if(currentView==='profile'){
    const heading=app.querySelector('.profile-hero h1');
    if(heading && /\b(Medcalf|Metcalf|Metcalfe)\b/i.test(heading.textContent||'')){
      const hero=app.querySelector('.profile-hero');
      hero?.insertAdjacentHTML('afterend',noteHtml);
      return true;
    }
  }
  return false;
}

if(!insertNote()){
  const observer=new MutationObserver(()=>{
    if(insertNote()) observer.disconnect();
  });
  observer.observe(app,{childList:true,subtree:true});
  setTimeout(()=>observer.disconnect(),10000);
}
