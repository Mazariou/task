const express = require('express');
const Task = require('../models/Task');

const router = express.Router();

// Créer une tâche
router.post('/tasks', async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Récupérer toutes les tâches
router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mettre à jour une tâche
router.put('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Supprimer une tâche
router.delete('/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Tâche supprimée" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
const auth = require('../middleware/authMiddleware');

// Récupérer les tâches de l’utilisateur connecté
router.get('/tasks', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: "Erreur serveur" });
  }
});

// Créer une tâche pour l’utilisateur connecté
router.post('/tasks', auth, async (req, res) => {
  try {
    const newTask = new Task({ ...req.body, user: req.user });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ msg: "Erreur lors de la création de la tâche" });
  }
});
