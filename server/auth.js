import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { createUser, findUserByEmail, findUserByVerificationToken, verifyUser, findOrCreateOAuthUser } from './db.js';
import { sendVerificationEmail } from './mailer.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_change_me';

// --- Local Auth ---

router.post('/register', async (req, res) => {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
        return res.status(400).json({ error: 'Missing fields' });
    }

    const existingUser = findUserByEmail(email);
    if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    try {
        createUser(email, hashedPassword, name, verificationToken);
        await sendVerificationEmail(email, verificationToken);
        res.json({ message: 'Registration successful. Please check your email to verify your account.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = findUserByEmail(email);

    if (!user || !user.password) { // !user.password means it might be an OAuth-only user
        return res.status(400).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return res.status(400).json({ error: 'Invalid credentials' });
    }

    if (!user.verified) {
        return res.status(403).json({ error: 'Email not verified. Please check your inbox.' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar } });
});

router.get('/verify', (req, res) => {
    const { token } = req.query;
    if (!token) return res.status(400).json({ error: 'Missing token' });

    const user = findUserByVerificationToken(token);
    if (!user) {
        return res.status(400).json({ error: 'Invalid or expired token' });
    }

    verifyUser(user.id);
    res.json({ success: true, message: 'Email verified successfully' });
});

// --- OAuth Placeholders (Manual Implementation) ---

// GOOGLE
router.get('/google', (req, res) => {
    const client_id = process.env.GOOGLE_CLIENT_ID;
    const redirect_uri = 'http://localhost:3001/api/auth/google/callback';
    const scope = 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email';

    if (!client_id) return res.status(500).send("Missing GOOGLE_CLIENT_ID in server env");

    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=${scope}`;
    res.redirect(url);
});

router.get('/google/callback', async (req, res) => {
    const { code } = req.query;
    if (!code) return res.status(400).send('No code provided');

    try {
        // Exchange code for token
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                code,
                grant_type: 'authorization_code',
                redirect_uri: 'http://localhost:3001/api/auth/google/callback'
            })
        });
        const tokenData = await tokenResponse.json();

        // Get User Info
        const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { Authorization: `Bearer ${tokenData.access_token}` }
        });
        const userData = await userResponse.json();

        const user = findOrCreateOAuthUser({
            email: userData.email,
            name: userData.name,
            id: userData.id,
            avatar: userData.picture
        }, 'google');

        const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });

        // Redirect to frontend with token
        res.redirect(`http://localhost:5173/login?token=${token}`);

    } catch (err) {
        console.error('Google Auth Error:', err);
        res.redirect('http://localhost:5173/login?error=google_auth_failed');
    }
});

// GITHUB
router.get('/github', (req, res) => {
    const client_id = process.env.GITHUB_CLIENT_ID;
    const redirect_uri = 'http://localhost:3001/api/auth/github/callback';

    if (!client_id) return res.status(500).send("Missing GITHUB_CLIENT_ID in server env");

    const url = `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=user:email`;
    res.redirect(url);
});

router.get('/github/callback', async (req, res) => {
    const { code } = req.query;
    if (!code) return res.status(400).send('No code provided');

    try {
        // Exchange code for token
        const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
            })
        });
        const tokenData = await tokenResponse.json();

        // Get User Info
        const userResponse = await fetch('https://api.github.com/user', {
            headers: { Authorization: `Bearer ${tokenData.access_token}` }
        });
        const userData = await userResponse.json();

        // Get Email if private
        let email = userData.email;
        if (!email) {
            const emailsResponse = await fetch('https://api.github.com/user/emails', {
                headers: { Authorization: `Bearer ${tokenData.access_token}` }
            });
            const emails = await emailsResponse.json();
            email = emails.find(e => e.primary).email;
        }

        const user = findOrCreateOAuthUser({
            email: email,
            name: userData.name || userData.login,
            id: userData.id.toString(),
            avatar: userData.avatar_url
        }, 'github');

        const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });

        // Redirect to frontend with token
        res.redirect(`http://localhost:5173/login?token=${token}`);

    } catch (err) {
        console.error('GitHub Auth Error:', err);
        res.redirect('http://localhost:5173/login?error=github_auth_failed');
    }
});

export default router;
