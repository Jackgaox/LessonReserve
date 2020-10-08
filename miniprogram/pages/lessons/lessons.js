const MAX_LIMIT = 3
const db = wx.cloud.database()
Page({
  data: {

  },
  onLoad: function (event) {
    wx.showShareMenu({
      withShareTicket: true
    })
    this._getSwiper()
  },
  //查看全部
  searchAll() {
    let keyword = 'ALL'
    wx.navigateTo({
      url: `../search-list/search-list?keyword=${keyword}`
    })
  },

  _getSwiper() {
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'api-swiper',
      data: {
        $url: 'swiper',
      }
    }).then((res) => {
      this.setData({
        swiperImgUrls: res.result.data
      })
      wx.hideLoading()
    })
  },

})