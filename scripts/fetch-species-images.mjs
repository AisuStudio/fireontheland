#!/usr/bin/env node
// Fetches one lead image per species from Wikipedia/Wikimedia Commons, together
// with its author and licence, and writes them to assets/species/ plus a
// credits JSON. Run once locally; only the resulting files get committed.
//
// Usage: node scripts/fetch-species-images.mjs

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const OUT_DIR = join(ROOT, 'assets', 'species');
const UA = 'FireOnTheLandSpeciesImages/1.0 (https://fireontheland.org/; aisustudio.berlin@gmail.com)';

// pull the SPECIES array straight out of app.js so the two can't drift apart
function loadSpecies() {
  const src = readFileSync(join(ROOT, 'app.js'), 'utf8');
  const start = src.indexOf('var SPECIES = [');
  const open = src.indexOf('[', start);
  let depth = 0, end = -1;
  for (let i = open; i < src.length; i++) {
    if (src[i] === '[') depth++;
    else if (src[i] === ']') { depth--; if (depth === 0) { end = i; break; } }
  }
  return eval(src.slice(open, end + 1));
}

async function api(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA, 'Accept': 'application/json' } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

// strip the HTML Commons puts in the Artist field, keep readable plain text
function plain(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#0?39;/g, "'")
    .replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

async function leadImageFile(latin) {
  // try German Wikipedia first, fall back to English
  for (const lang of ['de', 'en']) {
    const url = `https://${lang}.wikipedia.org/w/api.php?action=query&format=json&redirects=1` +
      `&prop=pageimages&piprop=name&titles=${encodeURIComponent(latin)}`;
    const json = await api(url);
    const pages = json?.query?.pages || {};
    for (const key of Object.keys(pages)) {
      if (pages[key].pageimage) return pages[key].pageimage;
    }
  }
  return null;
}

async function fileInfo(fileName) {
  const url = 'https://commons.wikimedia.org/w/api.php?action=query&format=json' +
    '&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=640' +
    `&titles=${encodeURIComponent('File:' + fileName)}`;
  const json = await api(url);
  const pages = json?.query?.pages || {};
  const page = pages[Object.keys(pages)[0]];
  const info = page?.imageinfo?.[0];
  if (!info) return null;
  const m = info.extmetadata || {};
  return {
    thumb: info.thumburl || info.url,
    descriptionUrl: info.descriptionurl,
    artist: plain(m.Artist?.value) || 'unbekannt',
    license: plain(m.LicenseShortName?.value) || '',
    licenseUrl: plain(m.LicenseUrl?.value) || ''
  };
}

async function main() {
  const species = loadSpecies();
  mkdirSync(OUT_DIR, { recursive: true });
  const credits = {};
  const missing = [];

  for (const sp of species) {
    process.stdout.write(`${sp.latin} … `);
    try {
      const file = await leadImageFile(sp.latin);
      if (!file) { console.log('kein Bild gefunden'); missing.push(sp.id); continue; }
      const info = await fileInfo(file);
      if (!info?.thumb) { console.log('keine Bildinfo'); missing.push(sp.id); continue; }

      const imgRes = await fetch(info.thumb, { headers: { 'User-Agent': UA } });
      if (!imgRes.ok) throw new Error(`Bild-Download ${imgRes.status}`);
      const buf = Buffer.from(await imgRes.arrayBuffer());
      const ext = info.thumb.toLowerCase().endsWith('.png') ? 'png' : 'jpg';
      writeFileSync(join(OUT_DIR, `${sp.id}.${ext}`), buf);

      credits[sp.id] = {
        file: `${sp.id}.${ext}`,
        artist: info.artist,
        license: info.license,
        licenseUrl: info.licenseUrl,
        source: info.descriptionUrl
      };
      console.log(`ok (${info.license || 'Lizenz unbekannt'}, ${Math.round(buf.length / 1024)} KB)`);
    } catch (err) {
      console.log('FEHLER: ' + err.message);
      missing.push(sp.id);
    }
  }

  writeFileSync(join(OUT_DIR, 'credits.json'), JSON.stringify(credits, null, 2));
  console.log(`\n${Object.keys(credits).length}/${species.length} Bilder geholt.`);
  if (missing.length) console.log('ohne Bild: ' + missing.join(', '));
}

main().catch((e) => { console.error(e); process.exit(1); });
