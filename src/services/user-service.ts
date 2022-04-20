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
                created_at: new Date(moment().subtract(3,'hours').format('YYYY-MM-DD H:mm:s')),
                updated_at: new Date(moment().subtract(3,'hours').format('YYYY-MM-DD H:mm:s'))
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
                active:obj.active,
                password: obj.password,
                updated_at: new Date(moment().format('YYYY-MM-DD H:mm:s'))
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
        const user = await database.user.findFirst(
            { where: filters }
        );
        return user;
    }
    catch (e: any) {
        throw e;
    }
}

export { create, update, findOne };