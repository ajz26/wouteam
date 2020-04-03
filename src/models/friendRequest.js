const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');
const USER = require('./User');



const acceptationChildSchema = new Schema({
    response:{
        type:Boolean,
    },
    date: { type: Date, default: Date.now },
    
}, { _id: false });


const FriendRequestSchema = new Schema({

    sender: {
        type: Schema.ObjectId,
        required:true,
        ref:'USER'
    },
    receptor: {
        type: Schema.ObjectId,
        required:true,
        ref:'USER'
    },
    is_readed :{acceptationChildSchema},
    is_accepted  :acceptationChildSchema,
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('FRIENDSREQUEST', FriendRequestSchema);
