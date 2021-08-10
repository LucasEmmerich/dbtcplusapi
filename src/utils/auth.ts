import { encode, decode, TAlgorithm } from "jwt-simple";

interface IConfig {
    algorithm: TAlgorithm,
    key: string
};
const config: IConfig = {
    algorithm: 'HS512',
    key: 'only_for_government_tender'
};

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

export { generate, tokenInfo };