import { prisma, PrismaClient } from '@prisma/client';
import { GlucoseRecord, GlucoseRecordUpdateType } from '../models/glucose-record';
import moment from 'moment';

const database = new PrismaClient();

async function listByUser(id: number, pageWidth: number, page: number) {
    try {
        const contentLength = await database.glucose_record.count({ where: { user_id: id } });
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

        const records = queryData.map((glr: any) => {
            return new GlucoseRecord(
                glr.id,
                glr.mg_per_dl,
                glr.was_there_consumption,
                glr.consumption,
                glr.insulin_doses_used,
                glr.user_id,
                moment(glr.created_at).format('DD/MM/YYYY HH:mm:ss'),
                moment(glr.updated_at).format('DD/MM/YYYY HH:mm:ss'),
            );
        })

        return { records, contentLength };
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
                created_at: new Date(moment(obj.created_at || new Date()).subtract(3, 'hours').format('YYYY-MM-DD H:m:ss')), //dps ver pq caralhos essa data vem errada
                updated_at: new Date(moment().subtract(3, 'hours').format('YYYY-MM-DD H:m:ss'))
            }
        });
        return id;
    }
    catch (e: any) {
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
        if (e.code === 'P2025') return;
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
            and was_there_consumption = 1 
            order by LENGTH(longest_common_substring( ${q} , consumption)) desc
            LIMIT 10;
        `;
        return result.map((x: any) => x.consumption);
    }
    catch (e: any) {
        throw e;
    }
}

async function getBestDosages(consumption: string, user_id: number, glycemic_goal: number = 100) {
    try {
        const result = await database.$queryRaw`
        select *from
        (
            select 
            id, 
            ABS(mg_per_dl - ${glycemic_goal}) as ranking,
            mg_per_dl, 
            TIMESTAMPDIFF(MINUTE,LAG(created_at, 1) over (order by created_at), created_at) as minutes_diff,
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
        having q1.minutes_diff <= 300
        `;

        return result;
    }
    catch (e: any) {
        throw e;
    }
}

async function getDailyDosesReport(user_id: number, filters: { initial_date: string, end_date: string }) {
    try {
        const result = await database.$queryRaw`
            select date_format(created_at,'%d/%m/%Y') as created_at,
            DATE(created_at) as date_to_order,
            sum(insulin_doses_used) as insulin_doses_used,
            CONCAT(min(insulin_doses_used), ' - ', max(insulin_doses_used)) as min_max_insulin_doses_used,
            count(insulin_doses_used) as count

            from glucose_record
            where user_id = ${user_id}
            and created_at >= ${filters.initial_date + ' 00:00:00'} and created_at <= ${filters.end_date + ' 23:59:59'}
            and insulin_doses_used > 0
            group by date_format(created_at,'%d/%m/%Y') 
            order by date_to_order desc;
        `;
        return result;
    }
    catch (e: any) {
        console.log(e)
        throw e;
    }
}

async function getDailyGlycemiaAverageReport(user_id: number, filters: { initial_date: string, end_date: string }) {
    try {
        const result = await database.$queryRaw`
            select date_format(created_at,'%d/%m/%Y') as created_at,
            DATE(created_at) as date_to_order,
            avg(mg_per_dl) as daily_mg_per_dl,
            CONCAT(min(mg_per_dl), ' - ', max(mg_per_dl)) as min_max_mg_per_dl,
            count(mg_per_dl) as count

            from glucose_record
            where user_id = ${user_id}
            and created_at >= ${filters.initial_date + ' 00:00:00'} and created_at <= ${filters.end_date + ' 23:59:59'}
            group by date_format(created_at,'%d/%m/%Y')
            order by date_to_order desc;
        `;
        return result;
    }
    catch (e: any) {
        console.log(e)
        throw e;
    }
}

export {
    create,
    update,
    remove,
    listByUser,
    listConsumption,
    getBestDosages,
    getDailyDosesReport,
    getDailyGlycemiaAverageReport,
}