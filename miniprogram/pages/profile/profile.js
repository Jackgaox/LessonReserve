// pages/profile/profile.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    authorized: false,
    userInfo: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.userAuthorized()
  },

  onShow(options) {

    // wx.getUserInfo({
    //   success:data=>{
    //     console.log(data)
    //   }
    // })
  },

  onTapQrCode() {
    wx.showLoading({
      title: '生成中',
    })
    wx.cloud.callFunction({
      name: 'getqrcode'
    }).then((res) => {
      const fileId = res.result
      wx.previewImage({
        urls: [fileId],
        current: fileId
      })
      wx.hideLoading()
    })
  },
  onJumpToMyLesson(event) {
    const userAuthorized = this.userAuthorized()
    
    wx.navigateTo({
      url: '/pages/mylesson/mylesson',
    })

    // userAuthorized.then(() => {
    //   if (!this.data.authorized)(
    //     this.onGetUserInfo(event)
    //   )
    //   else {
    //     wx.navigateTo({
    //       url: '/pages/mylesson/mylesson',
    //     })
    //   }
    // })
  },

  // onJumpToAbout(event) {
  //   wx.navigateTo({
  //     url: '',
  //   })
  // },
  //是否已授权
  userAuthorized() {
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success: data => {
          console.log(data.authSetting)
          if (data.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: data => {
                this.setData({
                  authorized: true,
                  userInfo: data.userInfo
                })
              }
            })
          } else {
            this.setData({
              authorized: false,
              userInfo: null
            })
          }
          resolve()
        }
      })
    })
  },
  onGetUserInfo(event) {
    const userInfo = event.detail.userInfo
    if (userInfo) {
      this.setData({
        userInfo,
        authorized: true
      })
    }
  },
})
