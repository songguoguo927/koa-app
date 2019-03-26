# koa 入门-实战写接口

**1.搭建本地服务器**

yarn add koa koa-router --save

**2.连接mongoDB 数据库**

在线数据库 mlab的使用

**3.创建测试接口和用户模型**

**4.注册接口和调试工具**

接口调试工具postman（调试本地接口or远程接口）

npm i koa-bodyparser  获取前台传过来的数据

npm install bcryptjs  密码加密

**5.全球公认头像的使用**

npm install gravatar

**6.解决注册接口加密问题**

希望存储到数据库的密码也显示密文-通过封装加密模块后进行调用

**7.登陆接口**

**8.生成token**

yarn add jsonwebtoken --save

**9.passport验证token**

解析token

yarn add koa-passport -D

yarn add passport-jwt -D

**10.使用validator验证表单**

yarn add validator -D

后端进行验证

**11.验证注册和登陆的input**