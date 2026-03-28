async function loadPartial(id, path) {
  const target = document.getElementById(id);
  if (!target) return;

  try {
    const response = await fetch(path, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Failed to load partial: ${path}`);
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
    console.error(error);
    target.innerHTML = "<p>ヘッダーの読み込みに失敗しました。</p>";
  }
}

document.addEventListener("DOMContentLoaded", () => {
    loadPartial("site-header", "assets/partials/header.html");
});