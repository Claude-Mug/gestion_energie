// events.js placeholder for socket
const { getIO } = require('./index');

const broadcastNewArticle = (article) => {
    const io = getIO();
    io.emit('new_article', article);
};

module.exports = {
    broadcastNewArticle
};
