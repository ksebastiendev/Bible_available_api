import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHomePage(): string {
    return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Bible Available API</title>
    <style>
      :root { color-scheme: light dark; }
      body {
        margin: 0;
        font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        background: #0b1020;
        color: #e6e8ee;
      }
      .container {
        max-width: 860px;
        margin: 0 auto;
        padding: 32px 20px 48px;
      }
      h1 { margin: 0 0 8px; font-size: 1.8rem; }
      h2 { margin-top: 28px; font-size: 1.1rem; }
      p, li { line-height: 1.6; }
      .card {
        background: #121935;
        border: 1px solid #273058;
        border-radius: 12px;
        padding: 16px;
        margin-top: 14px;
      }
      code {
        background: #1b2447;
        border: 1px solid #2d3766;
        border-radius: 6px;
        padding: 2px 6px;
      }
      a { color: #9ec5ff; }
      .muted { color: #b8bfd6; }
      ul { padding-left: 18px; }
    </style>
  </head>
  <body>
    <main class="container">
      <h1>Bible Available API</h1>
      <p class="muted">A clean JSON API for Bible references and chapter navigation.</p>

      <div class="card">
        <p><strong>Version:</strong> v1</p>
        <p><strong>API status:</strong> operational</p>
        <p><strong>Available translation:</strong> Louis Segond 1910 (LSG1910)</p>
        <p><strong>Swagger docs:</strong> <a href="/docs">/docs</a></p>
      </div>

      <h2>Main endpoints</h2>
      <ul>
        <li><code>GET /v1/translations</code></li>
        <li><code>GET /v1/bible/books</code></li>
        <li><code>GET /v1/bible/books/:bookSlug/chapters/:chapter</code></li>
        <li><code>GET /v1/bible/ref?ref=Jn%203:16</code></li>
      </ul>

      <h2>Example request URLs</h2>
      <ul>
        <li><a href="/v1/translations">/v1/translations</a></li>
        <li><a href="/v1/bible/books">/v1/bible/books</a></li>
        <li><a href="/v1/bible/books/genese/chapters/1">/v1/bible/books/genese/chapters/1</a></li>
        <li><a href="/v1/bible/ref?ref=Jn%203:16">/v1/bible/ref?ref=Jn%203:16</a></li>
      </ul>

      <h2>Response format</h2>
      <p>All API responses are JSON.</p>

      <h2>Standard error codes</h2>
      <ul>
        <li><code>400</code> Bad Request</li>
        <li><code>404</code> Not Found</li>
        <li><code>500</code> Internal Server Error</li>
      </ul>

      <p class="muted">Source text: Louis Segond 1910 (public domain).</p>
    </main>
  </body>
</html>`;
  }
}
