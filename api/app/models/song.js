const mongoose = require('mongoose')
const Schema = mongoose.Schema;

var song = new Schema({
    id: Number,
    type: String,
    index: Number,
    name: String,
    artists: [{ type: String }],
    album: { type: String },
    duration: Number,
});
mongoose.model('Song', song);