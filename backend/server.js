const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()

const app = express()

app.use(cors())
app.use(express.json())
app.use("/api/auth", require("./routes/authRoutes"))
app.use("/api/notes", require("./routes/noteRoutes"))

app.get("/", (req,res)=>{
    res.send("API running")
})

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB connected"))
.catch(err=>console.log(err))

const PORT = process.env.PORT || 5000

app.listen(PORT, ()=>{
    console.log(`Server running on ${PORT}`)
})