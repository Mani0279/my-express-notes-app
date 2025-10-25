import { Router } from 'express';
const router = Router();
import { searchNotes, getAllNotes, getNoteById, createNote, updateNote, deleteNote } from '../controllers/noteController.js';

// Search notes (must be before /:id route)
router.get('/search', searchNotes);

// Get all notes
router.get('/', getAllNotes);

// Create new note
router.post('/', createNote);

// Get note by ID
router.get('/:id', getNoteById);

// Update note
router.put('/:id', updateNote);

// Delete note
router.delete('/:id', deleteNote);

export default router;

