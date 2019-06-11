## Getting Started
### install
```console
    npm i h-application -g
```
### init project
```console
    h-application --name helloword
```
### install dependence
```console
    cd helloworld
    npm install
```
### start server
```console
    npm run start
    //run debug server
    npm run start-debug
```
### build
```console
   npm run build
   //只编译webpack
   npm run compile
   //clean
   npm run clean
```
### 帮助
h-application是一个快速搭建web应用的cli,框架主要基于模块和应用，模块和应用中包含组件、指令、依赖的资源，每个模块和应用可分布式部署，
框架包含一个模块和应用分析工具，自动分析出当前页面的模块、应用依赖情况，可方便的了解到模块和应用的重复依赖。

合并加载资源
/*[[myChunk.js*/
"a.js",
"b.js"
/*]]*/
a.js与b.js将会合并为myChunk.js，如没有指定合并后名称，将随机生成文件名称