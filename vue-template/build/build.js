const path = require('path');
const srcDir = path.resolve(__dirname,'../src');
module.exports = {
    pages:[
        {
            template:path.resolve(srcDir,'index.html'),
            templateFileName:'index.html',
            envConfig:path.resolve(srcDir,'env/applications.json'),
            output:{
                filename:'[name].js',
                path:path.resolve(srcDir,'chunks'),
                publicPath:'chunks/'
            }
        },
        {
            template:path.resolve(srcDir,'login/login.html'),
            templateFileName:'login.html',
            envConfig:path.resolve(srcDir,'env/login_applications.json'),
            output:{
                filename:'[name].js',
                path:path.resolve(srcDir,'chunks/login'),
                publicPath:'chunks/login/'
            }
        }
    ]
};