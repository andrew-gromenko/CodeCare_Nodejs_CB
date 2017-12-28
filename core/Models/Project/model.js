const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Project = new Schema({
    creator: {
        type: Schema.ObjectId, ref: 'User',
        required: true,
    },

    title: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        default: ''
    },

    tag: {
        type: String,
        default: ''
    },

    genre: {
        type: String,
    },

    file: {
        type: Object,
        default: null
    },

    privacy: {
        type: Boolean,
        default: false
    },

    modified_at: {
        type: Date,
        default: Date.now,
    },

    url: {
        type: Object,
        default: {
            src: null,
            type: null
        }
    },

    likes: {
        type: Array,
        default: []
    },

    plays: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Project', Project);