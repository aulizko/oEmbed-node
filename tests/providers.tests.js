require("should");
var providers = require('../index').providers;

describe('Providers', function() {
  describe('.get(url)', function () {
    it('should get a provider for Vimeo', function (done) {
      providers
          .init()
          .get("https://vimeo.com/62584176")
          .then(function (provider) {
            provider.should.have.property("getUrls");
            done();
          });
    });
    it('should get a provider for Rutube', function (done) {
      providers
          .init()
          .get("http://rutube.ru/video/59d92e33219f5b81ce0c5375cb537ba0/")
          .then(function (provider) {
            provider.should.have.property("getUrls");
            done();
          });
    });
  });
});
