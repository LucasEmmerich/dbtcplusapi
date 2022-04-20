import { encode, decode, TAlgorithm } from "jwt-simple";
interface IConfig {
    algorithm: TAlgorithm,
    key: string
};
const config: IConfig = {
    algorithm: 'HS512',
    key: process.env.SALT as string
};

const generateHashForAccountActivation = (user: any) => {
    const obj = { user, hashCreatedAt: new Date().getTime() };
    const hash = encode(obj, config.key, config.algorithm);
    return hash;
}

const readHashFromAccountActivation = (hash: string) => {
    try {
        const result = decode(hash, config.key, false, config.algorithm);
        return {
            valid: true,
            result
        };
    }
    catch (_e) {
        return {
            valid: false,
            result: _e
        };
    }
}

const generate = function (user: any) {
    const issued = new Date();
    const expires = issued.setFullYear(issued.getFullYear() + 1);
    const session = {
        user,
        issued: Number(issued),
        expires: Number(expires)
    };

    return {
        token: encode(session, config.key, config.algorithm),
        issued: issued,
        expires: expires
    };
};

const tokenInfo = function (token: string) {
    try {
        const result = decode(token, config.key, false, config.algorithm);
        return {
            valid: true,
            result
        };
    }
    catch (_e) {
        return {
            valid: false,
            result: _e
        };
    }
};

export { 
    generate, 
    tokenInfo, 
    generateHashForAccountActivation,
    readHashFromAccountActivation 
};