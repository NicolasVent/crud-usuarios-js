const express = require('express')
// importa o express, um framework para criar servidores web em Node.js.
const cors = require('cors')
// importa o cors, um middleware que permite que o frontend acesse o backend.
const db = require('./database')
// importa o banco de dados SQLite configurado em database.js.

const app = express()
app.use(cors())
app.use(express.json())

// CREATE
app.post('/usuarios', (req, res) => {
  const { nome, email } = req.body
  // desestrutura os dados enviados pelo frontend.
  // { "nome": "João", "email": "joao@email.com" }
  if (!nome || !email) {
    return res.status(400).json({ error: 'Nome e email são obrigatórios.' })
  }

  // validação simples para garantir que nome e email sejam fornecidos. Erro do cliente, nao do servidor.
  const verificaEmail = 'SELECT * FROM usuarios WHERE email = ?'

  db.get(verificaEmail, [email], (err, row) => {
  // retorna um unico registro que corresponda ao email fornecido.
    if (err) {
      return res.status(500).json(err)
    }
    if (row) {
    // se row existir, significa que o email já está cadastrado.
      return res.status(409).json({ error: 'Email já cadastrado.' })
    }

  
  const sql = 'INSERT INTO usuarios (nome, email) VALUES (?, ?)'
  // comando SQL para inserrir dados. ? são placeholders para evitar SQL Injection.
  db.run(sql, [nome, email], function (err) {
    // executa o comando SQL com os valores fornecidos. 
    if (err) {
      return res.status(500).json(err)
    }
    res.json({ id: this.lastID, nome, email })
    // retorna o ID do novo usuário criado junto com os dados.
   })
    })
  })

// READ
app.get('/usuarios', (req, res) => {
    // busca todos os usuários no banco de dados.
  db.all('SELECT * FROM usuarios', (err, rows) => {
    // executa o comando SQL para selecionar todos os usuários. row será um array de usuários.
    if (err) {
      return res.status(500).json(err)
    }
    res.json(rows)
    // retorna a lista de usuários em formato JSON.
  })
})

// UPDATE
app.put('/usuarios/:id', (req, res) => {
    // atualiza os dados de um usuário específico.

const { nome, email } = req.body
  const { id } = req.params
  // desestrutura os dados do corpo da requisição e o ID dos parâmetros da URL.

    if (!nome || !email) {
      return res.status(400).json({ error: 'Nome e email são obrigatórios.' })
    } 
  // validação simples para garantir que nome e email sejam fornecidos. Erro do cliente, nao do servidor.
  
  const sql = 'UPDATE usuarios SET nome = ?, email = ? WHERE id = ?'
  // comando SQL para atualizar os dados do usuário com o ID fornecido.
  db.run(sql, [nome, email, id], function (err) {
    // executa o comando SQL com os valores fornecidos. Executa o Update.
    if (err) {
      return res.status(500).json(err)
    }
    res.json({ updated: this.changes })
    // retorna o número de linhas alteradas.
  })
})

// DELETE
app.delete('/usuarios/:id', (req, res) => {
    // deleta um usuário específico com base no ID fornecido.
  const { id } = req.params
  // captura o ID dos parâmetros da URL.

  db.run('DELETE FROM usuarios WHERE id = ?', id, function (err) {
    // executa o comando SQL para deletar o usuário com o ID fornecido.
    if (err) {
      return res.status(500).json(err)
    }
    
    res.json({ deleted: this.changes })
    // retorna o número de linhas deletadas.
  })
})

app.listen(3000, () => {
    // inicia o servidor na porta 3000.
  console.log('Servidor rodando em http://localhost:3000')
})
