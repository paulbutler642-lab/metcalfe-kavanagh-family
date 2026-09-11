import fs from 'node:fs';
import path from 'node:path';

const out = path.resolve('dist');
fs.rmSync(out,{recursive:true,force:true});
fs.mkdirSync(out,{recursive:true});
for (const file of ['index.html','styles.css','hills.css','tree-v2.css','gallery.css','app.js','tree-v2.js','gallery.js','surname-note.js','favicon.svg']) {
  fs.copyFileSync(path.resolve('src',file),path.join(out,file));
}
const url = process.env.SUPABASE_URL || '';
const key = process.env.SUPABASE_PUBLISHABLE_KEY || '';
fs.writeFileSync(path.join(out,'config.js'),`window.__APP_CONFIG__=${JSON.stringify({SUPABASE_URL:url,SUPABASE_PUBLISHABLE_KEY:key})};\n`);
console.log('Built static family history site to dist/');
