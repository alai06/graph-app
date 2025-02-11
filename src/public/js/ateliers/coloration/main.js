import { initDefiMode } from './defi.js';
import { initLibreMode } from './libre.js';
import { initCreationMode } from './creation.js';

document.addEventListener('DOMContentLoaded', () => {
	const modeLibreBtn = document.querySelector('#mode-libre-btn');
	const modeDefiBtn = document.querySelector('#mode-defi-btn');
	const modeCreationBtn = document.querySelector('#mode-creation-btn');
	const graphSection = document.querySelector('#graph-section');
	const modeTitle = document.querySelector('#mode-title');
	const dynamicButtons = document.querySelector('#dynamic-buttons');
	const selectElement = document.querySelector('#graph-select');

	const infoContainer = document.querySelector('#info-container');
	const infoBtn = document.querySelector('#info-btn');
	const infoSection = document.querySelector('#info-section');
	const infoText = document.querySelector('#info-text');
	const closeInfoBtn = document.querySelector('#close-info-btn');

	infoBtn.addEventListener('click', () => {
		infoSection.style.display = 'block';
	});

	closeInfoBtn.addEventListener('click', () => {
		infoSection.style.display = 'none';
	});

	const displayModeInfo = (mode) => {
		infoContainer.style.display = 'block';
		switch (mode) {
			case 'Défi':
				infoText.innerHTML = `
					<strong>Objectif :</strong><br/>
					- deux sommets adjacents ne doivent jamais avoir la même couleur. <br/>
					- Vous possèdez un nombre limité de pastilles que vous devez placer correctement.<br/><br/>
					<strong>Étapes :</strong><br/>
					- Sélectionnez un graphe prédéfini.<br/>
					- Appliquez les couleurs tout en respectant l'objectif.<br/>
					- Si vous pensez avoir réussi, cliquez sur le bouton "Valider la coloration".`;
				break;
			case 'Libre':
				infoText.innerHTML = `
					<strong>Objectif :</strong><br/>
					- deux sommets adjacents ne doivent jamais avoir la même couleur. <br/>
					- Vous possèdez un nombre illimité de pastilles que vous devez placer correctement.<br/>
					- Il se peut que votre solution soit la meilleure possible ou qu'il soit possible de réduire le nombre de couleur<br/><br/>
					<strong>Étapes :</strong><br/>
					- Sélectionnez un graphe prédéfini.<br/>
					- Appliquez les couleurs tout en respectant l'objectif.<br/>
					- Si vous pensez avoir réussi, cliquez sur le bouton "Valider la coloration".`;
				break;
			case 'Création':
				infoText.innerHTML = `
					<strong>Objectif :</strong><br/>
					- deux sommets adjacents ne doivent jamais avoir la même couleur.<br/><br/>
					<strong>Étapes :</strong><br/>
					- Ajoutez des sommets et reliez-les par des arêtes.<br/>
					- Passez en Mode Libre pour tester la coloration.<br/>
					- Vérifiez si votre graphe respecte l'objectif.`;
				break;
			default:
				infoText.innerHTML = '';
				break;
		}
	};

	const clearDynamicButtons = () => {
		dynamicButtons.innerHTML = '';
	};

	modeDefiBtn.addEventListener('click', () => {
		graphSection.style.display = 'block';
		modeTitle.textContent = 'Mode Défi';
		clearDynamicButtons();
		selectElement.style.display = 'block';
		initDefiMode(dynamicButtons);
		displayModeInfo('Défi');
	});

	modeLibreBtn.addEventListener('click', () => {
		graphSection.style.display = 'block';
		modeTitle.textContent = 'Mode Libre';
		clearDynamicButtons();
		selectElement.style.display = 'block';
		initLibreMode(dynamicButtons);
		displayModeInfo('Libre');
	});

	modeCreationBtn.addEventListener('click', () => {
		graphSection.style.display = 'block';
		modeTitle.textContent = 'Mode Création';
		clearDynamicButtons();
		selectElement.style.display = 'none';
		initCreationMode(dynamicButtons);
		displayModeInfo('Création');
	});
});