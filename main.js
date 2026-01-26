let timerDecrementTime = 0;
let timerIncrementTime = 0;
let timer;
let timerActive = false;
let timerPaused = false;
let displayMs = true;
let controller = new AbortController();

window.addEventListener("load", () => {
    const dropdown = document.querySelector("#dropdown");
    dropdown.value = "incremental";
    dropdown.addEventListener("change",() => {
        const decrementalOptions = document.querySelector("#decrementalOptions");
        stopTimer();
        if (isIncrementalTimer()) {
            decrementalOptions.classList.add("hidden");
        } else {
            decrementalOptions.classList.remove("hidden");
        }
    });

    const checkbox = document.querySelector("#msCheckbox");
    checkbox.addEventListener("click", () => {
        displayMs = checkbox.checked;
        if (!timerActive) {
            setTimerText(0);
        }
    });

    const themeDropdown = document.querySelector("#theme");
    themeDropdown.addEventListener("change", setStyle);

    const funCheckbox = document.querySelector("#funCheckbox");
    funCheckbox.addEventListener("change", () => {
        if (funCheckbox.checked) {
            document.body.classList.add('fun');
        } else {
            document.body.classList.remove('fun');
        }
    })
    setStyle();

    addInputListeners();
});

function setStyle() {
    const themeDropdown = document.querySelector("#theme");
    const themeStylesheet = document.querySelector("#themeSheet");

    switch (themeDropdown.value) {
        case "light":
            themeStylesheet.href = "simpleLight.css";
            break;
        case "dark":
            themeStylesheet.href = "simpleDark.css";
            break;
        case "green":
            themeStylesheet.href = "greenscreen.css";
            break;
        case "purple":
            themeStylesheet.href = "purpleGradient.css";
            break;
    }
}

function addInputListeners() {
    const hourInput = document.querySelector("#hourInput");
    hourInput.addEventListener("change", () => highlightRedIfBad(hourInput));
    const minuteInput = document.querySelector("#minuteInput");
    minuteInput.addEventListener("change", () => highlightRedIfBad(minuteInput));
    const secondInput = document.querySelector("#secondInput");
    secondInput.addEventListener("change", () => highlightRedIfBad(secondInput));
    const msInput = document.querySelector("#msInput");
    msInput.addEventListener("change", () => highlightRedIfBad(msInput));
}

function setDecrementTime(ms) {
    if (timerActive) {
        return;
    }
    timerDecrementTime = ms;
    setTimerText(ms);
}

function startTimer() {
    if (timerActive && !timerPaused) {
        return;
    }
    controller = new AbortController();
    timerActive = true;
    timerPaused = false;
    const startTime = Date.now() - timerIncrementTime;
    const pauseButton = document.querySelector("#pause");

    if (isIncrementalTimer()) {
        timer = setInterval(() => {
            setTimerText(Date.now() - startTime);
        }, 1000/60)

        pauseButton.addEventListener("click", () => {
            timerPaused = true;
            timerIncrementTime = Date.now() - startTime;
            clearInterval(timer);
        }, {once: true,
                    signal: controller.signal});

    } else {
        let ms = timerDecrementTime;
        const endTime = new Date(startTime + ms).valueOf();

        timer = setInterval(() => {
            ms = endTime - Date.now();

            if (ms <= 0) {
                stopTimer();
                if (document.querySelector("#audioCheckbox").checked) {
                    new Audio('250629__kwahmah_02__alarm1.mp3').play();
                }
                return;
            }

            setTimerText(ms);

        }, 1000 / 60);

        pauseButton.addEventListener("click", function decrementPauseListener() {
            timerPaused = true;
            timerDecrementTime = ms;
            clearInterval(timer);
        }, {once: true,
                    signal: controller.signal})
    }
}

function stopTimer() {
    clearInterval(timer);
    controller.abort();
    setTimerText(0);
    timerActive = false;
    timerPaused = false;
    timerIncrementTime = 0;
    timerDecrementTime = 0;
}

function manualTimeSubmit() {
    const hours = document.querySelector("#hourInput");
    const minutes = document.querySelector("#minuteInput");
    const seconds = document.querySelector("#secondInput");
    const ms = document.querySelector("#msInput");
    if (inputIsValid(hours) && inputIsValid(minutes) && inputIsValid(seconds) && inputIsValid(ms))
        setDecrementTime(3600000 * parseInt(hours.value) + 60000 * parseInt(minutes.value) + 1000 * parseInt(seconds.value) + parseInt(ms.value));
    else
        alert("Invalid value(s)!");
}

function isIncrementalTimer() {
    return document.querySelector("#dropdown").value === "incremental";
}

function highlightRedIfBad(element) {
    if (element.value === "")
        element.value = 0;

    if (inputIsValid(element)) {
        element.classList.remove("redBorder");
    } else {
        element.classList.add("redBorder");
    }
}

function inputIsValid(inputElement) {
    const elementValue = parseInt(inputElement.value);
    const elementMax = parseInt(inputElement.max);
    const elementMin = parseInt(inputElement.min);
    return !(isNaN(inputElement.value) || elementValue > elementMax || elementValue < elementMin)
}

function getTime(ms) {
    const map = new Map();

    map.set("hours", Math.floor(ms / 3600000));
    let excessMs = ms % 3600000;
    map.set("minutes", Math.floor(excessMs / 60000));
    excessMs %= 60000
    map.set("seconds", Math.floor(excessMs / 1000));
    map.set("ms", excessMs % 1000);
    return map;
}

function setTimerText(ms) {
    const textElement = document.querySelector("#timerText");
    const time = getTime(ms);

    if (displayMs) {
        textElement.innerText =
            `${time.get("hours").toString().padStart(2, "0")}:` +
            `${time.get("minutes").toString().padStart(2, "0")}:` +
            `${time.get("seconds").toString().padStart(2, "0")}.` +
            `${time.get("ms").toString().padStart(3, "0")}`;
    } else {
        textElement.innerText =
            `${time.get("hours").toString().padStart(2, "0")}:` +
            `${time.get("minutes").toString().padStart(2, "0")}:` +
            `${time.get("seconds").toString().padStart(2, "0")}`;
    }
}