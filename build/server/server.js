"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const user_1 = require("./user");
const filesService_1 = require("../service/filesService");
let app = express();
app.use(bodyParser.json());
//打开页面加载用户数据
// app.post('/init', (request: any, response: any) => {
//     InitService.initData(request, response);
// })
app.post('/user/*', (request, response) => {
    const path = request.path;
    /*路由分发接口*/
    switch (path) {
        case '/user/login': {
            user_1.User.login(request, response);
            break;
        }
        case '/user/register': {
            user_1.User.register(request, response);
            break;
        }
    }
});
app.post('/files/*', (request, response) => {
    const path = request.path;
    /*路由分发接口*/
    switch (path) {
        case '/files/create': {
            filesService_1.FilesService.createOperation(request, response);
            break;
        }
        case '/files/update': {
            filesService_1.FilesService.updateFiles(request, response);
            break;
        }
        //文件查询接口
        case '/files/query': {
            filesService_1.FilesService.queryFiles(request, response);
            break;
        }
        case '/files/delete': {
            filesService_1.FilesService.deleteFiles(request, response);
            break;
        }
        case '/files/content': {
            filesService_1.FilesService.updateContent(request, response);
            break;
        }
        case '/files/cd': {
            filesService_1.FilesService.entryNextCatalogue(request, response);
            break;
        }
    }
});
app.listen(8085, function openServer() {
    console.log('express running on http://localhost:8085');
});
