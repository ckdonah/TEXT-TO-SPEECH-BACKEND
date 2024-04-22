import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  note: String,
});

const Note = mongoose.model("Note", noteSchema);

export default Note;