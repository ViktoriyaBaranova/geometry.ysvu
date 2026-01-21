introJs().setOptions({
    steps: [
        {
            title: txtIntro,
            intro: "",

        },
        {
            element: document.querySelector("img.sistem-hint"),
            intro: "Системные подсказки расскажут о принципах выполнения задания"
        },
        {
            element: document.querySelector("img.teory-hint"),
            intro: "Теоретические подсказки помогут вспомнить основные понятия. Появляются при наведении на текст условия"
        },
        {
            element: document.querySelector(".btn-paint"),
            intro: "Откройте графические инструменты для дополнительных построений и заметок. Чтобы продолжить выполнять задание, нажмите на кнопку повторно"
        }
    ]
    }).start();