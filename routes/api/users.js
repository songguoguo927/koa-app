const Router = require("koa-router");
const router = new Router();
const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");
const tools = require("../../config/tools");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const keys = require("../../config/keys");

const passport = require("koa-passport");
//引入input验证
const validateRegisterInput = require("../../validation/register");
const validateRLoginInput = require("../../validation/login");
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
  const { errors, isValid } = validateRegisterInput(ctx.request.body);
  //判断验证是否通过
  if (!isValid) {
    ctx.status = 400;
    ctx.body = errors;
    return;
  }
  //存储到数据库
  const findResult = await User.find({ email: ctx.request.body.email });
  // console.log(findResult)
  if (findResult.length > 0) {
    ctx.status = 500;
    ctx.body = { email: "邮箱已被占用" };
  } else {
    //没查到
    const avatar = gravatar.url(ctx.request.body.email, {
      s: "200",
      r: "pg",
      d: "mm"
    });
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

/**
 * @route POST api/users/login
 * @desc 登录接口地址 返回token
 * @access 接口地址是公开的
 */
router.post("/login", async ctx => {
  const { errors, isValid } = validateLoginInput(ctx.request.body);
  //判断验证是否通过
  if (!isValid) {
    ctx.status = 400;
    ctx.body = errors;
    return;
  }
  //查询
  const findResult = await User.find({ email: ctx.request.body.email });
  const user = findResult[0];
  const password = ctx.request.body.password;
  //判断是否查到
  if (findResult.length == 0) {
    ctx.status = 404;
    ctx.body = { email: "用户不存在" };
  } else {
    //查到后 验证密码
    var result = await bcrypt.compareSync(password, user.password);
    //验证通过
    if (result) {
      //返回token
      const payload = { id: user.id, name: user.name, avatar: user.avatar };
      const token = jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 });

      ctx.status = 200;
      ctx.body = { success: true, token: "Bearer " + token }; //token格式固定，有空格，不要写错了
    } else {
      ctx.status = 400;
      ctx.body = { password: "密码错误" };
    }
  }
});

/**
 * @route GET api/users/current
 * @desc 用户信息接口地址 返回用户信息
 * @access 接口地址是私密的
 */
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  async ctx => {
    // ctx.body = ctx.state.user
    ctx.body = {
      id: ctx.state.user.id,
      name: ctx.state.user.name,
      email: ctx.state.user.email,
      avatar: ctx.state.user.avatar
    };
  }
);
module.exports = router.routes();
