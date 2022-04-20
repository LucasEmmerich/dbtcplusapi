import { PrismaClient } from '@prisma/client';
import { GlucoseRecord, GlucoseRecordUpdateType } from '../models/glucose-record';
import moment from 'moment';

const database = new PrismaClient();

async function listByUser(id: number, pageWidth: number, page: number) {
    try {
        const queryData = await database.glucose_record.findMany({
            where: {
                user_id: id
            },
            orderBy: {
                created_at: 'desc'
            },
            skip: pageWidth * (page - 1),
            take: pageWidth
        });

        const data = queryData.map((glr: any) => {
            return new GlucoseRecord(
                glr.id,
                glr.gl_per_dl,
                glr.was_there_consumption,
                glr.consumption,
                glr.insulin_doses_used,
                glr.user_id,
                moment(glr.created_at).format('DD/MM/YYYY H:mm:s'),
                moment(glr.updated_at).format('DD/MM/YYYY H:mm:s'),
            );
        })

        return data;
    }
    catch (e: any) {
        throw e;
    }
};

async function create(obj: GlucoseRecord) {
    try {
        const { id } = await database.glucose_record.create({
            data: {
                gl_per_dl: obj.gl_per_dl,
                insulin_doses_used: obj.insulin_doses_used,
                user_id: obj.user_id,
                was_there_consumption: obj.was_there_consumption,
                consumption: obj.consumption,
                created_at: new Date(moment().subtract(3,'hours').format('YYYY-MM-DD H:m:s')),
                updated_at: new Date(moment().subtract(3,'hours').format('YYYY-MM-DD H:m:s'))
            }
        });
        return id;
    }
    catch (e: any) {
        console.log(e)
        throw e;
    }
};

async function update(id: number, user_id: number, obj: GlucoseRecordUpdateType) {
    try {
        await database.glucose_record.updateMany({
            where: { 
                user_id, 
                id 
            },
            data: obj,
        });
    }
    catch (e: any) {
        throw e;
    }
}

async function remove(id: number, user_id: number) { 
    try {
        await database.glucose_record.deleteMany({
            where: { 
                user_id, 
                id 
            }
        });
    }
    catch (e: any) {
        if(e.code === 'P2025') return;
        throw e;
    }
}

export {
    create,
    update,
    remove,
    listByUser
}