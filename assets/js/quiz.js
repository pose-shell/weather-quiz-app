document.addEventListener("DOMContentLoaded", async () => {
  const CATEGORY_FILE_MAP = {
    "numerical-weather-prediction": "assets/data/questions/numerical-weather-prediction.json",
    "observation": "assets/data/questions/observation.json",
    "synoptic-analysis": "assets/data/questions/synoptic-analysis.json",
    "short-range-forecast": "assets/data/questions/short-range-forecast.json",
    "local-phenomena": "assets/data/questions/local-phenomena.json",
    "weather-disaster": "assets/data/questions/weather-disaster.json",
    "forecast-operations": "assets/data/questions/forecast-operations.json"
  };

  const CATEGORY_LABEL_MAP = {
    "numerical-weather-prediction": "数値予報",
    "observation": "観測",
    "synoptic-analysis": "総観解析",
    "short-range-forecast": "短時間予報",
    "local-phenomena": "局地現象",
    "weather-disaster": "気象災害",
    "forecast-operations": "情報利用・予報業務"
  };

  const params = new URLSearchParams(window.location.search);
  const category = params.get("category") || "numerical-weather-prediction";
  const startParam = params.get("start");
  const dataPath = CATEGORY_FILE_MAP[category];

  let questions = [];
  let currentIndex = 0;
  let selectedChoiceIndex = null;
  let answered = false;

  const pageTitleEl = document.getElementById("page-title");
  const categoryLabelEl = document.getElementById("category-label");
  const questionCountEl = document.getElementById("question-count");
  const questionTextEl = document.getElementById("question-text");
  const choicesEl = document.getElementById("choices");
  const answerButtonEl = document.getElementById("answer-button");

  const resultSectionEl = document.getElementById("result-section");
  const resultTextEl = document.getElementById("result-text");
  const answerTextEl = document.getElementById("answer-text");

  const explanationSectionEl = document.getElementById("explanation-section");
  const explanationTextEl = document.getElementById("explanation-text");
  const wrongChoiceListEl = document.getElementById("wrong-choice-list");

  const prevButtonEl = document.getElementById("prev-button");
  const nextButtonEl = document.getElementById("next-button");
  const relatedArticlesContainerEl = document.getElementById("related-articles-container");
  let articlesIndex = []; 

  if (!dataPath) {
    showLoadError("存在しないカテゴリです。");
    return;
  }

  try {
    const response = await fetch(dataPath, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`問題JSONの取得に失敗しました: ${response.status}`);
    }

  questions = await response.json();
  if (!Array.isArray(questions) || questions.length === 0) {
    throw new Error("問題データが空、または配列ではありません。");
  }

  const articlesResponse = await fetch("assets/data/articles.json", { cache: "no-store" });

  if (!articlesResponse.ok) {
    throw new Error(`記事一覧JSONの取得に失敗しました: ${articlesResponse.status}`);
  }

  articlesIndex = await articlesResponse.json();

  const parsedStart = Number(startParam);

  if (Number.isInteger(parsedStart) && parsedStart >= 0 && parsedStart < questions.length) {
    currentIndex = parsedStart;
  } else {
    currentIndex = 0;
  }

renderQuestion();

  } catch (error) {
    console.error(error);
    showLoadError("問題データの読み込みに失敗しました。");
  }

  function showLoadError(message) {
    if (pageTitleEl) {
      pageTitleEl.textContent = "演習を読み込めませんでした";
    }
    categoryLabelEl.textContent = "";
    questionCountEl.textContent = "";
    questionTextEl.textContent = message;
    choicesEl.innerHTML = "";
    answerButtonEl.disabled = true;
    prevButtonEl.disabled = true;
    nextButtonEl.disabled = true;
  }

  function renderQuestion() {
    const question = questions[currentIndex];
    const categoryLabel = CATEGORY_LABEL_MAP[category] || category;

    selectedChoiceIndex = null;
    answered = false;

    if (pageTitleEl) {
      pageTitleEl.textContent = `${categoryLabel}の演習`;
    }

    categoryLabelEl.textContent = categoryLabel;
    questionCountEl.textContent = `${currentIndex + 1} / ${questions.length}`;
    questionTextEl.textContent = question.question;

    choicesEl.innerHTML = "";

    question.choices.forEach((choice, index) => {
      const button = document.createElement("button");
      button.className = "choice-button";
      button.type = "button";
      button.textContent = `${choiceLabel(index)}. ${choice}`;

      button.addEventListener("click", () => {
        if (answered) return;
        selectedChoiceIndex = index;
        updateChoiceSelection();
      });

      choicesEl.appendChild(button);
    });

    resultSectionEl.classList.add("is-hidden");
    explanationSectionEl.classList.add("is-hidden");
    resultTextEl.textContent = "";
    answerTextEl.textContent = "";
    explanationTextEl.textContent = "";
    wrongChoiceListEl.innerHTML = "";

    answerButtonEl.disabled = false;
    prevButtonEl.disabled = currentIndex === 0;
    nextButtonEl.disabled = currentIndex === questions.length - 1;

    renderRelatedArticles(question);
  }

  function updateChoiceSelection() {
    const buttons = choicesEl.querySelectorAll(".choice-button");

    buttons.forEach((button, index) => {
      button.classList.toggle("selected", index === selectedChoiceIndex);
    });
  }

  function judgeAnswer() {
    if (selectedChoiceIndex === null) {
      alert("選択肢を選んでください。");
      return;
    }

    const question = questions[currentIndex];
    answered = true;

    const isCorrect = selectedChoiceIndex === question.answer;

    showAnswerState(question, isCorrect);
    showExplanation(question);

    answerButtonEl.disabled = true;
  }

  function showAnswerState(question, isCorrect) {
    resultSectionEl.classList.remove("is-hidden");

    if (isCorrect) {
      resultTextEl.textContent = "正解です。";
      resultTextEl.classList.remove("incorrect");
      resultTextEl.classList.add("correct");
    } else {
      resultTextEl.textContent = "不正解です。";
      resultTextEl.classList.remove("correct");
      resultTextEl.classList.add("incorrect");
    }

    answerTextEl.textContent = `正解: ${choiceLabel(question.answer)}. ${question.choices[question.answer]}`;

    const buttons = choicesEl.querySelectorAll(".choice-button");
    buttons.forEach((button, index) => {
      button.disabled = true;

      if (index === question.answer) {
        button.classList.add("correct-choice");
      }

      if (index === selectedChoiceIndex && index !== question.answer) {
        button.classList.add("incorrect-choice");
      }
    });
  }

  function showExplanation(question) {
    explanationSectionEl.classList.remove("is-hidden");
    explanationTextEl.textContent = question.explanation;

    if (Array.isArray(question.wrong_choice_explanations)) {
      question.wrong_choice_explanations.forEach((text, index) => {
        const li = document.createElement("li");
        li.textContent = `${choiceLabel(index)}. ${text}`;
        wrongChoiceListEl.appendChild(li);
      });
    }
  }

function renderRelatedArticles(question) {
  if (!relatedArticlesContainerEl) return;

  const relatedIds = Array.isArray(question.related_art_ids)
    ? question.related_art_ids
    : [];

  if (relatedIds.length === 0) {
    relatedArticlesContainerEl.innerHTML = "";
    return;
  }

  const matchedArticles = relatedIds
    .map((id) => articlesIndex.find((article) => article.id === id))
    .filter(Boolean);

  if (matchedArticles.length === 0) {
    relatedArticlesContainerEl.innerHTML = "";
    return;
  }

  relatedArticlesContainerEl.innerHTML = `
    <section class="related-articles">
      <h2>関連記事</h2>
      <ul class="related-articles__list">
        ${matchedArticles.map((article) => `
          <li>
            <a href="${article.url}">${escapeHtml(article.title)}</a>
          </li>
        `).join("")}
      </ul>
    </section>
  `;
}

  function moveQuestion(direction) {
    const nextIndex = currentIndex + direction;

    if (nextIndex < 0 || nextIndex >= questions.length) {
      return;
    }

    currentIndex = nextIndex;
    renderQuestion();
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

  function choiceLabel(index) {
    return ["A", "B", "C", "D"][index] ?? String(index + 1);
  }

  answerButtonEl.addEventListener("click", judgeAnswer);
  prevButtonEl.addEventListener("click", () => moveQuestion(-1));
  nextButtonEl.addEventListener("click", () => moveQuestion(1));
});