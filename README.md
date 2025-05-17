TOP 3 <!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Gestão Escolar - Atividades</title>
<style>
  body {
    font-family: Arial, sans-serif;
    background: #000;
    color: #0f0;
    padding: 20px;
  }
  input, button, select {
    font-size: 1rem;
    padding: 6px 10px;
    margin: 5px;
    border-radius: 5px;
    border: 2px solid #0f0;
    background: #111;
    color: #0f0;
  }
  button:hover {
    background: #0f0;
    color: #000;
    cursor: pointer;
  }
  .card {
    border: 1px solid #0f0;
    background-color: #111;
    padding: 15px;
    margin: 15px 0;
    border-radius: 8px;
    box-shadow: 0 0 10px #0f0;
  }
  .aba-sala {
    margin-top: 10px;
    padding: 10px;
    border: 1px solid #0f0;
    border-radius: 8px;
  }
  .codigo-btn {
    margin: 3px;
    cursor: pointer;
    background: #000;
    color: #0f0;
    border: 1px solid #0f0;
    border-radius: 3px;
  }
  .codigo-btn.active {
    background: #0f0;
    color: #000;
  }
  .danger {
    color: red;
  }
  fieldset {
    border: 1px solid #0f0;
    padding: 10px;
    margin-top: 10px;
    border-radius: 6px;
  }
  legend {
    font-weight: bold;
  }
  label {
    user-select: none;
  }
  #loginContainer, #adminPanel {
    max-width: 400px;
    margin: 30px auto;
    padding: 20px;
    border: 1px solid #0f0;
    border-radius: 10px;
    background: #111;
  }
  #mainContent {
    display: none;
  }
  #acessosList {
    max-height: 200px;
    overflow-y: auto;
    margin-top: 10px;
    border: 1px solid #0f0;
    padding: 10px;
    border-radius: 6px;
    background: #000;
  }
</style>
</head>
<body>

<!-- LOGIN -->
<div id="loginContainer" class="card">
  <h2>Login de Acesso</h2>
  <input id="loginNome" placeholder="Nome completo" /><br>
  <input id="loginCPF" placeholder="CPF (somente números)" maxlength="11" /><br>
  <input id="loginTelefone" placeholder="Telefone (somente números)" /><br>
  <button onclick="fazerLogin()">Entrar</button>
</div>

<!-- CONTEÚDO PRINCIPAL DO SITE -->
<div id="mainContent">
  <h1>Gestão Escolar - Atividades</h1>

  <div class="card">
    <h2>Adicionar Sala</h2>
    <input id="novaSala" placeholder="Ex: 3°B Noturno" />
    <button onclick="modoAdm ? adicionarSala() : alert('Apenas administradores podem adicionar salas.')">Adicionar Sala</button>
  </div>

  <div class="card">
    <h2>Remover Sala</h2>
    <select id="removerSala"></select>
    <button onclick="modoAdm ? removerSala() : alert('Apenas administradores podem remover salas.')">Remover Sala</button>
  </div>

  <div class="card">
    <h2>Cadastro de Aluno</h2>
    <input id="nome" placeholder="Nome" />
    <input id="ra" placeholder="RA" />
    <input id="digito" placeholder="Dígito do RA" />
    <input id="senha" placeholder="Senha" />
    <input id="whatsapp" placeholder="WhatsApp (somente números)" />
    <select id="turma"></select><br>
    <input id="valorPago" type="number" placeholder="Valor Pago" />
    <input id="valorDevido" type="number" placeholder="Valor Devido" />

    <fieldset id="atividadesFieldset">
      <legend>Atividades:</legend>
    </fieldset>

    <button onclick="modoAdm ? adicionarAluno() : alert('Apenas administradores podem adicionar alunos.')">Salvar Aluno</button>
  </div>

  <div class="card">
    <h2>Valor Fixo por Atividade</h2>
    <div id="valoresFixosAtividades"></div>
  </div>

  <div class="card">
    <h2>Alunos por Sala</h2>
    <div id="listaSalas"></div>
  </div>

  <div class="card">
    <h2 class="danger">Área de Exclusão (Admin)</h2>
    <input id="login" placeholder="Login" />
    <input id="senhaAdm" placeholder="Senha" type="password" />
    <button onclick="autenticarAdm()">Entrar</button>
    <div id="adminPanel" style="display:none">
      <p>Você entrou no modo administrador.</p>

      <h3>Pessoas que acessaram o site</h3>
      <div id="acessosList"></div>

      <button onclick="apagarTudo()" class="danger">Apagar TODOS os dados</button>
    </div>
  </div>

  <footer>&copy; Adriano 2025</footer>
