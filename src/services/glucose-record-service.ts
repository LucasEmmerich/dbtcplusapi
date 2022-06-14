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
                glr.mg_per_dl,
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
                mg_per_dl: obj.mg_per_dl,
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

async function listConsumption(q: string, user_id: number) { 
    try {
        const result = await database.$queryRaw`
            SELECT DISTINCT(consumption) as consumption
            FROM 
            glucose_record 
            where user_id = ${user_id} 
            order by LENGTH(longest_common_substring( ${q} , consumption)) desc
            LIMIT 10;
        `;
        return result.map((x: any) => x.consumption);
    }
    catch (e: any) {
        throw e;
    }
}

async function getBestDosages(consumption: string, user_id: number) { 
    try {
        const glycemic_goal = 100;
        const result = await database.$queryRaw`
        select *from
        (
            select 
            id, 
            ABS(mg_per_dl - ${glycemic_goal}) as ranking,
            mg_per_dl, 
            was_there_consumption,
            consumption,
            insulin_doses_used,
            date_format(created_at,'%d/%m/%Y %H:%i:%S') as created_at,
            (mg_per_dl - LAG(mg_per_dl, 1) over (order by created_at)) as score,
            LAG(mg_per_dl, 1) over (order by created_at) as prev_mg_per_dl,
            LAG(insulin_doses_used, 1) over (order by created_at) as prev_insulin_doses_used,
            date_format(LAG(created_at, 1) over (order by created_at),'%d/%m/%Y %H:%i:%S') as prev_created_at
            from glucose_record
            where user_id = ${user_id}
            order by ranking
        ) as q1 where q1.consumption = ${consumption}
        `;

        //and TIMESTAMPDIFF(HOUR,q1.unformatted_prev_created_at, q1.unformatted_created_at) <= 5

        return result;
    }
    catch (e: any) {
        throw e;
    }
}

export {
    create,
    update,
    remove,
    listByUser,
    listConsumption,
    getBestDosages
}