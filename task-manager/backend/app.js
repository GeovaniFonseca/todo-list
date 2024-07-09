const express = require('express');
const cors = require('cors');
const app = express();
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');

// Configurar CORS
app.use(cors());

app.use(express.json());
app.use('/api', taskRoutes);
app.use('/api/users', userRoutes);

module.exports = app;
