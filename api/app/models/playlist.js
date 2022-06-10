const mongoose = require('mongoose')
const Schema = mongoose.Schema;

var playlist = new Schema({
    id: String,
    name: String,
    songs: [{type: Schema.Types.ObjectId, ref: 'song'}],
    createTime: Date,
    updateTime: Date,

});

mongoose.model('Playlist', playlist);