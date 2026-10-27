/* =========================================================================
   QUIZ DATA
   -------------------------------------------------------------------------
   Add a quiz by copying one { ... } block. Fields:
     id         unique name without spaces
     title      shown on the Quizzes page
     material   (optional) id of the material in data/resources.js this quiz is
                about. Passing the quiz marks that material as "learned".
     audience   who it is for: ["mt", "mtc", "teacher", "staff"]
     passScore  percentage needed to pass, e.g. 70
     desc       one or two sentences
     sample     true = shown with a "Sample" tag
     questions  [] = shown as "Coming soon". Each question:
                  { q: "Question text",
                    options: ["A", "B", "C", "D"],
                    answer: 1,                 // index of the correct option (0 = first)
                    explain: "Why this is right (shown after answering)" }
   ========================================================================= */

const QUIZZES = [

  {
    id: "smartapp-teachers-quiz",
    title: "SmartApp for Teachers",
    material: "smartapp-teachers",
    category: "academic",
    audience: ["teacher"],
    passScore: 80,
    desc: "Check that you know how to use SmartApp as a teacher.",
    questions: [],   // waiting for the questions — send the SmartApp deck and they will be written from it
  },
  {
    id: "code-of-conduct-quiz",
    title: "Teacher Code of Conduct",
    material: "code-of-conduct",
    category: "academic",
    audience: ["teacher", "mt", "mtc"],
    passScore: 80,
    desc: "Check your understanding of the teacher compliance and code of conduct rules.",
    questions: [],   // waiting for the questions — send the compliance deck and they will be written from it
  },

  {
    id: "consultation-basics",
    title: "Consultation Flow Basics",
    material: "sales-guide",
    category: "marketing",
    audience: ["mt", "mtc", "staff"],
    passScore: 70,
    sample: true,
    desc: "A sample quiz built from the EAC Sales Digging Guide, so you can try how quizzes work. Real academic quizzes will be written from the training decks.",
    questions: [
      {
        q: "Which sequence matches the EAC consultation flow?",
        options: [
          "RECOMMEND → ASK → CONNECT → LISTEN → UNDERSTAND → DIG DEEPER",
          "ASK → LISTEN → DIG DEEPER → UNDERSTAND → CONNECT → RECOMMEND",
          "LISTEN → RECOMMEND → ASK → DIG DEEPER → CONNECT → UNDERSTAND",
          "ASK → RECOMMEND → LISTEN → CONNECT → UNDERSTAND → DIG DEEPER",
        ],
        answer: 1,
        explain: "The guide's flow is ASK → LISTEN → DIG DEEPER → UNDERSTAND → CONNECT → RECOMMEND. You recommend only after you understand.",
      },
      {
        q: "The guide's principle says: \"Don't chase every question. Chase ...\"",
        options: [
          "the fastest sale",
          "the longest conversation",
          "an understanding of the customer",
          "the most detailed notes",
        ],
        answer: 2,
        explain: "The principle is ASK → LISTEN → DIG DEEPER: don't chase every question, chase an understanding of the customer.",
      },
      {
        q: "A parent says English matters \"so they'll be more confident.\" What should you do next?",
        options: [
          "Move on to the next question, since the reason is clear",
          "Start explaining the program straight away",
          "Ask for the context: school, presentations, friends or another situation",
          "Offer three program options to choose from",
        ],
        answer: 2,
        explain: "Don't settle for a generic answer. Ask for the context (school, presentations, friends…) so the reason becomes specific.",
      },
      {
        q: "Which of these should you AVOID when asking \"Why do you want to learn English?\"",
        options: [
          "Jumping straight into explaining the program",
          "Observing the student's expression",
          "Looking for who is pushing the need the most",
          "Asking for the situation behind the answer",
        ],
        answer: 0,
        explain: "The guide says: don't settle for a generic answer, don't jump straight into explaining the program, and don't steer the answer with too many options.",
      },
      {
        q: "When asking about the customer's biggest challenge, what should you avoid?",
        options: [
          "Asking about past learning experiences",
          "Looking for the situation that triggers the problem",
          "Offering a solution before you understand the root cause",
          "Noticing parent concerns",
        ],
        answer: 2,
        explain: "Don't immediately argue or \"fix\" the problem, and don't blame the student. Understand the root cause first.",
      },
      {
        q: "What is the recommended approach on an initial phone call?",
        options: [
          "Ask every prepared question quickly in one go",
          "Keep it light, one question at a time, and notice tone and hesitation",
          "Read the full program details first",
          "Skip rapport and go straight to the schedule",
        ],
        answer: 1,
        explain: "On the phone: keep the conversation light, one question at a time, and pick up on tone, hesitation and the main concern.",
      },
      {
        q: "What is the recommended approach in an initial chat?",
        options: [
          "Send long messages with many questions",
          "Send short messages, 1–2 questions at a time, and use the customer's own words",
          "Wait for the customer to ask everything first",
          "Paste the full price list immediately",
        ],
        answer: 1,
        explain: "In chat: send short messages, ask 1–2 questions at a time and use the customer's own words to shape your follow-up.",
      },
      {
        q: "What are Consultation Notes (Point 08) for?",
        options: [
          "Repeating the answers already given in points 01–07",
          "Recording important information that isn't covered in points 01–07",
          "Filling every field so the form looks complete",
          "Writing your guesses about the customer",
        ],
        answer: 1,
        explain: "Notes capture useful context not covered earlier: buying signals, objections, decision maker, urgency and more. Never make up information or fill a field just to complete it.",
      },
    ],
  },

];
