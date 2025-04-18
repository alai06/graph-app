// =================== IMPORTS ===================
import { fetchGraphs, addGraph, editGraph, deleteGraph } from './api.js';
import { highlightNode, resetHighlight } from "../functions.js"

// =================== DOM ELEMENTS ===================
const graphsList = document.querySelector('#graphs-list');
const addGraphBtn = document.querySelector('#add-graph-btn');
const graphModal = document.querySelector('#graph-modal');
const deleteModal = document.querySelector('#delete-modal');
const closeModalBtns = document.querySelectorAll('.close');
const confirmDeleteBtn = document.querySelector('#confirm-delete-btn');

const generalSection = document.querySelector('#section-general');
const actionsSection = document.querySelector('#section-actions');

const graphNameInput = generalSection.querySelector('#graph-name');
const selectDifficulty = generalSection.querySelector('#graph-difficulty');

const addNodeBtn = actionsSection.querySelector('#add-node-btn');
const resetGraphBtn = actionsSection.querySelector('#reset-graph-btn');
const edgeSliderContainer = actionsSection.querySelector('#edge-slider-container');
const edgeSlider = actionsSection.querySelector('#edge-slider');
const saveGraphBtn = actionsSection.querySelector('#save-graph-btn');

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

// =================== INITIAL STATE ===================
let cy;
let editingGraphId = null;
let selectedNode = null;
let selectedEdge = null;

// =================== MODAL NAVIGATION ===================
document.addEventListener('DOMContentLoaded', () => {
    const menuButtons = document.querySelectorAll('.graph-modal-menu button');
    const sections = document.querySelectorAll('.modal-section');

    menuButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-section');
            sections.forEach(sec => sec.classList.remove('active'));
            document.querySelector(`#section-${target}`).classList.add('active');
        });
    });
});

// =================== EVENT LISTENERS ===================
addNodeBtn.addEventListener('click', () => {
    const id = `n${cy.nodes().length + 1}`;
    cy.add({
        group: 'nodes',
        data: { id, label: id },
        position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 }
    });
});

resetGraphBtn.addEventListener('click', () => {
    Swal.fire({
        title: 'Confirmer la suppression',
        text: 'Voulez-vous vraiment supprimer le graphe ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui, supprimer',
        cancelButtonText: 'Annuler',
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6'
    }).then((result) => {
        if (result.isConfirmed) {
            cy.elements().remove();
            resetNodeSelection();
            Swal.fire('Supprimé !', 'Le graphe a été supprimé.', 'success');
        }
    });
});

saveGraphBtn.addEventListener('click', async () => {
    cy.layout({ name: 'preset', positions: (node) => node.position(), fit: true }).run();

    const name = graphNameInput.value.trim();
    const difficulty = selectDifficulty.value;

    const cyData = cy.json().elements;
    const nodes = cyData.nodes || [];
    const edges = cyData.edges || [];

    edges.forEach(edge => {
        edge.data.controlPointDistance = edge.data['control-point-distance'] ?? 0;
    });

    const graphPayload = {
        name,
        data: { nodes, edges }
    };

    let response;
    if (editingGraphId) {
        response = await editGraph(editingGraphId, graphPayload);
    } else {
        response = await addGraph(graphPayload);
    }

    if (response) {
        Swal.fire({
            icon: 'success',
            title: 'Félicitations !',
            text: `Graphe ${editingGraphId ? "modifié" : "ajouté"} avec succès !`,
        });
    }

    displayGraphs();
    closeGraphModal();
});

addGraphBtn.addEventListener('click', () => openGraphModal('Ajouter un Graphe'));

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

// =================== FUNCTIONS ===================
const openGraphModal = (title, graph = null) => {
    graphModal.style.display = 'block';
    document.querySelector('#modal-title').textContent = title;

    if (graph) {
        graphNameInput.value = graph.name;
        selectDifficulty.value = graph.difficulty;
        cy = initializeCytoscape(graph.data);
        editingGraphId = graph._id;
    } else {
        graphNameInput.value = '';
        selectDifficulty.value = '';
        cy = initializeCytoscape();
        editingGraphId = null;
    }

    handleDisableSaveBtn();

    graphNameInput.addEventListener('input', handleDisableSaveBtn);
    selectDifficulty.addEventListener('input', handleDisableSaveBtn);
};

