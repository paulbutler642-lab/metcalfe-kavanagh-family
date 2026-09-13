const API='https://c26-api.nationalarchives.ie/api/census/query_c26a';
const clean=v=>String(v||'').trim().slice(0,100);
export default async function handler(req,res){
  if(req.method!=='GET') return res.status(405).json({error:'Method not allowed'});
  const first=clean(req.query.first), surname=clean(req.query.surname), county=clean(req.query.county), townland=clean(req.query.townland);
  if(!first&&!surname) return res.status(400).json({error:'A first name or surname is required'});
  const q=new URLSearchParams({limit:'50'});
  if(first) q.set('first_name__icontains',first);
  if(surname) q.set('surname__icontains',surname);
  if(county) q.set('county',county);
  if(townland) q.set('townland__icontains',townland);
  try{
    const upstream=await fetch(`${API}?${q}`,{headers:{accept:'application/json','user-agent':'Metcalfe-Kavanagh-Family-History/1.0'}});
    if(!upstream.ok) throw new Error(`National Archives returned ${upstream.status}`);
    const data=await upstream.json();
    res.setHeader('Cache-Control','s-maxage=86400, stale-while-revalidate=604800');
    return res.status(200).json(data);
  }catch(error){return res.status(502).json({error:error.message||'Census search failed'})}
}
