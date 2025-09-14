const brechoForm = document.getElementById("brechoForm");
const brechoList = document.getElementById("brechoList");
const filterForm = document.getElementById("filterForm");

let brechos = [];

// FUNÇÃO DE RENDERIZAÇÃO
function renderBrechos(lista) {
  brechoList.innerHTML = "";
  if (lista.length === 0) {
    brechoList.innerHTML = "<p>Nenhum brechó encontrado.</p>";
    return;
  }

  lista.forEach((brecho) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <h3>${brecho.nome}</h3>
      <p><b>Endereço:</b> ${brecho.endereco}, ${brecho.numero} ${brecho.complemento || ""}, 
         ${brecho.bairro} - CEP: ${brecho.cep}, ${brecho.cidade}</p>
      <p><b>Contato:</b> Tel: ${brecho.telefone} | Email: ${brecho.email}</p>
      <p><b>Horário:</b> ${brecho.horario}</p>
      <p><b>Faixa de preço:</b> R$${brecho.preco_min} - R$${brecho.preco_max}</p>
      <p><b>Itens:</b> ${brecho.itens.join(", ")}</p>
      <p><b>Doações:</b> ${brecho.doacao_info || "Não informado"} (${brecho.remunerada})</p>
      <p><b>Voluntariado:</b> ${brecho.voluntario}</p>
    `;
    brechoList.appendChild(li);
  });
}

// CADASTRO
brechoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(brechoForm);
  const itensSelecionados = formData.getAll("itens");
  const diasSelecionados = formData.getAll("dias");

  const novoBrecho = {
    nome: formData.get("nome"),
    endereco: formData.get("endereco"),
    numero: formData.get("numero"),
    complemento: formData.get("complemento"),
    bairro: formData.get("bairro"),
    cep: formData.get("cep"),
    cidade: formData.get("cidade"),
    telefone: formData.get("telefone"),
    email: formData.get("email"),
    horario: `${diasSelecionados.join(", ")} - ${formData.get("hora_abertura")} às ${formData.get("hora_fechamento")}`,
    preco_min: formData.get("preco_min"),
    preco_max: formData.get("preco_max"),
    itens: itensSelecionados,
    doacao_info: formData.get("doacao_info"),
    remunerada: formData.get("remunerada"),
    voluntario: formData.get("voluntario"),
  };

  brechos.push(novoBrecho);
  renderBrechos(brechos);
  brechoForm.reset();
});

// FILTRO
filterForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(filterForm);

  const categoria = formData.get("categoria");
  const bairro = formData.get("bairro").toLowerCase();
  const precoMax = formData.get("preco_max");
  const doacao = formData.get("remunerada");
  const voluntario = formData.get("voluntario");

  const filtrados = brechos.filter((b) => {
    return (
      (categoria === "" || b.itens.includes(categoria)) &&
      (bairro === "" || b.bairro.toLowerCase().includes(bairro)) &&
      (precoMax === "" || Number(b.preco_max) <= Number(precoMax)) &&
      (doacao === "" || b.remunerada === doacao) &&
      (voluntario === "" || b.voluntario === voluntario)
    );
  });

  renderBrechos(filtrados);
});

// NAVEGAÇÃO POR ABAS
const tabs = document.querySelectorAll(".tab-button");
const contents = document.querySelectorAll(".tab-content");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((btn) => btn.classList.remove("active"));
    contents.forEach((content) => content.classList.remove("active"));

    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.add("active");
  });
});
