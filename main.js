let timerDecrementTime = 0;
let timer;

window.addEventListener("load", () => {
    const dropdown = document.querySelector("#dropdown");
    dropdown.addEventListener("change",() => {
        const decrementalOptions = document.querySelector("#decrementalOptions");
        if (dropdown.value === "incremental") {
            decrementalOptions.classList.add("hidden");
        } else {
            decrementalOptions.classList.remove("hidden");
        }
    })
})

function setDecrementTime(ms) {
    timerDecrementTime = ms;
}

function startTimer() {
    const startTime = Date.now();

    if (document.querySelector("#dropdown").value === "incremental") {
        timer = setInterval(() => {
            setTimerText(Date.now() - startTime);
        }, 1000/60)

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

        }, 1000 / 60)
    }
}

function stopTimer() {
    clearInterval(timer);
    document.querySelector("#timerText").innerText = "00:00:00.000";
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

    textElement.innerText =
        `${time.get("hours").toString().padStart(2, "0")}:` +
        `${time.get("minutes").toString().padStart(2, "0")}:` +
        `${time.get("seconds").toString().padStart(2, "0")}.` +
        `${time.get("ms").toString().padStart(3, "0")}`;
}