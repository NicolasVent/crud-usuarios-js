const sqlite3 = require('sqlite3').verbose()
// Importa a biblioteca sqlite3 e .verbose() exibe mensagens detalhadas de erro.

const db = new sqlite3.Database('./usuarios.db')
//cria ou abre o banco de dados SQLite chamado 'usuarios.db'. 


db.serialize(() => {
// Garante que os comenados SQL sejam executados em sequência.
  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE
    )
  `)
})

module.exports = db
// Exporta a variável db e permite que outros arquivos a utilizem para interagir com o banco de dados.