const closeGraphModal = () => {
    graphModal.style.display = 'none';
};

const handleDisableSaveBtn = () => {
    const isFormValid = graphNameInput.value.trim().length > 0 &&
        selectDifficulty.value;

    saveGraphBtn.disabled = !isFormValid;
    saveGraphBtn.style.cursor = saveGraphBtn.disabled ? 'not-allowed' : 'pointer';
    saveGraphBtn.className = saveGraphBtn.disabled ? 'button button-disabled' : 'button button-success';
};

const initializeCytoscape = (data = []) => {
    const instance = cytoscape({
        container: document.querySelector('#cy-container'),
        elements: [],
        style: [
            { selector: 'node', style: { 'background-color': '#cccccc', 'width': 30, 'height': 30 } },
            {
                selector: 'edge',
                style: {
                    'line-color': '#666',
                    'width': 2,
                    'curve-style': 'unbundled-bezier',
                    'control-point-distance': 'data(controlPointDistance)',
                    'control-point-weight': 0.5
                }
            }
        ],
        layout: { name: 'grid' },
    });

    if (Object.keys(data).length > 0) {
        if (data.edges.length > 0) {
            data.edges.forEach(edge => {
                edge.data.controlPointDistance = edge.data.controlPointDistance || 0;
            });
        }
        instance.add([...data.nodes, ...data.edges]);
    }

    instance.on('tap', 'node', (event) => handleNodeClick(event.target));

    instance.on('tap', 'edge', (event) => {
        selectedEdge = event.target;
        edgeSliderContainer.style.display = 'block';
        edgeSlider.value = selectedEdge.data('control-point-distance') || 0;
    });

    instance.on('tap', (event) => {
        if (event.target === instance || instance.panningEnabled() || instance.boxSelectionEnabled()) return;
        if (!event.target.isEdge() && !edgeSliderContainer.contains(event.target)) {
            edgeSliderContainer.style.display = 'none';
            selectedEdge = null;
        }
    });

    edgeSlider.addEventListener('input', (event) => {
        if (selectedEdge) {
            const value = parseInt(event.target.value, 10);
            selectedEdge.style({
                'curve-style': 'unbundled-bezier',
                'control-point-distance': value,
                'control-point-weight': 0.5
            });
            selectedEdge.data('control-point-distance', value);
        }
    });

    instance.on('cxttap', 'node, edge', (event) => handleElementContextMenu(event.target));
    instance.on('tap', (event) => {
        if (event.target === instance) resetNodeSelection();
    });

    return instance;
};

const handleNodeClick = (node) => {
    if (!selectedNode) {
        selectedNode = node;
        highlightNode(node);
    } else if (selectedNode !== node) {
        cy.add({
            group: 'edges',
            data: { source: selectedNode.id(), target: node.id(), controlPointDistance: 0 }
        });
        resetNodeSelection();
    }
};

const handleElementContextMenu = (element) => {
    Swal.fire({
        title: 'Confirmer la suppression',
        text: `Voulez-vous vraiment supprimer ${element.isNode() ? 'ce sommet' : 'cette arête'} ?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui, supprimer',
        cancelButtonText: 'Annuler',
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6'
    }).then((result) => {
        if (result.isConfirmed) {
            element.remove();
            resetNodeSelection();
            Swal.fire('Supprimé!', "L'élément a été supprimé.", 'success');
        }
    });
};

const resetNodeSelection = () => {
    if (selectedNode) {
        resetHighlight(selectedNode);
        selectedNode = null;
    }
};

const applyLayout = (layoutName, options = {}) => {
    const defaultOptions = { name: layoutName, fit: true, padding: 30 };
    const layoutOptions = { ...defaultOptions, ...options };
    cy.layout(layoutOptions).run();
};

displayGraphs();