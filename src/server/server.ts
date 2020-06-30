import express = require("express");
import * as bodyParser from 'body-parser';
import {User} from "./user";
import {initUserRoot} from "../core/catalogue/userCatalogue";
import {FilesService} from "../service/filesService";
import {InitService} from "../service/initService";

let app: any = express();

app.use(bodyParser.json());

//打开页面加载用户数据
app.get('/init', (request: any, response: any): void => {
    InitService.initData(request, response);
})

app.post('/user/*', (request: any, response: any) => {
    const path = request.path;

    /*路由分发接口*/
    switch (path) {
        case '/user/login': {
            User.login(request, response)
            break
        }

        case '/user/register': {
            User.register(request, response)
            break
        }
    }
});

app.post('/files/*', (request: any, response: any) => {
    const path: string = request.path;
    /*路由分发接口*/
    switch (path) {
        case '/files/create': {
            FilesService.createOperation(request, response);
            break
        }

        case '/files/update': {
            FilesService.updateFiles(request, response);
            break
        }
        //文件查询接口
        case '/files/query': {
            FilesService.queryFiles(request, response);
            break
        }

        case '/files/delete': {
            FilesService.deleteFiles(request, response);
            break
        }

        case '/files/content': {
            FilesService.updateContent(request, response);
            break
        }

        case '/files/cd': {
            FilesService.entryNextCatalogue(request, response);
            break
        }
    }
})


app.listen(8085, function openServer(){
    console.log('express running on http://localhost:8085');
})

