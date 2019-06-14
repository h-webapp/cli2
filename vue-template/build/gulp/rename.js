let through = require('through2');
module.exports = function (rename) {
    return through.obj(async function(file, encoding, callback) {
        try {
            if(typeof rename === 'function'){
                file.relative = rename(file);
            }else if(typeof rename === 'string'){
                file.relative = rename;
            }
            callback(null, file);
        } catch (err) {
            callback(err);
        }
    });
};