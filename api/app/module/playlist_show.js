const mongoose = require('mongoose')

module.exports = async (query, res) => {
    const playlist = mongoose.model('Playlist');
    
    playlist.find().then((err, doc) => {
        if (err) {
            return res.send(err);
        } else {
            return res.send(doc);
        }
    }).catch(
        (err) => {
            return res.send(err);
        }
    )

    // return res.send(query)
}
