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
        <p class="proposition">---</p>
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
const answersImgsPath = '../res/img/Responses/'

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

    //console.log(questionsList);
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
        updateCurrentPlayer();
        updateValidatedProposition(true);
    } else {
        playerTurnIndex = 0;
        showAnswer();
    }
} updateCurrentPlayer();

function updateValidatedProposition(arePropositionsHidden) {
    let playerPropositionElement;
    if (arePropositionsHidden) {
        for (i = 0; i < playerTurnIndex; i++) {
            playerPropositionElement = document.querySelector(`#players-container .player-row:nth-child(${i + 1}) .proposition`);
            playerPropositionElement.textContent = `✔️`;
        }
        for (i = playerTurnIndex; i < playersPoints.length; i++) {
            playerPropositionElement = document.querySelector(`#players-container .player-row:nth-child(${i + 1}) .proposition`);
            playerPropositionElement.textContent = `---`;
        }
    } else {
        console.log("là")
        for (i = 0; i < playersPoints.length; i++) {
            playerPropositionElement = document.querySelector(`#players-container .player-row:nth-child(${i + 1}) .proposition`);
            playerPropositionElement.textContent = `${playersReponses[i]}`;
        }
    }
}

function updateCurrentPlayer() {
    let currentPlayerDiv;
    let currentPlayerInput;

    resetPlayersColors();

    currentPlayerDiv = document.querySelector(`#players-container .player-row:nth-child(${playerTurnIndex + 1})`);
    currentPlayerDiv.style.backgroundColor = "#4398ff";
    currentPlayerDiv.style.color = "white";

    currentPlayerInput = document.querySelector(`#players-container .player-row:nth-child(${playerTurnIndex + 1}) .player-pseudo-input`);
    currentPlayerInput.style.color = "white";
}

function resetPlayersColors() {
    let currentPlayerDiv;
    let currentPlayerInput;

    for (i = 0; i < playersPoints.length; i++) {
        currentPlayerDiv = document.querySelector(`#players-container .player-row:nth-child(${i + 1})`);
        currentPlayerDiv.style.backgroundColor = "";
        currentPlayerDiv.style.color = "black";
        currentPlayerInput = document.querySelector(`#players-container .player-row:nth-child(${i + 1}) .player-pseudo-input`);
        currentPlayerInput.style.color = "black";
    }
}

function limitInputLength(input, maxLength) {
    if (input.value.length > maxLength) {
        input.value = input.value.slice(0, maxLength);
    }
}

const nextQuestionBtn = document.getElementById("next-question-btn");
const answerP = document.querySelector("#questions-card .answer-p");
const dateResponseP = document.querySelector("#questions-card .date-response-p");
const answerImg = document.getElementById("answer-img");

function showAnswer() {
    updateProgressBar()
    resetPlayersColors();
    updateAnswerContent();
    switchShownedCard("answer");
    nextQuestionBtn.style.visibility = "visible";
    setTimeout(() => {
        nextQuestionBtn.focus();
    }, 500);
    updateValidatedProposition(false);
    givePoints(questionsList[questionIndex].date);
    //console.log(playersReponses);
}

function updateAnswerContent() {
    answerP.textContent = questionsList[questionIndex].answer;
    dateResponseP.textContent = questionsList[questionIndex].date;
    answerImg.src = answersImgsPath + questionsList[questionIndex].imgLink;
}

function givePoints(correctYear) {
    if (gameParameters.gainType === "first") {
        let minDifference = Infinity;
        let lstIndexBestPlayers = [];

        for (let i = 0; i < playersReponses.length; i++) {
            const playerReponse = playersReponses[i];

            const difference = Math.abs(playerReponse - correctYear);

            if (difference < minDifference) {

                minDifference = difference;
                lstIndexBestPlayers = []
                lstIndexBestPlayers.push(i);

            } else if (difference === minDifference) {
                lstIndexBestPlayers.push(i);
            }
        }

        lstIndexBestPlayers.forEach(playerInd => {
            addPointToPlayer(playerInd, 1);
        });

    } else if (gameParameters.gainType === "prox") {

        for (let i = 0; i < playersReponses.length; i++) {
            const playerReponse = playersReponses[i];

            const difference = Math.abs(playerReponse - correctYear);

            if (difference <= gameParameters.gapTolerance) {
                addPointToPlayer(i, 1);
            }
        }
    }
}

function addPointToPlayer(playerIndex, pointsAmount) {
    //console.log(document.querySelector(`#players-container .player-row:nth-child(0) .player-points`))
    let playerPointsElement = document.querySelector(`#players-container .player-row:nth-child(${playerIndex + 1}) .player-points`);
    playerPointsElement.innerHTML = `${playersPoints[playerIndex]}pt <span class="green">+${pointsAmount}</span>`;
    playersPoints[playerIndex] += pointsAmount;
}

function updateProgressBar() {
    let pg = questionIndex * 100 / questionsList.length
    if (questionIndex == 0) { pg = 0; }
    progressBar.style.width = pg + "%";
} updateProgressBar();

const questionLabel = document.getElementById("question-label");

function showNextQuestion() {
    nextQuestionBtn.style.visibility = "hidden";
    setTimeout(() => {
        reponseInput.focus();
    }, 500);
    switchShownedCard("question");
    updatePlayerPoints();
    if (questionIndex + 1 < questionsList.length) {
        questionIndex++;
        questionLabel.textContent = questionsList[questionIndex].question;
    } else {
        showFinalScreen();
    }
}

function updatePlayerPoints() {
    let playerPointsElement;
    for (i = 0; i < playersPoints.length; i++) {
        //console.log(document.querySelector(`#players-container .player-row:nth-child(${i + 1}) .player-points`))
        playerPointsElement = document.querySelector(`#players-container .player-row:nth-child(${i + 1}) .player-points`);
        playerPointsElement.innerHTML = `${playersPoints[i]}pt`;
    }
    /*playersPoints.forEach(playerInd => {
        playerPointsElement = document.querySelector(`#players-container .player-row:nth-child(${playerInd}) .player-points`);
        playerPointsElement.innerHTML = `${playersPoints[playerInd]}pt`;
    });*/
}

function switchShownedCard(cardType) {
    if (cardType === "question") {
        document.querySelector(`#questions-card .left`).style.display = "none";
        document.querySelector(`#questions-card .right`).style.display = "none";
        document.querySelector(`#questions-card .center`).style.display = "flex";
    } else if (cardType === "answer") {
        document.querySelector(`#questions-card .left`).style.display = "block";
        document.querySelector(`#questions-card .right`).style.display = "flex";
        document.querySelector(`#questions-card .center`).style.display = "none";
    }
}

function showFinalScreen() {
    //a faire
}
