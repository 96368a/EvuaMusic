const mongoose = require('mongoose')
const Schema = mongoose.Schema;

module.exports = async (query, res) => {
    const playlist = mongoose.model('Playlist');
    const song = mongoose.model('Song');
    const { id } = query;
    if (id) {
        console.log(id);
        let s = song({ id: id, name: "test" })
        s.save();
        return res.send(s);
    }
    return res.send(query)
}
