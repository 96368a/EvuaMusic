import song from './song';
import mongoose from './';

var Schema = mongoose.Schema;

var playlist = new Schema({
    id: String,
    name: String,
    songs: [song],
    createTime: Date,
    updateTime: Date,

});

export default mongoose.model('Playlist', playlist);