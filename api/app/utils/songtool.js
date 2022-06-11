const wyyMusic = require('../api/NeteaseCloudMusicApi')
const { song_detail } = require('../api/NeteaseCloudMusicApi')
const qqMusic = require('../api/QQMusicApi');
qqMusic.setCookie(require('../../config.js').qqcookie)

async function findSong(ids, type) {
    if (type === "wyy") {
        if(Array.isArray(ids)){
            ids = ids.join(',')
        }
        let result = await song_detail({ ids: ids })
        return {
            code: 200,
            songs: result.body.songs.map(e => {
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
        }
    } else if (type === "qq") {
        if (!Array.isArray(ids)) {
            ids = ids.split(/\s*,\s*/)
        }
        //qqmusic的批量获取接口好像不可用，自己封装了一下
        var result = ids.map(async id => {
            return await qqMusic.api('song', { songmid: id })
        })
        result = await Promise.all(result)
        return {
            code: 200,
            songs: result.map(e => {
                return {
                    name: e.track_info.name,
                    id: e.track_info.mid,
                    artists: e.track_info.singer.map(e => {
                        return {
                            name: e.name,
                            id: e.id
                        }
                    }),
                    album: {
                        id: e.track_info.album.mid,
                        name: e.track_info.album.name
                    },
                    type: 'qq'
                }
            })
        }
    }
    return null;
}

async function findPlaylist(songs) {
    if (Array.isArray(songs)) {
        let result = songs.map(({ id, type }) => {
            if (id && type) {
                return findSong([id], type)
            }
        })
        result = await Promise.all(result)
        return result.map(e => {
            return e.songs[0]
        }
        )
    }
    return { error: "not implemented" }
}

module.exports =  { findSong, findPlaylist }

/* let music = findSong("0039MnYb0qxYhV,001B8mwk0W0vw5", 'qq').then(e => {
    console.log(e);

    console.log(233);
}) */
/* let music = findPlaylist([{
    id: "0039MnYb0qxYhV",
    type: "qq"
}, {
    id: "001B8mwk0W0vw5",
    type: "qq"
},{
    id: "1842801269",
    type: "wyy"
}]).then(e => {
    console.log(e);

    console.log(233);
})
// console.log(music); */