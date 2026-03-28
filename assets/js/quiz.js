document.addEventListener("DOMContentLoaded", async () => {
  const DATA_PATH = "assets/data/questions/numerical-weather-prediction.json";

  let questions = [];
  let currentIndex = 0;
  let selectedChoiceIndex = null;
  let answered = false;

  // 要素取得
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

  // JSON読み込み
  try {
    const response = await fetch(DATA_PATH, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`問題JSONの取得に失敗しました: ${response.status}`);
    }

    questions = await response.json();

    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error("問題データが空、または配列ではありません。");
    }

    renderQuestion();
  } catch (error) {
    console.error(error);
    questionTextEl.textContent = "問題データの読み込みに失敗しました。";
    choicesEl.innerHTML = "";
    answerButtonEl.disabled = true;
    return;
  }

  function renderQuestion() {
    const question = questions[currentIndex];

    selectedChoiceIndex = null;
    answered = false;

    categoryLabelEl.textContent = getCategoryLabel(question.category);
    questionCountEl.textContent = `${currentIndex + 1} / ${questions.length}`;
    questionTextEl.textContent = question.question;

    // 選択肢初期化
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

    // 結果・解説を隠す
    resultSectionEl.classList.add("is-hidden");
    explanationSectionEl.classList.add("is-hidden");
    resultTextEl.textContent = "";
    answerTextEl.textContent = "";
    explanationTextEl.textContent = "";
    wrongChoiceListEl.innerHTML = "";

    // ボタン状態
    answerButtonEl.disabled = false;
    prevButtonEl.disabled = currentIndex === 0;
    nextButtonEl.disabled = currentIndex === questions.length - 1;
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

  function moveQuestion(direction) {
    const nextIndex = currentIndex + direction;

    if (nextIndex < 0 || nextIndex >= questions.length) {
      return;
    }

    currentIndex = nextIndex;
    renderQuestion();
  }

  function choiceLabel(index) {
    return ["A", "B", "C", "D"][index] ?? String(index + 1);
  }

  function getCategoryLabel(category) {
    const map = {
      "numerical-weather-prediction": "数値予報",
      "observation": "観測",
      "synoptic-analysis": "総観解析",
      "short-range-forecast": "短時間予報",
      "local-phenomena": "局地現象",
      "weather-disaster": "気象災害",
      "forecast-operations": "情報利用・予報業務"
    };

    return map[category] || category;
  }

  answerButtonEl.addEventListener("click", judgeAnswer);
  prevButtonEl.addEventListener("click", () => moveQuestion(-1));
  nextButtonEl.addEventListener("click", () => moveQuestion(1));
});
