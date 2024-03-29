const koa = require("koa");
const Router = require("koa-router");
const mongoose = require("mongoose");
const bodyParser = require("koa-bodyparser");
const passport = require("koa-passport");
//实例化
const app = new koa();
const router = new Router();
app.use(bodyParser());

app.use(passport.initialize());
app.use(passport.session());

//
const users = require("./routes/api/users");
//路由

router.get("/", async ctx => {
  ctx.body = { msg: "hello koa interface" };
});
//config
const db = require("./config/keys").mongoURI;
//连接数据库
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => {
    console.log("mongodb connected");
  })
  .catch(err => {
    console.log(err);
  });
//回调到config passport.js
require("./config/passport")(passport);
//配置路由地址 当localhost:5000/api/users 都会去users 路由下去找
router.use("/api/users", users);
//配置路由
app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`server started on ${port}`);
});
