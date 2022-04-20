import { Request, Response } from "express";
import moment from "moment";
import { GlucoseRecord, GlucoseRecordUpdateType } from "../models/glucose-record";
import { create, listByUser, remove, update } from "../services/glucose-record-service";
class GlucoseRecordController {

    async list(request: Request, response: Response) {
        try {
            const pageWidth = 5;
            const page = Number(request.query.page);
            const { id } = request.body.user_info;
            if (isNaN(page)) {
                return response.status(400).end('Bad Request');
            }

            const data = await listByUser(id, pageWidth, page);

            return response.status(200).json(data).end();
        }
        catch (e) {
            return response.status(500).end('Internal Server Error');
        }
    };

    async create(request: Request, response: Response) {
        try {
            const {
                gl_per_dl,
                was_there_consumption,
                consumption,
                insulin_doses_used,
                user_info
            } = request.body;

            const glucose_record = new GlucoseRecord(
                0,
                gl_per_dl,
                was_there_consumption,
                consumption,
                insulin_doses_used,
                user_info.id
            );

            await create(glucose_record);

            return response.status(201).end('Created');
        }
        catch (e) {
            return response.status(500).end('Internal Server Error');
        }
    };

    async update(request: Request, response: Response) { 
        try {
            const updateData = request.body;
            const user_id = updateData.user_info.id;

            delete updateData.user_info,
                   updateData.id,
                   updateData.created_at,
                   updateData.updated_at;

            const glucose_record: GlucoseRecordUpdateType = request.body;

            const id = Number(request.params.id);
            if(isNaN(id)){
                return response.status(400).end('Internal Server Error');
            }

            await update(id, user_id, glucose_record);

            return response.status(200).end('OK');
        }
        catch (e: any) {
            if(e.message.includes('Unknown arg')){
                return response.status(400).end('Bad Request');
            }
            return response.status(500).end('Internal Server Error');
        }
    };

    async delete(request: Request, response: Response) { 
        try {
            const id = Number(request.params.id);
            const user_id = request.body.user_info.id;

            if(isNaN(id)){
                return response.status(400).end('Internal Server Error');
            }

            await remove(id, user_id);

            return response.status(200).end('OK');
        }
        catch (e: any) {
            if(e.message.includes('Unknown arg')){
                return response.status(400).end('Bad Request');
            }
            return response.status(500).end('Internal Server Error');
        }
    };
}

export default GlucoseRecordController;