</div>

<script>
let modoAdm = false;

const codigos = {
  1: "Expansão",
  2: "Alura",
  3: "Speak",
  4: "Empreendedorismo",
  5: "Tarefa",
  6: "Redação"
};

let salas = JSON.parse(localStorage.getItem("salas") || "[]");
let alunos = JSON.parse(localStorage.getItem("alunos") || "[]");
let valoresFixos = JSON.parse(localStorage.getItem("valoresFixos") || "{}");

// NOVO: lista de acessos dos usuários
let acessosUsuarios = JSON.parse(localStorage.getItem("acessosUsuarios") || "{}");

const loginContainer = document.getElementById("loginContainer");
const mainContent = document.getElementById("mainContent");

function fazerLogin() {
  const nome = document.getElementById("loginNome").value.trim();
  const cpf = document.getElementById("loginCPF").value.trim();
  const telefone = document.getElementById("loginTelefone").value.trim();

  if (!nome || !cpf || !telefone) {
    alert("Por favor, preencha todos os campos para acessar.");
    return;
  }
  if (cpf.length !== 11 || !/^\d+$/.test(cpf)) {
    alert("CPF deve conter 11 números.");
    return;
  }
  if (!/^\d+$/.test(telefone)) {
    alert("Telefone deve conter somente números.");
    return;
  }

  // Verificar se usuário já existe
  if (!acessosUsuarios[cpf]) {
    acessosUsuarios[cpf] = { nome, cpf, telefone, acessos: 1 };
  } else {
    acessosUsuarios[cpf].acessos++;
  }
  localStorage.setItem("acessosUsuarios", JSON.stringify(acessosUsuarios));

  // Salvar dados do usuário para auto login (localStorage)
  localStorage.setItem("usuarioLogado", JSON.stringify({ nome, cpf, telefone }));

  mostrarConteudoPrincipal();
}

function mostrarConteudoPrincipal() {
  loginContainer.style.display = "none";
  mainContent.style.display = "block";
  renderizarCheckboxesAtividades();
  renderizarSalas();
  renderizarValoresFixos();
  if (modoAdm) {
    mostrarAcessosAdmin();
  }
}

// Verifica se já tem usuário salvo para auto-login
function checarAutoLogin() {
  const usuario = localStorage.getItem("usuarioLogado");
  if (usuario) {
    const obj = JSON.parse(usuario);
    // Incrementa acessos toda vez que abrir a página
    if (acessosUsuarios[obj.cpf]) {
      acessosUsuarios[obj.cpf].acessos++;
    } else {
      acessosUsuarios[obj.cpf] = { nome: obj.nome, cpf: obj.cpf, telefone: obj.telefone, acessos: 1 };
    }
    localStorage.setItem("acessosUsuarios", JSON.stringify(acessosUsuarios));
    mostrarConteudoPrincipal();
  }
}

function renderizarCheckboxesAtividades() {
  const fieldset = document.getElementById("atividadesFieldset");
  fieldset.innerHTML = "<legend>Atividades:</legend>";
  Object.entries(codigos).forEach(([codigo, nome]) => {
    const label = document.createElement("label");
    label.style.marginRight = "10px";
    label.innerHTML = `<input type="checkbox" value="${codigo}" /> ${nome}`;

    // Clique direito para desmarcar
    const checkbox = label.querySelector("input[type='checkbox']");
    checkbox.addEventListener("contextmenu", e => {
      e.preventDefault();
      checkbox.checked = false;
    });

    fieldset.appendChild(label);
  });
}

