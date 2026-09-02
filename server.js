const http = require('http');
const WebSocket = require('ws');

const PORT = process.env.PORT || 3000;

// Servidor HTTP simples só para health check (o Render exige que a porta responda algo)
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Servidor de chat rodando.\n');
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws, req) => {
  console.log(`Novo cliente conectado (${req.socket.remoteAddress}). Total online: ${wss.clients.size}`);

  ws.on('message', (data) => {
    // Repassa o JSON recebido para todos os outros clientes conectados (broadcast)
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data.toString());
      }
    });
  });

  ws.on('close', () => {
    console.log(`Cliente desconectado. Total online: ${wss.clients.size}`);
  });

  ws.on('error', (err) => {
    console.error('Erro no socket:', err.message);
  });
});

server.listen(PORT, () => {
  console.log(`Servidor ouvindo na porta ${PORT}`);
});
