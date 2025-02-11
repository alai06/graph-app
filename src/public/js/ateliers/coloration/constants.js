export const DOM_ELEMENTS = {
    modeLibreBtn: document.querySelector('#mode-libre-btn'),
    modeDefiBtn: document.querySelector('#mode-defi-btn'),
    modeCreationBtn: document.querySelector('#mode-creation-btn'),
	
    graphSection: document.querySelector('#graph-section'),
    modeTitle: document.querySelector('#mode-title'),
    dynamicButtons: document.querySelector('#dynamic-buttons'),
    selectElement: document.querySelector('#graph-select'),
    infoContainer: document.querySelector('#info-container'),
    infoBtn: document.querySelector('#info-btn'),
    infoSection: document.querySelector('#info-section'),
    infoText: document.querySelector('#info-text'),
    closeInfoBtn: document.querySelector('#close-info-btn'),
};

export const MODE_INFO_TEXTS = {
    Défi: `
        <strong>Objectif :</strong><br/>
        - deux sommets adjacents ne doivent jamais avoir la même couleur. <br/>
        - Vous possèdez un nombre limité de pastilles que vous devez placer correctement.<br/><br/>
        <strong>Étapes :</strong><br/>
        - Sélectionnez un graphe prédéfini.<br/>
        - Appliquez les couleurs tout en respectant l'objectif.<br/>
        - Si vous pensez avoir réussi, cliquez sur le bouton "Valider la coloration".
    `,
    Libre: `
        <strong>Objectif :</strong><br/>
        - deux sommets adjacents ne doivent jamais avoir la même couleur. <br/>
        - Vous possèdez un nombre illimité de pastilles que vous devez placer correctement.<br/>
        - Il se peut que votre solution soit la meilleure possible ou qu'il soit possible de réduire le nombre de couleur<br/><br/>
        <strong>Étapes :</strong><br/>
        - Sélectionnez un graphe prédéfini.<br/>
        - Appliquez les couleurs tout en respectant l'objectif.<br/>
        - Si vous pensez avoir réussi, cliquez sur le bouton "Valider la coloration".
    `,
    Création: `
        <strong>Objectif :</strong><br/>
        - deux sommets adjacents ne doivent jamais avoir la même couleur.<br/><br/>
        <strong>Étapes :</strong><br/>
        - Ajoutez des sommets et reliez-les par des arêtes.<br/>
        - Passez en Mode Libre pour tester la coloration.<br/>
        - Vérifiez si votre graphe respecte l'objectif.
    `,
};