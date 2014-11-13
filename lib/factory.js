var fs = require('fs');
var url = require('url');
var customErrors = require('./errors');
var MalformedUrlError = customErrors.MalformedUrlError;
var ProviderNotFoundError = customErrors.ProviderNotFoundError;

exports.init = function (extraProviders) {
  var providerFiles = fs.readdirSync(__dirname + '/providers');
  var providers = {};

  providerFiles.forEach(function (file) {
    var code = require(__dirname + '/providers/' + file.replace('.js', ''));
    code.urls.forEach(function (u) {
      providers[u] = code;
    });
  });
  return {
    get: function (urlStr) {
      var parsedUrl;
      try {
        parsedUrl = url.parse(urlStr);
      } catch (e) {
        throw new MalformedUrlError("Malformed url: " + urlStr);
      }

      var provider;

      if (extraProviders && extraProviders[parsedUrl.host]) {
        provider = extraProviders[parsedUrl.host];
      } else {
        provider = providers[parsedUrl.host];
      }

      if (!provider) {
        throw ProviderNotFoundError('Provider not found for url: ' + urlStr);
      }

      return provider.init(urlStr);
    }
  }
};
