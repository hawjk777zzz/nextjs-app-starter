const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8000;

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Rota específica para produtos.json
app.get('/produtos.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'produtos.json'));
});

// Rota principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Fallback para rotas não encontradas
app.get('*', (req, res) => {
  res.status(404).send(`
    <html>
      <head><title>404 - Página não encontrada</title></head>
      <body style="background: #121212; color: #e0e0e0; font-family: Arial; text-align: center; padding: 50px;">
        <h1>404 - Página não encontrada</h1>
        <p>A página que você procura não existe.</p>
        <a href="/" style="color: #00e5ff;">Voltar ao início</a>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor da Loja Valorant rodando na porta ${PORT}`);
  console.log(`📱 Acesse: http://localhost:${PORT}`);
});
