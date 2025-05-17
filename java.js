function handleLogin() {
  const ra = document.getElementById('ra').value.trim();
  const senha = document.getElementById('senha').value.trim();
  const nome = document.getElementById('nome').value.trim();
  const telefone = document.getElementById('telefone').value.trim();

  const usuarios = JSON.parse(localStorage.getItem('usuarios')) || {};

  if (ra === 'admin' && senha === 'admin') {
    mostrarAdmin();
    return;
  }

  if (!usuarios[ra]) {
    // Novo cadastro
    usuarios[ra] = {
      nome,
      telefone,
      senha,
      acessos: 1
    };
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    mostrarMembro(nome);
  } else {
    // Verifica dados existentes
    const usuario = usuarios[ra];
    if (usuario.nome === nome && usuario.telefone === telefone && usuario.senha === senha) {
      usuario.acessos++;
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
      mostrarMembro(nome);
    } else {
      alert('Dados incorretos. Verifique RA, nome, telefone e senha.');
    }
  }
}

function mostrarAdmin() {
  document.getElementById('login').style.display = 'none';
  document.getElementById('admin').style.display = 'block';

  const usuarios = JSON.parse(localStorage.getItem('usuarios')) || {};
  const tableBody = document.getElementById('tabela-usuarios');
  tableBody.innerHTML = '';

  for (let ra in usuarios) {
    const user = usuarios[ra];
    const row = `<tr>
      <td>${ra}</td>
      <td>${user.nome}</td>
      <td>${user.telefone}</td>
      <td>${user.acessos}</td>
    </tr>`;
    tableBody.innerHTML += row;
  }
}

function mostrarMembro(nome) {
  document.getElementById('login').style.display = 'none';
  document.getElementById('member-area').style.display = 'block';
  document.getElementById('member-name').textContent = nome;
}

function logout() {
  document.getElementById('login').style.display = 'block';
  document.getElementById('admin').style.display = 'none';
  document.getElementById('member-area').style.display = 'none';
  document.getElementById('ra').value = '';
  document.getElementById('senha').value = '';
  document.getElementById('nome').value = '';
  document.getElementById('telefone').value = '';
}
