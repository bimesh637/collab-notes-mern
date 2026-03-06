const router = require("express").Router()

const noteController = require("../controllers/noteController")
const auth = require("../middleware/authMiddleware")

router.post("/",auth,noteController.createNote)

router.get("/",auth,noteController.getNotes)

router.put("/:id",auth,noteController.updateNote)

router.delete("/:id",auth,noteController.deleteNote)
router.get("/search",auth,noteController.searchNotes)

module.exports = router