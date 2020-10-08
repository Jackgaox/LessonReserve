// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,//动态获取每个云环境对应的数据库
})
const TcbRouter = require('tcb-router')
const db = cloud.database()
const $ = db.command.aggregate
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({
    event
  })
  app.router('banner', async (ctx, next) => {
    ctx.body = await db.collection('banner').where({
      status: '1'
    })
      .skip(event.start)
      .limit(event.count)
      .orderBy('show_order', 'asc')
      .get()
      .then((res) => {
        return res
      })
  })

  app.router('lessonlist', async (ctx, next) => {
    //聚合查询
    ctx.body = db.collection('banner_to_lesson').aggregate()
      .lookup({
        from: 'lesson_info',
        let: {
          btl_lesson_id: '$lesson_id',
        },
        pipeline: $.pipeline()
          .match(_.expr($.and([
            $.eq(['$_id', '$$btl_lesson_id']),
            $.eq(['$offline', '0']),
          ])))
          .done(),
        as: 'banner_lessons',
      })
      .match({
        banner_id: event.banner_id,
        banner_lessons: _.elemMatch({
          offline: '0',
        })
      })
      .sort({
        sort_id: 1,
      })
      .limit(3)
      .end()
      .then((res) => {
        return res
      })
      .catch(err => console.error(err))
  })

  app.router('lessonlistall', async (ctx, next) => {
    //聚合查询
    ctx.body = db.collection('banner_to_lesson').aggregate()
      .lookup({
        from: 'lesson_info',
        let: {
          btl_lesson_id: '$lesson_id',
        },
        pipeline: $.pipeline()
          .match(_.expr($.and([
            $.eq(['$_id', '$$btl_lesson_id']),
            $.eq(['$offline', '0']),
          ])))
          .done(),
        as: 'banner_lessons',
      })
      .match({
        banner_id: event.banner_id,
        banner_lessons: _.elemMatch({
          offline: '0',
        })
      })
      .sort({
        sort_id: 1,
      })
      .end()
      .then((res) => {
        return res
      })
      .catch(err => console.error(err))
  })
  return app.serve()
}