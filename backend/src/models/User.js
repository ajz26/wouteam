const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    phone: {
        type: String,
        trim: true,
    },
    notifications:{
        type: Boolean,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    register: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: 'pending'
    },
});


UserSchema.methods.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(12);
    const hash = bcrypt.hash(password, salt);
    return hash;
};

UserSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

module.exports = mongoose.model('USER', UserSchema);
