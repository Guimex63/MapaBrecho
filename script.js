// Ao carregar a página, exibir dados salvos
window.onload = () => {
  const brechos = JSON.parse(localStorage.getItem("brechos")) || [];
  brechos.forEach(exibirBrecho);
};

function exibirBrecho(brecho) {
  const html = `
    <div class="brecho">
      <h3>${brecho.nome}</h3>
      <p><strong>Endereço:</strong> ${brecho.endereco}, ${brecho.cidade}</p>
      <p><strong>Horário:</strong> ${brecho.horario}</p>
      <p><strong>Faixa de preço:</strong> ${brecho.preco}</p>
      <p><strong>O que vende:</strong> ${brecho.itens}</p>
      <p><strong>Política de doações:</strong> ${brecho.doacao}</p>
    </div>
  `;
  document.getElementById("brecho-lista").innerHTML += html;
}

document.getElementById('form-brecho').addEventListener('submit', function(e) {
  e.preventDefault();

  const brecho = {
    nome: document.getElementById('nome').value,
    endereco: document.getElementById('endereco').value,
    cidade: document.getElementById('cidade').value,
    horario: document.getElementById('horario').value,
    preco: document.getElementById('preco').value,
    itens: document.getElementById('itens').value,
    doacao: document.getElementById('doacao').value
  };

  // salvar no localStorage
  const brechos = JSON.parse(localStorage.getItem("brechos")) || [];
  brechos.push(brecho);
  localStorage.setItem("brechos", JSON.stringify(brechos));

  exibirBrecho(brecho);
  this.reset();
});
