const Router = require('koa-router')
const router = new Router()

const User = require('../../models/User')
//test localhost:5000/api/users/test
/**
 * @route GET api/users/test
 * @desc 测试接口地址
 * @access 接口地址是公开的
 */
router.get('/test',async ctx => {
    ctx.status = 200;
    ctx.body = {msg:'user works....'};
})

module.exports = router.routes()