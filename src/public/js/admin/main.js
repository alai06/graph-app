import { fetchGraphs, addGraph, editGraph, deleteGraph } from './api.js';

const graphsList = document.querySelector('#graphs-list');
const addGraphBtn = document.querySelector('#add-graph-btn');
const graphModal = document.querySelector('#graph-modal');
const deleteModal = document.querySelector('#delete-modal');
const closeModalBtns = document.querySelectorAll('.close');
const saveGraphBtn = document.querySelector('#save-graph-btn');
const graphNameInput = document.querySelector('#graph-name');
const selectDifficulty = document.querySelector('#graph-difficulty');
const optimalColoringInput = document.querySelector('#graph-optimal-coloring');
const confirmDeleteBtn = document.querySelector('#confirm-delete-btn');
const addNodeBtn = document.querySelector('#add-node-btn');
const resetGraphBtn = document.querySelector('#reset-graph-btn');

const colorInputsContainer = document.getElementById('color-inputs');
const colorConfigContainer = document.getElementById('color-config');

const reorganizeGraphObject = {
	circle: { id: "#reorganize-graph-btn-circle", data: { name: 'circle', avoidOverlap: true } },
	random: { id: "#reorganize-graph-btn-random", data: { name: 'random' } },
}

Object.keys(reorganizeGraphObject).forEach((key) => {
	const { id, data } = reorganizeGraphObject[key];
	document.querySelector(id).addEventListener('click', () => {
		applyLayout(data.name, data);
	});
});

let cy;
let editingGraphId = null;
let selectedNode = null;
let manualColorConfig = {};

const handleDisableSaveBtn = () => {
	const totalNodes = cy.nodes().length;
	const inputs = document.querySelectorAll('#color-inputs input');

	const isFormValid = graphNameInput.value.trim().length > 0
		&& selectDifficulty.value
		&& optimalColoringInput.value.trim().length > 0;

	let usedPastilles = Array.from(inputs).reduce((sum, input) => sum + parseInt(input.value || 0, 10), 0);

	const isPastilleCountValid = (usedPastilles === totalNodes);

	if (isFormValid && isPastilleCountValid) {
		saveGraphBtn.disabled = false;
		saveGraphBtn.style.cursor = 'pointer';
		saveGraphBtn.className = 'button button-success';
	} else {
		saveGraphBtn.disabled = true;
		saveGraphBtn.style.cursor = 'not-allowed';
		saveGraphBtn.className = 'button button-disabled';
	}
};

const displayGraphs = async () => {
	const graphs = await fetchGraphs();
	graphsList.innerHTML = '';

	graphs.forEach((graph) => {
		const row = document.createElement('tr');
		row.innerHTML = `
      <td>${graph.name}</td>
      <td>${new Date(graph.createdAt).toLocaleDateString()}</td>
      <td>
        <button class="button button-primary" data-id="${graph._id}" onclick="handleEdit(event)">Modifier</button>
        <button class="button button-danger" data-id="${graph._id}" onclick="handleDelete(event)">Supprimer</button>
      </td>
    `;
		graphsList.appendChild(row);
	});
};

const openGraphModal = (title, graph = null) => {
	graphModal.style.display = 'block';
	document.querySelector('#modal-title').textContent = title;

	if (graph) {
		graphNameInput.value = graph.name;
		selectDifficulty.value = graph.difficulty;
		optimalColoringInput.value = graph.optimalColoring || '';

		cy = initializeCytoscape(graph.data);
		editingGraphId = graph._id;

		if (graph.pastilleCounts) {
			colorConfigContainer.style.display = 'block';
			generateColorInputs(graph.optimalColoring, graph.pastilleCounts || {});
		} else {
			colorConfigContainer.style.display = 'none';
		}
	} else {
		graphNameInput.value = '';
		selectDifficulty.value = '';
		optimalColoringInput.value = '';
		cy = initializeCytoscape();
		editingGraphId = null;
		colorConfigContainer.style.display = 'none';
	}

	handleDisableSaveBtn();

	graphNameInput.addEventListener('input', handleDisableSaveBtn);
	selectDifficulty.addEventListener('input', handleDisableSaveBtn);
	optimalColoringInput.addEventListener('input', validateOptimalColoring);
	optimalColoringInput.addEventListener('input', handleDisableSaveBtn);
	optimalColoringInput.addEventListener('input', handleColoringChange);
};

const handleColoringChange = () => {
	const optimalColoring = parseInt(optimalColoringInput.value, 10);
	if (!isNaN(optimalColoring) && optimalColoring > 0) {
		colorConfigContainer.style.display = 'block';
		generateColorInputs(optimalColoring, {});
	} else {
		colorConfigContainer.style.display = 'none';
	}
};

