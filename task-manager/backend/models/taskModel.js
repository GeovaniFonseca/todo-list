const pool = require('../config/db');

const Task = {
  getAllTasks: async (userId) => {
    let conn;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query('SELECT * FROM tasks WHERE user_id = ?', [userId]);
      return rows;
    } catch (err) {
      console.error('Error getting all tasks:', err);
      throw err;
    } finally {
      if (conn) conn.release();
    }
  },
  getTaskById: async (id, userId) => {
    let conn;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [id, userId]);
      return rows[0];
    } catch (err) {
      console.error('Error getting task by ID:', err);
      throw err;
    } finally {
      if (conn) conn.release();
    }
  },
  createTask: async (task) => {
    let conn;
    try {
      conn = await pool.getConnection();
      const res = await conn.query('INSERT INTO tasks (title, description, user_id) VALUES (?, ?, ?)', [task.title, task.description, task.user_id]);
      console.log('Task inserted:', res);
      return res.insertId;
    } catch (err) {
      console.error('Error creating task:', err);
      throw err;
    } finally {
      if (conn) conn.release();
    }
  },
  updateTask: async (id, task) => {
    let conn;
    try {
      conn = await pool.getConnection();
      await conn.query('UPDATE tasks SET title = ?, description = ?, completed = ? WHERE id = ? AND user_id = ?', [task.title, task.description, task.completed, id, task.user_id]);
    } catch (err) {
      console.error('Error updating task:', err);
      throw err;
    } finally {
      if (conn) conn.release();
    }
  },
  completeTask: async (id, userId, completed) => {
    let conn;
    try {
      conn = await pool.getConnection();
      await conn.query('UPDATE tasks SET completed = ? WHERE id = ? AND user_id = ?', [completed, id, userId]);
    } catch (err) {
      console.error('Error completing task:', err);
      throw err;
    } finally {
      if (conn) conn.release();
    }
  },
  deleteTask: async (id, userId) => {
    let conn;
    try {
      conn = await pool.getConnection();
      await conn.query('DELETE FROM tasks WHERE id = ? AND user_id = ?', [id, userId]);
    } catch (err) {
      console.error('Error deleting task:', err);
      throw err;
    } finally {
      if (conn) conn.release();
    }
  },
};

module.exports = Task;
