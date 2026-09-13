import fs from 'node:fs';
import path from 'node:path';

const out = path.resolve('dist');
fs.rmSync(out,{recursive:true,force:true});
fs.mkdirSync(out,{recursive:true});
for (const file of ['index.html','styles.css','altadore-heritage.css','landing-fix.css','profile-v1.css','profile-story-prominent.css','hills.css','tree-v2.css','tree-tabs.css','timeline-tabs.css','gallery.css','archive.css','visitors.css','layout-fixes.css','admin.css','profile-photo-editor.css','person-management.css','change-history.css','date-fields.css','relationships.css','analytics.css','sources.css','gender-avatars.css','about.css','research-tools.js','family-history-archive.js','avatar.js','gedcom-import.js','person-management.js','change-history.js','date-fields.js','relationships.js','analytics.js','media-optimizer.js','profile-photo-editor.js','profile-story-prominent.js','altadore-heritage.js','about.js','app.js','people.js','tree-v2.js','gallery.js','visitors.js','admin.js','surname-note.js','favicon.svg','family-crest.png','family-shield.svg','altadore-hero.jpg','altadore-photo.jpeg','altadore-garden.jpeg','botanical-panel.png','altadore-unified-hero.jpg','admin-share.png','admin-preview-v2.jpg','family-preview-v2.jpg','landing-hero-image.b64']) {
  fs.copyFileSync(path.resolve('src',file),path.join(out,file));
}
// landing-hero-image.b64 is stored as a small JSON object with the actual JPEG base64 in `content`.
// Parse it before decoding; decoding the whole JSON text produces a corrupt/blank image.
const heroSource=fs.readFileSync(path.resolve('src','landing-hero-image.b64'),'utf8').trim();
let heroB64=heroSource;
try {
  const parsed=JSON.parse(heroSource);
  if(parsed && typeof parsed.content==='string') heroB64=parsed.content;
} catch {}
heroB64=heroB64.replace(/\s+/g,'');
if(!heroB64.startsWith('/9j/')) throw new Error('Landing hero source is not a valid JPEG base64 payload');
fs.writeFileSync(path.join(out,'landing-hero.jpg'),Buffer.from(heroB64,'base64'));
fs.cpSync(path.resolve('src','family-archive'),path.join(out,'family-archive'),{recursive:true});
fs.mkdirSync(path.join(out,'admin'),{recursive:true});
fs.copyFileSync(path.resolve('src','admin','index.html'),path.join(out,'admin','index.html'));
const url = process.env.SUPABASE_URL || '';
const key = process.env.SUPABASE_PUBLISHABLE_KEY || '';
fs.writeFileSync(path.join(out,'config.js'),`window.__APP_CONFIG__=${JSON.stringify({SUPABASE_URL:url,SUPABASE_PUBLISHABLE_KEY:key})};\n`);
console.log('Built static family history site to dist/');
