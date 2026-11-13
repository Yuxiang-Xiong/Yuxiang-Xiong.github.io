import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const data = JSON.parse(await readFile(path.join(root, 'research-data.json'), 'utf8'));
const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const month = value => new Date(`${value}-01T12:00:00Z`).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
const paragraphs = values => values.map(value => `<p>${escape(value)}</p>`).join('\n');

function image(project, prefix, eager = false) {
  const revision = project.imageRevision ? `?v=${encodeURIComponent(project.imageRevision)}` : '';
  return `<img src="${prefix}assets/research/${project.slug}.webp${revision}"
    srcset="${prefix}assets/research/${project.slug}-small.webp${revision} 640w, ${prefix}assets/research/${project.slug}.webp${revision} 1200w"
    sizes="${prefix ? '(max-width: 820px) calc(100vw - 40px), 780px' : '(max-width: 700px) calc(100vw - 40px), (max-width: 1100px) calc((100vw - 68px) / 2), 516px'}"
    width="1536" height="1024" alt="${escape(project.alt)}" decoding="async" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'}>`;
}

function document(title, description, content, prefix = '') {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escape(title)} - Yuxiang Xiong</title>
  <meta name="description" content="${escape(description)}">
  <link rel="icon" href="${prefix}assets/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="${prefix}styles.css">
  <link rel="stylesheet" href="${prefix}research.css">
</head>
<body class="research-page">
  <a class="skip-link" href="#main-content">Skip to content</a>
  <header class="site-header">
    <a class="brand" href="${prefix}index.html">Yuxiang Xiong</a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button>
    <nav id="site-nav" class="site-nav" aria-label="Primary navigation">
      <a href="${prefix}index.html" data-page="home">Home</a>
      <a href="${prefix}research.html" data-page="research" aria-current="page">Research</a>
      <a href="${prefix}teaching.html" data-page="teaching">Teaching</a>
      <a href="${prefix}cv.html" data-page="cv">CV</a>
    </nav>
  </header>
${content}
  <footer class="site-footer">
    <span>&copy; <span id="year"></span> Yuxiang Xiong</span>
    <a href="mailto:Yuxiang.Xiong@student.ie.edu">Yuxiang.Xiong@student.ie.edu</a>
  </footer>
  <script src="${prefix}script.js"></script>
</body>
</html>
`;
}

function card(project, eager) {
  return `<article class="research-poster" id="${project.slug}">
    <a class="poster-link" href="research/${project.slug}.html" aria-labelledby="title-${project.slug}">
      <div class="poster-heading">
        <p class="eyebrow">${escape(project.field)}</p>
        <h3 id="title-${project.slug}">${escape(project.title)}</h3>
        <p class="poster-question">${escape(project.question)}</p>
      </div>
      ${image(project, '', eager)}
      <p class="poster-finding">${escape(project.finding)}</p>
      <div class="poster-footer"><span>Working paper &middot; ${month(project.date)}</span><span class="poster-action">Explore the study <span aria-hidden="true">&#8594;</span></span></div>
    </a>
  </article>`;
}

const categories = data.categories.map(category => {
  const projects = data.projects.filter(project => project.category === category.id).sort((a, b) => b.date.localeCompare(a.date));
  return `<section class="poster-category" id="${category.id}" aria-labelledby="heading-${category.id}">
    <h2 id="heading-${category.id}">${escape(category.title)}</h2>
    <div class="poster-grid">${projects.map((project, i) => card(project, category.id === 'environment' && i === 0)).join('\n')}</div>
  </section>`;
}).join('\n');

await writeFile(path.join(root, 'research.html'), document('Selected Research', 'Selected working papers by Yuxiang Xiong on biodiversity, trade, cities, and family care.', `
  <main id="main-content" class="research-gallery" tabindex="-1">
    <header class="gallery-heading">
      <p class="eyebrow">Research</p>
      <h1>Selected Research</h1>
      <p class="gallery-intro">Environmental change, international trade, regional development, and family care.</p>
      <nav class="research-topics" aria-label="Research themes">${data.categories.map(category => `<a href="#${category.id}">${escape(category.title)}</a>`).join('\n')}</nav>
    </header>
    ${categories}
  </main>`));

await mkdir(path.join(root, 'research'), { recursive: true });
for (const project of data.projects) {
  const content = `
  <main id="main-content" class="study-main" tabindex="-1">
    <a class="study-back" href="../research.html#${project.slug}"><span aria-hidden="true">&#8592;</span> Selected Research</a>
    <header class="study-heading">
      <p class="eyebrow">${escape(project.field)}</p>
      <h1>${escape(project.title)}</h1>
      <p class="study-lead">${escape(project.question)}</p>
      <p class="study-meta">Working paper &middot; Research as of <time datetime="${project.date}">${month(project.date)}</time></p>
    </header>
    <figure class="study-figure">${image(project, '../', true)}<figcaption>Conceptual illustration.</figcaption></figure>
    ${project.sections.map(section => `<section class="study-section"><h2>${escape(section.heading)}</h2>${paragraphs(section.paragraphs)}</section>`).join('\n')}
    <section class="study-section paper-summary">
      <p class="eyebrow">The paper</p>
      <h2>${escape(project.formalTitle)}</h2>
      <h3>Abstract</h3>
      <p>${escape(project.abstract)}</p>
      <h3>Methods and data</h3>
      <ul class="methods-list">${project.methods.map(method => `<li>${escape(method)}</li>`).join('')}</ul>
      ${project.links ? `<p>${project.links.map(link => `<a class="text-link" href="${escape(link.url)}">${escape(link.label)}</a>`).join(' &middot; ')}</p>` : ''}
      ${project.presentation ? `<h3>Presentation</h3><p>${escape(project.presentation)}</p>` : ''}
      <ul class="study-tags" aria-label="Research topics">${project.tags.map(tag => `<li>${escape(tag)}</li>`).join('')}</ul>
    </section>
    <a class="study-back" href="../research.html#${project.slug}"><span aria-hidden="true">&#8592;</span> Selected Research</a>
  </main>`;
  await writeFile(path.join(root, 'research', `${project.slug}.html`), document(project.title, project.question, content, '../'));
}
console.log(`Built research.html and ${data.projects.length} research detail pages.`);
