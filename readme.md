![图例](http://static.bulang123.cn/2ba1c219a8a8aec5c6830eefaf5dfb74)

#### 下载并安装依赖

1. ```
   git clone https://github.com/bulang/qiniu-upload-nodejs.git
   ```

2. ```
   cd qiniu-upload-nodejs
   yarn
   ```

#### 修改七牛云配置文件

> 文件位于qiniu>config.js

```javascript
module.exports = {
    accessKey:'',
    secretKey:'',
    expires:7200,
    bucket:'',
    returnBody:'{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}',
    zone:'',
    host:''
}
```

|    key     |                注释                |
| :--------: | :--------------------------------: |
| accessKey  |        七牛账号的accessKey         |
| secretKey  |        七牛账号的secretKey         |
|  expires   |           上传凭证有效期           |
| returnBody | 自定义上传完成之后七牛云的返回信息 |
|   bucket   |         要上传的存储空间名         |
|    zone    |           空间对应的机房           |
|    host    |           空间绑定的域名           |

#### 启动服务

```
node app.js
```

#### 文件说明

``` 
qiniu-upload-nodejs
    │  app.js           // 项目入口文件
    │  package.json		// 项目配置文件	
    │  readme.md        // readme文件
    │  yarn.lock        // yarn 相关文件
    │
    ├─public			// 静态资源文件	
    │  index.html		// 前台首页	
    │  
    │  
    │
    └─qiniu				// 上传核心文件	
            config.js	// 七牛配置文件
            index.js	// 上传七牛相关函数文件
            util.js		// 上传本地服务器相关函数文件
```



