let questions = [];
let currentIndex = 0;
let userAnswers = {};
let timerInterval = null;
let remainingSeconds = 30 * 60;
const PASS_MARK = 70;

const $ = (id) => document.getElementById(id);

async function init() {
  try {
    const response = await fetch("questions.json");
    if (!response.ok) throw new Error("Could not load questions.json");
    questions = await response.json();
    if (!Array.isArray(questions) || questions.length === 0) throw new Error("Question bank is empty.");
    $("status").textContent = `${questions.length} questions loaded.`;
    $("progress").textContent = `Question 1 of ${questions.length}`;
  } catch (error) {
    $("status").textContent = "Unable to load the question bank. If you opened the HTML directly, use a local web server or GitHub Pages.";
    console.error(error);
  }
}

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function startQuiz() {
  if (!questions.length) return;
  currentIndex = 0;
  userAnswers = {};
  remainingSeconds = 30 * 60;
  $("start-screen").hidden = true;
  $("result-screen").hidden = true;
  $("quiz-screen").hidden = false;
  $("status").textContent = "";
  renderQuestion();
  startTimer();
}

function renderQuestion() {
  const q = questions[currentIndex];
  $("progress").textContent = `Question ${currentIndex + 1} of ${questions.length}`;
  $("progress-bar").style.width = `${((currentIndex + 1) / questions.length) * 100}%`;
  $("question-number").textContent = `Question ${currentIndex + 1}`;
  $("question-text").textContent = q.question;
  $("question-type").textContent = q.type === "true_false" ? "True / False" : "Multiple Choice";

  const options = $("options");
  options.innerHTML = "";

  shuffle(q.options).forEach((option, i) => {
    const inputId = `q-${q.id}-option-${i}`;
    const input = document.createElement("input");
    input.type = "radio";
    input.className = "option-input";
    input.name = `question-${q.id}`;
    input.id = inputId;
    input.value = option;
    input.checked = userAnswers[q.id] === option;

    const label = document.createElement("label");
    label.className = "option-label";
    label.htmlFor = inputId;
    label.textContent = option;

    input.addEventListener("change", () => {
      userAnswers[q.id] = option;
      $("status").textContent = "Answer saved.";
    });

    options.append(input, label);
  });

  $("prev-btn").disabled = currentIndex === 0;
  $("next-btn").textContent = currentIndex === questions.length - 1 ? "Finish Quiz" : "Next";
  $("question-text").focus({ preventScroll: true });
}

function nextQuestion() {
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    renderQuestion();
  } else {
    finishQuiz();
  }
}

function previousQuestion() {
  if (currentIndex > 0) {
    currentIndex--;
    renderQuestion();
  }
}

function startTimer() {
  clearInterval(timerInterval);
  updateTimer();
  timerInterval = setInterval(() => {
    remainingSeconds--;
    updateTimer();
    if (remainingSeconds <= 0) {
      clearInterval(timerInterval);
      finishQuiz(true);
    }
  }, 1000);
}

function updateTimer() {
  const mins = Math.floor(remainingSeconds / 60).toString().padStart(2, "0");
  const secs = (remainingSeconds % 60).toString().padStart(2, "0");
  $("timer").textContent = `${mins}:${secs}`;
  $("timer").style.color = remainingSeconds <= 60 ? "#c0392b" : "";
}

function finishQuiz(timeExpired = false) {
  clearInterval(timerInterval);
  let score = 0;

  questions.forEach(q => {
    if (userAnswers[q.id] === q.answer) score++;
  });

  const percent = Math.round((score / questions.length) * 100);
  const passed = percent >= PASS_MARK;

  $("quiz-screen").hidden = true;
  $("result-screen").hidden = false;
  $("result-title").textContent = passed ? "Quiz Passed" : "Quiz Not Passed";
  $("score-text").textContent = `${score} / ${questions.length} (${percent}%)`;
  $("result-detail").textContent = `${passed ? "You reached" : "You did not reach"} the ${PASS_MARK}% passing mark.${timeExpired ? " The timer expired." : ""}`;

  const review = $("review-answers");
  review.innerHTML = "";
  questions.forEach((q, i) => {
    const user = userAnswers[q.id] || "No answer";
    const correct = q.answer;
    const item = document.createElement("article");
    item.className = `review-item ${user === correct ? "correct" : "incorrect"}`;

    const qEl = document.createElement("div");
    qEl.className = "review-q";
    qEl.textContent = `Q${i + 1}. ${q.question}`;

    const userEl = document.createElement("div");
    userEl.className = "review-answer";
    userEl.textContent = `Your answer: ${user}`;

    const correctEl = document.createElement("div");
    correctEl.className = "review-answer";
    correctEl.textContent = `Correct answer: ${correct}`;

    item.append(qEl, userEl, correctEl);
    review.appendChild(item);
  });

  $("result-screen").scrollIntoView({ behavior: "smooth", block: "start" });
}

function restart() {
  clearInterval(timerInterval);
  $("result-screen").hidden = true;
  $("quiz-screen").hidden = true;
  $("start-screen").hidden = false;
  $("status").textContent = "";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

$("start-btn").addEventListener("click", startQuiz);
$("next-btn").addEventListener("click", nextQuestion);
$("prev-btn").addEventListener("click", previousQuestion);
$("retake-btn").addEventListener("click", startQuiz);
$("restart-top").addEventListener("click", restart);

document.addEventListener("keydown", (event) => {
  if ($("quiz-screen").hidden) return;
  if (event.key === "ArrowRight") nextQuestion();
  if (event.key === "ArrowLeft") previousQuestion();
});

init();
