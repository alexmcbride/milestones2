function FlashMessages(session) {
    this.session = session;
    this.session.flashMessages = this.session.flashMessages || [];
}

FlashMessages.prototype.add = function(message, type) {
    this.session.flashMessages.push({message: message, type: type});
};

FlashMessages.prototype.hasMessages = function() {
    return this.session.flashMessages && this.session.flashMessages.length > 0;
}

FlashMessages.prototype.getMessages = function() {
    var messages = [];
    while (this.session.flashMessages.length) {
        messages.push(this.session.flashMessages.pop());
    }
    return messages;
};

FlashMessages.prototype.clearMessages = function() {
    this.session.flashMessages = [];
};

module.exports = FlashMessages;
