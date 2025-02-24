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
					<h3>🎯 Objectif</h3>
					<ul>
						<li>Deux sommets adjacents ne doivent jamais avoir la même couleur.</li>
						<li>Vous possédez un nombre limité de pastilles que vous devez placer correctement.</li>
					</ul>

					<h3>🛠️ Comment jouer à la <strong>Coloration d'un Graphe</strong></h3>
					<ul>
						<li>Sélectionne un graphe prédéfini dans le menu déroulant.</li>
						<li>Clique sur le bouton <strong>Charger le Graphe</strong> pour charger le graphe.</li>
						<li>Seul les pastilles de couleur (🔴) peuvent être déplacées jusqu'aux sommets.</li>
						<li>Attrape une pastille de couleur, fais la glisser vers un sommet et relâche là pour lui attribuer cette couleur.</li>
						<li>Colorie entiérement le graphe en respectant les règles de coloration.</li>
						<li>Quand tu penses avoir réussi, clique sur le bouton <strong>Valider la Coloration</strong> pour vérifier si le graphe est correctement coloré.</li>
					</ul>

					<h3>🔧 Fonctionnalités</h3>
					<ul>
						<li>Si tu penses avoir fait une erreur, tu peux faire un clic droit sur un sommet pour lui retirer sa couleur.</li>
						<li>Si tu veux recommencer, clique sur <strong>Réinitialiser la Coloration</strong> pour remettre tous les sommets dans leur état initial.</li>
					</ul>`;
				break;

			case 'Libre':
				infoText.innerHTML = `
					<h3>🎯 Objectif</h3>
					<ul>
						<li>Deux sommets adjacents ne doivent jamais avoir la même couleur.</li>
						<li>Vous possédez un nombre limité de pastilles que vous devez placer correctement.</li>
					</ul>

					<h3>🛠️ Comment jouer à la <strong>Coloration d'un Graphe</strong></h3>
					<ul>
						<li>Sélectionne un graphe prédéfini dans le menu déroulant.</li>
						<li>Clique sur le bouton <strong>Charger le Graphe</strong> pour charger le graphe.</li>
						<li>Seul les pastilles de couleur (🔴) peuvent être déplacées jusqu'aux sommets.</li>
						<li>Attrape une pastille de couleur, fais la glisser vers un sommet et relâche là pour lui attribuer cette couleur.</li>
						<li>Colorie entiérement le graphe en respectant les règles de coloration.</li>
						<li>Quand tu penses avoir réussi, clique sur le bouton <strong>Valider la Coloration</strong> pour vérifier si le graphe est correctement coloré.</li>
						<li>Mets toi au défi d'utiliser le moins de couleurs possible pour colorier le graphe !</li>
					</ul>

					<h3>🔧 Fonctionnalités</h3>
					<ul>
						<li>Si tu penses avoir fait une erreur, tu peux faire un clic droit sur un sommet pour lui retirer sa couleur.</li>
						<li>Si tu veux recommencer, clique sur <strong>Réinitialiser la Coloration</strong> pour remettre tous les sommets dans leur état initial.</li>
					</ul>`;
				break;

			case 'Création':
				infoText.innerHTML = `
					<h3>🎯 Objectif</h3>
					<ul>
						<li>Créer un graphe et le colorier.</li>
						<li>Deux sommets adjacents ne doivent jamais avoir la même couleur.</li>
						<li>Vous possédez un nombre limité de pastilles que vous devez placer correctement.</li>
					</ul>

					<h3>🛠️ Comment jouer à la <strong>Création et la Coloration d'un Graphe</strong></h3>
					<ul>
						<li>Clique sur le bouton <strong>Ajouter un sommet.</strong> pour ajouter un sommet au graphe.</li>
						<li>Place le sommet en le faisant glisser là où tu veux.</li>
						<li>En faisant un clic gauche sur un sommet puis un autre clic gauche sur un autre sommet, tu peux ajouter une arête entre les deux sommets.</li>
						<li>Dès que tu penses avoir fini de créer ton graphe, clique sur le bouton <strong>Essayer le Graphe</strong> pour commencer à colorier le graphe.</li>
						<li>Seul les pastilles de couleur (🔴) peuvent être déplacées jusqu'aux sommets.</li>
						<li>Attrape une pastille de couleur, fais la glisser vers un sommet et relâche là pour lui attribuer cette couleur.</li>
						<li>Colorie entiérement le graphe en respectant les règles de coloration.</li>
						<li>Quand tu penses avoir réussi, clique sur le bouton <strong>Valider la Coloration</strong> pour vérifier si le graphe est correctement coloré.</li>
						<li>Mets toi au défi d'utiliser le moins de couleurs possible pour colorier le graphe !</li>
					</ul>
					
					<h3>🔧 Fonctionnalités</h3>
					<ul>
						<li>Lors de la création, si tu penses que ton graphe est pas beau, tu peux le réarranger en cliquant sur <strong>Réarranger le graphe</strong>.</li>
						<li>Si tu penses avoir fait une erreur, tu peux faire un clic droit sur un sommet pour lui retirer sa couleur.</li>
						<li>Si tu veux recommencer, clique sur <strong>Réinitialiser la Coloration</strong> pour remettre tous les sommets dans leur état initial.</li>
					</ul>`;
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