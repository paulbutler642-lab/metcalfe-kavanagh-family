const months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const monthMap={jan:1,january:1,feb:2,february:2,mar:3,march:3,apr:4,april:4,may:5,jun:6,june:6,jul:7,july:7,aug:8,august:8,sep:9,sept:9,september:9,oct:10,october:10,nov:11,november:11,dec:12,december:12};

export function attachDateFields(form){
  form.querySelectorAll('input[name="birth_date_text"],input[name="death_date_text"]').forEach(input=>enhanceDate(input));
}

function enhanceDate(hidden){
  const parsed=parseStoredDate(hidden.value),maxYear=new Date().getFullYear(),today=new Date().toISOString().slice(0,10),thisMonth=today.slice(0,7);
  hidden.type='hidden';
  const editor=document.createElement('div');
  editor.className='structured-date';
  editor.innerHTML=`<label class="date-kind"><span>Date accuracy</span><select aria-label="Date accuracy"><option value="exact">Exact date</option><option value="month">Month and year</option><option value="about">About a year</option><option value="year">Year only</option><option value="range">Between two years</option><option value="unknown">Not known</option></select></label><div class="date-input date-exact"><label><span>Choose date</span><input type="date" min="1000-01-01" max="${today}"></label></div><div class="date-input date-month"><label><span>Choose month</span><input type="month" min="1000-01" max="${thisMonth}"></label></div><div class="date-input date-about"><label><span>Approximate year</span><input type="number" inputmode="numeric" min="1000" max="${maxYear}" step="1" placeholder="e.g. 1896"></label></div><div class="date-input date-year"><label><span>Year</span><input type="number" inputmode="numeric" min="1000" max="${maxYear}" step="1" placeholder="e.g. 1932"></label></div><div class="date-input date-range"><label><span>From year</span><input class="range-start" type="number" inputmode="numeric" min="1000" max="${maxYear}" step="1"></label><label><span>To year</span><input class="range-end" type="number" inputmode="numeric" min="1000" max="${maxYear}" step="1"></label></div><p class="date-preview"></p>`;
  hidden.after(editor);
  const kind=editor.querySelector('select'),exact=editor.querySelector('.date-exact input'),month=editor.querySelector('.date-month input'),about=editor.querySelector('.date-about input'),year=editor.querySelector('.date-year input'),start=editor.querySelector('.range-start'),end=editor.querySelector('.range-end'),preview=editor.querySelector('.date-preview'),controls={exact:[exact],month:[month],about:[about],year:[year],range:[start,end],unknown:[]};
  kind.value=parsed.kind;
  if(parsed.kind==='exact')exact.value=parsed.value;
  if(parsed.kind==='month')month.value=parsed.value;
  if(parsed.kind==='about')about.value=parsed.year;
  if(parsed.kind==='year')year.value=parsed.year;
  if(parsed.kind==='range'){start.value=parsed.start;end.value=parsed.end}

  const sync=()=>{
    editor.querySelectorAll('.date-input').forEach(x=>x.hidden=true);
    const active=editor.querySelector(`.date-${kind.value}`);
    if(active)active.hidden=false;
    Object.entries(controls).forEach(([mode,items])=>items.forEach(x=>x.required=mode===kind.value));
    end.setCustomValidity(kind.value==='range'&&start.value&&end.value&&Number(end.value)<Number(start.value)?'The second year must be the same as or later than the first year.':'');
    hidden.value=formatDate(kind.value,{exact:exact.value,month:month.value,about:about.value,year:year.value,start:start.value,end:end.value});
    preview.textContent=hidden.value?`Saved as: ${hidden.value}`:'No date will be saved.';
  };
  kind.onchange=sync;
  [exact,month,about,year,start,end].forEach(x=>x.addEventListener('input',sync));
  sync();
}

export function parseStoredDate(value){
  const text=String(value||'').trim();
  if(!text)return{kind:'unknown'};
  let match=text.match(/^(?:abt\.?|about|circa|c\.?)\s*(\d{4})$/i);
  if(match)return{kind:'about',year:match[1]};
  match=text.match(/^(\d{4})\s*[\/–-]\s*(\d{4})$/);
  if(match)return{kind:'range',start:match[1],end:match[2]};
  match=text.match(/^(\d{4})$/);
  if(match)return{kind:'year',year:match[1]};
  match=text.match(/^([A-Za-z]+)\s+(\d{4})$/);
  if(match&&monthMap[match[1].toLowerCase()])return{kind:'month',value:`${match[2]}-${pad(monthMap[match[1].toLowerCase()])}`};
  match=text.match(/^(\d{1,2})(?:st|nd|rd|th)?\s+([A-Za-z]+)\s+(\d{4})$/i);
  if(match)return exactResult(match[3],monthMap[match[2].toLowerCase()],match[1]);
  match=text.match(/^([A-Za-z]+)\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})$/i);
  if(match)return exactResult(match[3],monthMap[match[1].toLowerCase()],match[2]);
  match=text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if(match)return exactResult(match[1],Number(match[2]),match[3]);
  return{kind:'unknown'};
}

function exactResult(year,month,day){
  if(!month)return{kind:'unknown'};
  const iso=`${year}-${pad(month)}-${pad(day)}`,date=new Date(`${iso}T00:00:00Z`);
  return date.getUTCFullYear()===Number(year)&&date.getUTCMonth()+1===Number(month)&&date.getUTCDate()===Number(day)?{kind:'exact',value:iso}:{kind:'unknown'};
}
export function formatDate(kind,v){
  if(kind==='exact'&&v.exact){const [y,m,d]=v.exact.split('-').map(Number);return`${d} ${months[m-1]} ${y}`}
  if(kind==='month'&&v.month){const [y,m]=v.month.split('-').map(Number);return`${months[m-1]} ${y}`}
  if(kind==='about'&&v.about)return`Abt. ${v.about}`;
  if(kind==='year'&&v.year)return String(v.year);
  if(kind==='range'&&v.start&&v.end)return`${v.start}–${v.end}`;
  return'';
}
function pad(value){return String(value).padStart(2,'0')}
