// components/search/search.js
let keyword = ''
const MAX_LIMIT = 10
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    placeholder: {
      type: String,
      value: '请输入关键字'
    }
  },
  externalClasses: [
    'iconfont',
    'icon-sousuo',
  ],

  /**
   * 组件的初始数据
   */
  data: {
    searchlist:[]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onInput(event) {
      keyword = event.detail.value
    },

    onSearch() {
      wx.navigateTo({
        url: `../search-list/search-list?keyword=${keyword}`
      })
    },
    searchAll() {
      let keyword = 'ALL'
      wx.navigateTo({
        url: `../search-list/search-list?keyword=${keyword}`
      })
    },
  }
})