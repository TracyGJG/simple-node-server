// https://dev.to/_7fb6011b57d383122b5a/vanilla-javascript-with-zero-build-tools-in-2026-shipping-es-modules-via--1mg8
// Dev To - Vanilla JavaScript with Zero Build Tools in 2026: Shipping ES Modules via `<script type="module">` (and the CORS/MIME Traps That

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { parseArgs } from 'node:util';

const args = process.argv.slice(2);
const options = {
  port: {
    type: 'string',
    short: 'p',
    default: '4321',
  },
  folder: {
    type: 'string',
    short: 'f',
    default: process.cwd(),
  },
};
const { values } = parseArgs({ args, options });
const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
};

createServer(async (req, res) => {
  const urlPath = decodeURIComponent(req.url.split('?')[0]);
  const safe = normalize(urlPath).replace(/^(\.\.[/\\])+/, '');
  const file = join(values.folder, safe === '/' ? 'index.html' : safe);

  try {
    res.writeHead(200, {
      'Content-Type': MIME_TYPES[extname(file)] ?? 'application/octet-stream',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    const body = await readFile(file);
    res.end(body);
  } catch {
    res.end('404');
  }
}).listen(values.port, () =>
  console.log(`
    http://localhost:${values.port}
    folder=${values.folder}
  `),
);
