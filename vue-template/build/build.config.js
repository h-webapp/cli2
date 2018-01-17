const path = require('path');
const srcDir = path.resolve(__dirname,'../src');

module.exports = {
    pages:[
        {
            template:path.resolve(srcDir,'index.html'),
            envConfig:path.resolve(srcDir,'env/applications.json'),
            output:{
                filename:'[name].js',
                path:path.resolve(srcDir,'chunks'),
                publicPath:'/chunks/'
            }
        }/*,
        {
            template:path.resolve(srcDir,'login/login.html'),
            envConfig:path.resolve(srcDir,'login/login_applications.json'),
            output:{
                filename:'[name].js',
                path:path.resolve(srcDir,'chunks/login'),
                publicPath:'/chunks/login/'
            }
        }*/
    ]
};