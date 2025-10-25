import { pool } from '../config/database.js';

// Get all notes
export const getAllNotes = async () => {
  try {
    const [rows] = await pool.query(
      'SELECT id, title, content, created_at FROM notes ORDER BY created_at DESC'
    );
    return rows;
  } catch (error) {
    throw new Error('Error fetching notes: ' + error.message);
  }
};

// Get note by ID
export const getNoteById = async (id) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, title, content, created_at FROM notes WHERE id = ?',
      [id]
    );
    return rows[0];
  } catch (error) {
    throw new Error('Error fetching note: ' + error.message);
  }
};

// Create new note
export const createNote = async (title, content) => {
  try {
    const [result] = await pool.query(
      'INSERT INTO notes (title, content) VALUES (?, ?)',
      [title, content]
    );
    
    // Fetch and return the created note
    const [rows] = await pool.query(
      'SELECT id, title, content, created_at FROM notes WHERE id = ?',
      [result.insertId]
    );
    return rows[0];
  } catch (error) {
    throw new Error('Error creating note: ' + error.message);
  }
};

// Update note
export const updateNote = async (id, title, content) => {
  try {
    const [result] = await pool.query(
      'UPDATE notes SET title = ?, content = ? WHERE id = ?',
      [title, content, id]
    );
    
    if (result.affectedRows === 0) {
      return null;
    }
    
    // Fetch and return the updated note
    const [rows] = await pool.query(
      'SELECT id, title, content, created_at FROM notes WHERE id = ?',
      [id]
    );
    return rows[0];
  } catch (error) {
    throw new Error('Error updating note: ' + error.message);
  }
};

// Delete note
export const deleteNote = async (id) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM notes WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  } catch (error) {
    throw new Error('Error deleting note: ' + error.message);
  }
};

// Search notes by title or content
export const searchNotes = async (query) => {
  try {
    const searchQuery = `%${query}%`;
    const [rows] = await pool.query(
      'SELECT id, title, content, created_at FROM notes WHERE title LIKE ? OR content LIKE ? ORDER BY created_at DESC',
      [searchQuery, searchQuery]
    );
    return rows;
  } catch (error) {
    throw new Error('Error searching notes: ' + error.message);
  }
};
