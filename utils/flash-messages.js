function FlashMessages(session) {
    this.session = session;
    this.session.flashMessages = [];
}

FlashMessages.prototype.add = function(message, type) {
    this.session.flashMessages.push({message: message, type: type});
};

FlashMessages.prototype.get = function() {
    return this.session.flashMessages;
};

FlashMessages.prototype.clear = function() {
    return this.session.flashMessages = [];
};

module.exports = FlashMessages;
