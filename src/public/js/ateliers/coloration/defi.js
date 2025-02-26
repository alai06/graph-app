import { initGraph, loadPredefinedGraph, validateGraph, resetColorsDefi, populateGraphSelect, rgbToHex } from './functions.js';
import { addDynamicButton } from '../../functions.js';

export const initDefiMode = () => {
    const cyDefi = initGraph('cy-predefined', { zoomingEnabled: false, panningEnabled: false, boxSelectionEnabled: false });

    let draggedColor = null;
    let closestNode = null;
    const snapDistance = 50;
    const defaultColor = '#cccccc';
    let difficulty = "";

    populateGraphSelect()

    addDynamicButton('Charger le Graphe', 'load-graph-btn', async () => {
        try {
            const graphId = document.querySelector('#predefined-graph-select').value;
            const graphData = await loadPredefinedGraph(graphId);

            if (!graphData || !graphData.data) {
                Swal.fire({
                    icon: 'error',
                    title: 'Erreur',
                    text: "Impossible de charger le graphe. Veuillez réessayer.",
                })
                return;
            }

            setTimeout(async () => {

                const pastilleCounts = graphData.pastilleCounts;

                difficulty = graphData.difficulty;

                addDynamicColorTokens(pastilleCounts, cyDefi);

                cyDefi.nodes().forEach((node) => {
                    if (!node.data('isColorNode')) {
                        node.lock();
                    }
                });
            }, 100);

        } catch (error) {
            console.error("Erreur lors du chargement du graphe :", error.message);
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: "Impossible de charger le graphe. Veuillez réessayer.",
            })
        }
    });

    addDynamicButton('Valider la Coloration', 'validate-graph-btn', () => validateGraph(cyDefi, difficulty));
    addDynamicButton('Réinitialiser la Coloration', 'reset-colors-btn', resetColorsDefi);

    function addDynamicColorTokens(pastilleCounts, cy) {
        let currentXPosition = 50;

        if (!pastilleCounts) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: "Impossible de charger les pastilles. Veuillez réessayer.",
            })
            return;
        }

        Object.entries(pastilleCounts).forEach(([color, count]) => {
            for (let i = 0; i < count; i++) {
                cy.add({
                    group: 'nodes',
                    data: { id: `color-${color}-${i}`, isColorNode: true },
                    position: { x: currentXPosition, y: 50 },
                    style: {
                        'background-color': color,
                        'width': 30,
                        'height': 30,
                        'label': '',
                        'border-width': 2,
                        'border-color': '#000',
                        'shape': 'ellipse',
                    },
                    locked: false,
                });
                currentXPosition += 50;
            }
        });

        cy.layout({ name: 'preset' }).run();
    }

    function findFreePositionX(cy) {
        const maxX = 1000;
        const step = 50;
        let x = 50;

        while (x < maxX) {
            const isOccupied = cy.nodes().some((node) => {
                const nodePos = node.position();
                return nodePos.x === x && nodePos.y === 50;
            });

            if (!isOccupied) {
                return x;
            }

            x += step;
        }

        console.error("No free position found on X-axis within the limit.");
        return null;
    }

    cyDefi.on('grab', 'node', (evt) => {
        const node = evt.target;

        if (node.data('isColorNode')) {
            draggedColor = node.style('background-color');
            node.data('initialPosition', { x: node.position('x'), y: node.position('y') });
        }
    });

    cyDefi.on('mousemove', (evt) => {
        if (draggedColor) {
            let closest = null;
            let minDistance = Infinity;

            cyDefi.nodes().forEach((node) => {
                if (!node.data('isColorNode')) {
                    const distance = Math.sqrt(
                        Math.pow(node.position('x') - evt.position.x, 2) +
                        Math.pow(node.position('y') - evt.position.y, 2)
                    );

                    if (distance < minDistance && distance < snapDistance) {
                        minDistance = distance;
                        closest = node;
                    }
                }
            });

            if (closest) {
                closestNode = closest;
                closestNode.style('border-color', '#FFD700');
            } else if (closestNode) {
                closestNode.style('border-color', '#666');
                closestNode = null;
            }
        }
    });

    cyDefi.on('free', 'node', (evt) => {
        const colorNode = evt.target;

        if (closestNode && draggedColor) {
            const currentColor = rgbToHex(closestNode.style('background-color'));

            if (currentColor !== defaultColor) {
                const initialPosition = colorNode.data('initialPosition');
                if (initialPosition) colorNode.position(initialPosition);

            } else {
                closestNode.style('background-color', draggedColor);
                closestNode.style('border-color', '#666');
                cyDefi.remove(colorNode);
            }
        } else {
            const initialPosition = colorNode.data('initialPosition');
            if (initialPosition) colorNode.position(initialPosition);
        }

        draggedColor = null;
        closestNode = null;
    });

    cyDefi.on('cxttap', 'node', (evt) => {
        const node = evt.target;
        const currentColor = rgbToHex(node.style('background-color'));
        const isColorNode = node.data('isColorNode');

        if (currentColor === defaultColor || isColorNode) return;

        node.style('background-color', defaultColor);

        const x = findFreePositionX(cyDefi);

        if (x !== null) {
            cyDefi.add({
                group: 'nodes',
                data: { id: `color-${currentColor}-${Math.random()}`, isColorNode: true },
                position: { x, y: 50 },
                style: {
                    'background-color': currentColor,
                    'width': 30,
                    'height': 30,
                    'label': '',
                    'border-width': 2,
                    'border-color': '#000',
                    'shape': 'ellipse',
                },
                locked: false,
            });
        }
    });
};