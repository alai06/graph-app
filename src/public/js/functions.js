// === Ajout de boutons dynamiques ===
const dynamicButtons = document.querySelector('#dynamic-buttons');

/**
 * @description Ajoute un bouton dynamique.
 * @param {string} text Texte du bouton.
 * @param {string} id Identifiant du bouton.
 * @param {Function} onClick Fonction à exécuter lors du clic.
*/
export const addDynamicButton = (text, id, onClick) => {
    const button = document.createElement('button');
    button.textContent = text;
    button.id = id;
    button.addEventListener('click', onClick);
    dynamicButtons.appendChild(button);
};

/**
 * @description Efface tous les boutons dynamiques.
*/
export const clearDynamicButtons = () => {
    dynamicButtons.innerHTML = '';
};

/**
 * @description Crée un sommet avec une position aléatoire.
 * @param {cytoscape.Core} cy Instance de cytoscape.
*/
export const createRandomNode = (cy) => {
    const id = `n${cy.nodes().length + 1}`;
    cy.add({
        group: 'nodes',
        data: { id },
        position: { x: 200 + Math.random() * 300, y: 200 + Math.random() * 300 },
    });
};

/**
 * @description Met en surbrillance un sommet.
 * @param {cytoscape.NodeSingular} node Instance d'un sommet.
*/
export const highlightNode = (node) => {
    node.style('border-color', '#FFD700');
    node.style('border-width', '3px');
}

/**
 * @description Réinitialise la surbrillance d'un sommet.
 * @param {cytoscape.NodeSingular} node Instance d'un sommet.
*/
export const resetHighlight = (node) => {
    node.style('border-color', '#666');
    node.style('border-width', '1px');
}