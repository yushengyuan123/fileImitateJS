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
        const time: string = request.body.time
        const results: ResultBean = new ResultBean();

        create(file_name, {
            path: path,
            content: content,
            fileType: type,
            createTime: time,
            recentWriterTime: null,
            recentReadTime: null,
        });

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
        const beforeName = request.body.beforeName;
        const type: file_type = request.body.file_type ? file_type.txt : file_type.folder;
        const time: string = request.body.editTime;
        const Results: ResultBean = new ResultBean();

        try {
            updateFiles(name, beforeName, path, time, type);
            response.json(Results.successBean('修改文件成功'))
        } catch (e) {
            response.json(Results.failBean(e.message));
        }
    }

    public static deleteFiles(request: any, response: any): void {
        const name = request.body.file_name;
        const path = request.body.file_path;
        const type: file_type = request.body.type ? file_type.txt : file_type.folder;
        const result: ResultBean = new ResultBean();

        deleteFiles(path, name, type)

        response.json(result.successBean('删除成功'))
    }

    public static updateContent(request: any, response: any) {
        const name = request.body.file_name;
        const path = request.body.file_path;
        const content = request.body.content;
        const beforeContent = request.body.beforeContent;
        const time = request.body.editTime
        const result: ResultBean = new ResultBean();

        try {
            updateFilesContent(name, path, content, time, beforeContent)
            response.json(result.successBean('修改成功'))
        } catch (e) {
            response.json(result.failBean(e.message))
        }
    }

    /**
     * 进入下一级目录
     * @param request
     * @param response
     */
    public static entryNextCatalogue(request: any, response: any) {
        const path: string = request.body.path
    }

}
