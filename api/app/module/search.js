const mongoose = require('mongoose');
const { login_cellphone,cloudsearch,search } = require('../api/NeteaseCloudMusicApi')
const qqMusic = require('../api/QQMusicApi');
qqMusic.setCookie(require('../../config.js').qqcookie)

module.exports = async (query, res) => {
    let { keywords, type } = query
    if (keywords) {
        if (type === undefined) {
            type = 'wyy'
        }
        if (type === 'wyy') {
            let result = await cloudsearch(query)
            console.log(result);
            return res.send({
                code: 200,
                songs: result.body.result.songs.map(e => {
                    return {
                        name: e.name,
                        id: e.id,
                        artists: e.ar.map(e => {
                            return {
                                name: e.name,
                                id: e.id
                            }
                        }),
                        album: {
                            ...e.al
                        },
                        type: 'wyy'
                    }
                })
            })
        } else if (type === 'qq') {
            let result = await qqMusic.api('search', { key: keywords })
            console.log(result);
            return res.send({
                code: 200,
                songs: result.list.map(e => {
                    return {
                        name: e.songname,
                        id: e.songmid,
                        artists: e.singer.map(e => {
                            return {
                                name: e.name,
                                id: e.id
                            }
                        }),
                        album: {
                            id: e.albumid,
                            name: e.albumname
                        },
                        type: 'qq'
                    }
                })
            })
        }
    }

    return res.send(query)
}
