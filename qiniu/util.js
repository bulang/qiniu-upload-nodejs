const fs = require('fs');
const path = require('path');
const md5 = require('md5');
class Upload {
    constructor(ctx,options){
        this.ctx = ctx;
        this.options = options;
    }
    /**
     * 创建写入目录
     */
    mkdirsSync(dirname){
        if (fs.existsSync(dirname)) {
            return true
        } else {
            if (this.mkdirsSync(path.dirname(dirname))) {
                fs.mkdirSync(dirname)
                return true
            }
        }
        return false
    }
    /**
     * 获取文件后缀
     */
    getSuffix (fileName) {
        return fileName.split('.').pop()
    }
    /**
     * 文件重命名
     */
    rename(fileName){
        return md5(Math.random().toString(16)+fileName) + '.' + this.getSuffix(fileName)
    }
    /**
     * 删除文件
     */
    removeTemImage (path) {
        fs.unlink(path, (err) => {
            if (err) {
               throw err
            }
        })
    }
    /**
     * 上传文件到本地服务器
     */
    uploadFile () {
        if(!this.mkdirsSync(this.options.path)){
            return false;
        }
        const file = this.ctx.request.files.file;
        const reader = fs.createReadStream(file.path);
        const fileName = this.rename(file.name);
        let filePath =  `${this.options.path}/${fileName}`;
        const upStream = fs.createWriteStream(filePath);
        return new Promise((resolve,reject)=>{
            reader.pipe(upStream).on('finish',()=>{
                resolve({
                    fileName:`${fileName}`,
                    fileSize:file.size,
                    fileType:file.type
                });
            });
        });
    }
}

module.exports = Upload;

