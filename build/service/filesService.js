"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("../core");
const create_1 = require("../core/operation/create");
const resultBean_1 = require("../utils/resultBean");
const positionViews_1 = require("../core/positionViews/positionViews");
const userCatalogue_1 = require("../core/catalogue/userCatalogue");
const otherUtils_1 = require("../core/utils/otherUtils");
const update_1 = require("../core/operation/update");
class FilesService {
    /**
     * 这里需要接受前端的文件名字，路径，文件类型,文件内容
     * @param request
     * @param response
     */
    static createOperation(request, response) {
        const file_name = request.body.file_name;
        const path = request.body.path;
        const type = request.body.type === 'txt' ? core_1.file_type.txt : core_1.file_type.folder;
        const content = request.body.content;
        const results = new resultBean_1.ResultBean();
        console.log(file_name);
        console.log(path);
        console.log(type);
        console.log(content);
        create_1.create(file_name, {
            path: path,
            content: content,
            fileType: type,
            recentWriterTime: null,
            recentReadTime: null,
        });
        console.log(positionViews_1.views.getViews());
        console.log(userCatalogue_1.UserRoot);
        response.json(results.successBean('创建成功'));
    }
    /**
     * 文件查询
     * @param request
     * @param response
     */
    static queryFiles(request, response) {
        const path = request.body.path;
        const Results = new resultBean_1.ResultBean();
        const files_info = otherUtils_1.queryFiles(path);
        //todo 路径出错校验
        response.json(Results.successBean('查询成功', files_info));
    }
    /**
     * 文件更新，包括更新名称，和内容。接受更新的名称，路径，内容
     * @param request
     * @param response
     */
    static updateFiles(request, response) {
        const name = request.body.file_name;
        const path = request.body.file_path;
        const content = request.body.content;
        const beforeName = request.body.beforeName;
        const type = request.body.type === 'txt' ? core_1.file_type.txt : core_1.file_type.folder;
        const Results = new resultBean_1.ResultBean();
        try {
            update_1.updateFiles(name, beforeName, path, content, type);
            response.json(Results.successBean('修改文件成功'));
        }
        catch (e) {
            console.log(e.message);
            response.json(Results.failBean(e.message));
        }
    }
}
exports.FilesService = FilesService;
