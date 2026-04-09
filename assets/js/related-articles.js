let __articlesIndexCache = null;

async function loadArticlesIndex() {
  if (__articlesIndexCache) return __articlesIndexCache;

  const res = await fetch("assets/data/articles.json");
  if (!res.ok) {
    throw new Error("articles.json の読み込みに失敗しました");
  }

  const articles = await res.json();
  __articlesIndexCache = articles;
  return articles;
}

function renderRelatedArticles(relatedIds, articles, container) {
  if (!container) return;

  if (!Array.isArray(relatedIds) || relatedIds.length === 0) {
    container.innerHTML = "";
    return;
  }

  const matched = relatedIds
    .map((id) => articles.find((article) => article.id === id))
    .filter(Boolean);

  if (matched.length === 0) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = `
    <section class="related-articles">
      <h2>関連記事</h2>
      <ul class="related-articles__list">
        ${matched.map((article) => `
          <li>
            <a href="${escapeHtml(article.url)}">${escapeHtml(article.title)}</a>
          </li>
        `).join("")}
      </ul>
    </section>
  `;
}