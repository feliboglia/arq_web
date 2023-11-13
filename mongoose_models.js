const mongoose = require('mongoose');


// User Model
const userSchema = new mongoose.Schema({
  userId: {type: Number, required: true},
  username: { type: String, required: true },
  email: { type: String, required: true },
  name: String
});

const User = mongoose.model('User', userSchema);

// Note Model
const noteSchema = new mongoose.Schema({
  noteId: {type: Number, required: true},
  title: {type: String, required: true },
  content: {type: String, required: true },
  creationDate: {type: Date, default: Date.now },
  owner: {type: String, ref: 'User' }
});

const Note = mongoose.model('Note', noteSchema);

// Project Model
const projectSchema = new mongoose.Schema({
  projectId: {type: Number, required: true},
  name: {type: String, required: true },
  notes: [{ type: [Number], ref: 'Note' }],
  owner: { type: String, ref: 'User' }
});

const Project = mongoose.model('Project', projectSchema);


module.exports = {
  User,
  Note,
  Project,
};