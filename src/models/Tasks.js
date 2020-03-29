const mongoose = require('mongoose');
const { Schema } = mongoose;

const TasksSchema = new Schema({

    title: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
    },
    project: {
        type: Schema.ObjectId,
        required:true,
    },
    createdBy: {
        user: {
            type: Schema.ObjectId,
            required:true,
        },
        date: {
            type: Date,
            default: Date.now
        }
    },
    status:[
        {
            statement: {
                default: 'pending',
                type: String,
            },
            changedBy: {
                type: Schema.ObjectId,
                required:true,
            },
            date: {
                type: Date,
                default: Date.now
            }

        }
    ],
    users:[
        
        {
            user: {
                type: Schema.ObjectId,
                required:true,
            },
            addedBy: {
                type: Schema.ObjectId,
                required:true,
            },
            date: {
                type: Date,
                default: Date.now
            }

        }
    ]
    
});

module.exports = mongoose.model('TASKS', TasksSchema);
