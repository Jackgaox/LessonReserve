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

  app.router('setReserveinfo', async (ctx, next) => {
    const wxContext = cloud.getWXContext()
    await db.collection('class_student').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        _openid: wxContext.OPENID,
        _appid: wxContext.APPID,
        _unionid: wxContext.UNIONID,
        lesson_name: event.lesson_name,
        lesson_id: event.lesson_id,
        cover_cloudid: event.cover_cloudid,
        class_name: event.class_name,
        class_id: event.class_id,
        message: event.message,
        phone_number: event.phone_number,
        student_name: event.student_name,
        reserve_status: event.reserve_status,
        reserve_date: event.reserve_date,
        revoke_reason: event.revoke_reason,
        reserve_date: event.reserve_date,
      }
    })
      .then(res => {
        ctx.body = res
      })
      .catch(console.error)
  })

  app.router('getReservedNum', async (ctx, next) => {
    const _ = db.command
    await db.collection('class_student').where({
      class_id: event.class_id, // 填入当前班次id
      reserve_status: _.neq("2")
    })
      .count()
      .then(res => {
        ctx.body = res
      })
  })
  app.router('getReservedNumByOpenId', async (ctx, next) => {
    const wxContext = cloud.getWXContext()
    await db.collection('class_student').where({
      class_id: event.class_id, 
      _openid: wxContext.OPENID,// 填入当前用户 openid
    })
      .count()
      .then(res => {
        ctx.body = res
      })
  })
  return app.serve()
}