const jokeDisplay = document.getElementById("joke-display");
const button = document.getElementById("get-joke-btn");
const errorBox = document.getElementById("error-message");

function zeigeLadezustand() {
    jokeDisplay.innerHTML = "<p>Lade einen Witz...</p>";
    errorBox.textContent = "";
    errorBox.style.display = "none";
}

function warte(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function ladeWitz() {
    zeigeLadezustand();

    try {
        await warte(800);

        const response = await fetch("https://v2.jokeapi.dev/joke/Any?lang=de");

        if (!response.ok) {
            throw new Error("Fehler beim Laden des Witzes.");
        }

        const data = await response.json();

        if (data.error) {
            throw new Error("Die Witz-API hat einen Fehler zurückgegeben.");
        }

        let jokeText = "";

        if (data.type === "single") {
            jokeText = data.joke;
        } else if (data.type === "twopart") {
            jokeText = `${data.setup}<br><br>${data.delivery}`;
        } else {
            throw new Error("Unbekanntes Witzformat.");
        }

        jokeDisplay.innerHTML = `<p>${jokeText}</p>`;
    } catch (error) {
        errorBox.textContent = "Fehler: Der Witz konnte nicht geladen werden.";
        errorBox.style.display = "block";
        console.error(error);
    }
}

window.addEventListener("load", () => {
    zeigeLadezustand();
    setTimeout(() => {
        ladeWitz();
    }, 500);
});

button.addEventListener("click", () => {
    ladeWitz();
});