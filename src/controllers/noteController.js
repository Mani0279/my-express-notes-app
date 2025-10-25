import { pool } from '../config/database.js';

// Get all notes
export const getAllNotes = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM notes ORDER BY created_at DESC');
    res.json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    next(error);
  }
};

// Get note by ID
export const getNoteById = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM notes WHERE id = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }
    
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    next(error);
  }
};

// Create new note
export const createNote = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    
    // Validation
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required'
      });
    }
    
    if (title.trim().length === 0 || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Title and content cannot be empty'
      });
    }
    
    const [result] = await pool.query(
      'INSERT INTO notes (title, content) VALUES (?, ?)',
      [title.trim(), content.trim()]
    );
    
    // Fetch the created note
    const [newNote] = await pool.query('SELECT * FROM notes WHERE id = ?', [result.insertId]);
    
    res.status(201).json({
      success: true,
      message: 'Note created successfully',
      data: newNote[0]
    });
  } catch (error) {
    next(error);
  }
};

// Update note
export const updateNote = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const { id } = req.params;
    
    // Validation
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required'
      });
    }
    
    if (title.trim().length === 0 || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Title and content cannot be empty'
      });
    }
    
    // Check if note exists
    const [existingNote] = await pool.query('SELECT id FROM notes WHERE id = ?', [id]);
    
    if (existingNote.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }
    
    await pool.query(
      'UPDATE notes SET title = ?, content = ?, updated_at = NOW() WHERE id = ?',
      [title.trim(), content.trim(), id]
    );
    
    // Fetch updated note
    const [updatedNote] = await pool.query('SELECT * FROM notes WHERE id = ?', [id]);
    
    res.json({
      success: true,
      message: 'Note updated successfully',
      data: updatedNote[0]
    });
  } catch (error) {
    next(error);
  }
};

// Delete note
export const deleteNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if note exists
    const [existingNote] = await pool.query('SELECT * FROM notes WHERE id = ?', [id]);
    
    if (existingNote.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }
    
    await pool.query('DELETE FROM notes WHERE id = ?', [id]);
    
    res.json({
      success: true,
      message: 'Note deleted successfully',
      data: existingNote[0]
    });
  } catch (error) {
    next(error);
  }
};

// Search notes
export const searchNotes = async (req, res, next) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query parameter "q" is required'
      });
    }
    
    const searchTerm = `%${q}%`;
    const [rows] = await pool.query(
      'SELECT * FROM notes WHERE title LIKE ? OR content LIKE ? ORDER BY created_at DESC',
      [searchTerm, searchTerm]
    );
    
    res.json({
      success: true,
      count: rows.length,
      query: q,
      data: rows
    });
  } catch (error) {
    next(error);
  }
};
