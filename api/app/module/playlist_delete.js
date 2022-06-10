const mongoose = require('mongoose')

module.exports = async (query, res) => {
    const playlist = mongoose.model('Playlist');

    const { id } = query;
    if (id) {
        playlist.deleteOne({ id: Number(id) },(err, doc) => {
            if (err) {
                return res.send(err);
            } else {
                if(doc.deletedCount === 1){
                    return res.send({msg:"删除成功",code:200});
                }else{

                    return res.send({error: 'id not found',code: 400});
                }
            }
        })
        return 
    }
    return res.send(query)
}
