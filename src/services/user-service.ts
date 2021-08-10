import { PrismaClient } from '@prisma/client';
import User from '../models/user';

const database = new PrismaClient();

async function create(obj: User) {
    try {
        await database.user.create({
            data: {
                name: obj.name,
                email: obj.email,
                login: obj.login,
                password: obj.password
            }
        });
    }
    catch (e: any) {
        throw e;
    }
}

async function update(obj: User) {
    try {
        await database.user.update({
            where: { id: obj.id },
            data: {
                name: obj.name,
                email: obj.email,
                login: obj.login,
                password: obj.password
            }
        });
    }
    catch (e: any) {
        throw e;
    }
}

async function findOne(filters: any) {
    try {
        const user = await database.user.findFirst({ where: filters });
        return user;
    }
    catch (e: any) {
        throw e;
    }
}

export { create, update, findOne };