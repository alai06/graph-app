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

	infoBtn.addEventListener("click", function () {
		if (infoSection.style.display === "none" || infoSection.style.display === "") {
			infoSection.style.display = "block";
			infoBtn.textContent = "❌ Fermer les règles";
		} else {
			infoSection.style.display = "none";
			infoBtn.textContent = "ℹ️ Voir les règles";
		}
	});

	const displayModeInfo = (mode) => {
		infoContainer.style.display = 'block';
		switch (mode) {
			case 'Défi':
				infoText.innerHTML = `
					<strong>🎯 Objectif :</strong><br/>
					- Assurez-vous que <strong>deux sommets adjacents</strong> n'ont jamais la même couleur !<br/>
					- Vous disposez d’un <strong>nombre limité</strong> de pastilles colorées. Saurez-vous les placer intelligemment ?<br/><br/>
					<strong>🛠️ Comment jouer ?</strong><br/>
					1️⃣ Choisissez un graphe prédéfini.<br/>
					2️⃣ Appliquez vos couleurs en respectant les règles.<br/>
					3️⃣ Lorsque vous êtes sûr de votre solution, cliquez sur <strong>"Valider la coloration"</strong> pour voir si vous avez réussi !<br/><br/>
					⚠️ Attention, chaque mouvement compte !`;
				break;
	
			case 'Libre':
				infoText.innerHTML = `
					<strong>🎯 Objectif :</strong><br/>
					- Coloriez le graphe en respectant la règle d'or : <strong>deux sommets reliés ne doivent jamais partager la même couleur</strong> !<br/>
					- Cette fois, vous avez un <strong>nombre illimité</strong> de pastilles, mais essayez de minimiser leur utilisation !<br/>
					- Peut-être avez-vous trouvé une solution... mais est-ce la plus optimale ?<br/><br/>
					<strong>🛠️ Comment jouer ?</strong><br/>
					1️⃣ Sélectionnez un graphe prédéfini.<br/>
					2️⃣ Testez différentes combinaisons de couleurs.<br/>
					3️⃣ Lorsque vous êtes satisfait, cliquez sur <strong>"Valider la coloration"</strong> et vérifiez si vous pouvez encore améliorer votre solution !<br/><br/>
					💡 Conseil : Une solution parfaite utilise <strong>le moins de couleurs possible</strong>. À vous de jouer !`;
				break;
	
			case 'Création':
				infoText.innerHTML = `
					<strong>🎯 Objectif :</strong><br/>
					- Créez votre propre graphe et testez sa difficulté !<br/>
					- Rappelez-vous : <strong>deux sommets adjacents ne doivent jamais partager la même couleur</strong> !<br/><br/>
					<strong>🛠️ Comment jouer ?</strong><br/>
					1️⃣ Ajoutez des sommets et reliez-les avec des arêtes pour façonner votre graphe.<br/>
					2️⃣ Passez en <strong>Mode Libre</strong> pour essayer de le colorer.<br/>
					3️⃣ Vérifiez si votre graphe est réalisable et testez-le sur vos amis !<br/><br/>
					🎨 Faites preuve de créativité et créez des défis uniques !`;
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