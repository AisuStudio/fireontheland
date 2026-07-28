#!/usr/bin/env node
// Fetches 3 NBR tiles (2020/2022/2024) for the Jüterbog burn scar from the
// Copernicus Data Space Ecosystem and saves them as static PNGs in assets/.
// Recipe: BRIEFING.md, Anhang A. Run locally — CDSE_CLIENT_SECRET never
// leaves this process; only the resulting PNGs get committed.
//
// Usage: node scripts/fetch-sentinel.mjs   (reads .env in project root)

import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));

function loadEnv(path) {
  const out = {};
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m) out[m[1]] = m[2].trim();
  }
  return out;
}

const env = loadEnv(join(ROOT, '.env'));
const CLIENT_ID = env.CDSE_CLIENT_ID;
const CLIENT_SECRET = env.CDSE_CLIENT_SECRET;
if (!CLIENT_ID || !CLIENT_SECRET || CLIENT_ID.startsWith('paste-')) {
  console.error('CDSE_CLIENT_ID / CDSE_CLIENT_SECRET fehlen oder sind noch Platzhalter in .env');
  process.exit(1);
}

const TOKEN_URL = 'https://identity.dataspace.copernicus.eu/auth/realms/CDSE/protocol/openid-connect/token';
const PROCESS_URL = 'https://sh.dataspace.copernicus.eu/api/v1/process';
const BBOX = [12.90, 51.98, 13.06, 52.08]; // AOI Jüterbog Brandnarbe (BRIEFING.md)
const SIZE = 512;

const YEARS = { r: 2020, g: 2022, b: 2024 };

const EVALSCRIPT = `//VERSION=3
function setup() {
  return { input: ["B08","B12","dataMask"], output: { bands: 1, sampleType: "UINT8" } };
}
function evaluatePixel(s) {
  if (s.dataMask === 0) return [0];
  let nbr = (s.B08 - s.B12) / (s.B08 + s.B12);
  return [Math.max(0, Math.min(255, Math.round((nbr + 1) / 2 * 255)))];
}`;

async function getToken() {
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }),
  });
  if (!res.ok) throw new Error(`Token-Request fehlgeschlagen: ${res.status} ${await res.text()}`);
  const json = await res.json();
  return json.access_token;
}

async function fetchYearTile(token, year) {
  const body = {
    input: {
      bounds: {
        bbox: BBOX,
        properties: { crs: 'http://www.opengis.net/def/crs/EPSG/0/4326' },
      },
      data: [{
        type: 'sentinel-2-l2a',
        dataFilter: {
          timeRange: { from: `${year}-07-01T00:00:00Z`, to: `${year}-08-31T23:59:59Z` },
          maxCloudCoverage: 10,
        },
        mosaickingOrder: 'leastCC',
      }],
    },
    output: {
      width: SIZE, height: SIZE,
      responses: [{ identifier: 'default', format: { type: 'image/png' } }],
    },
    evalscript: EVALSCRIPT,
  };

  const res = await fetch(PROCESS_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Process-Request ${year} fehlgeschlagen: ${res.status} ${await res.text()}`);
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  console.log('Hole Token…');
  const token = await getToken();

  const assetsDir = join(ROOT, 'assets');
  mkdirSync(assetsDir, { recursive: true });

  for (const [channel, year] of Object.entries(YEARS)) {
    console.log(`Hole NBR-Kachel ${year} (Kanal ${channel.toUpperCase()})…`);
    const png = await fetchYearTile(token, year);
    const out = join(assetsDir, `nbr-${year}.png`);
    writeFileSync(out, png);
    console.log(`  gespeichert: assets/nbr-${year}.png (${png.length} bytes)`);
  }

  console.log('Fertig. 3 Kacheln liegen in assets/ — bereit für renderComposite() in app.js.');
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
