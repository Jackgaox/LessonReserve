// 云函数入口文件
const cloud = require('wx-server-sdk')

const TcbRouter = require('tcb-router')

const db = cloud.database()

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,//动态获取每个云环境对应的数据库
})

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({
    event
  })
  app.router('searchlist_title', async (ctx, next) => {
    const keyword = event.keyword
    let w = {}
    if (keyword.trim() != '') {
      w = {
        title: new db.RegExp({
          regexp: keyword,
          options: 'i'
        })
      }
      ctx.body = await db.collection('lesson_info')
        .where(w)
        .skip(event.start)
        .limit(event.count)
        .orderBy('_id', 'asc')
        .get()
        .then((res) => {
          return res
        })
    } else if (keyword == 'ALL'){
      ctx.body = await db.collection('lesson_info')
        .skip(event.start)
        .limit(event.count)
        .orderBy('_id', 'asc')
        .get()
        .then((res) => {
          return res
        })
    }
  })
  return app.serve()
}