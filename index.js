const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');

const { Note, User, Project } = require('./mongoose_models.js');

const app = express();
app.use(bodyParser.json());

// Conecto a MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/tp_arq_web_wsl');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Mongoose Connection error: "));
db.once("open", function () { console.log("MongoDB Connected Succesfully"); });

// Levanto el servidor?
const port = 3000
app.listen(port, () => {
  console.log(`Express server is running on port ${port}`);
});

// Defino un handler para el root
app.get('/', (req, res) => {
  res.send('Welcome to the Note Taking App API');
});

// ------------------------------- Notas -------------------------------
// Crear una nueva nota
app.post('/notes', async  (req, res) => {
  try {
    const { noteId, title, content, owner } = req.body;

    // Check if a note with the same noteId already exists
    const existingNote = await Note.findOne({ noteId });

    if (existingNote) {
      return res.status(409).json({ error: 'Ya existe una nota con ese id.' });
    }
  
    const newNote = new Note({
      noteId, 
      title, 
      content,
      owner
    });

    const savedNote = await newNote.save();
    res.json(savedNote);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Traer todas las notas
app.get("/notes", async (req, res) => {
  try {
    const notes = await Note.find({});
    let noteList = '';
    notes.forEach((n) => {
      noteList += `Note ID: ${n.noteId}\n Title: ${n.title} \n ${n.content}\n Creator: ${n.owner} \n --- \n`;
    }); 
    res.status(200).send(noteList);
  }
  catch (error) {
    res.status(400).send(error);
  }
});

// Traer todas las notas de un usuario específico
app.get("/notes/:owner", async (req, res) => {

  // Intenté hacerlo por query params pero me traía todas las notas de todos los users :(
  const owner = req.params.owner;
  
  try {
    const notes = await Note.find({ owner });
    let noteList = '';
    notes.forEach((n) => {
      noteList += `Note: ${n.noteId}\n Title: ${n.title} \n ${n.content}\n Creator: ${n.owner} \n --- \n`;
    }); 
    res.status(200).send(noteList);
  }
  catch (error) {
    res.status(400).send(error);
  }
});

// Traer nota por noteId
app.get('/notes', async (req, res) => {
  const noteId = Number(req.query.noteId);

  try { 
    const note = await Note.find({noteId});
    if (note.length === 0) {
      res.status(404).send('Note not found');
    } else {
      res.json(note);
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

// Traer nota por titulo
app.get('/notes/t/:title', async (req, res) => {
  const title = req.params.title;

  try { 
    await Note.find({title})
    res.json(Note);
	} catch (error) {
    res.status(400).send(error);
	}
});

// Update a note
app.put("/notes/:noteId", async (req, res) => {
  const noteId = req.params.noteId;
  const { name, content, owner } = req.body;

  try {
    const updatedNote = await Note.findOneAndUpdate(
      { noteId },
      { name, content, owner },
      { new: true } // This option returns the updated document
    );
    res.json(updatedNote);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Borrar nota por noteId
app.delete('/notes/:noteId', async (req, res) => {
  const noteId = req.params.noteId;
  try {
		await Note.deleteOne({noteId})
    res.json("Nota eliminada correctamente!");
	} catch (error) {
		res.status(400).send(error);
	}
})

// ------------------------------- Users -------------------------------
// Crear nuevo usuario
app.post('/users', async  (req, res) => {
  try {
    const { userId, username, email, name } = req.body;

    // Check if a note with the same noteId already exists
    const existingUser = await User.findOne({ userId });

    if (existingUser) {
      return res.status(409).json({ error: 'Ya existe un usuario con ese id.' });
    }

    const newUser = new User({
      userId, 
      username, 
      email,
      name
    });

    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Traer usuario por userId
app.get('/users/:userId', async (req, res) => {
  const userId = req.params.userId;

  try { 
    await User.find({userId})
    res.json(User);
	} catch (error) {
    res.status(400).send(error);
	}
});

// Traer usuarios por email
app.get('/users/e/:email', async (req, res) => {
  const email = req.params.email;

  try { 
    await User.find({email})
    res.json(User);
	} catch (error) {
    res.status(400).send(error);
	}
});

// Actualizar un usuario
app.put("/users/:userId", async (req, res) => {
  const userId = req.params.userId;
  const { name, email } = req.body;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { userId },
      { name, email }, // Replace with actual user fields
      { new: true } // This option returns the updated document
    );
    res.json(updatedUser);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Borrar usuario por userId
app.delete('/users/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
		await User.deleteOne({userId})
    res.json("Usuario eliminado correctamente!");
	} catch (error) {
		res.status(400).send(error);
	}
})


// ------------------------------- Projects -------------------------------
// Crear nuevo proyecto
app.post('/projects', async  (req, res) => {
  try {
    const { projectId, name, notes, owner } = req.body;

    // Check if a project with the same projectId already exists
    const existingProject = await Project.findOne({ projectId });

    if (existingProject) {
      return res.status(409).json({ error: 'Ya existe un proyecto con ese id.' });
    }

    const newProject = new Project({
      projectId, 
      name, 
      notes, // Lista de noteIds
      owner
    });

    const savedProject = await newProject.save();
    res.json(savedProject);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Traer notas de un proyecto por projectId
app.get('/projects/:projectId/notes', async (req, res) => {
  const projectId = req.params.projectId;

  try { 
    const project = await Project.findOne({ projectId });

    if (!project) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    const notes = await Note.find({ noteId: { $in: project.notes } });
    res.json(notes);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Agregar notas a un proyecto
app.put('/projects/:projectId/notes', async (req, res) => {
  const projectId = req.params.projectId;
  const { notes } = req.body; // This should be an array of noteIds

  try {
    const project = await Project.findOne({ projectId });

    if (!project) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    // Add new notes to the project
    project.notes.push(...notes);  // Spread operator to add all elements of the array ????

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (error) {
    res.status(400).send(error);
  }
});

