const mongoose = require('mongoose')
const Schema = mongoose.Schema;
let mongooseHidden = require('mongoose-hidden')()

var playlist = new Schema({
    id: Number,
    name: String,
    songs: [{
        id: String,
        type: { type: String, default: 'wyy' },
        index: Number,
        name: String,
        _id: false
    }],
    createTime: Date,
    updateTime: Date,
    description: String,
});

const AutoIncrement = require('mongoose-sequence')(mongoose);
playlist.plugin(AutoIncrement, {inc_field: 'id',start_seq: 100000});
playlist.plugin(mongooseHidden)
mongoose.model('Playlist', playlist);
