// components/searchsingle/searchsingle.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    lesson: {
      type: Object,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onlessonTap: function (event) {
      var lesson_id = event.currentTarget.dataset._id;
      wx.navigateTo({
        url: `../lesson-detail/lesson-detail?lesson_id=${lesson_id}`
      })
    }

  }
})
