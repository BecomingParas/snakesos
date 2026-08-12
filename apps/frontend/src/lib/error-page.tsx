/**
 * Error Page Renderer
 * Used for server-side error handling
 */

export function renderErrorPage(message = 'Internal Server Error'): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Error - Snake Rescue</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #333;
          }
          
          .error-container {
            background: white;
            padding: 3rem;
            border-radius: 1rem;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 500px;
            text-align: center;
          }
          
          h1 {
            font-size: 3rem;
            color: #667eea;
            margin-bottom: 1rem;
          }
          
          p {
            font-size: 1.2rem;
            color: #666;
            margin-bottom: 2rem;
          }
          
          a {
            display: inline-block;
            padding: 0.75rem 2rem;
            background: #667eea;
            color: white;
            text-decoration: none;
            border-radius: 0.5rem;
            font-weight: 600;
            transition: background 0.3s;
          }
          
          a:hover {
            background: #764ba2;
          }
        </style>
      </head>
      <body>
        <div class="error-container">
          <h1>🐍 Oops!</h1>
          <p>${message}</p>
          <a href="/">Return Home</a>
        </div>
      </body>
    </html>
  `;
}
