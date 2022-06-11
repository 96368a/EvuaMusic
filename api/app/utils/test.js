const qqMusic = require('../api/QQMusicApi');
qqMusic.setCookie(require('../../config.js').qqcookie)

qqMusic.api('/song/urls', { id: '0039MnYb0qxYhV,004Z8Ihr0JIu5s' }).then(e => {
    console.log(e);
    console.log(e);
})