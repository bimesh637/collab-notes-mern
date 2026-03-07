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

    res.json(note);
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
      .populate("owner", "username")
      .populate("collaborators", "username")
      .sort({ createdAt: -1 });

    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch notes" });
  }
});

// Search notes
router.get("/search/:query", authMiddleware, async (req, res) => {
  try {
    const query = req.params.query;

    const notes = await Note.find({
      $and: [
        {
          $or: [
            { title: { $regex: query, $options: "i" } },
            { content: { $regex: query, $options: "i" } },
          ],
        },
        {
          $or: [
            { owner: req.user.id },
            { collaborators: req.user.id },
          ],
        },
      ],
    })
      .populate("owner", "username")
      .populate("collaborators", "username")
      .sort({ createdAt: -1 });

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
      .populate("owner", "username")
      .populate("collaborators", "username");

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

// Add collaborator
router.post("/:id/collaborators", authMiddleware, async (req, res) => {
  try {
    const { collaboratorId } = req.body;

    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (String(note.owner) !== String(req.user.id)) {
      return res.status(403).json({ message: "Only owner can add collaborators" });
    }

    if (String(note.owner) === String(collaboratorId)) {
      return res.status(400).json({ message: "Owner is already part of the note" });
    }

    const user = await User.findById(collaboratorId);
    if (!user) {
      return res.status(404).json({ message: "Collaborator user not found" });
    }

    if (!note.collaborators.includes(collaboratorId)) {
      note.collaborators.push(collaboratorId);
      await note.save();
    }

    const updatedNote = await Note.findById(note._id)
      .populate("owner", "username")
      .populate("collaborators", "username");

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
      .populate("owner", "username")
      .populate("collaborators", "username");

    res.json(updatedNote);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to remove collaborator" });
  }
});

module.exports = router;