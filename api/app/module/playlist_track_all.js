const mongoose = require('mongoose')
module.exports = async (query, res) => {
    const playlist = mongoose.model('Playlist');

    const { id } = query;
    if (id) {
        playlist.find({ id: Number(id) }).then((err, doc) => {
            if (err) {
                return res.send(err);
            } else {
                return res.send(doc.toJSON());
            }
        })
        return 
    }
    return res.send(query)
}
