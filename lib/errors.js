function MalformedUrlError (message) {
    this.message = message;
    this.name = "MalformedUrlError";
    Error.captureStackTrace(this, MalformedUrlError);
}
MalformedUrlError.prototype = Object.create(Error.prototype);
MalformedUrlError.prototype.constructor = MalformedUrlError;


function ProviderNotFoundError (message) {
    this.message = message;
    this.name = "ProviderNotFoundError";
    Error.captureStackTrace(this, ProviderNotFoundError);
}
ProviderNotFoundError.prototype = Object.create(Error.prototype);
ProviderNotFoundError.prototype.constructor = ProviderNotFoundError;

module.exports.MalformedUrlError = MalformedUrlError;
module.exports.ProviderNotFoundError = ProviderNotFoundError;