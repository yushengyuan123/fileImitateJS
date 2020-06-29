import {file_type} from "../core";
import {create} from "../core/operation/create";
import {ResultBean} from "../utils/resultBean";
import {views} from "../core/positionViews/positionViews";
import {UserRoot} from "../core/catalogue/userCatalogue";
import {queryFiles} from "../core/utils/otherUtils";
import {queryFilesFormat} from "../core/operation/interface";
import {updateFiles} from "../core/operation/update";
import {deleteFiles} from "../core/operation/delete";
import {updateFilesContent} from "../core/operation/updateContent";

export class FilesService {
    /**
     * 这里需要接受前端的文件名字，路径，文件类型,文件内容
     * @param request
     * @param response
     */
    public static createOperation(request: any, response: any): void {
        const file_name: string = request.body.file_name;
        const path: string = request.body.path;
        const type: file_type = request.body.type === 'txt' ? file_type.txt : file_type.folder;
        const content: string = request.body.content;
        const results: ResultBean = new ResultBean();

        create(file_name, {
            path: path,
            content: content,
            fileType: type,
            recentWriterTime: null,
            recentReadTime: null,
        });

        console.log(views.getViews())
        console.log(UserRoot[0].files_list[0])

        response.json(results.successBean('创建成功'))
    }

    /**
     * 文件查询
     * @param request
     * @param response
     */
    public static queryFiles(request: any, response: any): void {
        const path = request.body.path;
        const Results = new ResultBean();
        const files_info: queryFilesFormat = queryFiles(path);

        //todo 路径出错校验

        response.json(Results.successBean('查询成功', files_info))
    }

    /**
     * 文件更新，包括更新名称，和内容。接受更新的名称，路径，内容
     * @param request
     * @param response
     */
    public static updateFiles(request: any, response: any): void {
        const name = request.body.file_name;
        const path = request.body.file_path;
        const beforeName = request.body.beforeName ;
        const Results: ResultBean = new ResultBean();

        try {
            updateFiles(name, beforeName, path);
            response.json(Results.successBean('修改文件成功'))
        } catch(e) {
            console.log(e.message)
            response.json(Results.failBean(e.message));
        }
    }

    public static deleteFiles(request: any, response: any): void {
        const name = request.body.file_name;
        const path = request.body.file_path;
        const type: file_type = request.body.type === 'txt' ? file_type.txt : file_type.folder;
        const result: ResultBean = new ResultBean();

        console.log(name)
        console.log(path)
        console.log(type)

        deleteFiles(path, name, type)

        response.json(result.successBean('删除成功'))
    }

    public static updateContent(request: any, response: any) {
        const name = request.body.file_name;
        const path = request.body.file_path;
        const content = request.body.content;
        const beforeContent = request.body.beforeContent;
        const result: ResultBean = new ResultBean();

        // try {
            updateFilesContent(name, path, content, beforeContent)

            console.log(views.getViews())
            response.json(result.successBean('修改成功'))
        // } catch (e) {
        //     response.json(result.failBean(e.message))
        // }
    }

}
