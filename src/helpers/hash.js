import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export { hashPassword, comparePassword, signToken, verifyToken };

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
    console.log({ plainPassword, hashedPassword, salt });
    const hash = crypto.pbkdf2Sync(plainPassword, salt, 1000, 64, 'sha1').toString('hex');

    console.log({ hash, hashedPassword });

    return hash === hashedPassword;
}

function signToken(user) {
    const token = jwt.sign({
        id: user.id,
        username: user.username,
        name: user.name,
        age: user.age,
        email: user.email,
        gender: user.gender,
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
    return token
}

function verifyToken(req, res, next) {
    const token = req.headers.authorization.split(' ')[1]

    try {
        var decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
        return res.status(401).json({
            error: err
        })
    }

    req.decoded = decoded
    next()
}