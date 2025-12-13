import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';

const db = new Database('aurora.db');

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    name TEXT,
    verified INTEGER DEFAULT 0,
    verification_token TEXT,
    provider TEXT DEFAULT 'local',
    google_id TEXT,
    github_id TEXT,
    avatar TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name TEXT,
    content TEXT,
    preview TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )
`);

export const createProject = (userId, name, content = '[]', preview = '') => {
    const stmt = db.prepare('INSERT INTO projects (user_id, name, content, preview) VALUES (?, ?, ?, ?)');
    return stmt.run(userId, name, content, preview);
};

export const getProjectsByUserId = (userId) => {
    const stmt = db.prepare('SELECT * FROM projects WHERE user_id = ? ORDER BY updated_at DESC');
    return stmt.all(userId);
};

export const getProjectById = (id) => {
    const stmt = db.prepare('SELECT * FROM projects WHERE id = ?');
    return stmt.get(id);
};

export const updateProject = (id, content, preview) => {
    const stmt = db.prepare('UPDATE projects SET content = ?, preview = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
    return stmt.run(content, preview, id);
};

export const deleteProject = (id) => {
    const stmt = db.prepare('DELETE FROM projects WHERE id = ?');
    return stmt.run(id);
};

export const createUser = (email, password, name, token, provider = 'local', googleId = null, githubId = null, avatar = null) => {
    const stmt = db.prepare('INSERT INTO users (email, password, name, verification_token, provider, google_id, github_id, avatar) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    const info = stmt.run(email, password, name, token, provider, googleId, githubId, avatar);
    return info.lastInsertRowid;
};

export const findUserByEmail = (email) => {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email);
};

export const findUserById = (id) => {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(id);
};

export const findUserByVerificationToken = (token) => {
    const stmt = db.prepare('SELECT * FROM users WHERE verification_token = ?');
    return stmt.get(token);
};

export const verifyUser = (id) => {
    const stmt = db.prepare('UPDATE users SET verified = 1, verification_token = NULL WHERE id = ?');
    return stmt.run(id);
};

export const findOrCreateOAuthUser = (profile, provider) => {
    const email = profile.email;
    let user = findUserByEmail(email);

    if (user) {
        // Update provider ID if missing (linking accounts implicitly by email)
        const idField = provider === 'google' ? 'google_id' : 'github_id';
        if (!user[idField]) {
            const stmt = db.prepare(`UPDATE users SET ${idField} = ?, avatar = COALESCE(?, avatar), verified = 1 WHERE id = ?`);
            stmt.run(profile.id, profile.avatar, user.id);
            user[idField] = profile.id;
        }
        return user;
    }

    // Create new user
    const idField = provider === 'google' ? 'google_id' : 'github_id';
    const stmt = db.prepare(`INSERT INTO users (email, name, ${idField}, avatar, provider, verified) VALUES (?, ?, ?, ?, ?, 1)`);
    const info = stmt.run(email, profile.name, profile.id, profile.avatar, provider);
    return findUserById(info.lastInsertRowid);
};

export default db;
