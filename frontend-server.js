const http = require('http');
const fs = require('fs').promises;
const path = require('path');

const server = http.createServer(async (req, res) => {
  try {
    const filePath = path.join(__dirname, 'src/frontend', req.url === '/' ? 'index.html' : req.url);
    const file = await fs.readFile(filePath);
    const contentType = getContentType(filePath);
    
    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end(file);
  } catch (error) {
    console.error('Error:', error);
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('Not Found');
  }
});

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.html': return 'text/html';
    case '.js': return 'application/javascript';
    case '.css': return 'text/css';
    default: return 'text/plain';
  }
}

const PORT = 3001;
server.listen(PORT, '127.0.0.1', () => {
  console.log(`Frontend server running at http://127.0.0.1:${PORT}`);
});

// Manejar errores de conexión
server.on('error', (error) => {
  console.error('Server error:', error);
});

// Manejar desconexiones
server.on('close', () => {
  console.log('Server closed');
});
