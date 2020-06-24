"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const user_1 = require("./user");
let app = express();
app.use(bodyParser.json());
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
app.listen(8085, function openServer() {
    console.log('express running on http://localhost:8085');
});
