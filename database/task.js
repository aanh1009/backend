const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    text: {
        type: String,
    },
})

const Task = new mongoose.model("Task", taskSchema);
module.exports = Task;