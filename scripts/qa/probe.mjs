// QA probe over the Chrome DevTools Protocol (no dependencies).
// usage: node scripts/qa/probe.mjs <url> <width> <mobile|desktop> <reduce|no-preference> <check.js> [shot.png] [full]
// Opens the page under real device emulation, runs check.js (the body of an
// async function that returns JSON), prints the result and any page errors,
// and optionally saves a screenshot (viewport, or the full page with "full").
import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const [url, w, kind, motion, scriptFile, shot, full] = process.argv.slice(2);
const width = Number(w);
const mobile = kind === 'mobile';
const port = 9800 + Math.floor(Math.random() * 150);
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
  '--headless=new', '--disable-gpu', '--hide-scrollbars', `--remote-debugging-port=${port}`,
  `--user-data-dir=${mkdtempSync(join(tmpdir(), 'probe-'))}`, 'about:blank',
], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let target;
for (let i = 0; i < 50 && !target; i++) {
  await sleep(200);
  try { target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === 'page'); } catch {}
}
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0;
const pending = new Map();
const logs = [];
ws.onmessage = (m) => {
  const msg = JSON.parse(m.data);
  if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); }
  if (msg.method === 'Runtime.exceptionThrown') logs.push('EXCEPTION ' + (msg.params.exceptionDetails.exception?.description || '').slice(0, 300));
  if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') logs.push('console.error ' + JSON.stringify(msg.params.args.map((a) => a.value ?? a.description)).slice(0, 300));
};
const send = (method, params = {}) => new Promise((r) => { const n = ++id; pending.set(n, r); ws.send(JSON.stringify({ id: n, method, params })); });
await send('Runtime.enable');
await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width, height: mobile ? 844 : 900, deviceScaleFactor: 1, mobile });
if (mobile) await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: motion }] });
await send('Page.navigate', { url });
await sleep(2500);
const body = readFileSync(scriptFile, 'utf8');
const res = await send('Runtime.evaluate', { expression: `(async () => { ${body} })()`, awaitPromise: true, returnByValue: true });
console.log(JSON.stringify(res.result?.result?.value ?? res.result?.exceptionDetails?.exception?.description ?? res.result));
if (logs.length) console.log('PAGE ERRORS', JSON.stringify(logs));
if (shot) {
  const h = full ? (await send('Runtime.evaluate', { expression: 'document.documentElement.scrollHeight', returnByValue: true })).result.result.value : undefined;
  const s = await send('Page.captureScreenshot', full ? { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: 0, width, height: h, scale: 1 } } : { format: 'png' });
  writeFileSync(shot, Buffer.from(s.result.data, 'base64'));
}
ws.close();
chrome.kill();
