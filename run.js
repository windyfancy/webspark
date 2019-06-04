const fs = require('fs');
const path = require('path');
const copyFile = function (srcPath, tarPath, filter = []) {
    let files=fs.readdirSync(srcPath) 
 
    files.forEach(function (filename) {
        let filedir = path.join(srcPath, filename);
        console.log("copy初始文件：",filedir)
        let stats = fs.statSync(filedir)
        let isFile = stats.isFile()
        if (isFile) {                                    // 复制文件
            const destPath = path.join(tarPath, filename);
            fs.copyFileSync(filedir, destPath, (err) => { })
        } else {                                        // 创建文件夹
            let tarFiledir = path.join(tarPath, filename);
            if(!fs.existsSync(tarFiledir)){
                fs.mkdirSync(tarFiledir, (err) => { });
            }
            copyFile(filedir, tarFiledir, filter)                 // 递归
        }

    })
         
    
}
 
if (__dirname.indexOf("node_modules") >= 0) {
    copyFile(path.resolve(__dirname,'./'), path.resolve(__dirname,'../..'));
    setImmediate(()=>{
        require(path.resolve(__dirname,"../../app.js"));
    })
    
    
}