const mongoose = require('mongoose')

module.exports = async (query, res) => {
    const playlist = mongoose.model('Playlist');
    const { name,description } = query;
    if (name && description) {
        let s = playlist({ name: name,description: description })
        s.save().then((err, doc) => {
            if (err) {
                return res.send(err);
            } else {
                return res.send(doc);
            }
        })
        return 
    }
    return res.send(query)
}
