const qqMusic = require('../api/QQMusicApi');

module.exports = async (query, res) => {
    const { id,type } = query;
    if (id&&type) {
        if(type === 'wyy'){
            res.redirect(`http://music.163.com/song/media/outer/url?id=${id}.mp3`)
        }else if(type === 'qq'){
            let data = await qqMusic.api('/song/urls', { id })
            res.redirect(data[id])
        }
        return 
    }
    return res.send(query)
}
