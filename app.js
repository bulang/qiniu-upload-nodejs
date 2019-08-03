const koa = require("koa");
const Router = require("koa-router");
const static = require("koa-static");
const koaBody = require("koa-body");
const upUtil = require("./qiniu/util.js");
const Qiniu = require("./qiniu/index.js");
const options = require("./qiniu/config.js");
const path = require("path");
const app = new koa();
const staticFile = '/public/'
app.use(static(__dirname+staticFile));
app.use(koaBody({
    multipart:true
}));
const upload = new Router();
/**
 * 上传到本地服务器
 */
upload.post('upload',async (ctx)=>{
    const upFile = 'uploads';
    const uploadPath = path.join(__dirname, staticFile+upFile)
    const upload = new upUtil(ctx,{
        path:uploadPath
    });
    const result = await upload.uploadFile();
    const imgPath = path.join(upFile, result.fileName)
    ctx.response.body = {
        errorCode:"ok",
        msg:"上传成功",
        data:{
            url:`http://${ctx.request.host}/${imgPath}`
        }
    }
});
/**
 *文件上传七牛云
 */
upload.post('fileUpload',async (ctx)=>{
    const upFile = 'uploads';
    const uploadPath = path.join(__dirname, staticFile+upFile)
    const upload = new upUtil(ctx,{
        path:uploadPath
    });
    const result = await upload.uploadFile();
    const imgPath = path.join(uploadPath, result.fileName);
    const qiniu = await (new Qiniu(options)).fileUpload(imgPath,result.fileName);
    upload.removeTemImage(imgPath);
    ctx.response.body = {
        errorCode:"ok",
        msg:"上传成功",
        data:{
            url:`${options.host}/${qiniu.key}`
        }
    }
});
/**
 * 数据流上传七牛云
 */
upload.post('streamUpload',async (ctx)=>{
    const qiniu = await (new Qiniu(options)).streamUpload(ctx);
    ctx.response.body = {
        errorCode:"ok",
        msg:"上传成功",
        data:{
            url:`${options.host}/${qiniu.key}`
        }
    }
});
const router = new Router();
router.use('/',upload.routes(),upload.allowedMethods());
app.use(router.routes()).use(router.allowedMethods());
app.listen(3006);
console.log('server listen on http://127.0.0.1:3006');