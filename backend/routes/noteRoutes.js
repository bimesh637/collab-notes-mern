const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");


// Create note
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, content } = req.body;

    const note = await Note.create({
      title,
      content,
      owner: req.user.id,
    });

    const createdNote = await Note.findById(note._id)
      .populate("owner", "username fullName userId email")
      .populate("collaborators", "username fullName userId email");

    res.json(createdNote);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create note" });
  }
});


// Get all notes for logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const notes = await Note.find({
      $or: [
        { owner: req.user.id },
        { collaborators: req.user.id },
      ],
    })
      .populate("owner", "username fullName userId email")
      .populate("collaborators", "username fullName userId email")
      .sort({ createdAt: -1 });

    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch notes" });
  }
});


// Full-text search notes
router.get("/search/:query", authMiddleware, async (req, res) => {
  try {
    const query = req.params.query;

    const notes = await Note.find(
      {
        $text: { $search: query },
        $or: [
          { owner: req.user.id },
          { collaborators: req.user.id },
        ],
      },
      {
        score: { $meta: "textScore" },
      }
    )
      .populate("owner", "username fullName userId email")
      .populate("collaborators", "username fullName userId email")
      .sort({ score: { $meta: "textScore" } });

    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Search failed" });
  }
});


// Update note
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      {
        _id: req.params.id,
        $or: [
          { owner: req.user.id },
          { collaborators: req.user.id },
        ],
      },
      req.body,
      { new: true }
    )
      .populate("owner", "username fullName userId email")
      .populate("collaborators", "username fullName userId email");

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update note" });
  }
});


// Delete note
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found or not authorized" });
    }

    res.json({ message: "Note deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete note" });
  }
});


// Add collaborator using username
router.post("/:id/collaborators", authMiddleware, async (req, res) => {
  try {
    const { username } = req.body;

    if (!username || !username.trim()) {
      return res.status(400).json({ message: "Collaborator username is required" });
    }

    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (String(note.owner) !== String(req.user.id)) {
      return res.status(403).json({ message: "Only owner can add collaborators" });
    }

    const user = await User.findOne({ username: username.trim() });

    if (!user) {
      return res.status(404).json({ message: "Collaborator user not found" });
    }

    if (String(note.owner) === String(user._id)) {
      return res.status(400).json({ message: "Owner already included" });
    }

    const alreadyAdded = note.collaborators.some(
      (collab) => String(collab) === String(user._id)
    );

    if (alreadyAdded) {
      return res.status(400).json({ message: "Collaborator already added" });
    }

    note.collaborators.push(user._id);
    await note.save();

    const updatedNote = await Note.findById(note._id)
      .populate("owner", "username fullName userId email")
      .populate("collaborators", "username fullName userId email");

    res.json(updatedNote);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add collaborator" });
  }
});


// Remove collaborator
router.delete("/:id/collaborators/:collaboratorId", authMiddleware, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (String(note.owner) !== String(req.user.id)) {
      return res.status(403).json({ message: "Only owner can remove collaborators" });
    }

    note.collaborators = note.collaborators.filter(
      (collab) => String(collab) !== String(req.params.collaboratorId)
    );

    await note.save();

    const updatedNote = await Note.findById(note._id)
      .populate("owner", "username fullName userId email")
      .populate("collaborators", "username fullName userId email");

    res.json(updatedNote);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to remove collaborator" });
  }
});

module.exports = router;