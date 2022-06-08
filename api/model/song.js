var mongoose = require('.');
var Schema = mongoose.Schema;

var song = new Schema({
    id: String,
    type: String,
    index: Number,
});

export default mongoose.model('Song', song);