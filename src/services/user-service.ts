import { PrismaClient } from '@prisma/client';
import moment from 'moment';
import User from '../models/user';

const database = new PrismaClient();

async function create(obj: User) {
    try {
        const response = await database.user.create({
            data: {
                name: obj.name as string,
                email: obj.email as string,
                login: obj.login as string,
                password: obj.password as string,
                active: true,
                created_at: new Date(moment().format('YYYY-MM-DD H:mm:ss')),
                updated_at: new Date(moment().format('YYYY-MM-DD H:mm:ss'))
            }
        });
        return response;
    }
    catch (e: any) {
        throw e;
    }
}

async function update(id: number, obj: User) {
    try {
        const response = await database.user.update({
            where: { id },
            data: {
                name: obj.name,
                email: obj.email,
                login: obj.login,
                active: obj.active,
                password: obj.password,
                updated_at: new Date(moment().format('YYYY-MM-DD H:mm:ss'))
            }
        });
        return response;
    }
    catch (e: any) {
        throw e;
    }
}

async function findOne(filters: any) {
    try {
        const user = await database.user.findFirst({
            where: {
                OR: [
                    { login: filters.login },
                    { email: filters.login }
                ],
                AND: { active: true }
            }
        });
        return user;
    }
    catch (e: any) {
        throw e;
    }
}

async function getDashboardData(user_id: number) {
    try {
        const todayAverageQuery = await database.$queryRaw`
            select count(*) as count, FLOOR(avg(mg_per_dl)) as average from (select mg_per_dl from glucose_record where current_date() = (DATE_FORMAT(created_at, "%Y-%m-%d")) and user_id = ${user_id}) regs;
        `;
        const todayInsulin_doses_usedQuery = await database.$queryRaw`
            select count(*) as count, sum(insulin_doses_used) as today_insulin_doses_used from glucose_record where current_date() = (DATE_FORMAT(created_at, "%Y-%m-%d")) and user_id = ${user_id} group by DATE_FORMAT(created_at, "%Y-%m-%d");
        `;
        const weekAverageQuery = await database.$queryRaw`
            select count(*) as count, FLOOR(avg(mg_per_dl)) as average from (select mg_per_dl from glucose_record where DATE_FORMAT(current_date(), '%Y') = (DATE_FORMAT(created_at, '%Y')) and WEEK(current_date()) = week(created_at) and user_id = ${user_id}) regs;
        `;
        const monthAverageQuery = await database.$queryRaw`
            select count(*) as count, FLOOR(avg(mg_per_dl)) as average from (select mg_per_dl from glucose_record where DATE_FORMAT(current_date(), '%Y-%m') = (DATE_FORMAT(created_at, '%Y-%m')) and user_id = ${user_id}) regs;
        `;
        const lastRegisterQuery = await database.$queryRaw`
            select mg_per_dl, date_format(created_at,'%d/%m/%Y %H:%i:%S') from glucose_record where user_id = ${user_id} order by created_at desc limit 1;
        `;

        return {
            todayAverage: todayAverageQuery[0],
            weekAverage: weekAverageQuery[0],
            monthAverage: monthAverageQuery[0],
            lastRegister: lastRegisterQuery[0],
            todayInsulin_doses_used: todayInsulin_doses_usedQuery[0]
        };
    }
    catch (e: any) {
        throw e;
    }
}

export { create, update, findOne, getDashboardData };