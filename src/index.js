const Koa = require('koa');
const Router = require('@koa/router')
const bodyParser = require('koa-bodyparser')
const axios = require('axios')
const {httping, ping} = require('./ping')
const {generateProcessId} = require('./utils')
const _ = require('lodash')

const http = new axios.create({
  baseURL: 'http://192.168.50.1',
  timeout: 5 * 1000
})

const app = new Koa();
app.use(bodyParser());
const router = new Router();

router
  .get('/ss-config', async (ctx, next) => {
    const result = await http.get('/_api/ss');
    ctx.body = result.data.result[0]
  })
  .get('/ss-status', async (ctx, next) => {
    const result = await Promise.all([
      httping('www.baidu.com'),
      httping('www.google.com.hk')
    ])
    ctx.body = {
      inland: result[0],
      foreign: result[1]
    }
  })
  .get('/ss-ping', async (ctx) => {
    const serverConfig = await http.get('/_api/ssconf_basic_server_');
    const servers = serverConfig.data.result[0]
    const serverlen = Object.keys(servers).length
    const results = await Promise.all(
      _.range(1, serverlen + 1)
        .map(key => ping(servers[`ssconf_basic_server_${key}`]))
    )
    ctx.body = _.zipObject(_.range(1, serverlen + 1), results);
  })
  .post('/ss-apply', async (ctx) => {
    const body = ctx.request.body
    const selectNode = body['nodeKey']
    if (selectNode) {
      try {
        await http.post('/_api/', {
          id: generateProcessId(),
          method: "ss_config.sh",
          params: ["start"],
          fields: {"ssconf_basic_node": selectNode}
        })
        ctx.res.statusCode = 200
      } catch (e) {
        ctx.res.statusCode = 500
      }
    } else {
      ctx.res.statusCode = 400
    }

  })

app.use(router.routes()).use(router.allowedMethods());

app.listen(4000);
