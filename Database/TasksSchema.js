const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        required: true
    },
    usersAllTasks: [
        {
            taskDate: {
                type: String,
                default: new Date().toLocaleDateString().toString()
            },
            tasks: [
                {
                    taskHeading: {
                        type: String,
                        required: true
                    },
                    taskDetails: {
                        type: String,
                        default:"No extra data"
                    },
                    status: {
                        type: String,
                        default: "planned"
                    }
                }
            ]
        }
    ]
});


module.exports = mongoose.model("task",taskSchema);