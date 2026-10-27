/* Quiz page: intro → one question at a time (with instant feedback) → result → review.
   Attempts are saved with Store (this browser). Passing a quiz marks its material as learned. */
(function () {
  const root = document.getElementById("quiz-root");
  const params = new URLSearchParams(location.search);
  const LETTERS = "ABCDEFGH";
  const BACK = "index.html?view=quizzes";
  let quiz = null, idx = 0, picked = [], checked = false;

  const fail = (title, msg) => {
    root.innerHTML = `<div class="view-body"><div class="quiz-shell"><div class="state"><div class="big">📝</div><div><b>${esc(title)}</b></div><div>${esc(msg)}</div>
      <div class="state-actions"><a class="btn primary small" href="${BACK}">Back to Quizzes</a></div></div></div></div>`;
  };
  const findQuiz = id => (typeof QUIZZES === "undefined" ? [] : QUIZZES).find(q => q.id === id);
  const head = (right) => `<a class="back-link" href="${BACK}">← Back to Quizzes</a>${right || ""}`;

  /* ---------- intro ---------- */
  function intro() {
    const best = bestAttempt(quiz.id), n = Store.attempts().filter(a => a.quizId === quiz.id).length;
    const m = RESOURCES.find(x => x.id === quiz.material);
    root.innerHTML = `<div class="view-body"><div class="quiz-shell">
      ${head()}
      <div class="quiz-card-big">
        <span class="head-ic">${svg("quiz", 26)}</span>
        <h1>${esc(quiz.title)}</h1>
        <p>${esc(quiz.desc || "")}</p>
        <div class="quiz-meta">
          <span>${svg("quiz", 15)} ${quiz.questions.length} questions</span>
          <span>${svg("target", 15)} Pass at ${quiz.passScore}%</span>
          ${m ? `<span>${svg("learning", 15)} ${esc(m.title)}</span>` : ""}
          ${quiz.sample ? '<span class="type-tag">Sample</span>' : ""}
        </div>
        ${best ? `<p class="quiz-best">Your best score: <b>${best.score}%</b> · ${n} ${n === 1 ? "attempt" : "attempts"}</p>` : ""}
        <p class="quiz-tip">After each question you'll see right away whether you were correct, with a short explanation.</p>
        <button type="button" class="btn primary big" id="q-start">${best ? "Retake quiz" : "Start quiz"}</button>
      </div></div></div>`;
    document.getElementById("q-start").onclick = () => { idx = 0; picked = []; checked = false; question(); };
  }

  /* ---------- question ---------- */
  function question() {
    const q = quiz.questions[idx], total = quiz.questions.length;
    const sel = picked[idx];
    const optHtml = q.options.map((o, i) => {
      let cls = "q-opt";
      if (checked) { if (i === q.answer) cls += " right"; else if (i === sel) cls += " wrong"; }
      else if (i === sel) cls += " sel";
      return `<button type="button" class="${cls}" data-o="${i}" ${checked ? "disabled" : ""} role="radio" aria-checked="${i === sel}">
        <span class="q-let">${LETTERS[i]}</span><span class="q-tx">${esc(o)}</span>
        ${checked && i === q.answer ? `<span class="q-mark">${svg("check", 18)}</span>` : ""}</button>`;
    }).join("");
    const ok = checked && sel === q.answer;
    root.innerHTML = `<div class="view-body"><div class="quiz-shell">
      ${head(`<span class="q-count">Question ${idx + 1} of ${total}</span>`)}
      <div class="mbar"><i style="width:${(idx + (checked ? 1 : 0)) / total * 100}%"></i></div>
      <div class="quiz-card-big left">
        <h2 class="q-text">${esc(q.q)}</h2>
        <div class="q-opts" role="radiogroup" aria-label="Answer options">${optHtml}</div>
        ${checked ? `<div class="q-feedback ${ok ? "ok" : "bad"}"><b>${ok ? "Correct!" : "Not quite."}</b> ${esc(q.explain || "")}</div>` : ""}
        <div class="q-actions">
          ${checked
            ? `<button type="button" class="btn primary" id="q-next">${idx + 1 < total ? "Next question" : "See results"}</button>`
            : `<button type="button" class="btn primary" id="q-check" ${sel === undefined ? "disabled" : ""}>Check answer</button>`}
        </div>
      </div></div></div>`;
    root.querySelectorAll(".q-opt").forEach(b => b.onclick = () => { picked[idx] = +b.dataset.o; question(); });
    const chk = document.getElementById("q-check"); if (chk) chk.onclick = () => { checked = true; question(); };
    const nxt = document.getElementById("q-next");
    if (nxt) { nxt.onclick = () => { checked = false; if (idx + 1 < total) { idx++; question(); } else finish(); }; nxt.focus(); }
  }

  /* ---------- finish + result ---------- */
  let lastAttempt = null, newlyLearned = false;
  function finish() {
    const total = quiz.questions.length;
    const correct = quiz.questions.filter((q, i) => picked[i] === q.answer).length;
    const score = Math.round(correct / total * 100), passed = score >= quiz.passScore;
    lastAttempt = Store.addAttempt({ quizId: quiz.id, quizTitle: quiz.title, score, correct, total, passed, answers: picked.slice() });
    newlyLearned = false;
    if (passed && quiz.material && Store.status(quiz.material) !== "learned") { Store.setLearned(quiz.material, true); newlyLearned = true; }
    result();
  }
  function result() {
    const a = lastAttempt, m = RESOURCES.find(x => x.id === quiz.material);
    root.innerHTML = `<div class="view-body"><div class="quiz-shell">
      ${head()}
      <div class="quiz-card-big result ${a.passed ? "pass" : "fail"}">
        <div class="donut big" style="--p:${a.score}"><span>${a.score}%</span></div>
        <h1>${a.passed ? "You passed!" : "Not passed yet"}</h1>
        <p>You answered <b>${a.correct} of ${a.total}</b> correctly. ${a.passed ? "" : `You need ${quiz.passScore}% to pass — review the answers and try again.`}</p>
        ${newlyLearned && m ? `<p class="quiz-tip ok">${svg("check", 15)} “${esc(m.title)}” was marked as learned.</p>` : ""}
        <div class="q-actions center">
          <button type="button" class="btn" id="q-review">Review answers</button>
          <button type="button" class="btn" id="q-retake">Retake quiz</button>
          <a class="btn primary" href="${BACK}">Back to Quizzes</a>
        </div>
      </div></div></div>`;
    document.getElementById("q-review").onclick = () => review(a);
    document.getElementById("q-retake").onclick = () => { idx = 0; picked = []; checked = false; question(); };
  }

  /* ---------- review ---------- */
  function review(a) {
    const note = a.total !== quiz.questions.length ? `<p class="quiz-tip">This quiz was updated after you took it, so the review may not line up exactly.</p>` : "";
    const items = quiz.questions.map((q, i) => {
      const mine = a.answers[i], ok = mine === q.answer;
      return `<article class="rv ${ok ? "ok" : "bad"}">
        <div class="rv-h"><span class="rv-n">${i + 1}</span><b>${esc(q.q)}</b><span class="lchip ${ok ? "learned" : "bad"}">${ok ? "Correct" : "Incorrect"}</span></div>
        <p class="rv-a">${mine === undefined ? "<i>No answer</i>" : `<span class="you">Your answer:</span> ${LETTERS[mine]}. ${esc(q.options[mine] || "")}`}</p>
        ${ok ? "" : `<p class="rv-a good"><span class="you">Correct answer:</span> ${LETTERS[q.answer]}. ${esc(q.options[q.answer])}</p>`}
        ${q.explain ? `<p class="rv-e">${esc(q.explain)}</p>` : ""}
      </article>`;
    }).join("");
    root.innerHTML = `<div class="view-body"><div class="quiz-shell wide">
      ${head(`<span class="q-count">${esc(quiz.title)} · ${esc(new Date(a.at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }))} · ${a.score}%</span>`)}
      ${note}
      <div class="rv-list">${items}</div>
      <div class="q-actions center"><a class="btn primary" href="${BACK}">Back to Quizzes</a><a class="btn" href="quiz.html?id=${esc(quiz.id)}">Retake quiz</a></div>
    </div></div>`;
  }

  /* ---------- keyboard: 1–4 pick, Enter checks / continues ---------- */
  document.addEventListener("keydown", e => {
    if (!quiz || !document.getElementById("q-start") && !root.querySelector(".q-opts")) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const opts = root.querySelectorAll(".q-opt");
    if (opts.length && !checked && /^[1-8]$/.test(e.key) && opts[+e.key - 1]) { picked[idx] = +e.key - 1; question(); }
    else if (e.key === "Enter") {
      const b = document.getElementById("q-next") || document.getElementById("q-check") || document.getElementById("q-start");
      if (b && !b.disabled && document.activeElement === document.body) { e.preventDefault(); b.click(); }
    }
  });

  /* ---------- start ---------- */
  const reviewId = params.get("review");
  if (reviewId) {
    const a = Store.attempt(reviewId);
    if (!a) return fail("Result not found", "This result isn't saved on this device.");
    quiz = findQuiz(a.quizId);
    if (!quiz) return fail("Quiz not found", "This quiz no longer exists.");
    review(a);
  } else {
    quiz = findQuiz(params.get("id") || "");
    if (!quiz) fail("Quiz not found", "Pick a quiz from the Quizzes page.");
    else if (!quizReady(quiz)) fail(quiz.title, "The questions for this quiz are not ready yet.");
    else intro();
  }
})();
