var Promise = require('bluebird');
var request = Promise.promisify(require("request"));

exports.init = function (customProviders, options) {
    var providers = require('./factory').init(customProviders, options);

    return {
        get: function (options, cb) {
            return providers.get(options.url, options)
                .then(function (provider) {
                    return provider.getUrls();
                })
                .then(function (provUrls) {
                    return [request(provUrls.embed), provUrls];
                })
                .spread(function (response, provUrls) {
                    // because request passses as a result two non-error values, response and body
                    // they are coming as an array [response, body] inside a .spread method argument
                    response = response[0];

                    if (response.statusCode != 200) {
                        throw new Error('error: ' + response.statusCode);
                    }

                    var dto = JSON.parse(response.body);
                    dto.video_url = provUrls.video;
                    return dto;
                })
                .nodeify(cb);
        }
    };
};
