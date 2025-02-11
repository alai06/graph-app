// === Ajout de boutons dynamiques ===
export const addDynamicButton = (dynamicButtons, text, id, onClick) => {
    const button = document.createElement('button');
    button.textContent = text;
    button.id = id;
    button.addEventListener('click', onClick);
    dynamicButtons.appendChild(button);
};