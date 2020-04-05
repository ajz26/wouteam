const mongoose = require('mongoose');
const { Schema } = mongoose;
const USER = require('./User');


const userChildSchema = new Schema({
    user: {
    type: Schema.ObjectId,
    required:true,
    ref: "USER"
},
addedBy: {
    type: Schema.ObjectId,
    required:true,
},
date: {
    type: Date,
    default: Date.now
}
}, { _id: false });


const statusChildSchema = new Schema({
    statement: {
        default: 'pending',
        type: String,
    },
    changedBy: {
        type: Schema.ObjectId,
        required:true,
        ref: "USER"
    },
    date: {
        type: Date,
        default: Date.now
    }

}, { _id: false });


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
            ref:'USER'
        },
        date: {
            type: Date,
            default: Date.now
        }
    },
    status:[statusChildSchema],
    users:[userChildSchema]
    
});

module.exports = mongoose.model('TASKS', TasksSchema);
