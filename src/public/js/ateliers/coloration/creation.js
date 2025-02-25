import { initGraph, validateGraph, resetColorsLibre, generateRandomColors, isGraphConnected } from './functions.js';
import { addDynamicButton } from '../../functions.js';

export const initCreationMode = (dynamicButtons) => {
    
    const cyCustom = initGraph('cy-predefined', { zoomingEnabled: false, panningEnabled: false });
    const defaultColor = '#cccccc';

    let firstNode = null;

    addDynamicButton(dynamicButtons, 'Ajouter un sommet', 'add-node-btn', () => {
        const id = `n${cyCustom.nodes().length + 1}`;
        cyCustom.add({
            group: 'nodes',
            data: { id: id },
            position: { x: 200 + Math.random() * 300, y: 200 + Math.random() * 300 },
        });
    });

    addDynamicButton(dynamicButtons, 'Réinitialiser le graphe', 'reset-graph-btn', () => {
        Swal.fire({
            title: "Confirmer la suppression",
            text: `Voulez-vous vraiment rénitialiser le graphe ?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Oui, supprimer",
            cancelButtonText: "Annuler",
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
        }).then((result) => {
            if (result.isConfirmed) {
                cyCustom.elements().remove();
                firstNode = null;
                Swal.fire("Graphe réinitialisé !", "", "success");
            }
        });
    });

    addDynamicButton(dynamicButtons, 'Essayer le graphe', 'try-graph-btn', () => {
        if (!isGraphConnected(cyCustom)) {
            Swal.fire({
                title: "Sommets non reliés",
                text: "Tous les sommets doivent être reliés par des arêtes avant d'essayer le graphe.",
                icon: "error",
                confirmButtonText: "OK"
            });
            return;
        }

        const colorsNumber = generateRandomColors(cyCustom);
    
        if (colorsNumber.length > 12) {
            Swal.fire({
                title: "Trop de couleurs nécessaires",
                text: "Le graphe nécessite plus de 12 couleurs, ce qui dépasse la limite autorisée.",
                icon: "error",
                confirmButtonText: "OK"
            });
            return;
        }
        
        switchToLibreMode(cyCustom.json(), dynamicButtons);
    });    

    addDynamicButton(dynamicButtons, 'Réarranger le graphe', 'rearrange-graph-btn', () => {
        const layoutOptions = {
            name: 'circle',
            fit: true,
            padding: 30,
            avoidOverlap: true,
        };
        cyCustom.layout(layoutOptions).run();
    });    

    cyCustom.on('tap', 'node', (evt) => {
        const clickedNode = evt.target;

        if (!firstNode) {
            firstNode = clickedNode;
            highlightNode(firstNode);
        } else {
            if (clickedNode !== firstNode) {
                cyCustom.add({
                    group: 'edges',
                    data: { source: firstNode.id(), target: clickedNode.id() },
                });
            }

            resetHighlight(firstNode);
            firstNode = null;
        }
    });

    cyCustom.on('tap', (evt) => {
        if (evt.target === cyCustom) {
            if (firstNode) {
                resetHighlight(firstNode);
                firstNode = null;
            }
        }
    });

    document.addEventListener("contextmenu", (event) => event.preventDefault());

    cyCustom.container().addEventListener('contextmenu', (evt) => evt.preventDefault());

    cyCustom.on('cxttap', 'node, edge', (evt) => {
        const target = evt.target;
        Swal.fire({
            title: "Confirmer la suppression",
            text: `Voulez-vous vraiment supprimer ${target.isNode() ? 'ce sommet' : 'cette arête'} ?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Oui, supprimer",
            cancelButtonText: "Annuler",
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
        }).then((result) => {
            if (result.isConfirmed) {
                target.remove();
                Swal.fire("Supprimé!", "L'élément a été supprimé.", "success");
            }
        });
    });

    function highlightNode(node) {
        node.style('border-color', '#FFD700');
        node.style('border-width', '3px');
    }

    function resetHighlight(node) {
        node.style('border-color', '#666');
        node.style('border-width', '1px');
    }

    function switchToLibreMode(customGraph, dynamicButtons) {
        dynamicButtons.innerHTML = '';
        const cyLibre = initGraph('cy-predefined', { zoomingEnabled: false, panningEnabled: false });
    
        cyLibre.json(customGraph);
    
        cyLibre.nodes().forEach((node) => {
            if (!node.data('isColorNode')) {
                node.lock();
            }
        });
    
        addDynamicButton(dynamicButtons, 'Valider la Coloration', 'validate-graph-btn', () => validateGraph(cyLibre));
        addDynamicButton(dynamicButtons, 'Réinitialiser la Coloration', 'reset-colors-btn', () => resetColorsLibre(cyLibre));
    
        const colorsConfig = generateRandomColors(cyLibre);
        console.log(colorsConfig);
        addInfiniteColorTokens(colorsConfig, cyLibre);
    
        let draggedColor = null;
        let closestNode = null;
        const snapDistance = 50;
    
        function addInfiniteColorTokens(colorsConfig, cy) {
            let currentXPosition = 50;
    
            colorsConfig.forEach(({ color }) => {
                createColorToken(color, currentXPosition, 50, cy);
                currentXPosition += 50;
            });
    
            cy.layout({ name: 'preset' }).run();
        }
    
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
                closestNode.style('background-color', draggedColor);
                closestNode.style('border-color', '#666');
            }
    
            cyLibre.remove(colorNode);
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
    
        cyLibre.on('tapdragout', 'node', (evt) => {
            if (!closestNode && draggedColor) {
                cyLibre.remove(evt.target);
            }
        });
    
        cyLibre.on('tap', (evt) => {
            if (!evt.target.data('isColorNode')) {
                closestNode = null;
            }
        });

        cyLibre.on('cxttap', 'node', (evt) => {
            const node = evt.target;
            const currentColor = node.style('background-color');
    
            if (currentColor !== defaultColor) {
                node.style('background-color', defaultColor);
            }
        });
    }
};