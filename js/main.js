/**Update les labels en fonction de la valeur des sliders */
const playersNbLabel = document.getElementById("players-nb-label");
const questionsNbLabel = document.getElementById("questions-nb-label");

const playersNbSlider = document.getElementById("players-nb-slider");
const questionsNbSlider = document.getElementById("questions-nb-slider");

// Fonction pour mettre à jour les labels
function updateLabels() {
    playersNbLabel.textContent = playersNbSlider.value;
    questionsNbLabel.textContent = questionsNbSlider.value;
}

// Ajoutez des gestionnaires d'événements aux sliders
playersNbSlider.addEventListener("input", updateLabels);
questionsNbSlider.addEventListener("input", updateLabels);

// Appelez la fonction updateLabels initialement pour afficher les valeurs par défaut
updateLabels();

/**Tooltip créer une partie */
const createGameBtn = document.getElementById("create-game-btn");
const tooltip = document.getElementById("create-game-tooltip");
const yesBtn = document.getElementById("yes-btn");
const noBtn = document.getElementById("no-btn");

createGameBtn.addEventListener("click", () => {
    // Positionnez le tooltip sous le bouton
    const rect = createGameBtn.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop; // Obtenir l'offset en Y du scroll

    // tooltip.style.left = rect.left + "px";
    // tooltip.style.top = rect.bottom + "px";
    const tooltipWidth = tooltip.offsetWidth;
    const buttonWidth = createGameBtn.offsetWidth;
    const xOffset = (buttonWidth - tooltipWidth) / 2; // Calcul de la position horizontale
    const yOffset = rect.bottom + scrollTop + 10; // Calcul de la position verticale en tenant compte du scroll

    tooltip.style.left = rect.left + xOffset + "px"; // Ajoutez xOffset à la position gauche
    tooltip.style.top = yOffset + "px";

    // Affichez le tooltip
    tooltip.style.display = "block";

    // Ajoutez un écouteur d'événements pour détecter les clics en dehors du popup
    document.addEventListener("click", () => {
        outsideClickHandler(event, tooltip, createGameBtn)
    });
});

// Pour masquer le tooltip lorsque vous cliquez sur "Oui" ou "Non"
yesBtn.addEventListener("click", () => {
    tooltip.style.display = "none";
    document.removeEventListener("click", outsideClickHandler);
});

noBtn.addEventListener("click", () => {
    tooltip.style.display = "none";
    document.removeEventListener("click", outsideClickHandler);
});

const joinGameTooltip = document.getElementById("join-game-tooltip");
const joinGameBtn = document.getElementById("join-game-btn");

joinGameBtn.addEventListener("click", () => {
    const rect = joinGameBtn.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop; // Obtenir l'offset en Y du scroll

    const tooltipWidth = joinGameTooltip.offsetWidth;
    const buttonWidth = joinGameBtn.offsetWidth;
    const xOffset = (buttonWidth - tooltipWidth) / 2; // Calcul de la position horizontale
    const yOffset = rect.bottom + scrollTop + 10; // Calcul de la position verticale en tenant compte du scroll

    joinGameTooltip.style.left = rect.left + xOffset + "px"; // Ajoutez xOffset à la position gauche
    joinGameTooltip.style.top = yOffset + "px";

    // Affichez le tooltip
    joinGameTooltip.style.display = "flex";

    // Ajoutez un écouteur d'événements pour détecter les clics en dehors du popup
    document.addEventListener("click", () => {
        outsideClickHandler(event, joinGameTooltip, joinGameBtn)
    });
});

// Fonction pour gérer les clics en dehors du popup
function outsideClickHandler(event, tlTip, btn) {
    if (!tlTip.contains(event.target) && event.target !== btn) {
        tlTip.style.display = "none";
        document.removeEventListener("click", outsideClickHandler);
    }
}


/**afficher ou cacher l'input de saisie de tolérance de marquage de points */
const gapInput = document.getElementById("gap-input");
const gapSlideRadio = document.getElementById("gap-slice-radio");
const nearestRadio = document.getElementById("nearest-radio");

// Écoutez les changements d'état du bouton radio "Tranche d'écart"
gapSlideRadio.addEventListener("change", changeGapSlideRadioVisibility);
nearestRadio.addEventListener("change", changeGapSlideRadioVisibility);

function changeGapSlideRadioVisibility() {
    changeMinNbPlayer();
    // Vérifiez si le bouton radio "Tranche d'écart" est coché
    if (gapSlideRadio.checked) {
        // Si oui, affichez l'input gap-input
        gapInput.style.display = "block";
    } else {
        // Sinon, cachez-le
        gapInput.style.display = "none";
    }
}

changeGapSlideRadioVisibility();

//Vérifie que le joueur ne joue pas seul avec l'option 'le plus proche'.
function changeMinNbPlayer() {
    nearestRadio.checked ? playersNbSlider.min = "2" : playersNbSlider.min = "1";
    updateLabels();
}

/*
// Définir la valeur que vous souhaitez stocker dans le cookie
var valeur = "bonjour";

// Définir la durée de validité du cookie en jours
var duree = 1; // Par exemple, 365 jours

// Créer une date d'expiration pour le cookie
var expirationDate = new Date();
expirationDate.setDate(expirationDate.getDate() + duree);

// Convertir la date d'expiration en une chaîne au format UTC
var expirationString = expirationDate.toUTCString();

// Créer le cookie avec la valeur et la date d'expiration
document.cookie = "coock1=" + encodeURIComponent(valeur) + "; expires=" + expirationString + "; path=/";
*/

/**lancer une partie */
var gameParameters = { "nbPlayers": 0, "nbQuestions": 0, "gainType": "first/prox", "gapTolerance": 10 };

function launchLocalGame() {
    storeGameParametersInCoockies()
    window.open('html/game_local.html');
}

function storeGameParametersInCoockies() {
    gameParameters = { "nbPlayers": playersNbSlider.value, "nbQuestions": questionsNbSlider.value, "gainType": "first/prox", "gapTolerance": gapInput.value }
    nearestRadio.checked ? gameParameters.gainType = "first" : gameParameters.gainType = "prox";

    var gameParametersJSON = JSON.stringify(gameParameters);
    document.cookie = "gameParameters=" + gameParametersJSON;
}

// Lire la valeur du cookie "monFichier.txt"
/*var cookieValue = getCookie("coock1");
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

