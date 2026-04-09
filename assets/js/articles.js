async function loadArticles() {
  const res = await fetch("assets/data/articles.json");
  if (!res.ok) {
    throw new Error("articles.json の読み込みに失敗しました");
  }
  return res.json();
}

function getCategoryLabel(category) {
  const map = {
    observation: "観測",
    "synoptic-analysis": "実況解析・総観場",
    "numerical-weather-prediction": "数値予報",
    "short-range-local-forecast": "短時間予報・局地予報",
    "forecasting-techniques": "予報技術",
    "weather-disaster-and-application": "気象災害・予報活用",
    nwp: "数値予報"
  };
  return map[category] || category;
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (ch) => {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };
    return map[ch];
  });
}

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function renderArticlesList(articles, container) {
  if (!articles.length) {
    container.innerHTML = "<p>表示できる記事がありません。</p>";
    return;
  }

  const html = articles.map((article) => {
    const tagsHtml = Array.isArray(article.tags) && article.tags.length
      ? `<ul class="article-card__tags">${article.tags.map(tag => `<li>${escapeHtml(tag)}</li>`).join("")}</ul>`
      : "";

    return `
      <article class="article-card">
        <p class="article-card__category">${escapeHtml(getCategoryLabel(article.category))}</p>
        <h2 class="article-card__title">
          <a href="${escapeHtml(article.url)}">${escapeHtml(article.title)}</a>
        </h2>
        ${tagsHtml}
        <p class="article-card__meta">更新日: ${escapeHtml(article.updated_at || "-")}</p>
      </article>
    `;
  }).join("");

  container.innerHTML = html;
}

async function initArticlesPage() {
  const container = document.getElementById("articles-list");
  if (!container) return;

  try {
    const articles = await loadArticles();
    const category = getQueryParam("category");

    const filtered = articles
      .filter(article => article.status !== "archived")
      .filter(article => !category || article.category === category)
      .sort((a, b) => {
        const orderA = Number.isFinite(a.order) ? a.order : 9999;
        const orderB = Number.isFinite(b.order) ? b.order : 9999;
        if (orderA !== orderB) return orderA - orderB;
        return String(a.title).localeCompare(String(b.title), "ja");
      });

    renderArticlesList(filtered, container);

    const heading = document.getElementById("articles-page-title");
    if (heading && category) {
      heading.textContent = `${getCategoryLabel(category)} の記事一覧`;
    }
  } catch (error) {
    console.error(error);
    container.innerHTML = "<p>記事一覧の読み込みに失敗しました。</p>";
  }
}

document.addEventListener("DOMContentLoaded", initArticlesPage);