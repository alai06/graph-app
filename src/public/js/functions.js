// === Ajout de boutons dynamiques ===
export const addDynamicButton = (dynamicButtons, text, id, onClick) => {
    const button = document.createElement('button');
    button.textContent = text;
    button.id = id;
    button.addEventListener('click', onClick);
    dynamicButtons.appendChild(button);
};

// === Couleurs ===
export const colors = [
    '#FF5733',
    '#3498DB',
    '#2ECC71',
    '#F1C40F',
    '#9400D3', 
    '#FF69B4', 
    '#8B4513', 
    '#1E90FF',
    '#32CD32', 
    '#FFD700',
    '#9400D3', 
    '#FF4500', 
    '#2E8B57', 
    '#DC143C', 
    '#00CED1', 
    '#A52A2A',
    '#FF8C00', 
    '#4B0082'
];