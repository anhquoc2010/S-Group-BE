import crypto from 'crypto';

export { hashPassword, comparePassword };

function hashPassword(plainPassword) {
    // Generate random salt
    const salt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = crypto.pbkdf2Sync(plainPassword, salt, 1000, 64, 'sha1').toString('hex');

    return {
        salt,
        hashedPassword
    };
}

function comparePassword(plainPassword, hashedPassword, salt) {
    const hash = crypto.pbkdf2Sync(plainPassword, salt, 1000, 64, 'sha1').toString('hex');

    return hash === hashedPassword;
}