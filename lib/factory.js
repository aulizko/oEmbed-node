var fs = require('fs');
var url = require('url');
var customErrors = require('./errors');
var MalformedUrlError = customErrors.MalformedUrlError;
var ProviderNotFoundError = customErrors.ProviderNotFoundError;
var _ = require('lodash');

var Promise = require('bluebird');

exports.init = function (extraProviders, options) {
    var providerFiles = fs.readdirSync(__dirname + '/providers');
    var providers = {};

    _.each(providerFiles, function (file) {
        var code = require(__dirname + '/providers/' + file.replace('.js', ''));
        _.each(code.urls, function (url) {
            providers[url] = code;
        });
    });



    return {
        get: function (urlStr, /* alllow override default options per request */optionsForUrl) {
            var opts = _.assign({}, options, optionsForUrl);

            return Promise.resolve()
                .then(function () {
                    // deal with url
                    var parsedUrl;
                    try {
                        parsedUrl = url.parse(urlStr);
                    } catch (e) {
                        throw new MalformedUrlError("Malformed url: " + urlStr);
                    }
                    return parsedUrl;
                })
                .then(function(parsedUrl) {
                    // get provider for provided url
                    var provider;

                    if (extraProviders && extraProviders[parsedUrl.host]) {
                        provider = extraProviders[parsedUrl.host];
                    } else {
                        provider = providers[parsedUrl.host];
                    }

                    if (!provider) {
                        if (opts.embedlyApiKey) { // if Embed.ly API key is provided, use Embed.ly as a fallback provider
                            provider = providers['embed.ly'];
                        } else { // throw error otherwise
                            throw ProviderNotFoundError('Provider not found for url: ' + urlStr);
                        }
                    }

                    return provider.init(urlStr, opts);
                });
        }
    }
};
