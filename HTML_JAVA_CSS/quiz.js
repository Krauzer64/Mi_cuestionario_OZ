// ============================================================
//  DATOS DEL CUESTIONARIO
//  Edita este array para personalizar las preguntas,
//  opciones y respuestas correctas.
// ============================================================
const QUESTIONS = [
  {
    question: "¿Cuál es es color favorito de osvaldo?",
    options: ["azul", "amarillo", "verde", "rojo"],
    correct: 2  // índice de la respuesta correcta (empieza en 0)
  },
  {
    question: "¿Que dia es su cumpleaños?",
    options: ["7", "21", "9", "10"],
    correct: 1
  },
  {
    question: "¿Comida favorita?",
    options: ["Pizza", "Chilaquiles", "Pollo KFC", "Ramen"],
    correct: 2
  },
  {
    question: "¿Que ingenieria tiene osvaldo?",
    options: ["Mecanica", "Civil", "Electrica", "Sistemas"],
    correct: 3
  },
  {
    question: "¿Podcast favorito de osvaldo?",
    options: ["La mesa reñoña", "La cotorrisa", "La mañanera", "Penitencia"],
    correct: 1
  }
];

// ============================================================
//  ESTADO DEL CUESTIONARIO
// ============================================================
let currentIndex = 0;
let score = 0;
let answered = false;

// ============================================================
//  REFERENCIAS AL DOM
// ============================================================
const screenStart    = document.getElementById("screen-start");
const screenQuestion = document.getElementById("screen-question");
const screenResult   = document.getElementById("screen-result");

const btnStart       = document.getElementById("btn-start");
const btnNext        = document.getElementById("btn-next");
const btnRestart     = document.getElementById("btn-restart");

const progressBar    = document.getElementById("progress-bar");
const questionCounter= document.getElementById("question-counter");
const scoreDisplay   = document.getElementById("score-display");
const questionText   = document.getElementById("question-text");
const optionsGrid    = document.getElementById("options-grid");

const resultIcon     = document.getElementById("result-icon");
const resultTitle    = document.getElementById("result-title");
const resultScore    = document.getElementById("result-score");
const resultMessage  = document.getElementById("result-message");

// ============================================================
//  FUNCIONES AUXILIARES
// ============================================================

/** Muestra una pantalla y oculta las demás */
function showScreen(id) {
  [screenStart, screenQuestion, screenResult].forEach(s => {
    s.classList.toggle("hidden", s.id !== id);
  });
}

/** Actualiza la barra de progreso */
function updateProgress() {
  const pct = ((currentIndex) / QUESTIONS.length) * 100;
  progressBar.style.width = pct + "%";
}

/** Renderiza la pregunta actual en el DOM */
function renderQuestion() {
  answered = false;
  btnNext.classList.add("hidden");

  const q = QUESTIONS[currentIndex];

  // Contador y puntuación
  questionCounter.textContent = `Pregunta ${currentIndex + 1} de ${QUESTIONS.length}`;
  scoreDisplay.textContent     = `Puntos: ${score}`;

  // Texto de la pregunta
  questionText.textContent = q.question;

  // Generar botones de opciones
  optionsGrid.innerHTML = "";
  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className   = "option-btn";
    btn.textContent = opt;
    btn.addEventListener("click", () => handleAnswer(i));
    optionsGrid.appendChild(btn);
  });

  updateProgress();
}

/** Maneja la respuesta seleccionada */
function handleAnswer(selectedIndex) {
  if (answered) return;
  answered = true;

  const q = QUESTIONS[currentIndex];
  const buttons = optionsGrid.querySelectorAll(".option-btn");

  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correct)   btn.classList.add("correct");
    if (i === selectedIndex && selectedIndex !== q.correct)
      btn.classList.add("wrong");
  });

  if (selectedIndex === q.correct) {
    score++;
    scoreDisplay.textContent = `Puntos: ${score}`;
  }

  // Mostrar botón de siguiente
  btnNext.classList.remove("hidden");

  // Si es la última pregunta, cambiar el texto del botón
  if (currentIndex === QUESTIONS.length - 1) {
    btnNext.textContent = "Ver resultado →";
  } else {
    btnNext.textContent = "Siguiente →";
  }
}

/** Avanza a la siguiente pregunta o muestra el resultado */
function nextQuestion() {
  currentIndex++;
  if (currentIndex < QUESTIONS.length) {
    renderQuestion();
  } else {
    showResult();
  }
}

/** Calcula y muestra la pantalla de resultado */
function showResult() {
  progressBar.style.width = "100%";
  showScreen("screen-result");

  const total = QUESTIONS.length;
  const pct   = score / total;

  resultScore.innerHTML = `Obtuviste <strong>${score} / ${total}</strong>`;

  if (pct === 1) {
    resultIcon.textContent   = "🏆";
    resultTitle.textContent  = "¡Perfecto!";
    resultMessage.textContent= "Respondiste todo correctamente. ¡Eres un experto!";
  } else if (pct >= 0.6) {
    resultIcon.textContent   = "🎉";
    resultTitle.textContent  = "¡Muy bien!";
    resultMessage.textContent= "Tienes un buen conocimiento del tema.";
  } else if (pct >= 0.4) {
    resultIcon.textContent   = "🤔";
    resultTitle.textContent  = "¡Casi!";
    resultMessage.textContent= "Sigue practicando, ¡puedes mejorar!";
  } else {
    resultIcon.textContent   = "📚";
    resultTitle.textContent  = "¡A estudiar!";
    resultMessage.textContent= "No te rindas, inténtalo de nuevo.";
  }
}

/** Reinicia el cuestionario desde cero */
function restartQuiz() {
  currentIndex = 0;
  score        = 0;
  renderQuestion();
  showScreen("screen-question");
}

// ============================================================
//  EVENTOS
// ============================================================
btnStart.addEventListener("click", () => {
  renderQuestion();
  showScreen("screen-question");
});

btnNext.addEventListener("click", nextQuestion);

btnRestart.addEventListener("click", restartQuiz);