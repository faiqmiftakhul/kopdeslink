// Loader .env.local minimal untuk skrip tsx (Next hanya memuat env untuk app,
// bukan untuk skrip mandiri). Impor file ini PALING ATAS di setiap skrip.
import fs from 'node:fs';
import path from 'node:path';

for (const file of ['.env.local', '.env']) {
  const p = path.resolve(process.cwd(), file);
  if (!fs.existsSync(p)) continue;
  for (const line of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2];
  }
}
