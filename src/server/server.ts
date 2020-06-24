import express = require("express");
import * as bodyParser from 'body-parser';
import {User} from "./user";

let app: any = express();

app.use(bodyParser.json());

app.post('/user/*', (request: any, response: any) => {
    const path = request.path

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


app.listen(8085, function openServer(){
    console.log('express running on http://localhost:8085');
})

