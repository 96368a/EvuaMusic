const qqMusic = require('../api/QQMusicApi');
const { song_url } = require('../api/NeteaseCloudMusicApi')

module.exports = async (query, res) => {
    const { id,type } = query;
    if (id&&type) {
        if(type === 'wyy'){
            let data = await song_url({id});
            console.log(data);
            // res.send(data)
            res.redirect(data.body.data[0].url)
        }else if(type === 'qq'){
            let data = await qqMusic.api('/song/urls', { id })
            res.redirect(data[id])
        }
        return 
    }
    return res.send(query)
}
