import { Request, Response, urlencoded } from "express";
import { encrypt } from '../utils/cryptography';
import { create, update, findOne, getDashboardData } from "../services/user-service";
import { loginRegExp, mailRegExp } from "../utils/regex";
import { generateHashForAccountActivation, tokenInfo } from "../utils/auth";
import User from "../models/user";
import { sendAccountActivateEmail } from "../utils/mail/mail";

class UserController {

    async create(request: Request, response: Response) {

        const { name, email, login, password } = request.body;

        const user = new User(0, name, email, login, password);
        user.password = encrypt(password);

        const validation = user.validate();
        if (validation.valid) {

            user.active = true; // ignora ativação por email

            const createdUser = await create(user);

            // const activeAccountHash = generateHashForAccountActivation(createdUser);

            // const baseUrl = request.protocol + '://' + request.get('host');
            // const urlToSend = `${baseUrl}/user/activateAccount?token=${activeAccountHash}`

            // await sendAccountActivateEmail(email, { name, url: urlToSend });

            return response.status(201).end('Created');
        }
        else {
            return response.status(400).json(validation.errors).end('Bad Request');
        }
    };

    async update(request: Request, response: Response) {
        const { user_info, name, email, login, password } = request.body;

        const user = new User(0, name, email, login, password);

        const validation = user.validate();

        if (validation.valid) {
            await update(user_info.id, user);

            return response.status(201).end();
        }
        else {
            return response.status(400).json(validation.errors).end('Bad Request');
        }
    };

    async emailExists(request: Request, response: Response) {
        const email = request.query.email;

        if (email) {
            const data = await findOne({ email });

            return response.status(200).json({
                email,
                valid: mailRegExp.test(email as string),
                notExists: !!!data?.id
            });
        } else {
            return response.status(400).end();
        }

    };

    async loginExists(request: Request, response: Response) {
        const login = request.query.login;

        if (login) {
            const data = await findOne({ login });

            return response.status(200).json({
                login,
                valid: loginRegExp.test(login as string),
                notExists: !!!data?.id
            });
        } else {
            return response.status(400).end();
        }
    };

    async activateAccount(request: Request, response: Response) {
        try {
            const token = request.query.token;

            const { valid, result } = tokenInfo(token as string)

            if (!valid) {
                return response.status(401).end('Unauthorized');
            }
            else {
                const user = result.user as User;
                user.active = true;
                await update(user.id as number, user);
                return response.status(200).end('Account Activated');
            }
        }
        catch (e: any) {
            return response.status(500).end('Internal Server Error');
        }
    };


    async getDashboardData(request: Request, response: Response) {
        try {
            const user_id = request.body.user_info.id;

            const data = await getDashboardData(user_id);

            return response.status(200).json(data);
        }
        catch (e: any) {
            return response.status(500).end('Internal Server Error');
        }
    }
}

export default UserController;