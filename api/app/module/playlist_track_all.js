const mongoose = require('mongoose');
const { findPlaylist } = require('../utils/songtool');
module.exports = async (query, res) => {
    const playlist = mongoose.model('Playlist');

    const { id } = query;
    if (id) {
        playlist.findOne({ id }, async (err, doc) => {
            if (err) {
                return res.send(err);
            } else {
                let data = await findPlaylist(doc.toJSON().songs);
                console.log(data);
                return res.send({
                    code: 200,
                    songs: data
                });
            }
        })
        return
    }
    return res.send(query)
}