function salvarValoresFixos() {
  localStorage.setItem("valoresFixos", JSON.stringify(valoresFixos));
}

function renderizarValoresFixos() {
  const container = document.getElementById("valoresFixosAtividades");
  container.innerHTML = "";
  Object.entries(codigos).forEach(([codigo, nome]) => {
    const input = document.createElement("input");
    input.type = "number";
    input.placeholder = `Valor - ${nome}`;
    input.value = valoresFixos[codigo] || "";
    input.onchange = () => {
      if (modoAdm) {
        valoresFixos[codigo] = parseFloat(input.value);
        salvarValoresFixos();
      } else {
        alert("Apenas administradores podem alterar valores fixos.");
        input.value = valoresFixos[codigo] || "";
      }
    };
    container.appendChild(input);
  });
}

function renderizarSalas() {
  const select = document.getElementById("turma");
  const selectRemover = document.getElementById("removerSala");
  select.innerHTML = "";
  selectRemover.innerHTML = "";
  salas.forEach(s => {
    const option = document.createElement("option");
    option.value = s;
    option.textContent = s;
    select.appendChild(option);
    const optionRemover = option.cloneNode(true);
    selectRemover.appendChild(optionRemover);
  });

  const lista = document.getElementById("listaSalas");
  lista.innerHTML = "";
  salas.forEach(sala => {
    const div = document.createElement("div");
    div.className = "aba-sala";
    div.innerHTML = `<h3>${sala}</h3>`;

    alunos.filter(a => a.turma === sala).forEach((aluno, index) => {
      const alunoDiv = document.createElement("div");
      alunoDiv.className = "card";
      alunoDiv.innerHTML = `<strong>${aluno.nome}</strong><br>
        RA: ${aluno.ra}-${aluno.digito} | Senha: ${aluno.senha}<br>
        Valor Pago: R$ ${aluno.valor} | Valor Devido: R$ ${aluno.devido}<br>`;

      // MOSTRAR APENAS AS ATIVIDADES QUE O ALUNO TEM
      if (aluno.codigos && aluno.codigos.length > 0) {
        aluno.codigos.forEach(codigo => {
          const nomeAtividade = codigos[codigo];
          if (!nomeAtividade) return; // segurança

          const btn = document.createElement("button");
          btn.textContent = `${codigo} - ${nomeAtividade}`;
          btn.className = "codigo-btn active";

          btn.onclick = () => {
            if (!modoAdm) {
              alert("Apenas administradores podem remover atividades.");
              return;
            }
            if (confirm(`Remover a atividade "${nomeAtividade}" deste aluno?`)) {
              const pos = aluno.codigos.indexOf(codigo);
              if (pos > -1) {
                aluno.codigos.splice(pos, 1);
                localStorage.setItem("alunos", JSON.stringify(alunos));
                renderizarSalas();
              }
            }
          };

          alunoDiv.appendChild(btn);
        });
      } else {
        alunoDiv.innerHTML += "<em>Sem atividades cadastradas.</em><br>";
      }

      // Botão WhatsApp
      if (aluno.whatsapp && aluno.whatsapp.trim() !== "") {
        const waBtn = document.createElement("button");
        waBtn.innerHTML = "📱 WhatsApp";
        waBtn.style.marginLeft = "10px";
        waBtn.onclick = () => {
          const numero = aluno.whatsapp.replace(/\D/g, "");
          window.open(`https://wa.me/${numero}`, "_blank");
        };
        alunoDiv.appendChild(waBtn);
      }

      // Botão remover aluno
      const removerBtn = document.createElement("button");
      removerBtn.textContent = "Remover Aluno";
      removerBtn.className = "danger";
      removerBtn.onclick = () => modoAdm ? removerAluno(index) : alert("Apenas administradores podem remover alunos.");
      alunoDiv.appendChild(removerBtn);

      div.appendChild(alunoDiv);
    });
    lista.appendChild(div);
  });
}

