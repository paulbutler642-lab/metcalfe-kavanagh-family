const PHOTO_TYPES=new Set(['image/jpeg','image/png','image/webp','image/heic','image/heif']);
const DOCUMENT_TYPES=new Set(['application/pdf','image/jpeg','image/png','image/webp']);
const MAX_INCOMING_BYTES=10*1024*1024;
const WEB_MAX_EDGE=2000;
const THUMB_MAX_EDGE=480;
const TARGET_BYTES=400*1024;

export function validateArchiveFile(file,kind='photo'){
  if(!file||!file.size)throw new Error('This file is empty or could not be read.');
  if(file.size>MAX_INCOMING_BYTES)throw new Error(`${file.name} is larger than the 10 MB upload limit.`);
  const allowed=kind==='photo'?PHOTO_TYPES:DOCUMENT_TYPES;
  if(!allowed.has(file.type))throw new Error(kind==='photo'?'Please use a JPG, PNG, WebP or HEIC photograph.':'Please use a PDF, JPG, PNG or WebP document.');
}

function canvasBlob(canvas,type,quality){return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('The browser could not create an optimised image.')),type,quality))}
function dimensions(width,height,maxEdge){const scale=Math.min(1,maxEdge/Math.max(width,height));return{width:Math.max(1,Math.round(width*scale)),height:Math.max(1,Math.round(height*scale))}}
function draw(bitmap,size){const canvas=document.createElement('canvas');canvas.width=size.width;canvas.height=size.height;const context=canvas.getContext('2d',{alpha:false});if(!context)throw new Error('Image processing is not available in this browser.');context.imageSmoothingEnabled=true;context.imageSmoothingQuality='high';context.drawImage(bitmap,0,0,size.width,size.height);return canvas}
async function decode(file){
  try{return await createImageBitmap(file,{imageOrientation:'from-image'})}
  catch(error){
    if(file.type==='image/heic'||file.type==='image/heif')throw new Error('This device cannot convert HEIC photographs. On iPhone, choose Most Compatible in Camera settings or export the photograph as JPEG, then try again.');
    throw new Error('This photograph is damaged or is not a supported image.');
  }
}

export async function optimisePhoto(file){
  validateArchiveFile(file,'photo');
  const bitmap=await decode(file);
  try{
    let size=dimensions(bitmap.width,bitmap.height,WEB_MAX_EDGE),canvas=draw(bitmap,size),quality=.88,web=await canvasBlob(canvas,'image/webp',quality);
    while(web.size>TARGET_BYTES&&quality>.72){quality=Math.max(.72,quality-.04);web=await canvasBlob(canvas,'image/webp',quality)}
    while(web.size>TARGET_BYTES*1.3&&Math.max(size.width,size.height)>1200){size={width:Math.round(size.width*.9),height:Math.round(size.height*.9)};canvas=draw(bitmap,size);web=await canvasBlob(canvas,'image/webp',quality)}
    const thumbSize=dimensions(bitmap.width,bitmap.height,THUMB_MAX_EDGE),thumb=await canvasBlob(draw(bitmap,thumbSize),'image/webp',.8);
    return{web,thumbnail:thumb,width:size.width,height:size.height,thumbnailWidth:thumbSize.width,thumbnailHeight:thumbSize.height,originalBytes:file.size,quality,outputType:'image/webp'};
  }finally{bitmap.close?.()}
}

export const mediaLimits={maxIncomingBytes:MAX_INCOMING_BYTES,webMaxEdge:WEB_MAX_EDGE,thumbnailMaxEdge:THUMB_MAX_EDGE,targetBytes:TARGET_BYTES};
