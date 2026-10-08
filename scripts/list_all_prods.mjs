import fs from 'fs';
import path from 'path';

const files = fs.readdirSync('./scripts');
const prods = new Set();
for (const f of files) {
  if (f.endsWith('.mjs') || f.endsWith('.js') || f.endsWith('.py')) {
    const content = fs.readFileSync(path.join('./scripts', f), 'utf8');
    const matches = content.match(/name:\s*["']([^"']+)["']/g);
    if (matches) {
      console.log(`\n=== ${f} ===`);
      matches.forEach(m => {
        const name = m.replace(/name:\s*["']/, '').replace(/["']$/, '');
        prods.add(name);
        console.log(`  ${name}`);
      });
    }
  }
}
console.log('\n--- ALL UNIQUE PRODUCTS IN SCRIPTS ---');
Array.from(prods).sort().forEach(p => console.log('•', p));
