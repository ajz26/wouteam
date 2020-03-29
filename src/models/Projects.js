const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProjectSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
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
    users:[
        
        {
            user: {
                type: Schema.ObjectId,
                required:true,
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

        }
    ]
});

module.exports = mongoose.model('PROJECTS', ProjectSchema);
