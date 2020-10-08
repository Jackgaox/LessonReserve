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

  app.router('orderlessons', async (ctx, next) => {
    let lessonlist = []
    const wxContext = cloud.getWXContext()
    ctx.body = await db.collection('class_student').aggregate()
      .lookup({
        from: 'lesson_info',
        localField: 'lesson_id',
        foreignField: '_id',
        as: 'lesson_info',
      })
      .match({
        _openid: wxContext.OPENID,
      })
      .end()
      .then((res) => {
        return res
      })
      .catch(err => console.error(err))
  })

  return app.serve()
}