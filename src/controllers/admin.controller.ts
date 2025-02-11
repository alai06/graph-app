import adminModel from '@/models/admin.model';

import type { Request, Response } from 'express';

export const getAdmins = async (req: Request, res: Response) => {
	try {
		const graphs = await adminModel.find();
		res.json(graphs);
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
};