const generateColorInputs = (optimalColorCount, existingConfig) => {
	colorInputsContainer.innerHTML = '';

	const availableColors = ['#FF5733', '#3498DB', '#2ECC71', '#F1C40F', '#9400D3', '#2A233E', '#34495E', '#00FFFF', '#1A182D'];

	for (let i = 0; i < optimalColorCount; i++) {
		const color = availableColors[i % availableColors.length];

		const div = document.createElement('div');
		div.style.display = 'flex';
		div.style.alignItems = 'center';
		div.style.marginBottom = '5px';

		const label = document.createElement('label');
		label.textContent = `Nombre de pastilles pour `;
		label.style.marginRight = '10px';

		const colorCircle = document.createElement('span');
		colorCircle.style.backgroundColor = color;
		colorCircle.style.width = '20px';
		colorCircle.style.height = '20px';
		colorCircle.style.borderRadius = '50%';
		colorCircle.style.display = 'inline-block';
		colorCircle.style.marginRight = '10px';

		const input = document.createElement('input');
		input.type = 'number';
		input.min = 1;
		input.value = existingConfig[color] || 1;
		input.dataset.color = color;

		div.appendChild(label);
		div.appendChild(colorCircle);
		div.appendChild(input);

		colorInputsContainer.appendChild(div);
	}

	validatePastilleInputs();
};

const validatePastilleInputs = () => {
	const totalNodes = cy.nodes().length;
	const inputs = document.querySelectorAll('#color-inputs input');

	inputs.forEach(input => {
		input.dataset.prevValue = input.value || "1";
	});

	inputs.forEach(input => {
		input.addEventListener('input', (event) => {
			let currentValue = parseInt(event.target.value || 0, 10);
			let prevValue = parseInt(input.dataset.prevValue || "1", 10);

			let usedPastilles = Array.from(inputs).reduce((sum, inp) =>
				sum + (inp === input ? 0 : parseInt(inp.value || 0, 10)),
				0
			);

			if (currentValue < 1) {
				event.target.value = 1;
			} else if (usedPastilles + currentValue > totalNodes) {
				event.target.value = prevValue;
			} else {
				input.dataset.prevValue = event.target.value;
			}

			handleDisableSaveBtn();
		});
	});

	handleDisableSaveBtn();
};

const validateOptimalColoring = (event) => {
	const totalNodes = cy.nodes().length;
	let inputValue = parseInt(optimalColoringInput.value, 10) || 1;

	optimalColoringInput.max = totalNodes;

	if (inputValue < 1) {
		event.preventDefault();
		optimalColoringInput.value = 1;
	} else if (inputValue > totalNodes) {
		event.preventDefault();
		Swal.fire({
			icon: "warning",
			title: "Attention !",
			text: `Le nombre maximal de couleurs est ${totalNodes}, car il y a ${totalNodes} sommets.`,
		});
		optimalColoringInput.value = '';
	} else {
		optimalColoringInput.dataset.prevValue = inputValue;
	}
};

let hoveredNode = null; // Stocke le nœud sous la souris
let selectedNodeCurve = null; // Stocke le premier nœud sélectionné

const initializeCytoscape = (data = []) => {

	const instance = cytoscape({
		container: document.querySelector('#cy-container'),
		elements: [],
		style: [
			{ selector: 'node', style: { 'background-color': '#cccccc', label: 'data(label)' } },
			{ selector: 'edge.default', style: { 'line-color': '#666', 'width': 2 } },
			{ selector: 'edge.bezier-left', style: { 'curve-style': 'unbundled-bezier', 'control-point-distance': 50, 'control-point-weight': 0.5, 'line-color': '#666', 'width': 2 } },
			{ selector: 'edge.bezier-right', style: { 'curve-style': 'unbundled-bezier', 'control-point-distance': -50, 'control-point-weight': 0.5, 'line-color': '#666', 'width': 2 } }
		],
		layout: { name: 'grid' },
	});

	if (Object.keys(data).length > 0) {
		instance.add(data);
	};
	
	instance.on('mouseover', 'node', (event) => {
		hoveredNode = event.target;
	});
	
	instance.on('mouseout', 'node', () => {
		hoveredNode = null;
	});

	document.addEventListener('keydown', (event) => handleEdgeCurve(event));
	instance.on('tap', 'node', (event) => handleNodeClick(event.target));
	instance.on('cxttap', 'node, edge', (event) => handleElementContextMenu(event.target));
	instance.on('tap', (event) => {
		if (event.target === instance) {
			resetNodeSelection();
		}
	});

	return instance;
};

