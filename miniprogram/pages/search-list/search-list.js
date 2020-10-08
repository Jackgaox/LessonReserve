// miniprogram/pages/searchlist/search-list.js
import {
  formatTime,
  validInput,
  stringConvert
} from '../../utils/util.js'
let MAX_LIMIT = 10
Page({
  /**
   * 页面的初始数据
   */
  data: {
    lessonlist: []
  },
  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (options) {
    let banner_id = options._id;
    let keyword = options.keyword;
    //根据banner查询
    if (banner_id) {
      this._lessonsForBanner(banner_id);
    }
    //根据关键字查询
    if (keyword) {
      this._lessonsForKeyword(keyword);
    }
  },
  _lessonsForKeyword: function (keyword) {
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'lessonlist',
      data: {
        keyword,
        start: this.data.lessonlist.length,
        count: MAX_LIMIT,
        $url: 'lesson_info',
      }
    }).then((res) => {
      //截取长度
      let lessonlist = res.result.data
      if (lessonlist.length > 0) {
        for (let i = 0; i < lessonlist.length; i++) {
          if (lessonlist[i].description.length > 70) {
            lessonlist[i].description = lessonlist[i].description.substr(0, 60) + "..."
          }
          lessonlist[i].description = stringConvert(lessonlist[i].description)
        }
        this.setData({
          lessonlist: this.data.lessonlist.concat(lessonlist)
        })
      } else {
        wx.navigateTo({
          url: `../noResult/noResult`
        })
      }
      wx.stopPullDownRefresh()
      wx.hideLoading()
    })
  },

  _lessonsForBanner: function (banner_id) {
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'api-banner',
      data: {
        banner_id,
        start: this.data.lessonlist.length,
        count: MAX_LIMIT,
        $url: 'lessonlistall',
      }
    }).then((res) => {
      //截取长度
      let lessonlist = []
      for (let item of res.result.list) {
        if (item.banner_lessons[0].description.length > 70) {
          item.banner_lessons[0].description = item.banner_lessons[0].description.substr(0, 60) + "..."
        }
        item.banner_lessons[0].description = stringConvert(item.banner_lessons[0].description)
        lessonlist.push(item.banner_lessons[0])
      }

      this.setData({
        lessonlist: this.data.lessonlist.concat(lessonlist)
      })
      wx.stopPullDownRefresh()
      wx.hideLoading()
    })
  },
})