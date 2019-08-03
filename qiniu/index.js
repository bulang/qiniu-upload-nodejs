const qiniu = require("qiniu");
const fs = require('fs');
const md5 = require('md5');
class Qiniu{
    constructor(options){
        this.accessKey = options.accessKey;
        this.secretKey = options.secretKey;
        this.expires = options.expires;
        this.bucket = options.bucket;
        this.returnBody = options.returnBody;
        this.zone = options.zone;
    }
    //定义鉴权对象
    makeMac(){
        return new qiniu.auth.digest.Mac(this.accessKey, this.secretKey);
    }
    /**
     * 简单上传凭证
     */
    simpleToken(){
        const options = {
            scope: this.bucket,
            expires: this.expires,
            returnBody:this.returnBody
        };
        const putPolicy = new qiniu.rs.PutPolicy(options);
        return putPolicy.uploadToken(this.makeMac());
    }
    /**
     * 以本地文件方式上传
     * @param {文件路径} filePath 
     * @param {文件名} fileNme 
     */
    fileUpload(filePath, fileNme){
        const uploadToken = this.simpleToken();
        const config = new qiniu.conf.Config()
        // 空间对应的机房
        config.zone = qiniu.zone[this.zone]
        const localFile = filePath;
        const formUploader = new qiniu.form_up.FormUploader(config)
        const putExtra = new qiniu.form_up.PutExtra()
        const key = md5(fileNme);
        // 文件上传
        return new Promise((resolved, reject) => {
            formUploader.putFile(uploadToken, key, localFile, putExtra, function (respErr, respBody, respInfo) {
                console.log(respBody);
                if (respErr) {
                    reject(respErr)
                }
                if (respInfo.statusCode == 200) {
                    resolved(respBody)
                } else {
                    resolved(respBody)
                }
            })
        })
    }
    /**
     * 以数据流方式上传
     */
    streamUpload(ctx){
        const uploadToken = this.simpleToken();
        const config = new qiniu.conf.Config();
        config.zone = qiniu.zone[this.zone];
        const formUploader = new qiniu.form_up.FormUploader(config);
        const putExtra = new qiniu.form_up.PutExtra();
        const filePath = ctx.request.files.file.path;
        const readableStream = fs.createReadStream(filePath);
        const key = md5(filePath);
        return new Promise((resolve, reject)=>{
            formUploader.putStream(uploadToken, key, readableStream, putExtra, function(respErr,  respBody, respInfo) {
                if (respErr) {
                    reject(respErr);
                }
                if (respInfo.statusCode == 200) {
                    resolve(respBody);
                } else {
                    resolve(respBody);
                }
            });
        });
    }
}

module.exports = Qiniu;