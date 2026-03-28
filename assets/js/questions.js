document.addEventListener("DOMContentLoaded", async () => {
  const CATEGORY_FILE_MAP = {
    "numerical-weather-prediction": "assets/data/questions/numerical-weather-prediction.json",
    "observation": "assets/data/questions/observation.json"
  };

  const CATEGORY_LABEL_MAP = {
    "numerical-weather-prediction": "数値予報",
    "observation" : "観測"
  };

  const summaryEl = document.getElementById("questions-summary");
  const listEl = document.getElementById("questions-list");

  try {
    const allQuestions = [];

    for (const [category, path] of Object.entries(CATEGORY_FILE_MAP)) {
      const response = await fetch(path, { cache: "no-store" });

      if (!response.ok) {
        throw new Error(`問題JSONの取得に失敗しました: ${path}`);
      }

      const questions = await response.json();

      questions.forEach((question, index) => {
        allQuestions.push({
          ...question,
          category,
          categoryLabel: CATEGORY_LABEL_MAP[category] || category,
          displayNumber: index + 1,
          startIndex: index
        });
      });
    }

    renderQuestions(allQuestions);
  } catch (error) {
    console.error(error);
    summaryEl.textContent = "問題一覧の読み込みに失敗しました。";
    listEl.innerHTML = "";
  }

  function renderQuestions(questions) {
    summaryEl.textContent = `全 ${questions.length} 問を公開中`;

    if (questions.length === 0) {
      listEl.innerHTML = "<p>公開中の問題はまだありません。</p>";
      return;
    }

    const grouped = groupByCategory(questions);

    listEl.innerHTML = Object.entries(grouped)
      .map(([category, items]) => {
        const categoryLabel = items[0].categoryLabel;

        const itemsHtml = items.map((question) => {
          const title = question.title || `問題 ${question.displayNumber}`;
          const difficulty = "★".repeat(question.difficulty || 1);

          return `
            <article class="question-item">
              <div class="question-item-main">
                <p class="question-item-meta">
                  <span class="question-category">${categoryLabel}</span>
                  <span class="question-number">第${question.displayNumber}問</span>
                  <span class="question-difficulty">${difficulty}</span>
                </p>
                <h3 class="question-item-title">${escapeHtml(title)}</h3>
                <p class="question-item-text">${escapeHtml(question.question)}</p>
              </div>
              <div class="question-item-actions">
                <a class="button" href="quiz.html?category=${encodeURIComponent(category)}&start=${question.startIndex}">
                  この問題から解く
                </a>
              </div>
            </article>
          `;
        }).join("");

        return `
          <section class="question-group">
            <h2 class="question-group-title">${categoryLabel}</h2>
            <div class="question-group-list">
              ${itemsHtml}
            </div>
          </section>
        `;
      })
      .join("");
  }

  function groupByCategory(questions) {
    return questions.reduce((acc, question) => {
      if (!acc[question.category]) {
        acc[question.category] = [];
      }
      acc[question.category].push(question);
      return acc;
    }, {});
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }
});