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

function timer(ms) {
    const textElement = document.querySelector("#timerText");
    const startTime = Date.now();
    const endTime = new Date(startTime + ms).valueOf();

    let timer = setInterval(() => {
        ms = endTime - Date.now();
        const currentHours = Math.floor(ms/(3600000));
        let excessMs = ms % 3600000;
        const currentMinutes = Math.floor(excessMs/60000);
        excessMs %= 60000
        const currentSeconds = Math.floor(excessMs/1000);
        const currentMs = excessMs % 1000;

        if (ms <= 0) {
            clearInterval(timer);
            textElement.innerText = "00:00:00.000";
            return;
        }
        textElement.innerText = `${currentHours.toString().padStart(2, "0")}:${currentMinutes.toString().padStart(2, "0")}:${currentSeconds.toString().padStart(2, "0")}.${currentMs.toString().padStart(3, "0")}`;
    }, 1000/60)
}