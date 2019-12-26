# webspark
webspark是使用node.js开发的博客系统，支持 mysql,sqlite两种数据库，默认使用sqlite数据库。 使用npm安装后即可运行，开箱即用。

安装步骤

1. 使用npm安装webspark
```
 npm install --save webspark
```

2. 首次运行，在命令行执行如下命令，用于将node_modules中的项目文件复制到当前目录，当然手工copy也是可以的

 ```
  node -e "require('webspark')"
 ```

3. 打开浏览器输入：http://localhost:8000/ 即可访问



后续访问直接运行app.js即可
 ```
  node app.js
 ```

 # 界面截图

 ![](https://raw.githubusercontent.com/windyfancy/webspark/master/screenshot/1.png)
 
 ![](https://github.com/windyfancy/webspark/blob/master/screenshot/2.png?raw=true)
