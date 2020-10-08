import {
  formatTime,
  validInput,
  stringConvert
} from '../../utils/util.js'
let lessonClass = ""
let ischeckedclass = false
let objectClassList = []
let num_limit = 0
let isNumExceed = false
let isAlreadyReserve = false
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classList: [],
    index: 0,
    lessonData: {},
    reserved_count: '',
    start_date: '',
    end_date: '',
    num_limit: '',
    authorized: false,
    userInfo: null,
  },

  init: function () {
    lessonClass = ""
    ischeckedclass = false
    objectClassList = []
    num_limit = 0
    isNumExceed = false
    isAlreadyReserve = false
  },
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
  //授权信息
  onGetUserInfo(event) {
    const userInfo = event.detail.userInfo
    if (userInfo) {
      this.setData({
        userInfo,
        authorized: true
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    this.userAuthorized()
    this.init()
    let lesson_id = option.lesson_id
    this._getLessonDetail(lesson_id)
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.init()
  },
  /**
   * 获取课程详细界面
   */
  _getLessonDetail: function (lesson_id) {
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'lessonlist',
      data: {
        lesson_id,
        $url: 'lessondetail',
      }
    }).then((res) => {
      let data = res.result.list[0]
      data.description = stringConvert(data.description)
      this.setData({
        lessonData: data
      })

      let classListTemp = []
      data.lesson_classes.forEach((item, index) => {
        classListTemp.push(item.class_name)
        objectClassList.push(item)
      })
      if (objectClassList.length != 0) {
        //班次限制人数
        num_limit = objectClassList[this.data.index].num_limit
        //班次开始时间
        let start_date = formatTime(new Date(objectClassList[this.data.index].start_date), 'yyyy-MM-dd hh:mm:ss')
        //班次结束时间
        let end_date = formatTime(new Date(objectClassList[this.data.index].end_date), 'yyyy-MM-dd hh:mm:ss')
        this.setData({
          start_date: start_date,
          end_date: end_date,
          num_limit: num_limit
        })
        this.setData({
          classList: classListTemp
        })
        ischeckedclass = true
        let promiseArr = []
        let p1 = this.getReservedNum()
        promiseArr.push(p1)
        let p2 = this.getReservedNumByOpenId()
        promiseArr.push(p2)
        Promise.all(promiseArr).then((res) => {
          wx.hideLoading()
        })
      }
      wx.hideLoading()
      wx.stopPullDownRefresh()
    })
  },
  /**
   * 班级选择滑动
   */
  bindPickerChange: function (e) {
    let index = e.detail.value
    this.setData({
      index: index
    })
    this.getReservedNum()
    this.getReservedNumByOpenId()
    //班次限制人数
    num_limit = objectClassList[index].num_limit
    //班次开始时间
    let start_date = formatTime(new Date(objectClassList[this.data.index].start_date), 'yyyy-MM-dd')
    //班次结束时间
    let end_date = formatTime(new Date(objectClassList[this.data.index].end_date), 'yyyy-MM-dd')
    this.setData({
      start_date: start_date,
      end_date: end_date,
      num_limit: num_limit
    })
    ischeckedclass = true
  },
  /**
   * 查看已报名人数
   */
  getReservedNum: function (event) {
    this.setData({
      reserved_count: '',
    })
    return new Promise((resolve, reject) => {
      wx.showLoading({
        title: '加载中',
      })
      let class_id = objectClassList[this.data.index]._id
      wx.cloud.callFunction({
        name: 'lessson_Reserve',
        data: {
          class_id,
          $url: 'getReservedNum',
        }
      }).then((res) => {
        this.setData({
          reserved_count: res.result.total,
        })
        if (res.result.total >= num_limit) {
          isNumExceed = true
        }
        wx.hideLoading()
        resolve()
      })
    })
  },
  /**
   * 是否已报名该班次
   */
  getReservedNumByOpenId: function (event) {
    isAlreadyReserve = false
    return new Promise((resolve, reject) => {
      let class_id = objectClassList[this.data.index]._id
      wx.cloud.callFunction({
        name: 'lessson_Reserve',
        data: {
          class_id,
          $url: 'getReservedNumByOpenId',
        }
      }).then((res) => {
        if (res.result.total >= 1) {
          isAlreadyReserve = true
        }
        resolve()
      })
    })
  },
  /**
   * 跳转预定页面
   */
  toReservePage: function (event) {
    const userAuthorized = this.userAuthorized()
    userAuthorized.then(() => {
      if (!this.data.authorized) {
        this.onGetUserInfo(event)
      } else {
        if (!ischeckedclass) {
          wx.showModal({
            title: '需要选择班次',
            content: '',
            showCancel: false
          })
        } else if (isNumExceed) {
          wx.showModal({
            title: '报名人数已满',
            content: '',
            showCancel: false
          })
        } else if (isAlreadyReserve) {
          wx.showModal({
            title: '已经报名过该班次或您的预约已被退订',
            content: '',
            showCancel: false
          })
        } else {
          let lesson_name = event.currentTarget.dataset.lesson_name;
          let lesson_id = event.currentTarget.dataset._id;
          let cover_cloudid = event.currentTarget.dataset.cover_cloudid;
          wx.navigateTo({
            url: `../ReservePage/ReservePage?lesson_name=${lesson_name}&lesson_id=${lesson_id}&class_id=${objectClassList[this.data.index]._id}&cover_cloudid=${cover_cloudid}`
          })
        }
      }
    })
  },

})
