const mongoose = require('mongoose');
const { Schema } = mongoose;

const ContactSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    type: {
        type: String,
        trim: true
    },
    nif: {
        type: String,
        trim: true
    },
    nationality: {
        type: String,
        trim: true
    },
    address:{
        addressLine: {
            type: String,
            trim: true
        },
        city: {
            type: String,
            trim: true
        },
        zipCode: {
            type: String,
            trim: true
        },
        province: {
            type: String,
            trim: true
        },
        country: {
            type: String,
            trim: true
        },
    },
    contact:{
        email: {
            type: String,
            required: true,
            trim: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        web: {
            type: String,
            trim: true,
        },
        facebook: {
            type: String,
            trim: true,
        },
        instagram: {
            type: String,
            trim: true,
        },
        linkedIn: {
            type: String,
            trim: true,
        },
    },
    business: {
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
        },
    },
    
});

module.exports = mongoose.model('CONTACT', ContactSchema);
