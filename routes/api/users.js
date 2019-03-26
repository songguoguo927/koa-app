const Router = require("koa-router");
const router = new Router();

const gravatar = require('gravatar');
const tools = require("../../config/tools")

const User = require("../../models/User");

//test localhost:5000/api/users/test

/**
 * @route GET api/users/test
 * @desc 测试接口地址
 * @access 接口地址是公开的
 */
router.get("/test", async ctx => {
  ctx.status = 200;
  ctx.body = { msg: "user works...." };
});

/**
 * @route POST api/users/register
 * @desc 注册接口地址
 * @access 接口地址是公开的
 */
router.post("/register", async ctx => {
  //    console.log(ctx.request.body)
  //存储到数据库
  const findResult = await User.find({ email: ctx.request.body.email });
  // console.log(findResult)
  if (findResult.length > 0) {
    ctx.status = 500;
    ctx.body = { email: "邮箱已被占用" };
  } else {
    //没查到
    const avatar = gravatar.url(ctx.request.body.email, {s: '200', r: 'pg', d: 'mm'});
    const newUser = new User({
      name: ctx.request.body.name,
      email: ctx.request.body.email,
      avatar,
      password: tools.enbcrypt(ctx.request.body.password)
    });
    
    // console.log(newUser)
    //存储到数据库
    await newUser
      .save()
      .then(user => {
        ctx.body = user;
      })
      .catch(err => {
        console.log(err);
      });
    ctx.body = newUser;
  }
});
module.exports = router.routes();
