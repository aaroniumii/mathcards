export const SUPPORTED_LANGUAGES = ["es", "en", "ja"];
export const DEFAULT_LANGUAGE = "es";

export const translations = {
  es: {
    common: {
      formatDuration: (seconds) => {
        if (typeof seconds !== "number" || seconds < 0) return "-";
        const totalSeconds = Math.round(seconds);
        const minutes = Math.floor(totalSeconds / 60);
        const remainingSeconds = totalSeconds % 60;
        if (minutes <= 0) {
          return `${remainingSeconds} s`;
        }
        return `${minutes} min ${remainingSeconds.toString().padStart(2, "0")} s`;
      },
    },
    languageName: "Español",
    languageLabel: "Idioma",
    languageNames: {
      es: "Español",
      en: "Inglés",
      ja: "Japonés",
    },
    errors: {
      startSession: "Ups, no pudimos iniciar la sesión. Inténtalo de nuevo.",
      nextOperation: "No pudimos cargar la siguiente operación.",
      submitAnswer: "No pudimos guardar tu respuesta. Intenta otra vez.",
      statsUpload: "No se pudo cargar el archivo de estadísticas. Asegúrate de seleccionar un JSON válido.",
    },
    app: {
      helperEarly: "Respira profundo y piensa paso a paso.",
      helperLate: "¡Ya casi terminas!",
      helperDefault: "Suma o resta con calma, ¡tú puedes!",
      headerBadge: "¡Aprendamos jugando!",
      headerTitle: "Práctica de Sumas y Restas",
      headerDescription:
        "Resuelve cada reto escribiendo la respuesta correcta y gana estrellas mientras avanzas.",
    },
    settingsModal: {
      welcomeBadge: "¡Bienvenido a MathCards!",
      title: "Configura tu aventura",
      description:
        "Elige qué tipo de operaciones quieres practicar y cuántos retos completarás hoy.",
      modeLabel: "Modo de juego",
      modeOptions: {
        sum: "Solo sumas",
        sub: "Solo restas",
        mix: "Mixto",
      },
      difficultyLabel: "Dificultad",
      difficultyOptions: [
        "1 cifra",
        "2 cifras (1 + 2)",
        "2 cifras (2 + 2)",
        "3 y 2 cifras",
        "3 cifras",
        "4 y 3 cifras",
      ],
      countLabel: "Número de retos",
      countOptionLabel: (option) => `${option} retos`,
      startButton: "¡Empezar ahora!",
      loadingButton: "Preparando retos...",
      languageHelper: "Puedes cambiar el idioma en cualquier momento.",
      statsPreviewTitle: "Tus estadísticas",
      statsPreviewEmpty:
        "Aquí verás tus resultados una vez que completes tu primera sesión.",
      statsPreviewSessions: (count) => `${count} sesiones guardadas`,
      statsPreviewAverageScore: (score) => `Promedio de puntaje: ${score}%`,
      statsPreviewBestScore: (score) => `Mejor puntaje: ${score}%`,
      statsPreviewAverageDuration: (value) =>
        value ? `Tiempo promedio: ${value}` : "",
      statsPreviewLastScore: (score) => `Último puntaje: ${score}%`,
      statsPreviewLastDuration: (value) =>
        value ? `Último tiempo: ${value}` : "",
      statsPreviewLastUpdated: (value) =>
        value ? `Última sesión: ${value}` : "",
    },
    operationCard: {
      challengeLabel: (index, total) => `Reto ${index} de ${total}`,
      starsEarned: (count) => `${count} estrellas`,
      question: "¿Cuál es el resultado?",
      progressLabel: (progress) => `Progreso: ${progress}%`,
      answerLabel: "Tu respuesta",
      answerPlaceholder: "Escribe el resultado",
      submitButton: "Comprobar respuesta",
      errors: {
        required: "Escribe tu respuesta antes de continuar.",
        invalid: "Introduce solo números enteros.",
      },
      feedback: {
        correct: "¡Excelente! Sigue así.",
        incorrect: (expected) => `Casi. La respuesta correcta es ${expected}.`,
      },
    },
    sessionSummary: {
      title: "¡Sesión completada! 🎉",
      modeMessages: {
        mix: "Hoy domaste sumas y restas como un verdadero explorador.",
        sum: "Las sumas ya no tienen secretos para ti.",
        sub: "¡Las restas se rinden ante tus habilidades!",
      },
      cards: {
        correct: "Correctas",
        wrong: "Por mejorar",
        score: "Tu puntaje",
        duration: "Tiempo empleado",
      },
      encouragement: {
        top: "¡Eres una estrella de las matemáticas!",
        high: "¡Gran trabajo, sigue practicando!",
        mid: "Cada intento te hace más fuerte.",
        low: "¡No te rindas! Mañana será aún mejor.",
      },
      restart: "Jugar otra vez",
      statsTitle: "Estadísticas guardadas",
      totalSessions: (count) => `${count} sesiones`,
      bestScore: (score) => `Mejor puntaje: ${score}%`,
      averageScore: (score) => `Promedio: ${score}%`,
      averageDuration: (value) =>
        value != null ? `Tiempo promedio: ${value}` : "",
      bestDuration: (value) =>
        value != null ? `Mejor tiempo: ${value}` : "",
      lastDuration: (value) =>
        value != null ? `Último tiempo: ${value}` : "",
      lastUpdated: (value) => (value ? `Última sesión: ${value}` : ""),
      download: "Descargar estadísticas",
      upload: "Cargar estadísticas",
      uploadHint: "Selecciona un archivo JSON con tus estadísticas guardadas.",
      statsError: (message) => `Error al cargar: ${message}`,
    },
  },
  en: {
    common: {
      formatDuration: (seconds) => {
        if (typeof seconds !== "number" || seconds < 0) return "-";
        const totalSeconds = Math.round(seconds);
        const minutes = Math.floor(totalSeconds / 60);
        const remainingSeconds = totalSeconds % 60;
        if (minutes <= 0) {
          return `${remainingSeconds} s`;
        }
        return `${minutes} min ${remainingSeconds.toString().padStart(2, "0")} s`;
      },
    },
    languageName: "English",
    languageLabel: "Language",
    languageNames: {
      es: "Spanish",
      en: "English",
      ja: "Japanese",
    },
    errors: {
      startSession: "Oops! We couldn't start the session. Please try again.",
      nextOperation: "We couldn't load the next challenge.",
      submitAnswer: "We couldn't save your answer. Please try once more.",
      statsUpload: "We couldn't load that stats file. Make sure it's a valid JSON.",
    },
    app: {
      helperEarly: "Take a deep breath and think step by step.",
      helperLate: "You're almost done!",
      helperDefault: "Add or subtract calmly — you can do it!",
      headerBadge: "Let's learn by playing!",
      headerTitle: "Addition & Subtraction Practice",
      headerDescription:
        "Solve each challenge by typing the correct answer and earn stars along the way.",
    },
    settingsModal: {
      welcomeBadge: "Welcome to MathCards!",
      title: "Set up your adventure",
      description:
        "Choose the type of operations you want to practice and how many challenges to tackle today.",
      modeLabel: "Game mode",
      modeOptions: {
        sum: "Only addition",
        sub: "Only subtraction",
        mix: "Mixed",
      },
      difficultyLabel: "Difficulty",
      difficultyOptions: [
        "1 digit",
        "2 digits (1 + 2)",
        "2 digits (2 + 2)",
        "3 and 2 digits",
        "3 digits",
        "4 and 3 digits",
      ],
      countLabel: "Number of challenges",
      countOptionLabel: (option) => `${option} challenges`,
      startButton: "Start now!",
      loadingButton: "Preparing challenges...",
      languageHelper: "You can change the language at any time.",
      statsPreviewTitle: "Your statistics",
      statsPreviewEmpty:
        "Your results will appear here after you finish your first session.",
      statsPreviewSessions: (count) => `${count} saved sessions`,
      statsPreviewAverageScore: (score) => `Average score: ${score}%`,
      statsPreviewBestScore: (score) => `Best score: ${score}%`,
      statsPreviewAverageDuration: (value) =>
        value ? `Average time: ${value}` : "",
      statsPreviewLastScore: (score) => `Last score: ${score}%`,
      statsPreviewLastDuration: (value) =>
        value ? `Last time: ${value}` : "",
      statsPreviewLastUpdated: (value) =>
        value ? `Last session: ${value}` : "",
    },
    operationCard: {
      challengeLabel: (index, total) => `Challenge ${index} of ${total}`,
      starsEarned: (count) => `${count} stars`,
      question: "What is the result?",
      progressLabel: (progress) => `Progress: ${progress}%`,
      answerLabel: "Your answer",
      answerPlaceholder: "Type the result",
      submitButton: "Check answer",
      errors: {
        required: "Please enter your answer before continuing.",
        invalid: "Only whole numbers are allowed.",
      },
      feedback: {
        correct: "Great job!",
        incorrect: (expected) => `Almost! The correct answer is ${expected}.`,
      },
    },
    sessionSummary: {
      title: "Session complete! 🎉",
      modeMessages: {
        mix: "Today you mastered addition and subtraction like a true explorer.",
        sum: "Addition problems have no secrets for you now.",
        sub: "Subtraction bows to your skills!",
      },
      cards: {
        correct: "Correct",
        wrong: "Needs work",
        score: "Your score",
        duration: "Time spent",
      },
      encouragement: {
        top: "You're a math superstar!",
        high: "Great job, keep practicing!",
        mid: "Every try makes you stronger.",
        low: "Don't give up! Tomorrow will be even better.",
      },
      restart: "Play again",
      statsTitle: "Saved statistics",
      totalSessions: (count) => `${count} sessions`,
      bestScore: (score) => `Best score: ${score}%`,
      averageScore: (score) => `Average score: ${score}%`,
      averageDuration: (value) =>
        value != null ? `Average time: ${value}` : "",
      bestDuration: (value) =>
        value != null ? `Best time: ${value}` : "",
      lastDuration: (value) =>
        value != null ? `Last time: ${value}` : "",
      lastUpdated: (value) => (value ? `Last session: ${value}` : ""),
      download: "Download stats",
      upload: "Load stats",
      uploadHint: "Choose a JSON file with your saved statistics.",
      statsError: (message) => `Unable to load: ${message}`,
    },
  },
  ja: {
    common: {
      formatDuration: (seconds) => {
        if (typeof seconds !== "number" || seconds < 0) return "-";
        const totalSeconds = Math.round(seconds);
        const minutes = Math.floor(totalSeconds / 60);
        const remainingSeconds = totalSeconds % 60;
        if (minutes <= 0) {
          return `${remainingSeconds} 秒`;
        }
        return `${minutes} 分 ${remainingSeconds.toString().padStart(2, "0")} 秒`;
      },
    },
    languageName: "日本語",
    languageLabel: "言語",
    languageNames: {
      es: "スペイン語",
      en: "英語",
      ja: "日本語",
    },
    errors: {
      startSession: "セッションを開始できませんでした。もう一度お試しください。",
      nextOperation: "次のチャレンジを読み込めませんでした。",
      submitAnswer: "回答を保存できませんでした。もう一度試してください。",
      statsUpload: "統計ファイルを読み込めませんでした。有効なJSONファイルを選択してください。",
    },
    app: {
      helperEarly: "深呼吸して、順番に考えてみよう。",
      helperLate: "あと少しでゴール！",
      helperDefault: "落ち着いて計算しよう。きっとできるよ！",
      headerBadge: "遊びながら学ぼう！",
      headerTitle: "たし算・ひき算の練習",
      headerDescription:
        "チャレンジに答えを書き込んで、正解すると星がもらえるよ。",
    },
    settingsModal: {
      welcomeBadge: "MathCardsへようこそ！",
      title: "冒険の設定",
      description:
        "練習したい計算と今日挑戦するチャレンジの数を選びましょう。",
      modeLabel: "ゲームモード",
      modeOptions: {
        sum: "たし算のみ",
        sub: "ひき算のみ",
        mix: "ミックス",
      },
      difficultyLabel: "レベル",
      difficultyOptions: [
        "1けた",
        "2けた（1 + 2）",
        "2けた（2 + 2）",
        "3けたと2けた",
        "3けた",
        "4けたと3けた",
      ],
      countLabel: "チャレンジ数",
      countOptionLabel: (option) => `${option} 問`,
      startButton: "今すぐスタート",
      loadingButton: "チャレンジを準備中…",
      languageHelper: "言語はいつでも変更できます。",
      statsPreviewTitle: "統計情報",
      statsPreviewEmpty: "最初のセッションを終えると結果がここに表示されます。",
      statsPreviewSessions: (count) => `保存済みセッション: ${count}`,
      statsPreviewAverageScore: (score) => `平均スコア: ${score}%`,
      statsPreviewBestScore: (score) => `最高スコア: ${score}%`,
      statsPreviewAverageDuration: (value) =>
        value ? `平均時間: ${value}` : "",
      statsPreviewLastScore: (score) => `前回のスコア: ${score}%`,
      statsPreviewLastDuration: (value) =>
        value ? `今回の時間: ${value}` : "",
      statsPreviewLastUpdated: (value) =>
        value ? `前回のセッション: ${value}` : "",
    },
    operationCard: {
      challengeLabel: (index, total) => `チャレンジ ${index} / ${total}`,
      starsEarned: (count) => `スター ${count} 個`,
      question: "答えはいくつかな？",
      progressLabel: (progress) => `進行状況: ${progress}%`,
      answerLabel: "答え",
      answerPlaceholder: "結果を入力しよう",
      submitButton: "こたえを送る",
      errors: {
        required: "答えを入力してね。",
        invalid: "数字だけを入力してね。",
      },
      feedback: {
        correct: "よくできました！",
        incorrect: (expected) => `おしい！ 正しい答えは ${expected} だよ。`,
      },
    },
    sessionSummary: {
      title: "セッション完了！🎉",
      modeMessages: {
        mix: "今日は探検家のように たし算とひき算を征服したね。",
        sum: "たし算の問題はもう完璧！",
        sub: "ひき算も君の得意技だね！",
      },
      cards: {
        correct: "正解",
        wrong: "要復習",
        score: "スコア",
        duration: "かかった時間",
      },
      encouragement: {
        top: "君は算数のスターだよ！",
        high: "とてもよくできたね。続けていこう！",
        mid: "挑戦するたびに強くなるよ。",
        low: "あきらめないで！明日はもっと良くなるよ。",
      },
      restart: "もう一度遊ぶ",
      statsTitle: "保存された統計",
      totalSessions: (count) => `セッション数: ${count}`,
      bestScore: (score) => `最高スコア: ${score}%`,
      averageScore: (score) => `平均スコア: ${score}%`,
      averageDuration: (value) =>
        value != null ? `平均時間: ${value}` : "",
      bestDuration: (value) =>
        value != null ? `最短時間: ${value}` : "",
      lastDuration: (value) =>
        value != null ? `今回の時間: ${value}` : "",
      lastUpdated: (value) => (value ? `最新セッション: ${value}` : ""),
      download: "統計をダウンロード",
      upload: "統計を読み込む",
      uploadHint: "保存した統計のJSONファイルを選択してください。",
      statsError: (message) => `読み込みエラー: ${message}`,
    },
  },
};

export const getTranslations = (language) =>
  translations[language] || translations[DEFAULT_LANGUAGE];