const handleEdgeCurve = (event) => {
    if (event.key.toLowerCase() === 'c') {
        if (hoveredNode) {
            if (!selectedNodeCurve) {
                selectedNodeCurve = hoveredNode;
                highlightNode(selectedNodeCurve);
            } else if (selectedNodeCurve !== hoveredNode) {
                cy.add({
                    group: 'edges',
                    data: {
                        source: selectedNodeCurve.id(),
                        target: hoveredNode.id(),
                    },
                    classes: 'bezier-left',
                });

                unhighlightNode(selectedNodeCurve);
                selectedNodeCurve = null;
            }
        }
    }else if (event.key.toLowerCase() === 'v') {
		if (hoveredNode) {
			if (!selectedNodeCurve) {
				selectedNodeCurve = hoveredNode;
				highlightNode(selectedNodeCurve);
			} else if (selectedNodeCurve !== hoveredNode) {
				cy.add({
					group: 'edges',
					data: {
						source: selectedNodeCurve.id(),
						target: hoveredNode.id(),
					},
					classes: 'bezier-right',
				});

				unhighlightNode(selectedNodeCurve);
				selectedNodeCurve = null;
			}
		}
	}
};

addNodeBtn.addEventListener('click', () => {
	const id = `n${cy.nodes().length + 1}`;
	cy.add({
		group: 'nodes',
		data: { id, label: id },
		position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
	});

	validatePastilleInputs();
	validateOptimalColoring();
});

resetGraphBtn.addEventListener('click', () => {
	Swal.fire({
        title: "Confirmer la suppression",
        text: `Voulez-vous vraiment supprimer le graphe ?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oui, supprimer",
        cancelButtonText: "Annuler",
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
    }).then((result) => {
        if (result.isConfirmed) {
			cy.elements().remove();
			resetNodeSelection();
			validateOptimalColoring();
            Swal.fire("Supprimé !", "Le graphe a été supprimé.", "success");
        }
    });
});

saveGraphBtn.addEventListener('click', async () => {

	cy.layout({ name: 'preset', positions: (node) => node.position(), fit: true }).run();

	const name = graphNameInput.value.trim();
	const difficulty = selectDifficulty.value;
	const optimalColoring = parseInt(optimalColoringInput.value, 10);
	const graphData = cy.json().elements;

	const pastilleCounts = {};
	document.querySelectorAll('#color-inputs input').forEach(input => {
		pastilleCounts[input.dataset.color] = parseInt(input.value, 10) || 1;
	});

	const graphPayload = {
		name,
		data: { nodes: graphData.nodes, edges: graphData.edges },
		difficulty,
		optimalColoring,
		pastilleCounts
	};

	let response;
	if (editingGraphId) {
		response = await editGraph(editingGraphId, graphPayload);
	} else {
		response = await addGraph(graphPayload);
	}


	if (response) {
		Swal.fire({
			icon: "success",
			title: "Félicitations !",
			text: `Graphe ${editingGraphId ? "modifié" : "ajouté"} avec succès !`,
		});
	}

	displayGraphs();
	closeGraphModal();
});


addGraphBtn.addEventListener('click', () => {
	openGraphModal('Ajouter un Graphe');
});

const closeGraphModal = () => {
	graphModal.style.display = 'none';
};

window.closeGraphModal = closeGraphModal;

window.handleEdit = async (event) => {
	const id = event.target.getAttribute('data-id');
	const graphs = await fetchGraphs();
	const graphToEdit = graphs.find((g) => g._id === id);

	openGraphModal('Modifier un Graphe', graphToEdit);
};

window.handleDelete = (event) => {
	const id = event.target.getAttribute('data-id');
	deleteModal.style.display = 'block';
	confirmDeleteBtn.onclick = async () => {
		await deleteGraph(id);
		displayGraphs();
		deleteModal.style.display = 'none';
	};
};

closeModalBtns.forEach((btn) => {
	btn.addEventListener('click', () => {
		closeGraphModal();
		deleteModal.style.display = 'none';
	});
});

const handleNodeClick = (node) => {
	if (!selectedNode) {
		selectedNode = node;
		highlightNode(node);
	} else if (selectedNode !== node) {
		cy.add({
			group: 'edges',
			data: { source: selectedNode.id(), target: node.id() },
			classes: 'default',
		});
		resetNodeSelection();
	}
};

const handleElementContextMenu = (element) => {
    Swal.fire({
        title: "Confirmer la suppression",
        text: `Voulez-vous vraiment supprimer ${element.isNode() ? 'ce sommet' : 'cette arête'} ?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oui, supprimer",
        cancelButtonText: "Annuler",
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
    }).then((result) => {
        if (result.isConfirmed) {
            element.remove();
            resetNodeSelection();
            Swal.fire("Supprimé!", "L'élément a été supprimé.", "success");
        }
    });
};

const resetNodeSelection = () => {
	if (selectedNode) {
		unhighlightNode(selectedNode);
		selectedNode = null;
	}
};

const highlightNode = (node) => {
	node.style({ 'border-color': '#FFD700', 'border-width': '3px' });
};

const unhighlightNode = (node) => {
	node.style({ 'border-color': '#666', 'border-width': '1px' });
};

const applyLayout = (layoutName, options = {}) => {
	const defaultOptions = {
		name: layoutName,
		fit: true,
		padding: 30,
	};

	const layoutOptions = { ...defaultOptions, ...options };
	cy.layout(layoutOptions).run();
};

displayGraphs();