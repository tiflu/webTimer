let timerDecrementTime = 0;
let timerIncrementTime = 0;
let timer;
let timerActive = false;
let timerPaused = false;
let displayMs = true;

window.addEventListener("load", () => {
    const dropdown = document.querySelector("#dropdown");
    dropdown.value = "incremental";
    dropdown.addEventListener("change",() => {
        const decrementalOptions = document.querySelector("#decrementalOptions");
        stopTimer();
        if (incrementalTimer()) {
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
});

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
    timerActive = true;
    timerPaused = false;
    const startTime = Date.now() - timerIncrementTime;
    const pauseButton = document.querySelector("#pause");

    if (incrementalTimer()) {
        timer = setInterval(() => {
            setTimerText(Date.now() - startTime);
        }, 1000/60)

        pauseButton.addEventListener("click", () => {
            timerPaused = true;
            timerIncrementTime = Date.now() - startTime;
            clearInterval(timer);
        }, {once: true});

    } else {
        let ms = timerDecrementTime;
        const endTime = new Date(startTime + ms).valueOf();

        timer = setInterval(() => {
            ms = endTime - Date.now();

            if (ms <= 0) {
                stopTimer();
                return;
            }

            setTimerText(ms);

        }, 1000 / 60);

        pauseButton.addEventListener("click", () => {
            timerPaused = true;
            timerDecrementTime = ms;
            clearInterval(timer);
        }, {once: true})
    }
}

function stopTimer() {
    clearInterval(timer);
    setTimerText(0);
    timerActive = false;
    timerPaused = false;
    timerIncrementTime = 0;
    timerDecrementTime = 0;
}

function incrementalTimer() {
    return document.querySelector("#dropdown").value === "incremental";
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