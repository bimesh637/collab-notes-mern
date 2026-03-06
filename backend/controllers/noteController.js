const Note = require("../models/Note")

exports.createNote = async (req,res)=>{

    const {title,content} = req.body

    const note = await Note.create({
        title,
        content,
        owner:req.user.id
    })

    res.json(note)
}


exports.getNotes = async (req,res)=>{

    const notes = await Note.find({
        $or:[
            {owner:req.user.id},
            {collaborators:req.user.id}
        ]
    })

    res.json(notes)
}


exports.updateNote = async (req,res)=>{

    const note = await Note.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new:true}
    )

    res.json(note)
}


exports.deleteNote = async (req,res)=>{

    await Note.findByIdAndDelete(req.params.id)

    res.json({message:"Note deleted"})
}