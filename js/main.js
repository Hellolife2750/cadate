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
    // tooltip.style.left = rect.left + "px";
    // tooltip.style.top = rect.bottom + "px";
    const tooltipWidth = tooltip.offsetWidth;
    const buttonWidth = createGameBtn.offsetWidth;
    const xOffset = (buttonWidth - tooltipWidth) / 2; // Calcul de la position horizontale
    tooltip.style.left = rect.left + xOffset + "px"; // Ajoutez xOffset à la position gauche
    tooltip.style.top = rect.bottom + 10 + "px";

    // Affichez le tooltip
    tooltip.style.display = "block";

    // Ajoutez un écouteur d'événements pour détecter les clics en dehors du popup
    document.addEventListener("click", outsideClickHandler);
});

// Fonction pour gérer les clics en dehors du popup
function outsideClickHandler(event) {
    if (!tooltip.contains(event.target) && event.target !== createGameBtn) {
        tooltip.style.display = "none";
        document.removeEventListener("click", outsideClickHandler);
    }
}

// Pour masquer le tooltip lorsque vous cliquez sur "Oui" ou "Non"
yesBtn.addEventListener("click", () => {
    tooltip.style.display = "none";
    document.removeEventListener("click", outsideClickHandler);
});

noBtn.addEventListener("click", () => {
    tooltip.style.display = "none";
    document.removeEventListener("click", outsideClickHandler);
});


/**afficher ou cacher l'input de saisie de tolérance de marquage de points */
const gapInput = document.getElementById("gap-input");
const gapSlideRadio = document.getElementById("gap-slice-radio");
const nearestRadio = document.getElementById("nearest-radio");

// Écoutez les changements d'état du bouton radio "Tranche d'écart"
gapSlideRadio.addEventListener("change", changeGapSlideRadioVisibility);
nearestRadio.addEventListener("change", changeGapSlideRadioVisibility);

function changeGapSlideRadioVisibility() {
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