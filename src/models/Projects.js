const mongoose = require('mongoose');
const { Schema } = mongoose;
const USER = require('./User');

const userChildSchema = new Schema({
    user: {
    type: Schema.ObjectId,
    required:true,
    ref: "USER"
},
permissions: {
    type: String,
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


const ProjectSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        default: ''
    },
    priority: {
        type: String,
        default: 'low'
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
    owner: {
        type: Schema.ObjectId,
        required:true,
        ref:'USER'
    },
    progress:{
        start:{
            type: Date,
            default: Date.now
        },
        end:{
            type: Date,
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
    },
    users:[userChildSchema]
});

module.exports = mongoose.model('PROJECTS', ProjectSchema);




