// pages/lessons/resultPage/resultPage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSuccess: false,
    iconSize: [20, 30, 40, 50, 60, 70],
    iconColor: [
      'red', 'green'
    ],
    iconType: [
      'success',  'warn'
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  onTap: function () {
    wx.switchTab({
      url: "/pages/lessons/lessons"
    })
  },
})