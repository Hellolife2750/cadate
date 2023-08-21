/*// Lire la valeur du cookie "monFichier.txt"
var cookieValue = getCookie("coock1");
console.log(cookieValue);

function getCookie(name) {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        if (cookie.indexOf(name + '=') === 0) {
            return decodeURIComponent(cookie.substring(name.length + 1));
        }
    }
    return null;
}*/

/**Lire coockie des paramètres */
var cookieValue = document.cookie.replace(/(?:(?:^|.*;\s*)gameParameters\s*=\s*([^;]*).*$)|^.*$/, "$1");
var gameParameters = JSON.parse(cookieValue);


/**Générer liste des joueurs */
const playersContainer = document.getElementById("players-container");

function fillPlayersContainer() {
    for (i = 1; i <= gameParameters.nbPlayers; i++) {
        playersContainer.insertAdjacentHTML('beforeend', getPlayerLineCode(i));
    }
} fillPlayersContainer();

function getPlayerLineCode(playerIndex) {
    let code = `
    <div class="player-row">
        <input type="text" class="player-pseudo-input" value="Player${playerIndex}"></input>
        <p class="player-points">0pt</p>
    </div>
    `
    return code;
}

/**Gestion des réponses */
var playerTurnIndex = 0;
var playersPoints = [];
var playersReponses = [];

var questionIndex = 0;
var questionsList = [];
var questions;

const questionsJsonPath = '../res/data/questions.json'

fetch(questionsJsonPath) //récupère fichier JSON
    .then(response => response.json())
    .then(data => {
        questions = data.questions;
        pickQuestions(gameParameters.nbQuestions);
        showNextQuestion();
    })
    .catch(error => console.error(" Unable to load questions JSON", error));

function pickQuestions(nbOfQuestions) {
    if (!questions) {
        console.error("Questions JSON not loaded yet.");
        return;
    }

    if (nbOfQuestions >= questions.length) {
        questionsList = [...questions];
    } else {
        const shuffledQuestions = [...questions];
        for (let i = shuffledQuestions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledQuestions[i], shuffledQuestions[j]] = [shuffledQuestions[j], shuffledQuestions[i]];
        }

        questionsList = shuffledQuestions.slice(0, nbOfQuestions);
    }

    console.log(questionsList);
}

function initializePlayerArrays(nbPlayers) {
    var playersPoints = [];
    var playersReponses = [];

    for (var i = 0; i < nbPlayers; i++) {
        playersPoints.push(0);
        playersReponses.push(2000);
    }

    return { playersPoints, playersReponses };
}

var { playersPoints, playersReponses } = initializePlayerArrays(gameParameters.nbPlayers);


const reponseInput = document.getElementById("reponse-input");
const progressBar = document.getElementById("progress-done");


/*reponseInput.addEventListener("input", function () {
    console.log("la")
    if (reponseInput.value.length === 4 && event.keyCode === 13) {
        validateReponse();
    }
});*/

reponseInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && reponseInput.value.length === 4 && reponseInput === document.activeElement) {
        validateReponse();
    }
});


function validateReponse() {
    playersReponses[playerTurnIndex] = parseInt(reponseInput.value);
    reponseInput.value = "";
    if (playerTurnIndex < gameParameters.nbPlayers - 1) {
        playerTurnIndex++;
    } else {
        playerTurnIndex = 0;
        showAnswer();
    }
}

function limitInputLength(input, maxLength) {
    if (input.value.length > maxLength) {
        input.value = input.value.slice(0, maxLength);
    }
}

const nextQuestionBtn = document.getElementById("next-question-btn");

function showAnswer() {
    updateProgressBar()
    nextQuestionBtn.style.visibility = "visible";
    console.log(playersReponses);
}

function updateProgressBar() {
    let pg = questionIndex * 100 / questionsList.length
    if (questionIndex == 0) { pg = 0; }
    progressBar.style.width = pg + "%";
} updateProgressBar();

const questionLabel = document.getElementById("question-label");

function showNextQuestion() {
    nextQuestionBtn.style.visibility = "hidden";
    if (questionIndex + 1 < questionsList.length) {
        questionIndex++;
        questionLabel.textContent = questionsList[questionIndex].question;
    } else {
        showFinalScreen();
    }
}

function showFinalScreen() {
    //a faire
}
