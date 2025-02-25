import { initGraph, loadPredefinedGraph, resetColorsLibre, populateGraphSelect, generateRandomColors, rgbToHex } from './functions.js';
import { addDynamicButton } from '../../functions.js';

export const initLibreMode = (dynamicButtons) => {
    const cyLibre = initGraph('cy-predefined', { zoomingEnabled: false, panningEnabled: false });

    let draggedColor = null;
    let closestNode = null;
    const snapDistance = 50;
    const defaultColor = '#cccccc';
    let optimalColorCount = null;

    populateGraphSelect()

    addDynamicButton(dynamicButtons, 'Charger le Graphe', 'load-graph-btn', async () => {
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

            optimalColorCount = graphData.optimalColoring;

            setTimeout(() => {

                const colorsConfig = generateRandomColors(cyLibre);
                addInfiniteColorTokens(colorsConfig, cyLibre);

                cyLibre.nodes().forEach((node) => {
                    if (!node.data('isColorNode')) {
                        node.lock();
                    }
                });
            }, 100);

        } catch (error) {
            console.error("Erreur lors du chargement du graphe :", error.message);
        }
    });

    addDynamicButton(dynamicButtons, 'Valider la Coloration', 'validate-graph-btn', () => validateGraphLibre(cyLibre, optimalColorCount));
    addDynamicButton(dynamicButtons, 'Réinitialiser la Coloration', 'reset-colors-btn', resetColorsLibre);

    function addInfiniteColorTokens(colorsConfig, cy) {
        let currentXPosition = 50;

        colorsConfig.forEach(({ color, count }) => {

            count = 1;

            for (let i = 0; i < count; i++) {
                createColorToken(color, currentXPosition, 50, cy);
                currentXPosition += 50;
            }
        });

        cy.layout({ name: 'preset' }).run();
    };

    function createColorToken(color, x, y, cy) {

        const token = cy.add({
            group: 'nodes',
            data: { id: `color-${color}-${Math.random()}`, isColorNode: true },
            position: { x, y },
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

        token.on('grab', () => {
            draggedColor = color;
            createColorToken(color, x, y, cy);
        });
    }

    cyLibre.on('free', 'node', (evt) => {
        const colorNode = evt.target;

        if (closestNode && draggedColor) {
            const currentColor = rgbToHex(closestNode.style('background-color'));

            if (currentColor === defaultColor) {
                closestNode.style('background-color', draggedColor);
                closestNode.style('border-color', '#666');
                cyLibre.remove(colorNode);
            }
        } else {
            cyLibre.remove(colorNode);
        }

        draggedColor = null;
        closestNode = null;
    });

    cyLibre.on('mousemove', (evt) => {
        if (draggedColor) {
            let closest = null;
            let minDistance = Infinity;

            cyLibre.nodes().forEach((node) => {
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

    cyLibre.on('cxttap', 'node', (evt) => {
        const node = evt.target;
        const currentColor = node.style('background-color');
        const isColorNode = node.data('isColorNode');

        if (currentColor === defaultColor || isColorNode) return;

        node.style('background-color', defaultColor);
    });

    cyLibre.on('tapdragout', 'node', (evt) => {
        if (!closestNode && draggedColor) {
            cyLibre.remove(evt.target);
        }
    });
};

function validateGraphLibre(cy, optimalColorCount) {
    const defaultColor = '#cccccc';
    let isCompleted = true;
    let isValid = true;
    let usedColors = new Set();

    cy.nodes().forEach((node) => {
        if (node.data('isColorNode')) return;

        const nodeColor = node.style('background-color');
        let hexNodeColor = '';

        if (nodeColor.startsWith('rgb')) {
            hexNodeColor = rgbToHex(nodeColor);
        }

        if (hexNodeColor === defaultColor) {
            isCompleted = false;
        } else {
            usedColors.add(hexNodeColor);
        }

        node.connectedEdges().forEach((edge) => {
            const neighbor = edge.source().id() === node.id() ? edge.target() : edge.source();
            if (!neighbor.data('isColorNode') && neighbor.style('background-color') === nodeColor) {
                isValid = false;
            }
        });
    });

    if (!isCompleted) {
        Swal.fire({
            icon: "warning",
            title: "Attention !",
            text: "Le graphe n'est pas entièrement coloré.",
        });
    } else if (!isValid) {
        Swal.fire({
            icon: "error",
            title: "Erreur !",
            text: "Deux sommets adjacents ont la même couleur.",
        });
    } else {

        if (usedColors.size > optimalColorCount) {
            Swal.fire({
                icon: "success",
                title: "Félicitations !",
                text: "Bravo, la coloration est valide, êtes-vous sûr que vous ne pouvez pas utiliser moins de couleurs ?",
            });
        }else{
            Swal.fire({
                icon: "success",
                title: "Félicitations !",
                text: "Bravo, la coloration est valide, vous avez utilisé le moins de couleurs possible.",
            });
        }
    }
}
