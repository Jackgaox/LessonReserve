// components/lessongroup/lessongroup.js
const MAX_LIMIT = 3
const db = wx.cloud.database()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    
  },

  /**
   * 组件的初始数据
   */
  data: {
    list: []
  },

  /**
   * 组件生命周期函数
   */
  lifetimes: {
    ready() {
      this._getlessongroup()
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _getlessongroup: function () {
      wx.showLoading({
        title: '加载中',
      })
      wx.cloud.callFunction({
        name: 'api-banner',
        data: {
          start: this.data.list.length,
          count: MAX_LIMIT,
          $url: 'banner',
        }
      }).then((res) => {
        this.setData({
          list: this.data.list.concat(res.result.data)
        })
        wx.stopPullDownRefresh()
        wx.hideLoading()
      })
    },
    onMoreTap: function (event) {
      var _id = event.currentTarget.dataset._id;
      wx.navigateTo({
        url: `../search-list/search-list?_id=${_id}`
      })
    }
  }
})