function adicionarSala() {
  const nova = document.getElementById("novaSala").value.trim();
  if (!nova) return alert("Digite o nome da sala.");
  if (!salas.includes(nova)) {
    salas.push(nova);
    localStorage.setItem("salas", JSON.stringify(salas));
    document.getElementById("novaSala").value = "";
    renderizarSalas();
  } else {
    alert("Sala já existe.");
  }
}

function removerSala() {
  const salaSelecionada = document.getElementById("removerSala").value;
  if (!salaSelecionada) return alert("Selecione uma sala para remover.");
  if (!confirm(`Deseja remover a sala '${salaSelecionada}'?`)) return;
  salas = salas.filter(s => s !== salaSelecionada);
  // Também remover alunos dessa sala
  alunos = alunos.filter(a => a.turma !== salaSelecionada);
  localStorage.setItem("salas", JSON.stringify(salas));
  localStorage.setItem("alunos", JSON.stringify(alunos));
  renderizarSalas();
}

function adicionarAluno() {
  const nome = document.getElementById("nome").value.trim();
  const ra = document.getElementById("ra").value.trim();
  const digito = document.getElementById("digito").value.trim();
  const senha = document.getElementById("senha").value.trim();
  const whatsapp = document.getElementById("whatsapp").value.trim();
  const turma = document.getElementById("turma").value;
  const valor = parseFloat(document.getElementById("valorPago").value) || 0;
  const devido = parseFloat(document.getElementById("valorDevido").value) || 0;

  if (!nome || !ra || !digito || !senha || !turma) {
    alert("Preencha todos os campos obrigatórios.");
    return;
  }

  // Pegando as atividades selecionadas
  const checkboxes = document.querySelectorAll("#atividadesFieldset input[type='checkbox']");
  const codigosSelecionados = [];
  checkboxes.forEach(c => {
    if (c.checked) codigosSelecionados.push(c.value);
  });

  alunos.push({ nome, ra, digito, senha, whatsapp, turma, valor, devido, codigos: codigosSelecionados });
  localStorage.setItem("alunos", JSON.stringify(alunos));

  // Limpar campos
  document.getElementById("nome").value = "";
  document.getElementById("ra").value = "";
  document.getElementById("digito").value = "";
  document.getElementById("senha").value = "";
  document.getElementById("whatsapp").value = "";
  document.getElementById("valorPago").value = "";
  document.getElementById("valorDevido").value = "";
  checkboxes.forEach(c => c.checked = false);

  renderizarSalas();
}

function removerAluno(index) {
  if (!confirm("Confirma remover este aluno?")) return;
  alunos.splice(index, 1);
  localStorage.setItem("alunos", JSON.stringify(alunos));
  renderizarSalas();
}

function autenticarAdm() {
  const login = document.getElementById("login").value.trim();
  const senha = document.getElementById("senhaAdm").value.trim();

  // Aqui você pode colocar sua senha e login hardcoded
  if (login === "admin" && senha === "12345") {
    modoAdm = true;
    alert("Acesso de administrador liberado.");
    document.getElementById("adminPanel").style.display = "block";
    renderizarSalas();
    renderizarValoresFixos();
    mostrarAcessosAdmin();
  } else {
    alert("Usuário ou senha incorretos.");
  }
}

function mostrarAcessosAdmin() {
  const painel = document.getElementById("acessosList");
  painel.innerHTML = "";
  Object.values(acessosUsuarios).forEach(u => {
    const div = document.createElement("div");
    div.textContent = `Nome: ${u.nome} | CPF: ${u.cpf} | Telefone: ${u.telefone} | Acessos: ${u.acessos}`;
    painel.appendChild(div);
  });
}

function apagarTudo() {
  if (!modoAdm) return alert("Apenas administradores podem apagar dados.");
  if (!confirm("Tem certeza que quer apagar TODOS os dados?")) return;
  localStorage.clear();
  alert("Dados apagados.");
  location.reload();
}

window.onload = () => {
  checarAutoLogin();
};
</script>

</body>
</html>
