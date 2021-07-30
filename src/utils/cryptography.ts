function encrypt(password: string): string {
    const hash = require("crypto").createHash("sha256")
        .update(password).digest("hex");
    return hash
}

function verifyHash(text: string, hash: string): boolean {
    return encrypt(text) === hash;
}

export { verifyHash, encrypt }