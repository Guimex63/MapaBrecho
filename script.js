/* script.js — integração com Firebase Firestore */

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

/* ====== CONFIGURAÇÃO DO SEU FIREBASE ====== */
const firebaseConfig = {
  apiKey: "AIzaSyAHmgSbUkEO2xdVF2HTKAJxgePjeNypX10",
  authDomain: "mapa-brecho.firebaseapp.com",
  projectId: "mapa-brecho",
  storageBucket: "mapa-brecho.firebasestorage.app",
  messagingSenderId: "1032203593165",
  appId: "1:1032203593165:web:fa335515b7a33e4db05084"
};
/* ========================================== */

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const brechosCol = collection(db, "brechos");

/* ---- DOM ---- */
const brechoForm = document.getElementById("brechoForm");
const brechoList = document.getElementById("brechoList");
const filterForm = document.getElementById("filterForm");

let brechos = [];

/* RENDER: exibe brechós */
function renderBrechos(lista) {
  brechoList.innerHTML = "";
  if (!lista || lista.length === 0) {
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
      <p><b>Itens:</b> ${Array.isArray(brecho.itens) ? brecho.itens.join(", ") : (brecho.itens || "")}</p>
      <p><b>Doações:</b> ${brecho.doacao_info || "Não informado"} (${brecho.remunerada || "—"})</p>
      <p><b>Voluntariado:</b> ${brecho.voluntario || "—"}</p>
    `;
    brechoList.appendChild(li);
  });
}

/* ====== Escuta em tempo real ====== */
const q = query(brechosCol, orderBy("createdAt", "desc"));
onSnapshot(q, (snapshot) => {
  brechos = [];
  snapshot.forEach(doc => {
    brechos.push({ id: doc.id, ...doc.data() });
  });
  renderBrechos(brechos);
});

/* ====== CADASTRO ====== */
brechoForm.addEventListener("submit", async (e) => {
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
    preco_min: Number(formData.get("preco_min")),
    preco_max: Number(formData.get("preco_max")),
    itens: itensSelecionados,
    doacao_info: formData.get("doacao_info"),
    remunerada: formData.get("remunerada"),
    voluntario: formData.get("voluntario"),
    createdAt: serverTimestamp()
  };

  try {
    await addDoc(brechosCol, novoBrecho);
    brechoForm.reset();
  } catch (err) {
    console.error("Erro ao salvar no Firestore:", err);
    alert("Erro ao cadastrar. Veja o console para detalhes.");
  }
});

/* ====== FILTRO ====== */
filterForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(filterForm);

  const categoria = formData.get("categoria");
  const bairro = (formData.get("bairro") || "").toLowerCase();
  const precoMax = formData.get("preco_max");
  const doacao = formData.get("remunerada");
  const voluntario = formData.get("voluntario");

  const filtrados = brechos.filter((b) => {
    return (
      (categoria === "" || (b.itens && b.itens.includes(categoria))) &&
      (bairro === "" || (b.bairro && b.bairro.toLowerCase().includes(bairro))) &&
      (precoMax === "" || Number(b.preco_max) <= Number(precoMax)) &&
      (doacao === "" || b.remunerada === doacao) &&
      (voluntario === "" || b.voluntario === voluntario)
    );
  });

  renderBrechos(filtrados);
});
