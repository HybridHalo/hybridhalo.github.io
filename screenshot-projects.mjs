// screenshot-projects.mjs
// Starts a local server, rebuilds projects.js, screenshots every project, then exits.
//
// Usage:
//   node screenshot-projects.mjs
//
// Requirements:
//   npm install puppeteer

import puppeteer from 'puppeteer';
import { execSync, spawn } from 'child_process';
import { readdirSync, statSync, existsSync } from 'fs';
import { join } from 'path';

// Config
const PROJECTS_DIR = './projects';
const BASE_URL     = 'http://localhost:3000';
const PREVIEW_SIZE = { width: 1280, height: 720 };
const FORCE        = process.argv.includes('--force');
const ONLY_CHANGED = !FORCE;

// 1. Rebuild projects.js
console.log('Running updater.py...');
execSync('python3 updater.py', { stdio: 'inherit' });
console.log('');

// 2. Start local server
const server = spawn('npx', ['serve', '.', '--listen', '3000', '--no-clipboard'], {
  stdio: 'ignore',
  shell: true,
});

const killServer = () => {
  try { server.kill(); } catch (_) {}
};

process.on('exit', killServer);
process.on('SIGINT', () => { killServer(); process.exit(0); });

await new Promise(r => setTimeout(r, 1500));
console.log('Server started on http://localhost:3000');
console.log('');

// 3. Find project folders
const projects = readdirSync(PROJECTS_DIR).filter(name => {
  const full = join(PROJECTS_DIR, name);
  return statSync(full).isDirectory() && !name.startsWith('.');
});

console.log('Found ' + projects.length + ' project folder(s)');
console.log('');

// 4. Launch browser
const browser = await puppeteer.launch({ headless: 'new' });
const page    = await browser.newPage();
await page.setViewport(PREVIEW_SIZE);

let saved = 0, skipped = 0, failed = 0;

for (const project of projects) {
  const infoPath    = join(PROJECTS_DIR, project, 'info.js');
  const previewPath = join(PROJECTS_DIR, project, 'preview.png');

  if (!existsSync(infoPath)) {
    console.log('  -  ' + project + ' (no info.js, skipping)');
    skipped++;
    continue;
  }

  if (ONLY_CHANGED && existsSync(previewPath)) {
    const indexPath = join(PROJECTS_DIR, project, 'index.html');
    if (existsSync(indexPath)) {
      const previewMtime = statSync(previewPath).mtimeMs;
      const indexMtime   = statSync(indexPath).mtimeMs;
      if (previewMtime > indexMtime) {
        console.log('  -  ' + project + ' (unchanged, skipping)');
        skipped++;
        continue;
      }
    }
  }

  const url = BASE_URL + '/projects/' + project + '/index.html';

  try {
    process.stdout.write('  screenshot  ' + project + ' ... ');
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 });
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: previewPath, fullPage: true });
    console.log('done');
    saved++;
  } catch (err) {
    console.log('FAILED: ' + err.message);
    failed++;
  }
}

await browser.close();
killServer();

// 5. Summary
console.log('');
console.log('Done.');
console.log('  Saved:   ' + saved);
console.log('  Skipped: ' + skipped);
console.log('  Failed:  ' + failed);

if (failed > 0) process.exit(1);
