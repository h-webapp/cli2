let through = require('through2');
module.exports = function (processFunction) {
    return through.obj(function(file, encoding, callback) {
        try {
            let content = new Buffer(processFunction(String(file.contents)));
            file.contents = content;
            callback(null, file);
        } catch (err) {
            callback(err);
        }
    });
};