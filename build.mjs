import fs from 'node:fs';
import path from 'node:path';

const out = path.resolve('dist');
fs.rmSync(out,{recursive:true,force:true});
fs.mkdirSync(out,{recursive:true});
for (const file of ['index.html','styles.css','altadore-heritage.css','profile-v1.css','profile-story-prominent.css','hills.css','tree-v2.css','tree-tabs.css','timeline-tabs.css','gallery.css','archive.css','visitors.css','layout-fixes.css','admin.css','profile-photo-editor.css','person-management.css','change-history.css','date-fields.css','relationships.css','analytics.css','sources.css','research-tools.js','family-history-archive.js','gedcom-import.js','person-management.js','change-history.js','date-fields.js','relationships.js','analytics.js','media-optimizer.js','profile-photo-editor.js','profile-story-prominent.js','altadore-heritage.js','app.js','people.js','tree-v2.js','gallery.js','visitors.js','admin.js','surname-note.js','favicon.svg','family-crest.png','admin-share.png','admin-preview-v2.jpg','family-preview-v2.jpg']) {
  fs.copyFileSync(path.resolve('src',file),path.join(out,file));
}
fs.cpSync(path.resolve('src','family-archive'),path.join(out,'family-archive'),{recursive:true});
fs.mkdirSync(path.join(out,'admin'),{recursive:true});
fs.copyFileSync(path.resolve('src','admin','index.html'),path.join(out,'admin','index.html'));
const url = process.env.SUPABASE_URL || '';
const key = process.env.SUPABASE_PUBLISHABLE_KEY || '';
fs.writeFileSync(path.join(out,'config.js'),`window.__APP_CONFIG__=${JSON.stringify({SUPABASE_URL:url,SUPABASE_PUBLISHABLE_KEY:key})};\n`);
console.log('Built static family history site to dist/');
