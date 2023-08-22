/**Lire coockie des points des joueurs */
var cookieValue = document.cookie.replace(/(?:(?:^|.*;\s*)playersPointsWithNames\s*=\s*([^;]*).*$)|^.*$/, "$1");
var playersPointsWithNames = JSON.parse(cookieValue);
cookieValue = document.cookie.replace(/(?:(?:^|.*;\s*)nbQuestions\s*=\s*([^;]*).*$)|^.*$/, "$1");
var nbQuestions = JSON.parse(cookieValue);

/**Générer liste des résultats */
const resultsCard = document.getElementById("results-card");

/*function fillResultsCard() {
    const keys = Object.keys(playersPointsWithNames);

    keys.forEach(function (aName) {
        resultsCard.insertAdjacentHTML('beforeend', getResultLineCode(aName, playersPointsWithNames[aName]));
    });

} fillResultsCard();

function getResultLineCode(playerName, playerPoints) {
    let code = `
    <div class="player-row">
        <p class="player-name">${playerName}</p>
        <p class="player-points">${playerPoints}pt</p>
    </div>
    `
    return code;
}*/

function fillResultsCard() {
    // Convertir le dictionnaire en un tableau d'objets
    const playerEntries = Object.entries(playersPointsWithNames);

    // Trier le tableau par ordre décroissant de points
    playerEntries.sort((a, b) => b[1] - a[1]);

    // Afficher les joueurs triés
    playerEntries.forEach(([playerName, playerPoints], index) => {
        resultsCard.insertAdjacentHTML('beforeend', getResultLineCode(playerName, playerPoints, index === 0));
    });
}

function getResultLineCode(playerName, playerPoints, isFirst) {
    let emoji = "";
    if (isFirst) {
        emoji = "🏆";
    }

    let pg = (playerPoints) * 100 / nbQuestions

    let code = `
      <div class="player-row">
          <p class="player-name">${playerName} ${emoji}</p>
          
          <div class="row">
          <p class="player-points">${playerPoints} pts</p>
          <div class="progress">
              <div class="progress-done" style="width: ${pg}%;"></div>
          </div>
      </div> 
      </div>
    `
    return code;
}

fillResultsCard();

const questionsNb = document.getElementById("questions-nb");
questionsNb.textContent = nbQuestions + " Questions"