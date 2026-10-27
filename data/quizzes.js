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
    desc: "Check the key rules and fixes from the EA SmartApp manual and the troubleshooting deck.",
    draft: true,     // written from the PDFs — review the questions before relying on the scores
    questions: [
      {
        q: "How early should the teacher check the interactive session in SCMS before class starts?",
        options: ["At least 2 hours before class", "10 minutes before class", "Right when the class starts", "The evening before, only if there were problems"],
        answer: 0,
        explain: "The manual asks MTs to check the interactive session in SCMS at least 2 hours before class (H-2).",
      },
      {
        q: "What should you confirm when checking the interactive session in SCMS?",
        options: [
          "That topic and subtopic can be selected, and that “Open Control Panel” works (Main Navigation and Sharing Options visible)",
          "That the tablets are fully charged and the TV is turned on",
          "That every student has already submitted their answers",
          "That the attendance tab is filled in",
        ],
        answer: 0,
        explain: "Check that the topic and subtopic options appear and can be chosen, and that the Open Control Panel button works.",
      },
      {
        q: "You find a problem with the topic or the control panel. What is the right move?",
        options: [
          "Tell the Admin straight away so a new session card can be created, and don't wait until just before class",
          "Wait to see whether it fixes itself when class starts",
          "Ask a student to fix it in class",
          "Skip SmartApp for that class without telling anyone",
        ],
        answer: 0,
        explain: "Report it to Admin right away. Reporting errors suddenly, close to class time, leaves Admin too little time to make a new session card.",
      },
      {
        q: "A tablet has been assigned as an Interactive SmartApp tablet for students. Which use is NOT allowed?",
        options: [
          "Using it as the WA Business, attendance or sales-presentation tablet",
          "Letting students use it during the SmartApp activity",
          "Charging it before class",
          "Keeping it in the class set for SmartApp sessions",
        ],
        answer: 0,
        explain: "Tablets plotted as Interactive SmartApp tablets must not be repurposed as anything else (WA Business, attendance or sales-presentation tablets).",
      },
      {
        q: "Which statement about EAC tablets in class is correct?",
        options: [
          "Tablets are only for students during the SmartApp activity, and no other apps may be installed",
          "Students may keep the tablet at their desk between activities",
          "Staff may install helpful apps on the tablets",
          "Parental Controls must always be switched on",
        ],
        answer: 0,
        explain: "Tablets are used by students only during SmartApp activities, students must not hold them otherwise, and nobody may install other apps. Parental Controls do not need to be enabled on EAC tablets.",
      },
      {
        q: "What must the teacher do at the end of every interactive class session?",
        options: ["Click “Disconnect from TV”", "Restart the TV by unplugging it", "Uninstall the TV app", "Reset CodePush"],
        answer: 0,
        explain: "Teachers must click Disconnect from TV at the end of each interactive session.",
      },
      {
        q: "A student's name doesn't show up even though you took attendance. What is the correct way to record attendance?",
        options: [
          "Use Mark Attendance in SmartApp, set Attend / Absent, then click “Save and Back to Remote”",
          "Fill in the Attendance tab in SCMS Teacher",
          "Ask the student to mark themselves present",
          "Write it on the whiteboard and tell the admin later",
        ],
        answer: 0,
        explain: "Attendance goes through Mark Attendance and must be saved with “Save and Back to Remote” — not through the Attendance tab in SCMS.",
      },
      {
        q: "A device keeps showing that answers were already submitted. What is the usual cause and fix?",
        options: [
          "The device's time was set manually — set it to automatic (by timezone) and scan the QR code on the TV again",
          "The TV app is out of date — reinstall it",
          "The student's password is wrong — reset it",
          "The tablet has no battery — charge it",
        ],
        answer: 0,
        explain: "A manually or custom-set time on the phone/tablet causes this. Set the time automatically by timezone and rescan the QR code on the TV.",
      },
      {
        q: "A session won't connect to the TV. Which step helps?",
        options: [
          "Refresh the TV (unplug and plug it back in) and, when you click “Connect to TV”, select the TV app version that matches the APK installed on the TV",
          "Ask the students to log in again with their own accounts",
          "Delete the session card and wait for the next class",
          "Turn off the classroom Wi-Fi",
        ],
        answer: 0,
        explain: "Refresh the TV, make sure the installed TV APK is the current version (3.0.3), pick the matching TV app version in SCMS when connecting, then log in again with the session code.",
      },
    ],
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
