export default function handler(req,res){
  const header=name=>{const v=req.headers[name];return Array.isArray(v)?v[0]:v||null};
  const decode=v=>{if(!v)return null;try{return decodeURIComponent(v)}catch{return v}};
  res.setHeader('Cache-Control','private, no-store, max-age=0');
  res.status(200).json({
    country:header('x-vercel-ip-country'),
    region:header('x-vercel-ip-country-region'),
    city:decode(header('x-vercel-ip-city'))
  });
}
