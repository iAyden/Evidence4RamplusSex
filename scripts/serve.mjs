import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';

const port = Number(process.env.PORT ?? 4173);
const hostname = '127.0.0.1';
const publicFiles = new Map([
  ['/', ['index.html', 'text/html']],
  ['/index.html', ['index.html', 'text/html']],
  ['/styles.css', ['styles.css', 'text/css']],
  ['/app.mjs', ['app.mjs', 'text/javascript']],
  ['/planner.mjs', ['planner.mjs', 'text/javascript']],
]);

const server = createServer(async (request, response) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' }).end();
    return;
  }

  const pathname = request.url.split('?')[0];
  const file = publicFiles.get(pathname);

  if (!file) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Page not found.');
    return;
  }

  const [filename, mimeType] = file;

  try {
    const bytes = await readFile(new URL(`../dist/${filename}`, import.meta.url));
    response.writeHead(200, {
      'Content-Type': `${mimeType}; charset=utf-8`,
      'Content-Length': bytes.length,
    });
    response.end(request.method === 'HEAD' ? undefined : bytes);
  } catch (error) {
    console.error(error);
    response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Could not read the site build.');
  }
});

server.listen(port, hostname, () => {
  console.log(`Study Session Planner is running at http://${hostname}:${server.address().port}/`);
});
