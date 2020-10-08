// miniprogram/pages/mylesson/mylesson.js
import {
  formatTime,
  validInput,
  stringConvert
} from '../../utils/util.js'
const app = getApp()
let MAX_LIMIT = 10
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mylessonlist: []
  },

  _getmylessonlist: function () {
    let openid = app.globalData.openid
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'api-mylesson',
      data: {
        openid,
        start: this.data.mylessonlist.length,
        count: MAX_LIMIT,
        $url: 'orderlessons',
      }
    }).then((res) => {
      if (res.result != undefined && res.result.list.length > 0) {
        //截取长度
        let mylessonlist = []
        for (let item of res.result.list) {
          if (item.lesson_info[0] && item.lesson_info[0].description.length > 70) {
            item.lesson_info[0].description = item.lesson_info[0].description.substr(0, 60) + "..."
          }
          item.lesson_info[0].description = stringConvert(item.lesson_info[0].description)
          mylessonlist.push(item)
        }
        this.setData({
          mylessonlist: this.data.mylessonlist.concat(mylessonlist)
        })
      } else {
        wx.navigateTo({
          url: `../noResult/noResult`
        })
      }
    })
    wx.stopPullDownRefresh()
    wx.hideLoading()

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getmylessonlist()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
