<div align="center">

# ◈ Portfólio Template

**Um modelo de portfólio pessoal bilíngue (PT/EN), escuro e elegante — feito com HTML, CSS e JavaScript puros.**

Baseado no portfólio de **[Isaac Mangelli Silva](https://github.com/IsaacMSilva)**.

Sem framework, sem build, sem dependências. Edite um arquivo, publique e pronto.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Dependências](https://img.shields.io/badge/dependências-zero-ff3b30?style=for-the-badge)
![Licença MIT](https://img.shields.io/badge/licença-MIT-informational?style=for-the-badge)

<img src=".github/preview-isaac.png" alt="Portfólio original de Isaac Mangelli Silva" width="900">

<sub>↑ O portfólio original de <b>Isaac Mangelli Silva</b>, que deu origem a este modelo.</sub>

</div>

---

## 💡 Sobre o modelo

Este repositório nasceu do meu portfólio pessoal. Eu, **Isaac Mangelli Silva**, separei o código do conteúdo e substituí meus dados por um perfil fictício (**Alex Rocha**), para que qualquer pessoa possa usar a mesma base no próprio portfólio.

## ✨ Recursos

| | |
|---|---|
| 🌐 **Bilíngue** | Português e inglês com um clique; qualquer texto aceita `{ pt, en }`. |
| ✏️ **Um arquivo de conteúdo** | Bio, experiência, formação, competências, projetos e contatos ficam todos em `js/data.js`. |
| ⌨️ **Console interativo** | Um terminal no próprio site: `help`, `about`, `projects`, `skills`, `neofetch`, `whoami`, `open`… |
| 🗂️ **Projetos com estudo de caso** | Busca, filtro por categoria, projeto em destaque e detalhes expansíveis (problema, destaques, aprendizados). |
| 🖨️ **Currículo para impressão** | `Ctrl+P` gera um currículo a partir dos mesmos dados — ou aponte para o seu próprio PDF. |
| ♿ **Acessível** | Link para pular ao conteúdo, foco visível, ARIA, `noscript` e respeito a `prefers-reduced-motion`. |
| 🔎 **Pronto para SEO** | Open Graph, Twitter Cards e dados estruturados JSON-LD (`schema.org/Person`). |
| 🎨 **Fácil de personalizar** | Cores e fontes em variáveis CSS no topo de `styles.css`. |

## 🚀 Começando

1. Clique em **Use this template → Create a new repository** (ou faça um fork / baixe o ZIP).
2. Abra o `index.html` no navegador — ou sirva a pasta:
   ```bash
   python3 -m http.server 8000
   ```
3. Personalize seguindo o checklist abaixo e publique.

## ✅ Checklist de personalização

O modelo vem preenchido com uma pessoa fictícia (**Alex Rocha**). Troque pelos seus dados em:

- [ ] **`js/data.js`** — todo o conteúdo: nome, cargo, bio, experiência, formação, competências, projetos e contatos.
- [ ] **`assets/foto.jpg`** — sua foto (quadrada, 800×800 px ou mais). Sem foto, a moldura mostra suas iniciais.
- [ ] **`index.html`** — `<title>`, meta tags, bloco JSON-LD e `<noscript>` (robôs e redes sociais não executam JavaScript, então esses dados ficam repetidos aqui).
- [ ] **`js/i18n.js`** — `docTitle` e `docDesc` (título e descrição da aba em PT e EN).
- [ ] **`LICENSE`** — seu nome no copyright.

> A marca do topo, o prompt do console e o `neofetch` usam o `shortName` de `js/data.js` automaticamente.

## 📁 Estrutura

```
.
├── index.html      # estrutura da página, SEO e JSON-LD
├── styles.css      # identidade visual (variáveis no topo)
├── assets/         # sua foto e capas dos projetos
└── js/
    ├── data.js     # ✏️ todo o conteúdo do portfólio
    ├── i18n.js     # textos fixos da interface (PT/EN)
    └── app.js      # renderização, navegação, filtros e console
```

## ✏️ Editando o conteúdo

Campos de texto aceitam uma string (igual nos dois idiomas) ou `{ pt: "…", en: "…" }`. Listas vazias (`[]`) escondem a seção ou mostram um estado "em breve".

### Adicionar um projeto

Dentro de `projects: []` em `js/data.js` (o modelo completo está comentado no arquivo):

```js
{
  id: "meu-projeto", name: "Meu Projeto", featured: true, cover: "assets/meu-projeto.jpg",
  category: "Web", status: { pt: "Concluído", en: "Completed" }, period: "2026",
  description: { pt: "…", en: "…" }, tech: ["React", "Node.js"],
  problem: { pt: "…", en: "…" }, learnings: { pt: "…", en: "…" },
  github: "https://github.com/…", demo: "https://…"
}
```

O projeto com `featured: true` aparece em destaque. Se a capa não carregar, o card mostra as iniciais do projeto.

> 🔒 Links aceitos: `https://…`, `mailto:…` ou caminhos relativos. Outros formatos (ex.: `javascript:`) são ignorados por segurança.

### Currículo em PDF

Coloque o arquivo na raiz e preencha `resumePdf` em `js/data.js` (ex.: `"curriculo.pdf"`). Sem PDF, o botão **Imprimir / salvar PDF** gera a versão de impressão a partir dos dados.

### Cores e fontes

```css
:root {
  --bg: #060506;        /* fundo */
  --accent: #ff3b30;    /* cor de destaque */
  --display: "Space Grotesk", …;  /* títulos */
  --font: "Inter", …;             /* texto */
}
```

## 🌍 Publicando

- **GitHub Pages:** *Settings → Pages → Deploy from a branch → `main` / `(root)`*.
- **Netlify:** arraste a pasta em [app.netlify.com/drop](https://app.netlify.com/drop).
- **Vercel / Cloudflare Pages:** importe o repositório, sem comando de build.

Depois de publicar, no `<head>` do `index.html`:

1. Troque `https://SEU-DOMINIO` pela URL real e descomente `canonical`, `og:url`, `og:image` e `twitter:image`.
2. Para prévias grandes (LinkedIn, WhatsApp, X), crie uma imagem 1200×630 px (ex.: `assets/og.jpg`) e use `twitter:card` = `summary_large_image`.
3. Adicione `"url"` no bloco JSON-LD.

## 📄 Licença

Distribuído sob a licença MIT — use, modifique e publique à vontade. Veja [`LICENSE`](LICENSE).

---

<div align="center">

Modelo criado por **[Isaac Mangelli Silva](https://github.com/IsaacMSilva)**, a partir do próprio portfólio.<br>
Se usar este modelo, mantenha os créditos e deixe uma ⭐

</div>
