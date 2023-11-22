const addVerbForm = document.getElementById("addVerb");
const verbAdd = document.getElementById("verb");
const translationAdd = document.getElementById("translation");
const stateAdd = document.getElementById("state");
const saveVerb = document.getElementById("saveVerb");
const saveFeedback = document.getElementById("saveFeedback");

const checkInputs = () => {
    const anyInputEmpty = !verbAdd.value || !translationAdd.value;
    saveVerb.disabled = anyInputEmpty;
};

verbAdd.addEventListener("input", checkInputs);
translationAdd.addEventListener("input", checkInputs);

addVerbForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const verb = verbAdd.value;
    const translation = translationAdd.value;
    const state = stateAdd.value;
    let json = { verb, translation, state };
    try {
        const response = await fetch("/verb", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(json),
        });

        if (response.status === 201) {
            saveFeedback.innerHTML = "<p>The verb is saved successfully!</p>";
        } else if (response.status === 400) {
            saveFeedback.innerHTML = "<p>This verb already exists!</p>";
        } else {
            saveFeedback.innerHTML = "<p>The verb is not saved. Please try again.</p>";
        }
    } catch (error) {
        console.error("Error during saving:", error.message);
        saveFeedback.innerHTML = "<p>The verb is not saved. Please try again.</p>";
    }
});

const manageVerbForm = document.getElementById("manageVerb");
const verbMan = document.getElementById("verbM");
const translationMan = document.getElementById("translationM");
const stateMan = document.getElementById("stateM");
const saveVerbM = document.getElementById("saveVerbM");
const getVerb = document.getElementById("getVerb");

getVerb.addEventListener("click", () => {
    fetch("/random-verb")
        .then(response => response.json())
        .then(userData => {

        verbMan.value = userData.verb;
        translationMan.value = userData.translation;
        stateMan.value = userData.state;
        })
        .catch (error => console.error('Error fetching data:', error));
});

manageVerbForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const verb = verbMan.value;
    const translation = translationMan.value;
    const state = stateMan.value;
    let json = { verb, translation, state };
    try {
        const response = await fetch("/verb", {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(json),
        });

        if (response.status === 201) {
            saveFeedback.innerHTML = "<p>The verb is saved successfully!</p>";
        } else {
            saveFeedback.innerHTML = "<p>The verb is not saved. Please try again.</p>";
        }
    } catch (error) {
        console.error("Error during saving:", error.message);
        saveFeedback.innerHTML = "<p>The verb is not saved. Please try again.</p>";
    }
});

const manageSentencesForm = document.getElementById("manageSentences");
const sentencesText = document.getElementById("sentences");
const saveSentences = document.getElementById("saveSentences");
const getSentences = document.getElementById("getSentences");
const saveFeedbackSent = document.getElementById("saveFeedbackSent");

getSentences.addEventListener("click", () => {
    const verb = verbMan.value;
    const url = `/openai?verb=${verb}`;
    fetch(url)
        .then(response => response.json())
        .then(userData => {

        sentencesText.value = userData.message.content;
        })
        .catch (error => console.error("Error fetching data:", error));
});

manageSentencesForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const verb = verbMan.value;
    const sentences = sentencesText.value;
    let json = { verb, sentences };
    try {
        const response = await fetch("/sentences", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(json),
        });

        if (response.status === 201) {
            saveFeedbackSent.innerHTML = "<p>Sentences are saved successfully!</p>";
        } else {
            saveFeedbackSent.innerHTML = "<p>Sentences are not saved. Please try again.</p>";
        }
    } catch (error) {
        console.error("Error during saving:", error.message);
        saveFeedbackSent.innerHTML = "<p>Sentences are not saved. Please try again.</p>";
    }
});