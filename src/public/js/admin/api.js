const API_BASE_URL = '/api/graph';

export const fetchGraphs = async () => {

	try {
		const response = await fetch(API_BASE_URL);

		if (!response.ok) {
			throw new Error('Error fetching graphs');
		};

		return response.json();

	} catch (error) {
		console.error(`Error fetching graphs: ${error}`);
	};

	const response = await fetch(API_BASE_URL);
	return response.json();
};

export const addGraph = async (graphPayload) => {
	try {
		const response = await fetch(API_BASE_URL, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(graphPayload),
		});

		if (!response.ok) {
			throw new Error('Error adding graph');
		}

		return response.json();
	} catch (error) {
		console.error(`Error adding graph: ${error}`);
	}
};

export const editGraph = async (id, graphPayload) => {
	try {
		const response = await fetch(`${API_BASE_URL}/${id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(graphPayload),
		});

		if (!response.ok) {
			throw new Error('Error editing graph');
		}

		return response.json();
	} catch (error) {
		console.error(`Error editing graph: ${error}`);
	}
};

export const deleteGraph = async (id) => {
	try {
		const response = await fetch(`${API_BASE_URL}/${id}`, {
			method: 'DELETE',
		});

		if (!response.ok) {
			throw new Error('Error deleting graph');
		}

		return response.ok;
	} catch (error) {
		console.error(`Error deleting graph: ${error}`);
	}
};