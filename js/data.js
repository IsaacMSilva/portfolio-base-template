/*
 * Conteúdo do portfólio. Edite apenas este arquivo para atualizar as informações.
 * Campos de texto aceitam uma string (igual nos dois idiomas) ou {pt:"…", en:"…"}.
 * Listas vazias ([]) escondem a seção correspondente ou mostram um estado "em breve".
 */
const DATA = {
  // Dados de EXEMPLO (pessoa fictícia). Troque tudo pelos seus.
  name: "Alex Rocha",
  shortName: "Alex Rocha",       // usado na marca do topo e no console
  title: { pt: "Desenvolvedor Full Stack", en: "Full Stack Developer" },
  available: { pt: "Disponível para novas oportunidades", en: "Open to new opportunities" },
  location: { pt: "São Paulo, SP, Brasil", en: "São Paulo, Brazil" },
  photo: "assets/foto.jpg",      // sem o arquivo, a moldura mostra as iniciais
  intro: {
    pt: "Desenvolvedor apaixonado por criar interfaces rápidas, acessíveis e bem acabadas, do banco de dados ao pixel.",
    en: "Developer who loves building fast, accessible and polished interfaces, from the database to the pixel."
  },
  goals: {
    pt: "Construir produtos úteis, aprender todos os dias e colaborar com times que valorizam qualidade.",
    en: "Build useful products, learn every day and work with teams that value quality."
  },
  focus: { pt: "Full Stack · Web", en: "Full Stack · Web" },

  education: [
    {
      course: { pt: "Análise e Desenvolvimento de Sistemas", en: "Systems Analysis and Development" },
      school: "Universidade Exemplo",
      period: { pt: "2024 – 2026", en: "2024 – 2026" }
    }
  ],

  experience: [
    {
      role: { pt: "Desenvolvedor Front-end Júnior", en: "Junior Front-end Developer" },
      org: "Empresa Exemplo",
      period: { pt: "jan. 2025 – atual", en: "Jan 2025 – present" },
      note: { pt: "Remoto", en: "Remote" }
    },
    {
      role: { pt: "Estagiário de Desenvolvimento", en: "Development Intern" },
      org: "Startup Exemplo",
      period: { pt: "2024", en: "2024" },
      note: { pt: "Híbrido · São Paulo", en: "Hybrid · São Paulo" }
    }
  ],

  // Grupo → lista de tecnologias. O nome do grupo pode ser {pt,en}.
  skills: [
    { group: { pt: "Linguagens", en: "Languages" }, items: ["Python", "Java", "JavaScript"] },
    { group: "Front-end", items: ["HTML", "CSS", "React"] },
    { group: "Back-end", items: ["Node.js"] }
  ],

  /*
   * Projetos — A PREENCHER. Exemplo de objeto (todos os campos, exceto name, são opcionais):
   * {
   *   id: "meu-projeto",
   *   name: "Nome do projeto",
   *   featured: true,                       // aparece em destaque, ocupando mais espaço
   *   cover: "assets/meu-projeto.jpg",      // imagem 16:10, idealmente 1600×1000
   *   category: { pt: "Web", en: "Web" },
   *   status: { pt: "Concluído", en: "Completed" },
   *   period: "2026",
   *   description: { pt: "…", en: "…" },
   *   tech: ["React", "Node.js"],
   *   features: [{ pt: "…", en: "…" }],
   *   problem: { pt: "…", en: "…" },
   *   learnings: { pt: "…", en: "…" },
   *   github: "https://github.com/…",
   *   demo: "https://…"
   * }
   */
  projects: [
    {
      id: "tarefas",
      name: "Gerenciador de Tarefas",
      featured: true,
      category: "Web",
      status: { pt: "Concluído", en: "Completed" },
      period: "2026",
      description: {
        pt: "Projeto de exemplo: app de tarefas com quadros, filtros e sincronização em tempo real.",
        en: "Sample project: a task app with boards, filters and real-time sync."
      },
      tech: ["React", "Node.js"],
      features: [
        { pt: "Arrastar e soltar entre colunas", en: "Drag and drop between columns" },
        { pt: "Modo offline", en: "Offline mode" }
      ],
      problem: { pt: "Descreva aqui o problema que o projeto resolve.", en: "Describe the problem the project solves." },
      learnings: { pt: "Conte o que você aprendeu construindo.", en: "Tell what you learned while building it." }
    }
  ],

  courses: [],   // A PREENCHER (opcional): ex. [{pt:"Curso X — Instituição (2025)", en:"…"}]
  certs: [],     // A PREENCHER (opcional)
  languages: [{ pt: "Português — nativo", en: "Portuguese — native" }, { pt: "Inglês — intermediário", en: "English — intermediate" }],

  contact: {
    email: "voce@exemplo.com",
    github: "https://github.com/seu-usuario",
    linkedin: "https://www.linkedin.com/in/seu-usuario/",
    other: [] // ex. [{label:"Behance", url:"https://…"}]
  },

  resumePdf: "" // A PREENCHER (opcional): ex. "curriculo.pdf" colocado nesta pasta
};
