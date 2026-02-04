const API_URL = 'http://localhost:3000/usuarios'
let usuarioEmEdicao = null
let usuariosCache = []


function mostrarMensagem(texto, tipo) {
  const mensagem = document.getElementById('mensagem')
  
  mensagem.textContent = texto
  mensagem.className = tipo // 'sucesso' ou 'erro'

  setTimeout(() => {
    mensagem.textContent = ''
    mensagem.className = ''
  }, 3000)
}

function atualizarContador(qtd) {
  document.getElementById('contador').textContent = `👥 Total de usuários: ${qtd}`
}


function mostrarSemResultados(mostrar) {
  document.getElementById('semResultados').style.display =
    mostrar ? 'block' : 'none'
}


async function listarUsuarios() {
    // busca todos os usuários na API e os exibe na lista.
  try {
    const response = await fetch(API_URL)
    // Pausa a execução até que a promessa seja resolvida.
    const usuarios = await response.json()
    // Converte a resposta em JSON.

    usuariosCache = usuarios

const usuariosOrdenados = [...usuarios].sort((a, b) =>
  a.nome.localeCompare(b.nome)
)
atualizarContador(usuariosOrdenados.length)
mostrarSemResultados(false)
renderizarUsuarios(usuariosOrdenados)
return

  } catch (error) {
    console.error('Erro ao listar usuários:', error)
  }
}
function renderizarUsuarios(usuarios) {
  const lista = document.getElementById('lista')
  lista.innerHTML = ''

  usuarios.forEach(u => {
    const li = document.createElement('li')

    const texto = document.createElement('span')
    texto.textContent = `${u.nome} - ${u.email}`

    const btnEditar = document.createElement('button')
    btnEditar.type = 'button'
    btnEditar.textContent = 'Editar'
    btnEditar.addEventListener('click', () => {
      editarUsuario(u.id, u.nome, u.email)
    })

    const btnExcluir = document.createElement('button')
    btnExcluir.type = 'button'
    btnExcluir.textContent = 'Excluir'
    btnExcluir.addEventListener('click', () => {
      deletarUsuario(u.id)
    })

    li.appendChild(texto)
    li.appendChild(btnEditar)
    li.appendChild(btnExcluir)

    lista.appendChild(li)
  })
}


function filtrarUsuarios(texto) {
  const termo = texto.toLowerCase()

  const usuariosFiltrados = usuariosCache.filter(u =>
    u.nome.toLowerCase().includes(termo) ||
    u.email.toLowerCase().includes(termo)
  )

  atualizarContador(usuariosFiltrados.length)
  mostrarSemResultados(usuariosFiltrados.length === 0)

  renderizarUsuarios(usuariosFiltrados)
}


function editarUsuario(id, nome, email) {
  document.getElementById('nome').value = nome
  document.getElementById('email').value = email

  usuarioEmEdicao = id

  document.getElementById('btnSalvar').textContent = 'Atualizar'
  document.getElementById('btnCancelar').style.display = 'inline'
}

function cancelarEdicao() {
  document.getElementById('nome').value = ''
  document.getElementById('email').value = ''

  usuarioEmEdicao = null

  document.getElementById('btnSalvar').textContent = 'Salvar'
  document.getElementById('btnCancelar').style.display = 'none'
}


function emailValido(email) {
  // Função simples para validar o formato do email.
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

async function criarUsuario() {
try {
  const nome = document.getElementById('nome').value.trim()
  const email = document.getElementById('email').value.trim()
  // Obtém os valores dos campos de entrada e remove espaços em branco. trim()

  if (!nome) {
    mostrarMensagem('Por favor, insira um nome válido.', 'erro')
    return
  }

  if (!email) {
    mostrarMensagem('Por favor, insira um email válido.', 'erro')
    return
  }

  if (!emailValido(email)) {
    mostrarMensagem('E-mail invalido.', 'erro')
    return
  }

  let response
  if (usuarioEmEdicao === null) {
    // Criação de novo usuário
  response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, email })
  })
} else {
    // Edição de usuário existente
  response = await fetch(`${API_URL}/${usuarioEmEdicao}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, email })
  })

  usuarioEmEdicao = null
}

const data = await response.json()

if (!response.ok) {
  mostrarMensagem(data.error || 'Erro ao salvar usuário.', 'erro')
  return
}

document.getElementById('nome').value = ''
document.getElementById('email').value = ''

usuarioEmEdicao = null

document.getElementById('btnSalvar').textContent = 'Salvar'
document.getElementById('btnCancelar').style.display = 'none'

mostrarMensagem('Usuário salvo com sucesso!', 'sucesso')
listarUsuarios()

} catch (error) {
  mostrarMensagem('Erro ao criar/editar usuário:', 'erro')
  } 
}

async function deletarUsuario(id) {
  const confirmar = confirm('Tem certeza que deseja excluir este usuário?')

  if (!confirmar) return

  try {
    await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    })

    mostrarMensagem('Usuário excluído com sucesso!', 'sucesso')
    listarUsuarios()

  } catch (error) {
    mostrarMensagem('Erro ao excluir usuário.', 'erro')
    console.error(error)
  }
}


document.addEventListener('DOMContentLoaded', () => {
  listarUsuarios()
// Chama listarUsuarios() quando o conteúdo da página for totalmente carregado.
  const form = document.getElementById('form')
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    criarUsuario()
  })

  document
    .getElementById('btnCancelar')
    .addEventListener('click', cancelarEdicao)

    const busca = document.getElementById('busca')
    busca.addEventListener('input', e => {
    filtrarUsuarios(e.target.value)
  })
})