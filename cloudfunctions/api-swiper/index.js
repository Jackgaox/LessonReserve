// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,//动态获取每个云环境对应的数据库
})
const TcbRouter = require('tcb-router')
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({
    event
  })
  app.router('swiper', async (ctx, next) => {
    ctx.body = await db.collection('swiper')
      .get()
      .then((res) => {
        return res
      })
  })
  return app.serve()
}