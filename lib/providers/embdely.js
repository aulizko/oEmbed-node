module.exports = {
    name: 'embedly',
    urls: ["embed.ly"],
    init: function (urlStr, options) {
        return {
            getUrls: function () {
                var embedUrl = 'http://api.embed.ly/1/oembed?key=' + options.embedlyApiKey +
                    '&url=' + encodeURIComponent(urlStr) +
                    '&format=json';

                if (options.maxWidth) {
                    embedUrl += '&maxwidth=' + options.maxWidth;
                }

                if (options.maxHeight) {
                    embedUrl += '&maxheight=' + options.maxHeight;
                }

                return {
                    embed: embedUrl,
                    video: urlStr
                }
            }
        };
    }
};