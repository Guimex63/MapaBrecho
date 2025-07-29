document.getElementById("brechoForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const form = e.target;
  const nome = form.nome.value;
  const endereco = form.endereco.value;
  const cidade = form.cidade.value;
  const faixaMin = form.preco_min.value;
  const faixaMax = form.preco_max.value;

  const li = document.createElement("li");
  li.innerHTML = `
    <strong>${nome}</strong><br/>
    Endereço: ${endereco} - ${cidade}<br/>
    Faixa de preço: R$ ${faixaMin} até R$ ${faixaMax}
  `;

  document.getElementById("brechoList").appendChild(li);
  form.reset();
});
