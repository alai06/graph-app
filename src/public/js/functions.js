// === Ajout de boutons dynamiques ===
const dynamicButtons = document.querySelector('#dynamic-buttons');

export const addDynamicButton = (text, id, onClick) => {
    const button = document.createElement('button');
    button.textContent = text;
    button.id = id;
    button.addEventListener('click', onClick);
    dynamicButtons.appendChild(button);
};

export const clearDynamicButtons = () => {
    dynamicButtons.innerHTML = '';
};