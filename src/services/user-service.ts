import { PrismaClient } from '@prisma/client';
import User from '../models/user';
import { encrypt } from '../utils/cryptography';

const getConnection = () => new PrismaClient();

const create = async function (email: string, login: string, password: string) {
    const user = new User(0, email, login, password);
    user.password = encrypt(user.password);
    await getConnection().user.create({
        data: {
            email: user.email,
            login: user.login,
            password: user.password
        }
    });
}

const update = async function () {

}

const remove = async function () {

}

export { create, update, remove };