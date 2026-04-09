const BASE_PATH = "/weather-quiz-app";

function buildPath(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_PATH}${normalizedPath}`;
}

async function loadPartial(id, path) {
  const target = document.getElementById(id);
  if (!target) return;

  try {
    const fullPath = buildPath(path);
    const response = await fetch(fullPath, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Failed to load partial: ${fullPath} (status: ${response.status})`);
    }

    const html = await response.text();
    target.innerHTML = html;

    const currentPage = target.dataset.page;
    if (currentPage) {
      const activeLink = target.querySelector(`[data-nav="${currentPage}"]`);
      if (activeLink) {
        activeLink.classList.add("active");
      }
    }
  } catch (error) {
    console.error("loadPartial error:", error);
    target.innerHTML = "<p>ヘッダーの読み込みに失敗しました。</p>";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadPartial("site-header", "/assets/partials/header.html");
  loadPartial("site-footer", "/assets/partials/footer.html");
});