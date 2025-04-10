// Import
import { Schema, model } from 'mongoose';

const graphSchema = new Schema({
	name: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
	data: {
		nodes: [],
		edges: []
	},
	color_edge: { type: String, required: true },
    difficulty: {
        type: String,
        enum: ['Facile', 'Moyen', 'Difficile', 'Impossible'],
        required: true
    },
	optimalColoring: { type: Number, required: true },
	pastilleCounts: { type: Object, required: true },
}, { timestamps: true });

// Export
export default model('Graph', graphSchema);