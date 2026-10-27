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
     draft      true = shown with a "Draft" tag (written from a deck, not yet reviewed)
     questions  [] = shown as "Coming soon". Each question:
                  { q: "Question text",
                    options: ["A", "B", "C", "D"],
                    answer: 1,                 // index of the correct option (0 = first)
                    explain: "Why this is right (shown after answering)" }
   ========================================================================= */

/* Quizzes marked draft: true were written from the training decks and should be reviewed before the scores are relied on.
   Questions are shuffled when taken, so the position of the right answer here does not matter. */
const QUIZZES = [
  {
    "id": "onboarding-mtc-quiz",
    "title": "MT Coach Onboarding",
    "material": "onboarding-mtc",
    "category": "academic",
    "audience": [
      "mtc"
    ],
    "passScore": 80,
    "draft": true,
    "desc": "Checks a Master Teacher Coach's understanding of their role, OKRs, session types, class levels, and administration duties at English Academy.",
    "questions": [
      {
        "q": "What is the weekly teaching hours target for a Master Teacher Coach (MTC)?",
        "options": [
          "25 hours (minimum 20)",
          "40 hours (minimum 30)",
          "20 hours (minimum 15)",
          "17 hours (minimum 6 classes)"
        ],
        "answer": 0,
        "explain": "The deck states the MTC must fulfill 25 teaching hours each week, with a minimum of 20. The 40/30 figure is weekly working hours, not teaching hours."
      },
      {
        "q": "According to the OKR, what is the minimum acceptable tablet/SmartApp usage rate?",
        "options": [
          "50%",
          "75%",
          "90%",
          "100%"
        ],
        "answer": 1,
        "explain": "The deck lists SmartApp usage as minimum 75%, with 100% as the ideal."
      },
      {
        "q": "A student missed a class. When is a Catch Up class appropriate?",
        "options": [
          "For any student who misses any class",
          "Only when a teacher recommends extra help for struggling students",
          "Only for late-joiner students on full payment and students who didn't pass the unit quiz",
          "Whenever at least 3 students request it"
        ],
        "answer": 2,
        "explain": "The deck says Catch Up is not a general replacement for any missed class; it is only for late-joiner students on full payment and students who didn't pass the unit quiz."
      },
      {
        "q": "A student asks the coach directly to run a Clinic session for them. What is correct?",
        "options": [
          "Run it immediately since the student requested it",
          "Convert it into a Catch Up class instead",
          "Require at least 6 students before running it",
          "Decline because Clinic sessions are recommended by the teacher, not requested by students"
        ],
        "answer": 3,
        "explain": "The deck states Clinic sessions are recommended by the teacher and students cannot request one directly; the minimum is 3 students."
      },
      {
        "q": "How soon after a class must the Learning Report be sent out?",
        "options": [
          "The next day (D+1)",
          "Same day (D+0)",
          "Within one week",
          "Every Monday at 12.00 WITA"
        ],
        "answer": 0,
        "explain": "The deck specifies the Learning Report is sent out D+1 after the class."
      },
      {
        "q": "Who does the MTC act as a representative of at each center?",
        "options": [
          "The Branch Manager (BM)",
          "The Field Education Consultant (FEC)",
          "Academic Operations (Acops)",
          "Headquarters (HQ)"
        ],
        "answer": 2,
        "explain": "The deck says the MTC represents Acops and is the person BM, SA, and MT Mitra come to with academic questions."
      },
      {
        "q": "What is the duration of a Non-Dasher Main Class?",
        "options": [
          "60 minutes",
          "90 minutes",
          "45 minutes",
          "20 minutes"
        ],
        "answer": 1,
        "explain": "The deck lists Main Class as 60 min for Dasher and 90 min for Non-Dasher."
      },
      {
        "q": "When should an MTC train an MT Mitra based on observation?",
        "options": [
          "Only if the MT Mitra requests training",
          "When the observation score is above 4.1",
          "When the observation score is below 4.1",
          "Only after a quarterly calibration"
        ],
        "answer": 2,
        "explain": "The deck's OKR says to train any MT whose observation score is below 4.1."
      },
      {
        "q": "During an OPT (Oral Placement Test), how should the result be communicated?",
        "options": [
          "The teacher tells the parents the exact level directly",
          "Give parents only general feedback and report the level to the FEC, who informs parents",
          "Post the exact level in the Learning Report",
          "Give the student their level at the end of the test"
        ],
        "answer": 1,
        "explain": "The deck says to give parents general feedback only (not the exact level) and report the result to the FEC, who informs parents."
      },
      {
        "q": "Only 5 of 6 enrolled students attended a session. How should the MTC fill in SCMS attendance?",
        "options": [
          "Still fill in attendance for all 6 students",
          "Record attendance for only the 5 who attended",
          "Skip attendance since not everyone came",
          "Use the Manual Attendance Record instead"
        ],
        "answer": 0,
        "explain": "The deck states that if only 5 of 6 students attended, you still fill in all 6."
      }
    ]
  },
  {
    "id": "smartapp-teachers-quiz",
    "title": "SmartApp for Teachers",
    "material": "smartapp-teachers",
    "category": "academic",
    "audience": [
      "teacher"
    ],
    "passScore": 80,
    "draft": true,
    "desc": "Check the key rules and fixes from the EA SmartApp manual and the troubleshooting deck.",
    "questions": [
      {
        "q": "How early should the teacher check the interactive session in SCMS before class starts?",
        "options": [
          "At least 2 hours before class",
          "10 minutes before class",
          "Right when the class starts",
          "The evening before, only if there were problems"
        ],
        "answer": 0,
        "explain": "The manual asks MTs to check the interactive session in SCMS at least 2 hours before class (H-2)."
      },
      {
        "q": "What should you confirm when checking the interactive session in SCMS?",
        "options": [
          "That topic and subtopic can be selected, and that “Open Control Panel” works (Main Navigation and Sharing Options visible)",
          "That the tablets are fully charged and the TV is turned on",
          "That every student has already submitted their answers",
          "That the attendance tab is filled in"
        ],
        "answer": 0,
        "explain": "Check that the topic and subtopic options appear and can be chosen, and that the Open Control Panel button works."
      },
      {
        "q": "You find a problem with the topic or the control panel. What is the right move?",
        "options": [
          "Tell the Admin straight away so a new session card can be created, and don't wait until just before class",
          "Wait to see whether it fixes itself when class starts",
          "Ask a student to fix it in class",
          "Skip SmartApp for that class without telling anyone"
        ],
        "answer": 0,
        "explain": "Report it to Admin right away. Reporting errors suddenly, close to class time, leaves Admin too little time to make a new session card."
      },
      {
        "q": "A tablet has been assigned as an Interactive SmartApp tablet for students. Which use is NOT allowed?",
        "options": [
          "Using it as the WA Business, attendance or sales-presentation tablet",
          "Letting students use it during the SmartApp activity",
          "Charging it before class",
          "Keeping it in the class set for SmartApp sessions"
        ],
        "answer": 0,
        "explain": "Tablets plotted as Interactive SmartApp tablets must not be repurposed as anything else (WA Business, attendance or sales-presentation tablets)."
      },
      {
        "q": "Which statement about EAC tablets in class is correct?",
        "options": [
          "Tablets are only for students during the SmartApp activity, and no other apps may be installed",
          "Students may keep the tablet at their desk between activities",
          "Staff may install helpful apps on the tablets",
          "Parental Controls must always be switched on"
        ],
        "answer": 0,
        "explain": "Tablets are used by students only during SmartApp activities, students must not hold them otherwise, and nobody may install other apps. Parental Controls do not need to be enabled on EAC tablets."
      },
      {
        "q": "What must the teacher do at the end of every interactive class session?",
        "options": [
          "Click “Disconnect from TV”",
          "Restart the TV by unplugging it",
          "Uninstall the TV app",
          "Reset CodePush"
        ],
        "answer": 0,
        "explain": "Teachers must click Disconnect from TV at the end of each interactive session."
      },
      {
        "q": "A student's name doesn't show up even though you took attendance. What is the correct way to record attendance?",
        "options": [
          "Use Mark Attendance in SmartApp, set Attend / Absent, then click “Save and Back to Remote”",
          "Fill in the Attendance tab in SCMS Teacher",
          "Ask the student to mark themselves present",
          "Write it on the whiteboard and tell the admin later"
        ],
        "answer": 0,
        "explain": "Attendance goes through Mark Attendance and must be saved with “Save and Back to Remote” — not through the Attendance tab in SCMS."
      },
      {
        "q": "A device keeps showing that answers were already submitted. What is the usual cause and fix?",
        "options": [
          "The device's time was set manually — set it to automatic (by timezone) and scan the QR code on the TV again",
          "The TV app is out of date — reinstall it",
          "The student's password is wrong — reset it",
          "The tablet has no battery — charge it"
        ],
        "answer": 0,
        "explain": "A manually or custom-set time on the phone/tablet causes this. Set the time automatically by timezone and rescan the QR code on the TV."
      },
      {
        "q": "A session won't connect to the TV. Which step helps?",
        "options": [
          "Refresh the TV (unplug and plug it back in) and, when you click “Connect to TV”, select the TV app version that matches the APK installed on the TV",
          "Ask the students to log in again with their own accounts",
          "Delete the session card and wait for the next class",
          "Turn off the classroom Wi-Fi"
        ],
        "answer": 0,
        "explain": "Refresh the TV, make sure the installed TV APK is the current version (3.0.3), pick the matching TV app version in SCMS when connecting, then log in again with the session code."
      }
    ]
  },
  {
    "id": "smartapp-troubleshooting-quiz",
    "title": "SmartApp Troubleshooting",
    "material": "smartapp-troubleshooting",
    "category": "academic",
    "audience": [
      "teacher"
    ],
    "passScore": 80,
    "draft": true,
    "desc": "Checks whether teachers can match common EA SmartApp classroom problems to the correct fix from the troubleshooting deck.",
    "questions": [
      {
        "q": "In class, a student scans the QR code but their account shows 'No Access'. What is the likely cause?",
        "options": [
          "The device time was set manually instead of automatically",
          "The email used is not registered in the student list for that class session, or the EAC tablet is not logged in with the account email",
          "Too many apps are installed on the TV",
          "The student forgot their EA account password"
        ],
        "answer": 1,
        "explain": "The deck says 'No Access' is caused by using an email that does not match or is not registered in the session's student list, or the EAC tablet not being logged in with the account email."
      },
      {
        "q": "A student scanned the QR code and got 'No Access'. After confirming the email is wrong, what should you do?",
        "options": [
          "Click 'Disconnect from TV' then 'Disconnect & Close Session'",
          "Delete unneeded apps from the TV and reinstall the APK",
          "Change it to the correct email, then rescan the QR code on the TV",
          "Unplug the TV power cable and plug it back in"
        ],
        "answer": 2,
        "explain": "The deck instructs to make sure the correct email is used, change it to the correct one if needed, then rescan the QR code on the TV."
      },
      {
        "q": "In class, a student cannot log in because they forgot their EA account password. What should you do?",
        "options": [
          "Have the student click 'Forgot password?' to reset the password and follow the reset instructions",
          "Rescan the QR code on the TV",
          "Reset CodePush from the TV settings",
          "Reinstall the latest TV APK"
        ],
        "answer": 0,
        "explain": "The deck says the student can click 'Forgot password?' to reset the password and follow the instructions to reset it."
      },
      {
        "q": "A student on their personal device cannot click to record audio. What should you check?",
        "options": [
          "Whether the device time is set automatically",
          "The device permissions in settings and whether Parental Controls are active on the student's personal device",
          "Whether the TV app version matches the installed APK",
          "Whether all devices are on the same Wi-Fi network"
        ],
        "answer": 1,
        "explain": "The deck says to check the permission in settings and check whether Parental Controls are active on the student's personal device."
      },
      {
        "q": "The TV APK fails to install. According to the deck, what is the likely cause?",
        "options": [
          "An error on the TV",
          "Too many apps are installed on the TV",
          "The session code was entered incorrectly",
          "The email used is not registered"
        ],
        "answer": 1,
        "explain": "The deck states the cause of the APK failing to install is that too many apps are installed on the TV."
      },
      {
        "q": "The TV APK failed to install because of too many apps. What should you do?",
        "options": [
          "Click 'Reset CodePush' in the TV settings",
          "Click 'Forgot password?' and reset the account",
          "Delete unneeded apps on the TV (e.g. iQiyi, Netflix), then reinstall the latest TV APK",
          "Set the device time to automatic and rescan the QR code"
        ],
        "answer": 2,
        "explain": "The deck instructs to delete apps that are not needed on the TV, such as iQiyi and Netflix, then reinstall the latest TV APK."
      },
      {
        "q": "You cannot install the TV APK at all. Besides removing extra apps, what step does the deck recommend?",
        "options": [
          "Turn off the TV, unplug the power cable and plug it back in, then try installing again via flashdisk or the 'Send files to TV' app",
          "Reset the student's password",
          "Rescan the QR code using the English Academy app",
          "Click 'Disconnect & Close Session' in SCMS Teacher"
        ],
        "answer": 0,
        "explain": "The deck says to turn off the TV, unplug and replug the power cable, then try installing again using a flashdisk or the 'Send files to TV' app."
      },
      {
        "q": "In class you see a 'Remote error / Permission Denied' message in SCMS Teacher. What should you do first?",
        "options": [
          "Uninstall the TV APK and install version 3.0.3",
          "Refresh the SCMS Teacher page",
          "Have the student click 'Forgot password?'",
          "Delete Netflix and iQiyi from the TV"
        ],
        "answer": 1,
        "explain": "The deck's first step for 'Remote error / Permission Denied' is to refresh the SCMS Teacher page (and refresh again if it still errors)."
      },
      {
        "q": "You get 'Failed connect to session'. After clicking 'Disconnect from TV' then 'Disconnect & Close Session', what does the deck say to do on the TV?",
        "options": [
          "Rescan the QR code with the English Academy app",
          "Check the device permission settings",
          "Click the gear (⚙) icon at the top right of the TV screen and click 'Reset CodePush', then reconnect SCMS to the TV",
          "Unplug the TV and plug it back in"
        ],
        "answer": 2,
        "explain": "The deck says to click the gear icon at the top right of the TV screen, click 'Reset CodePush', then repeat the steps to connect SCMS to the TV."
      },
      {
        "q": "SmartApp Multiplayer will not launch during class. What should you ensure?",
        "options": [
          "That the tablet, TV, and laptop are connected to the same Wi-Fi network, then scan the QR code using the English Academy app",
          "That the device time is set manually",
          "That the TV APK is uninstalled and reinstalled as RG",
          "That the correct email is registered in the student list"
        ],
        "answer": 0,
        "explain": "The deck says to make sure the tablet, TV, and laptop are on the same Wi-Fi network, then scan the QR code using the English Academy app."
      }
    ]
  },
  {
    "id": "teaching-flow-quiz",
    "title": "Teaching Flow",
    "material": "teaching-flow",
    "category": "academic",
    "audience": [
      "teacher"
    ],
    "passScore": 80,
    "draft": true,
    "desc": "Checks understanding of EA's lesson goals and the seven-stage standard EA lesson flow.",
    "questions": [
      {
        "q": "According to the deck, what is the correct order of the standard EA lesson flow?",
        "options": [
          "Greeting, Rules, Warmer, Presentation, Practice, Production, Consolidation",
          "Rules, Greeting, Warmer, Presentation, Production, Practice, Consolidation",
          "Greeting, Warmer, Rules, Presentation, Practice, Consolidation, Production",
          "Warmer, Greeting, Rules, Presentation, Practice, Production, Consolidation"
        ],
        "answer": 0,
        "explain": "The deck lists the Standard EA Lesson Flow as Greeting, Rules, Warmer, Presentation, Practice, Production, Consolidation."
      },
      {
        "q": "What is the stated goal of the Production stage?",
        "options": [
          "Controlled practice for accuracy",
          "Free output for fluency",
          "Introducing new topic or language",
          "Reviewing and summarizing the lesson"
        ],
        "answer": 1,
        "explain": "The deck states Production's goal is 'Free output → fluency,' with examples like role-play and storytelling."
      },
      {
        "q": "Which of the following is listed as an EA lesson goal?",
        "options": [
          "Teacher speaks more than students",
          "Maximize student interaction (students speak more than teacher)",
          "Minimize use of the Workbook",
          "Keep every lesson under 30 minutes"
        ],
        "answer": 1,
        "explain": "The deck lists 'Maximize student interaction (students speak more than teacher)' as an EA lesson goal."
      },
      {
        "q": "A teacher is introducing a new topic, using the whiteboard to draw diagrams, having students repeat and give examples, and asking CCQs. Which stage is this?",
        "options": [
          "Warmer",
          "Practice",
          "Presentation",
          "Consolidation"
        ],
        "answer": 2,
        "explain": "The deck describes Presentation as introducing new topic/language using the whiteboard, 2-way repetition/examples, and CCQ."
      },
      {
        "q": "What does the deck say a teacher should NOT do during the Greeting stage?",
        "options": [
          "Ask students how their day was",
          "Give a warm welcome and icebreaker",
          "Ask students to open their books",
          "Keep it under 5 minutes"
        ],
        "answer": 2,
        "explain": "The deck's Greeting notes say 'Do not ask Ss to open their books (do it in Presentation-Practice).'"
      },
      {
        "q": "Students are doing fill-in-the-blank exercises in the Workbook and pair work, then coming to the board while the teacher guides. Which stage is this?",
        "options": [
          "Production",
          "Presentation",
          "Warmer",
          "Practice"
        ],
        "answer": 3,
        "explain": "The deck lists these as Practice examples, whose goal is 'Controlled practice → accuracy' using the Workbook and pair work."
      },
      {
        "q": "What does the deck list as the goal or activities of the Consolidation/feedback stage?",
        "options": [
          "Talk about what students learned that day, make sentences, error correction, and give feedback",
          "Introduce new language with visuals and CCQs",
          "Play a quick quiz or mini-game to warm up",
          "Have students do free role-play and storytelling"
        ],
        "answer": 0,
        "explain": "The deck describes Consolidation/feedback as talking about what students learned that day, students making sentences, error correction, and giving feedback."
      }
    ]
  },
  {
    "id": "classroom-standard-quiz",
    "title": "Classroom Standard",
    "material": "classroom-standard",
    "category": "academic",
    "audience": [
      "teacher"
    ],
    "passScore": 80,
    "draft": true,
    "desc": "Checks teacher knowledge of English Academy classroom standards: language policy, talking time, seating, whiteboard, tablet use and physical activities.",
    "questions": [
      {
        "q": "What does Student Talking Time (STT) refer to?",
        "options": [
          "The amount of time students actively speak during class",
          "The amount of time the teacher spends explaining grammar",
          "The total length of the lesson",
          "The time students spend listening passively"
        ],
        "answer": 0,
        "explain": "The deck defines STT as the amount of time students actively speak during class, and states it is the opposite of Teacher Talking Time (TTT)."
      },
      {
        "q": "According to the language policy, what is the target balance of talking time in class?",
        "options": [
          "50% STT and 50% TTT",
          "30% STT and 70% TTT",
          "70% STT and 30% TTT",
          "100% TTT"
        ],
        "answer": 2,
        "explain": "The deck shows the Language Policy target as 70% STT and 30% TTT, alongside a 100% English rule."
      },
      {
        "q": "Why does the deck recommend U-shape seating?",
        "options": [
          "It lets the teacher sit at the back unseen",
          "It reduces the need for student interaction",
          "It keeps students facing only the whiteboard",
          "It supports student interaction and makes teacher monitoring easier"
        ],
        "answer": 3,
        "explain": "The deck lists U-shape seating benefits: supports student interaction, lets students see each other, makes teacher monitoring easier, and creates a more interactive classroom."
      },
      {
        "q": "A low-level student does not understand the word 'enormous'. Following the deck, what should the teacher do?",
        "options": [
          "Simplify the English, e.g. say 'Very, very big!' with pictures and gestures",
          "Translate it directly into the students' first language",
          "Skip the word and move on",
          "Spell the word out letter by letter"
        ],
        "answer": 0,
        "explain": "The deck says 'Simplify, don't translate directly' and gives the example of replacing a direct translation with 'Very, very big!' supported by pictures, gestures, modelling and simple English."
      },
      {
        "q": "Which three elements does the deck say every class MUST have on the whiteboard?",
        "options": [
          "Homework, Attendance, and Timetable",
          "Lesson Aim, StarChamp, and Word Bank",
          "Hello Song, Alphabet Song, and Goodbye Song",
          "Pictures, Gestures, and Modelling"
        ],
        "answer": 1,
        "explain": "The Whiteboard Standard requires a Lesson Aim, a StarChamp (progress tracking/motivation) and a Word Bank in every class."
      },
      {
        "q": "A teacher lets students use tablets but just watches them play a SmartApp game alone. What is the problem according to the deck?",
        "options": [
          "Tablets should never be used in class",
          "Students should only use tablets individually, never in pairs",
          "The teacher should take the tablets away and lecture instead",
          "The tablet is a tool for interaction, not a replacement for it; the teacher should monitor and support and encourage pair/group interaction"
        ],
        "answer": 3,
        "explain": "The deck's key takeaway is that a tablet is a tool for interaction, not a replacement for interaction, and the teacher should monitor and support while encouraging pair/group interaction."
      },
      {
        "q": "The deck sums up physical activities with two phrases. Which pair is correct?",
        "options": [
          "Juniors: Move to learn. Adults: Move to interact.",
          "Juniors: Move to interact. Adults: Move to learn.",
          "Juniors: Sit to learn. Adults: Sit to interact.",
          "Juniors and Adults: Move to compete."
        ],
        "answer": 0,
        "explain": "The deck closes the Physical Activities section with 'Junior: Move to learn.' and 'Adults: Move to interact.'"
      }
    ]
  },
  {
    "id": "whiteboard-management-quiz",
    "title": "Whiteboard Management",
    "material": "whiteboard-management",
    "category": "academic",
    "audience": [
      "teacher"
    ],
    "passScore": 80,
    "draft": true,
    "desc": "Checks teacher understanding of the Whiteboard Management 2.0 deck: visual processing stats, the 3-colour ESL rule, mandatory board aspects, writing etiquette and TV usage.",
    "questions": [
      {
        "q": "According to the deck, what percentage of the information transmitted to the human brain is entirely visual?",
        "options": [
          "60%",
          "75%",
          "90%",
          "100%"
        ],
        "answer": 2,
        "explain": "The deck states '90% of the information transmitted to the human brain is entirely visual.'"
      },
      {
        "q": "In the 3-Color ESL Rule, which colour is used for the main text such as definitions, full sentences, and core vocabulary words?",
        "options": [
          "Black",
          "Blue",
          "Red",
          "Green"
        ],
        "answer": 0,
        "explain": "The deck assigns Black (Main Text) to definitions, full sentences, and core vocabulary words."
      },
      {
        "q": "You need to highlight a morphological change like the '-ed' ending and a pronunciation stress mark. According to the 3-Color ESL Rule, which colour should you use?",
        "options": [
          "Black",
          "Blue",
          "Red",
          "Underline"
        ],
        "answer": 2,
        "explain": "The deck says Red (Highlight/Emphasis/Most Important) is crucial for key corrections, morphological changes (e.g., -ed, -ing), and pronunciation stress marks."
      },
      {
        "q": "How much faster are visuals processed compared to text, according to the deck?",
        "options": [
          "600x faster",
          "6,000x faster",
          "60,000x faster",
          "600,000x faster"
        ],
        "answer": 2,
        "explain": "The deck states 'Visuals are processed 60,000x faster than text.'"
      },
      {
        "q": "Which three aspects does the deck list as mandatory writing aspects on the whiteboard?",
        "options": [
          "Lesson Aim, Starchamps, and Word Bank",
          "Date, Topic, and Word Bank",
          "Lesson Aim, Date, and Topic",
          "Starchamps, Date, and Topic"
        ],
        "answer": 0,
        "explain": "The deck lists the mandatory writing aspects as Lesson Aim (the learning objective), Starchamps (progress markers), and Word Bank (key vocabulary)."
      },
      {
        "q": "A teacher asks what belongs under the optional aspects of the whiteboard. Based on the deck's board layout, which items are marked optional?",
        "options": [
          "Lesson Aim and Word Bank",
          "Date and Topic",
          "Starchamps and Word Bank",
          "Starchamps and Lesson Aim"
        ],
        "answer": 1,
        "explain": "In the deck's 'Setting the Stage' board layouts, Date and Topic are both labelled '(optional)'."
      },
      {
        "q": "While writing on the whiteboard, what does the deck say about your body position toward the class?",
        "options": [
          "Face the board fully so your writing stays neat",
          "Never turn your back; stand at a 45-degree angle and make eye contact",
          "Sit beside the board to stay out of the students' view",
          "Keep your back to the class but speak loudly"
        ],
        "answer": 1,
        "explain": "The Whiteboard Writing Etiquette section says 'Never Turn Your Back: Stand at a 45-degree angle. Make eye contact.'"
      }
    ]
  },
  {
    "id": "product-knowledge-quiz",
    "title": "Product Knowledge",
    "material": "product-knowledge",
    "category": "academic",
    "audience": [
      "teacher"
    ],
    "passScore": 80,
    "draft": true,
    "desc": "Checks teachers' knowledge of English Academy Center's value propositions, programs, levelling system, and learning structures as stated in the Product Knowledge deck.",
    "questions": [
      {
        "q": "According to the deck, what is English Academy's Teacher's Rating?",
        "options": [
          "4.9 / 5",
          "4.5 / 5",
          "5.0 / 5",
          "4.7 / 5"
        ],
        "answer": 0,
        "explain": "The deck states a Teacher's Rating of 4,9 / 5 under 'Why English Academy?'."
      },
      {
        "q": "The deck describes the 'Tech Integrated Classroom'. Which statement best matches what it says students do?",
        "options": [
          "They only watch the screen passively during lessons",
          "They respond to questions on screen, collaborate in teams, and access recordings and materials automatically in the app",
          "They use paper worksheets that are later scanned into the app",
          "They download materials manually from a shared drive"
        ],
        "answer": 1,
        "explain": "The deck says students do not just watch the screen but respond to questions on screen, collaborate in teams, and access all recordings and class materials automatically in the app."
      },
      {
        "q": "What is the main purpose of the 'Localised Curriculum' feature as described in the deck?",
        "options": [
          "To teach only business English to adults",
          "To follow a rigid global curriculum without changes",
          "To directly target grammar mistakes Indonesians often make due to mother-tongue influence",
          "To replace local teachers with native speakers"
        ],
        "answer": 2,
        "explain": "The deck says the Localised Curriculum directly targets grammar mistakes frequently made by Indonesians due to mother-tongue influence, instead of forcing a rigid global curriculum."
      },
      {
        "q": "A parent asks what information they receive about their child's progress after lessons. Based on 'Daily Progress Reporting', which answer is correct?",
        "options": [
          "Only a final grade at the end of the course",
          "A monthly email summary with no scores",
          "Verbal feedback only, given at parent-teacher meetings",
          "A periodic per-session report with attendance, speaking scores, grammar accuracy, teacher evaluation notes, plus photos or videos of the session"
        ],
        "answer": 3,
        "explain": "The deck states Daily Progress Reporting provides a periodic per-session report containing attendance data, speaking scores, grammar accuracy, teacher evaluation notes, and photos or videos of the learning session."
      },
      {
        "q": "On what framework are English Academy Center's offered levels based?",
        "options": [
          "The Common European Framework of Reference (CEFR)",
          "TOEFL scoring bands",
          "IELTS proficiency levels",
          "A proprietary in-house scale only"
        ],
        "answer": 0,
        "explain": "The deck states that the levels offered are aligned with the Common European Framework of Reference (CEFR)."
      },
      {
        "q": "A student's placement test result is level D. According to the levelling rule in the deck, which classes may the agent recommend?",
        "options": [
          "Only level D",
          "Levels D, C or E (+/- 1 level), or E or F (same CEFR)",
          "Any level from A to L",
          "Only levels above D"
        ],
        "answer": 1,
        "explain": "The deck's example states that for a test result of level D, the agent may recommend level D, C or E (+/- 1 level), or E or F (same CEFR band)."
      },
      {
        "q": "Which CEFR level does the deck label as 'B2'?",
        "options": [
          "Beginner",
          "Pre-intermediate",
          "Intermediate",
          "Upper intermediate"
        ],
        "answer": 3,
        "explain": "In the deck's levelling table, B2 is labelled Upper intermediate (A1 Beginner, A2 Pre-intermediate, B1 Intermediate)."
      },
      {
        "q": "The deck lists a learning structure described as '48 sesi Pembelajaran + 5 parent event'. How many learning sessions and parent events does this structure include?",
        "options": [
          "24 learning sessions and 3 parent events",
          "24 learning sessions and 5 parent events",
          "48 learning sessions and 5 parent events",
          "48 learning sessions and 3 service events"
        ],
        "answer": 2,
        "explain": "The deck's 'Struktur Pembelajaran New' states 48 learning sessions plus 5 parent events."
      }
    ]
  },
  {
    "id": "sop-ptm-stm-quiz",
    "title": "SOP PTM/STM",
    "material": "sop-ptm-stm",
    "category": "academic",
    "audience": [
      "teacher"
    ],
    "passScore": 80,
    "draft": true,
    "desc": "Checks teachers' understanding of how PTM/STM meetings are defined, prepared, run, documented, and reported at English Academy.",
    "questions": [
      {
        "q": "What is a PTM/STM?",
        "options": [
          "A scheduled 1-on-1 meeting between a teacher and parents (PTM) or students (STM)",
          "An unscheduled group lecture for all parents at once",
          "A written exam taken by students at the end of each unit",
          "An internal staff meeting between teachers and the Student Advisor"
        ],
        "answer": 0,
        "explain": "The deck defines PTM/STM as scheduled meetings between the teacher and parents (PTM) or students (STM), conducted 1-on-1."
      },
      {
        "q": "How long is each individual PTM/STM slot per parent/student?",
        "options": [
          "5 minutes",
          "10 minutes",
          "30 minutes",
          "60 minutes"
        ],
        "answer": 1,
        "explain": "The Format section states the duration per parent/student is 10 minutes, within a total daily session block of 60 minutes."
      },
      {
        "q": "According to the deck, what is the total session block for PTM/STM per day?",
        "options": [
          "30 minutes, fixed",
          "45 minutes, non-extendable",
          "60 minutes per day, extendable up to 2 days if needed",
          "120 minutes per day"
        ],
        "answer": 2,
        "explain": "The Format section says the total session block is 60 minutes per day and can be extended up to 2 days if needed."
      },
      {
        "q": "Which example best matches the deck's guidance on giving constructive criticism?",
        "options": [
          "\"The student is bad at English.\"",
          "\"The student is weak in grammar.\"",
          "\"The student needs to try harder overall.\"",
          "\"The student often forgets past tense verbs; practice by writing 3 sentences daily using past tense.\""
        ],
        "answer": 3,
        "explain": "The deck says constructive criticism should focus on the specific skill, be evidence-based, and be actionable with clear next steps, like practicing past tense with 3 sentences daily."
      },
      {
        "q": "In the division of roles, what is the teacher primarily responsible for during PTM/STM?",
        "options": [
          "Preparing physical reports and administrative tasks",
          "Academic discussion, including sharing student progress with supporting evidence",
          "Ensuring parents are seated in the correct slot",
          "Sending schedule reminders to the parent WhatsApp group"
        ],
        "answer": 1,
        "explain": "The deck assigns the teacher to academic discussion: conveying student progress with supporting evidence and answering parents' questions about classroom learning."
      },
      {
        "q": "By when must the PTM/STM report be printed?",
        "options": [
          "At the latest 1 day before PTM/STM",
          "On the day of PTM/STM",
          "At the latest 3 days before PTM/STM",
          "One week before PTM/STM"
        ],
        "answer": 0,
        "explain": "The PTM report rules state the report must be finished at the latest 3 days before and printed at the latest 1 day before PTM/STM."
      },
      {
        "q": "If a parent or student cannot attend the PTM/STM, what does the SOP require?",
        "options": [
          "Reschedule the meeting to the following month",
          "Cancel the report for that family entirely",
          "Send the report via WhatsApp on the day of PTM/STM, with general feedback notes",
          "Mail a printed copy within two weeks"
        ],
        "answer": 2,
        "explain": "The report rules state that if a parent/student cannot attend, the report must be sent via WhatsApp on the day of PTM/STM along with general feedback notes."
      },
      {
        "q": "Who records videos of speaking activities or photos of students' written work for documentation?",
        "options": [
          "The teacher",
          "The parent",
          "The center manager",
          "The Student Advisor"
        ],
        "answer": 3,
        "explain": "The Learning Documentation section states the Student Advisor records speaking-activity videos or takes photos of students' written work, stored in a dedicated EAC Gdrive folder."
      },
      {
        "q": "On the day of PTM/STM (Hari H), what does the Student Advisor do while the teacher holds 1-on-1 sessions?",
        "options": [
          "Fills in the Production Score and Teacher's Comment",
          "Documents (photo/video) each 1-on-1 session",
          "Prints the Mid-Report for the first time",
          "Sends the RSVP invitation to the WhatsApp group"
        ],
        "answer": 1,
        "explain": "In the During/After workflow, on Hari H the SA documents each 1-on-1 session, and the footage is later used for the Graduation montage."
      },
      {
        "q": "At H+1 or H+2 after PTM/STM, what does the Student Advisor send to the WhatsApp group?",
        "options": [
          "The RSVP invitation and 1-on-1 schedule",
          "The printed Mid-Report documents",
          "A thank-you note together with the Course Map and Syllabus",
          "A reminder to fill in Production Scores"
        ],
        "answer": 2,
        "explain": "The workflow states that at H+1/H+2 the SA sends a thank-you message (with any follow-up results) along with the Course Map and Syllabus to the WhatsApp group."
      }
    ]
  },
  {
    "id": "ptm-stm-graduation-quiz",
    "title": "PTM/STM/Graduation Guideline",
    "material": "ptm-stm-graduation-guideline",
    "category": "academic",
    "audience": [
      "teacher"
    ],
    "passScore": 80,
    "draft": true,
    "desc": "Checks a teacher's understanding of the feedback/NPS cycle, the PTM/STM SOP and timeline, the Graduation SOP and flow, and the learning report process at EAC.",
    "questions": [
      {
        "q": "During which weeks of each month is the teacher & class feedback link distributed?",
        "options": [
          "Only the final week",
          "Every week of the month",
          "The 1st and 2nd weeks",
          "The 3rd and 4th weeks"
        ],
        "answer": 3,
        "explain": "The deck states the feedback link is distributed during the 3rd and 4th weeks of each month (e.g., August 12th to 24th)."
      },
      {
        "q": "Where are the Net Promoter Score (NPS) questions located relative to the feedback form?",
        "options": [
          "They are included in the same link as the teacher and class feedback",
          "They are sent in a separate NPS-only link",
          "They are asked verbally during PTM/STM",
          "They are collected at graduation day"
        ],
        "answer": 0,
        "explain": "The deck says the NPS questions are included in the same link as the teacher and class feedback, distributed in the 3rd and 4th weeks of the month."
      },
      {
        "q": "According to the Teachers Timeline, what must a teacher verify with the Student Advisor at D-3 before the PTM/STM?",
        "options": [
          "That parents have confirmed their attendance",
          "That graduation caps and sashes are ready",
          "That all evidence, mid-term reports, and teacher comments are prepared and available",
          "That the feedback link has been distributed"
        ],
        "answer": 2,
        "explain": "On the Teachers Timeline, D-3 requires the teacher to verify with the SA that all evidence, mid-term reports, and teacher comments are prepared and available."
      },
      {
        "q": "On PTM/STM day (D-0), what are teachers responsible for doing?",
        "options": [
          "Printing the mid-term report for every family",
          "Greeting parents and students upon arrival",
          "Confirming parent availability and scheduling WhatsApp calls",
          "Updating parents and students on progress using evidence/data, and providing feedback and action plans"
        ],
        "answer": 3,
        "explain": "The Teachers Timeline lists D-0 duties as updating parents/students on progress (highlighting performance with evidence or mid-term report data) and providing feedback with action plans as needed."
      },
      {
        "q": "When must the mid-term report be completed?",
        "options": [
          "Three days before the PTM/STM",
          "On the PTM/STM day itself",
          "One week after the PTM/STM",
          "At the same time as the final report"
        ],
        "answer": 0,
        "explain": "The Mid Report Rule states the mid-term report should be completed three days before the PTM/STM."
      },
      {
        "q": "A Dasher class needs its PTM sessions scheduled. According to the PTM/STM schedule, which sessions are these?",
        "options": [
          "Sessions 15 and 16 only",
          "PTM 1 at sessions 17 and 18, and PTM 2 at sessions 34 and 35",
          "Sessions 14 and 15",
          "A single session at meeting 47"
        ],
        "answer": 1,
        "explain": "The PTM/STM schedule lists Dasher as PTM 1 at sessions 17 and 18 and PTM 2 at sessions 34 and 35."
      },
      {
        "q": "Who records the learning documentation (videos of speaking activities or images of students' writing) at the end of each unit?",
        "options": [
          "The teacher",
          "The Student Advisor",
          "The parents",
          "The HQ team"
        ],
        "answer": 1,
        "explain": "The deck says the Student Advisor will record videos of speaking activities or capture images of students' writing as learning documentation; teachers ensure this is documented."
      },
      {
        "q": "At which meeting does Graduation take place for Runner, Sprinter, Ranger, and Explorer levels?",
        "options": [
          "Meeting 47",
          "Meeting 44",
          "Meeting 30",
          "Meeting 25"
        ],
        "answer": 2,
        "explain": "The deck lists Graduation at Meeting 30 for Runner, Sprinter, Ranger, and Explorer, while Dasher graduates at Meeting 47."
      },
      {
        "q": "What is the rule for printing the certificate given out on graduation day?",
        "options": [
          "It is optional and can be printed on any paper",
          "It must be printed double-sided on HVS paper",
          "It is only printed if the center requests a cash advance",
          "It must be printed on Blushwhite paper, full colour, with no editing of content or visuals"
        ],
        "answer": 3,
        "explain": "The deck states it is mandatory to print the certificate using Blushwhite paper, full colour printing, with no editing of content or visuals."
      },
      {
        "q": "How is a Superstar student chosen for Graduation?",
        "options": [
          "One Superstar per group, based on the average unit quiz",
          "One Superstar per class, chosen by the parents",
          "Three Superstars per class, based on attendance",
          "The student with the best final report comment"
        ],
        "answer": 0,
        "explain": "Pre-Graduation technical notes say the teacher provides one Superstar student per group, determined from the average unit quiz."
      },
      {
        "q": "In the Dasher Graduation flow, what is the teacher/host expected to do during the 'I can' statements segment?",
        "options": [
          "Perform the student outputs on behalf of the students",
          "Hand out certificates and read final report comments",
          "Read the 'I can' sentences together, ask if students can do it and show an example, then tick the checklists together on screen",
          "Give a 5-minute overview of the next level course"
        ],
        "answer": 2,
        "explain": "The Dasher 'I can' statements note says to read the sentences together one by one (or elicit), ask students if they can do it and show an example, then tick the checklists together on the screen."
      },
      {
        "q": "When outputs are prepared, what limits does the deck set on groups and performance length?",
        "options": [
          "Max 5 groups per class, no time limit",
          "Max 3 groups or 3 performances per class, duration max 4 minutes",
          "Max 2 groups per class, duration max 10 minutes",
          "One group per class, duration max 15 minutes"
        ],
        "answer": 1,
        "explain": "The Output Prep sections instruct teachers to decide on groups with a maximum of 3 groups or 3 performances per class and a duration of max 4 minutes."
      }
    ]
  },
  {
    "id": "code-of-conduct-quiz",
    "title": "Teacher Code of Conduct",
    "material": "code-of-conduct",
    "category": "academic",
    "audience": [
      "teacher",
      "mt",
      "mtc"
    ],
    "passScore": 80,
    "desc": "Check your understanding of the teacher compliance and code of conduct rules.",
    "questions": []
  },
  {
    "id": "consultation-basics",
    "title": "Consultation Flow Basics",
    "material": "sales-guide",
    "category": "marketing",
    "audience": [
      "mt",
      "mtc",
      "staff"
    ],
    "passScore": 70,
    "sample": true,
    "desc": "A sample quiz built from the EAC Sales Digging Guide, so you can try how quizzes work. Real academic quizzes will be written from the training decks.",
    "questions": [
      {
        "q": "Which sequence matches the EAC consultation flow?",
        "options": [
          "RECOMMEND → ASK → CONNECT → LISTEN → UNDERSTAND → DIG DEEPER",
          "ASK → LISTEN → DIG DEEPER → UNDERSTAND → CONNECT → RECOMMEND",
          "LISTEN → RECOMMEND → ASK → DIG DEEPER → CONNECT → UNDERSTAND",
          "ASK → RECOMMEND → LISTEN → CONNECT → UNDERSTAND → DIG DEEPER"
        ],
        "answer": 1,
        "explain": "The guide's flow is ASK → LISTEN → DIG DEEPER → UNDERSTAND → CONNECT → RECOMMEND. You recommend only after you understand."
      },
      {
        "q": "The guide's principle says: \"Don't chase every question. Chase ...\"",
        "options": [
          "the fastest sale",
          "the longest conversation",
          "an understanding of the customer",
          "the most detailed notes"
        ],
        "answer": 2,
        "explain": "The principle is ASK → LISTEN → DIG DEEPER: don't chase every question, chase an understanding of the customer."
      },
      {
        "q": "A parent says English matters \"so they'll be more confident.\" What should you do next?",
        "options": [
          "Move on to the next question, since the reason is clear",
          "Start explaining the program straight away",
          "Ask for the context: school, presentations, friends or another situation",
          "Offer three program options to choose from"
        ],
        "answer": 2,
        "explain": "Don't settle for a generic answer. Ask for the context (school, presentations, friends…) so the reason becomes specific."
      },
      {
        "q": "Which of these should you AVOID when asking \"Why do you want to learn English?\"",
        "options": [
          "Jumping straight into explaining the program",
          "Observing the student's expression",
          "Looking for who is pushing the need the most",
          "Asking for the situation behind the answer"
        ],
        "answer": 0,
        "explain": "The guide says: don't settle for a generic answer, don't jump straight into explaining the program, and don't steer the answer with too many options."
      },
      {
        "q": "When asking about the customer's biggest challenge, what should you avoid?",
        "options": [
          "Asking about past learning experiences",
          "Looking for the situation that triggers the problem",
          "Offering a solution before you understand the root cause",
          "Noticing parent concerns"
        ],
        "answer": 2,
        "explain": "Don't immediately argue or \"fix\" the problem, and don't blame the student. Understand the root cause first."
      },
      {
        "q": "What is the recommended approach on an initial phone call?",
        "options": [
          "Ask every prepared question quickly in one go",
          "Keep it light, one question at a time, and notice tone and hesitation",
          "Read the full program details first",
          "Skip rapport and go straight to the schedule"
        ],
        "answer": 1,
        "explain": "On the phone: keep the conversation light, one question at a time, and pick up on tone, hesitation and the main concern."
      },
      {
        "q": "What is the recommended approach in an initial chat?",
        "options": [
          "Send long messages with many questions",
          "Send short messages, 1–2 questions at a time, and use the customer's own words",
          "Wait for the customer to ask everything first",
          "Paste the full price list immediately"
        ],
        "answer": 1,
        "explain": "In chat: send short messages, ask 1–2 questions at a time and use the customer's own words to shape your follow-up."
      },
      {
        "q": "What are Consultation Notes (Point 08) for?",
        "options": [
          "Repeating the answers already given in points 01–07",
          "Recording important information that isn't covered in points 01–07",
          "Filling every field so the form looks complete",
          "Writing your guesses about the customer"
        ],
        "answer": 1,
        "explain": "Notes capture useful context not covered earlier: buying signals, objections, decision maker, urgency and more. Never make up information or fill a field just to complete it."
      }
    ]
  }
];
