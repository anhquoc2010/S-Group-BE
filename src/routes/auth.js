import { Router } from 'express';
const auth_router = Router();
import { db } from '../database/connection.js';
import { hashPassword, comparePassword, signToken } from '../helpers/hash.js';
import { mailService } from '../services/mail.js';
import crypto from 'crypto';

export { auth_router };

auth_router.post('/register', async (req, res) => {
    const {
        username,
        password,
        name,
        age,
        email,
        gender,
    } = req.body;

    db.query('SELECT * FROM users WHERE username = ?', [username],
        (err, rows) => {
            if (err) {
                return res.status(500).json({
                    message: 'Internal server error',
                    error: err
                });
            }

            const user = rows[0];

            if (user) {
                return res.status(400).json({
                    message: 'Username already exists'
                });
            }

            const {
                hashedPassword,
                salt,
            } = hashPassword(password);

            console.log({ hashedPassword, salt });

            db.query('INSERT INTO users SET ?', {
                username,
                password: hashedPassword,
                salt,
                name,
                age,
                email,
                gender,
            }, (err, _) => {
                if (err) {
                    return res.status(500).json({
                        message: 'Internal server error',
                        error: err
                    });
                }

                return res.status(201).json({
                    message: 'Register successfully'
                });
            });
        }
    );
});

auth_router.post('/login', async (req, res) => {
    //Get data from request body
    const {
        username,
        password,
    } = req.body;

    db.query('SELECT * FROM users WHERE username = ?', [username],
        (err, rows) => {
            if (err) {
                return res.status(500).json({
                    message: 'Internal server error',
                    error: err
                });
            }

            const user = rows[0];

            if (!user) {
                return res.status(400).json({
                    message: 'Username does not exist'
                });
            }

            const {
                password: hashedPassword,
                salt,
            } = user;

            console.log({ hashedPassword, salt });

            if (!comparePassword(password, hashedPassword, salt)) {
                return res.status(400).json({
                    message: 'Password is incorrect'
                });
            }

            const token = signToken(user);

            return res.status(200).json({
                message: 'Login successfully',
                token,
            });
        }
    );
});

auth_router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email],
        async (err, rows) => {
            if (err) {
                return res.status(500).json({
                    message: 'Internal server error',
                    error: err
                });
            }

            const user = rows[0];

            if (!user) {
                return res.status(400).json({
                    message: 'Email does not exist'
                });
            }

            const token = crypto.randomBytes(20).toString('hex');

            const expiration = new Date(Date.now() + 10 * 60 * 1000);

            db.query('UPDATE users SET passwordResetToken = ?, passwordResetExpiration = ? WHERE email = ?', [token, expiration, email],
                async (err, rows) => {
                    if (err) {
                        return res.status(500).json({
                            message: 'Internal server error',
                            error: err
                        });
                    }

                    try {
                        await mailService.sendMail({
                            emailFrom: process.env.EMAIL_FROM,
                            emailTo: email,
                            emailSubject: 'Reset password',
                            emailText: `Your reset password token is ${token}`,
                        });

                        return res.status(200).json({
                            message: 'Email sent successfully'
                        });
                    } catch (err) {
                        return res.status(500).json({
                            message: 'Internal server error',
                            error: err
                        });
                    }
                }
            );
        }
    );
});

auth_router.post('/reset-password', async (req, res) => {
    const { email, passwordResetToken, newPassword } = req.body;

    db.query('SELECT * FROM users WHERE email = ? AND passwordResetToken = ? AND passwordResetExpiration >= ?', [email, passwordResetToken, new Date(Date.now())],
        async (err, rows) => {
            if (err) {
                return res.status(500).json({
                    message: 'Internal server error',
                    error: err
                });
            }

            const user = rows[0];

            if (!user) {
                return res.status(400).json({
                    message: 'Invalid token'
                });
            }

            const { hashedPassword, salt } = hashPassword(newPassword);

            db.query('UPDATE users SET password = ?, salt = ?, passwordResetToken = NULL, passwordResetExpiration = NULL, passwordLastResetDate = ? WHERE email = ?', [hashedPassword, salt, new Date(Date.now()), email],
                async (err, rows) => {
                    if (err) {
                        return res.status(500).json({
                            message: 'Internal server error',
                            error: err
                        });
                    }

                    return res.status(200).json({
                        message: 'Reset password successfully'
                    });
                });
        })
});
