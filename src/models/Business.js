const mongoose = require('mongoose');
const { Schema } = mongoose;

const BusinessSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    nif: {
        type: String,
        trim: true
    },

    email: {
        type: String,
        trim: true
    },

    phone: {
        type: String,
        trim: true
    },

    address: {
        country: {
            type: String,
            trim: true
        },
        city: {
            type: String,
            trim: true
        },
        line_address: {
            type: String,
            trim: true
        },
        zipcode: {
            type: String,
            trim: true
        }
    },
    sector: {
        type: String,
        trim: true
    },
    businessSize: {
        type: String,
        trim: true
    },
    logo: {
        type: String,
        trim: true
    },
    preferences:{

        currency: {
            type: String,
            trim: true
        },
        numberFormat: {
            type: String,
            trim: true
        },
        decimals: {
            type: String,
            trim: true
        },
        timeZone: {
            type: String,
            trim: true
        },
        dateFormat: {
            type: String,
            trim: true
        },
        colorPrimary: {
            type: String,
            trim: true
        },
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
    ],
    status: {
        type: String,
        default: 'pending'
    },
});

module.exports = mongoose.model('BUSINESS', BusinessSchema);
