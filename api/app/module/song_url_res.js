const qqMusic = require('../api/QQMusicApi');
const { song_url } = require('../api/NeteaseCloudMusicApi')

module.exports = async (query, res) => {
    const { id,type } = query;
    if (id&&type) {
        if(type === 'wyy'){
            let data = await song_url({id});
            console.log(data);
            res.send(data)
            // res.redirect(`http://music.163.com/song/media/outer/url?id=${id}.mp3`)
        }else if(type === 'qq'){
            let data = await qqMusic.api('/song/urls', { id })
            res.redirect(data[id])
        }
        return 
    }
    return res.send(query)
}
