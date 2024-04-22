import express from "express";
import cors from "cors";
import colors from "colors";
import connectDB from "./config/connectDB.js";
import bodyParser from "body-parser";
import User from "./models/user.model.js";
import Contact from "./models/contact.model.js";
import Note from "./models/note.model.js";
import Text from "./models/text.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const app = express();
const { PORT } = process.env;

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

await connectDB();

app.get("/", (req, res) => {
    res.send("Welcome to the Contact List API");
})


// Signup route
app.post("/signup", async (req, res) => {
    try {
      const { username, email, password } = req.body;
  
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
  
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create new user
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
      });
  
      await newUser.save();
  
      res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Login route
  app.post("/login", async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Find user by username
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({ message: "Invalid username or password" });
      }
  
      // Compare passwords
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid username or password" });
      }
  
      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, "your_secret_key", { expiresIn: "1h" });
  
      res.status(200).json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });




app.post("/contact", async (req, res) => {
  try {
    const { name, email, mobile, message } = req.body;
    const newContact = new Contact({ name, email, mobile, message });
    await newContact.save();
    res.status(201).json({ message: "Contact saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/speech-to-text", async (req, res) => {
    try {
      const { note } = req.body;
      const newNote = new Note({ note });
      await newNote.save();
      res.status(201).json({ message: "Note saved successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/text-to-speech", async (req, res) => {
    try {
      const { text } = req.body;
      const newText = new Text({ text });
      await newText.save();
      res.status(201).json({ message: "Text saved successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });



app.listen(PORT, () => {
  console.log(
    `:::`.green,
    `Server is running on`.yellow,
    `http://localhost:${PORT}`.green.bold.underline
  );
});
