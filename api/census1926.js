const API='https://c26-api.nationalarchives.ie/api/census/query_c26a';
const clean=v=>String(v||'').trim().slice(0,100);
export default async function handler(req,res){
  if(req.method!=='GET') return res.status(405).json({error:'Method not allowed'});
  const requestUrl=new URL(req.url,'https://metcalfe-kavanagh-family-site.vercel.app');
  const first=clean(requestUrl.searchParams.get('first')), surname=clean(requestUrl.searchParams.get('surname')), county=clean(requestUrl.searchParams.get('county')), townland=clean(requestUrl.searchParams.get('townland'));
  if(!first&&!surname) return res.status(400).json({error:'A first name or surname is required'});
  const q=new URLSearchParams({limit:'50'});
  if(first) q.set('first_name__icontains',first);
  if(surname) q.set('surname__icontains',surname);
  if(county) q.set('county',county);
  if(townland) q.set('townland__icontains',townland);
  try{
    const upstreamUrl=new URL(API);
    q.forEach((value,key)=>upstreamUrl.searchParams.set(key,value));
    const upstream=await fetch(upstreamUrl,{headers:{accept:'application/json','user-agent':'Metcalfe-Kavanagh-Family-History/1.0'}});
    if(!upstream.ok) throw new Error(`National Archives returned ${upstream.status}`);
    const data=await upstream.json();
    res.setHeader('Cache-Control','s-maxage=86400, stale-while-revalidate=604800');
    return res.status(200).json(data);
  }catch(error){return res.status(502).json({error:error.message||'Census search failed'})}
}
