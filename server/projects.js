import express from 'express';
import { createProject, getProjectsByUserId, getProjectById, updateProject, deleteProject } from './db.js';
import { authenticateToken } from './middleware.js';

const router = express.Router();

// Get all projects for logged in user
router.get('/', authenticateToken, (req, res) => {
    try {
        const projects = getProjectsByUserId(req.user.id);
        res.json(projects);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

// Create new project
router.post('/', authenticateToken, (req, res) => {
    const { name } = req.body;
    try {
        const result = createProject(req.user.id, name || 'Untitled Project');
        res.json({ id: result.lastInsertRowid, name: name || 'Untitled Project', message: 'Project created' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create project' });
    }
});

// Get single project
router.get('/:id', authenticateToken, (req, res) => {
    try {
        const project = getProjectById(req.params.id);
        if (!project) return res.status(404).json({ error: 'Project not found' });

        // Ensure user owns project
        if (project.user_id !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });

        res.json(project);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update project content (Auto-save)
router.put('/:id', authenticateToken, (req, res) => {
    const { content, preview } = req.body;
    try {
        const project = getProjectById(req.params.id);
        if (!project) return res.status(404).json({ error: 'Project not found' });
        if (project.user_id !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });

        updateProject(req.params.id, JSON.stringify(content), preview);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to save project' });
    }
});

// Delete project
router.delete('/:id', authenticateToken, (req, res) => {
    try {
        const project = getProjectById(req.params.id);
        if (!project) return res.status(404).json({ error: 'Project not found' });
        if (project.user_id !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });

        deleteProject(req.params.id);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete project' });
    }
});

export default router;
