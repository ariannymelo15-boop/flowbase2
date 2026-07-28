const tabContent = [
  { desc: "Onboarding de equipe sem código, do jeito que você precisa.", nodes: ["Criar novo usuário", "🤖 AI Agent", "Adicionar ao canal"] },
  { desc: "Detecte e responda a incidentes de segurança automaticamente.", nodes: ["Alerta recebido", "🤖 AI Agent", "Abrir ticket"] },
  { desc: "Conecte pipelines de CI/CD com linguagem natural.", nodes: ["Deploy solicitado", "🤖 AI Agent", "Notificar time"] },
  { desc: "Gere insights de clientes a partir de dados dispersos.", nodes: ["Novo lead", "🤖 AI Agent", "Atualizar CRM"] },
  { desc: "Automatize as tarefas repetitivas do seu dia a dia.", nodes: ["Sua ideia", "🤖 AI Agent", "Ação executada"] },
];

const tabs = document.querySelectorAll(".ops__tab");
const desc = document.getElementById("opsDesc");
const diagramNodes = document.querySelectorAll(".ops__diagram .node");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("is-active"));
    tab.classList.add("is-active");
    const data = tabContent[tab.dataset.tab];
    desc.textContent = data.desc;
    const mainNodes = [...diagramNodes].filter(n => n.classList.contains("node--input") || n.classList.contains("node--core") || n.classList.contains("node--output"));
    mainNodes[0].textContent = data.nodes[0];
    mainNodes[1].textContent = data.nodes[1];
    mainNodes[2].textContent = data.nodes[2];
  });
});

/* SCROLL REVEAL (entrada e saída) */
const revealSelectors = [
  ".hero__text", ".ops__tabs", ".ops__panel",
  ".stats__item", ".integrations > .btn",
  ".features h2", ".card",
  ".movefast__card",
  ".cases h2", ".case",
  ".enterprise h2", ".enterprise p", ".enterprise__grid > div", ".hero__cta",
  ".pricing__card",
  ".t",
  ".finalcta h2", ".finalcta p", ".finalcta > .btn",
];

const revealEls = document.querySelectorAll(revealSelectors.join(","));
revealEls.forEach((el, i) => {
  el.classList.add("reveal");
  el.style.transitionDelay = `${(i % 4) * 80}ms`;
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("is-visible", entry.isIntersecting);
    });
  },
  { threshold: 0.15 }
);

revealEls.forEach((el) => revealObserver.observe(el));
