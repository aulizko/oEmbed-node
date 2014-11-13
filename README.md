oembed-node
===========

This is a fork from [hgarcia/oEmbed-node](https://github.com/hgarcia/oEmbed-node) with few additions:

* Rutube provider support
* Embed.ly fallback for urls which does not have providers
* Promise support

A node library to consume some providers of oEmbed.

At the moment it only supports YouTube and Vimeo but you can easily extend it to work with others via custom providers.

### Usage

```javascript
var oembed = require('oembed-node').init();
oembed.get({url: "https://vimeo.com/62584176"}, getVideo);
function getVideo(err, result) {

}

// or the same as above with promise

oembed
  .get({url: "https://vimeo.com/62584176"})
  .then(function(result) {/* handle result */})
  .catch(function(err) {/* deal with errors */});
```

The result will be a literal object with the properties returned by the provider. The library adds a video_url property to the object.

### Custom providers

The `init` method of the library takes a literal object that's a map from host names to functions. Each of those functions is the handler that will return a proper oEmbed end point.

For example a custom provider for vimeo would be like this:

```javascript
var customProviders = {
  "vimeo.com" : {
    init: function (urlStr) {
      return {
        getUrls: function () {
          return {
            embed: "http://vimeo.com/api/oembed.json?url=" + urlStr,
            video: urlStr
          };
        }
      };
    }
  }
};
```

And you can pass it to the `init` function of the module.

```javascript
var oembed = require('oembed-node').init(customProviders);
```

You can use the same handler for multiple host names, just associate it to other keys in the hash.

### Embed.ly support

If you don't see provider you want at supported providers list, and you won't bother to add them as custom providers (see above), you can let awesome [embed.ly](http://embed.ly) handle them for you.

Before being able to use this feature, you should register at [embed.ly](http://embed.ly) and get API key. Than, you can pass it into .init method, sit back and relax.

```javascript
var oembed = require('oembed-node').init({}, {embedlyApiKey: '123456'});

oembed
    .get('http://custom-provider.io/video-url')
    .then(function (result) {/* your stuff goes here */});

// Or, if you prefer, you can pass embed.ly API key every request (though I don't know why you should want to do this):

oembed
    .get('http://custom-provider.io/video-url', {
        // this option will override API key that you've passed into .init method, if any
        embedlyApiKey: '123456',
        maxWidth: 1200,
        maxHeight: 1040
    })
    .then(function (result) {/* your stuff goes here */});
```


### Changelog

**0.3.0** - Added Embed.ly fallback, Promises support, removed Justin.tv, added Rutube.ru support

**0.2.0** - Fixed a bug supporting YouTube with multi query parameters
Added support for Justin.tv
Added support for Revision3
Added support for yFrog

**0.1.0** - Initial release support for Vimeo and YouTube
