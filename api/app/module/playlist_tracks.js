const mongoose = require('mongoose')

module.exports = async (query, res) => {
    const playlist = mongoose.model('Playlist');
    const { id, op, songs } = query;
    if (id && op && Array.isArray(songs)) {
        if (op === 'add') {
            //添加歌曲操作
            playlist.findOne({ id: Number(id) }, (err, doc) => {
                if (err) {
                    return res.send(err);
                } else {
                    doc.songs = doc.songs.concat(songs);
                    doc.save().then((err, doc) => {
                        if (err) {
                            return res.send(err);
                        } else {
                            return res.send(doc);
                        }
                    })
                    return
                }
            })
            console.log("add");
            return
        } else if (op === 'del') {
            //删除歌曲操作
            playlist.findOne({ id: Number(id) }, (err, doc) => {
                if (err) {
                    return res.send(err);
                } else {
                    //删除歌曲
                    doc.songs = doc.songs.filter(item => {
                        return songs.findIndex(i => i.id === item.id && i.type === item.type) === -1
                    })
                    doc.save().then((err, doc) => {
                        if (err) {
                            return res.send(err);
                        } else {
                            return res.send(doc);
                        }
                    })
                    return
                }

            })


        } else {
            return res.send({ error: 'invalid op', code: 400 });
        }


        return
    }
    return res.send(query)
}
