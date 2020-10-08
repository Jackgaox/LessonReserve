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
exports.main = async(event, context) => {
  const app = new TcbRouter({
    event
  })
  app.router('lesson_info', async(ctx, next) => {
    if (event.keyword == 'ALL') {
      ctx.body = await db.collection('lesson_info')
        .skip(event.start)
        .limit(event.count)
        .orderBy('_id', 'asc')
        .get()
        .then((res) => {
          return res
        })
    } else if (event.keyword) {
      const keyword = event.keyword
      let w = {}
      if (keyword.trim() != '') {
        w = {
          lesson_name: new db.RegExp({
            regexp: keyword,
            options: 'i'
          })
        }
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
    }
  })
  app.router('lessondetail', async(ctx, next) => {
    //聚合查询
    ctx.body = db.collection('lesson_info').aggregate()
      .lookup({
        from: 'lessonclass',
        let: {
          li_id: '$_id',
        },
        pipeline: $.pipeline()
          .match(_.expr($.and([
            $.eq(['$lesson_id', '$$li_id']),
            $.eq(['$offline', '0']),
          ])))
          .done(),
        as: 'lesson_classes',
      })
      .match({
        _id: event.lesson_id,
        lesson_classes: _.elemMatch({
          offline: '0',
        })
      })
      .end()
      .then((res) => {
        return res
      })
      .catch(err => console.error(err))
  })
  return app.serve()
}