let through = require('through2');
module.exports = function (getFileContent) {
    return through.obj(async function(file, encoding, callback) {
        try {
            let content = await getFileContent(file);
            file.contents = new Buffer(content);
            callback(null, file);
        } catch (err) {
            callback(err);
        }
    });
};