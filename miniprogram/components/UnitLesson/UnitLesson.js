// components/lessonsingle/lessonsingle.js
const MAX_LIMIT = 3
const db = wx.cloud.database()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    _id: {
      type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    lessonlist: []
  },

  /**
   * 组件生命周期函数
   */
  lifetimes: {
    ready() {
      this._getlessonlist()
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _getlessonlist: function () {
      wx.showLoading({
        title: '加载中',
      })
      wx.cloud.callFunction({
        name: 'api-banner',
        data: {
          start: this.data.lessonlist.length,
          count: MAX_LIMIT,
          banner_id: this.properties._id,
          $url: 'lessonlist',
        }
      }).then((res) => {
        this.setData({
          lessonlist: this.data.lessonlist.concat(res.result.list)
        })
        wx.stopPullDownRefresh()
        wx.hideLoading()
      })
    },
    //点击课程跳转详细页
    onlessonTap: function (event) {
      let lesson_id = event.currentTarget.dataset.lesson_id;
      wx.navigateTo({
        url: `../lesson-detail/lesson-detail?lesson_id=${lesson_id}`
      })
    },
  }
})
