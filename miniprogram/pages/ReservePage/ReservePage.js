// pages/lessons/ReservePage/ReservePage.js
import {
  formatTime,
  validInput
} from '../../utils/util.js'
let phone_number = ''
let student_name = ''
let message = ''
let num_limit = 0
let class_id = ''
let lesson_id = ''
let cover_cloudid = ''
let start_date = ''
let end_date = ''
let isNumExceed = false
let isExpire = false
let isStart = false
let isAlreadyReserve = false
let reserve_status = 1
let revoke_reason = ''
//是否通过验证
let isVerifica = true
Page({
  /**
   * 页面的初始数据
   */
  data: {
    lesson_name: '',
    class_name: '',
  },

  /**
   * 输入框监听
   */
  onInputPhoneNumber(event) {
    phone_number = event.detail.value
  },

  onInputStudentName(event) {
    student_name = event.detail.value
  },

  onInputMessage(event) {
    message = event.detail.value
  },
  /**
   * 回调初始化数据
   */
  init: function() {
    wx.showLoading({
      title: '加载中',
    })
    //获取限制人数
    wx.cloud.callFunction({
      name: 'class-detail',
      data: {
        class_id,
        $url: 'classDetail',
      }
    }).then((res) => {
      this.setData({
        class_name: res.result.data.class_name
      })
      start_date = res.result.data.start_date
      end_date = res.result.data.end_date
      num_limit = res.result.data.num_limit
      let promiseArr = []
      //获取已报名人数，判断可报名结果
      let p1 = this.getReservedNum()
      promiseArr.push(p1)
      //获取是否报名过该课程
      let p2 = this.getReservedNumByOpenId()
      promiseArr.push(p2)
      Promise.all(promiseArr).then((res) => {
        wx.hideLoading()
      })
    })
  },
  /**
   * 查看已报名人数
   */
  getReservedNum: function(event) {
    this.setData({
      reserved_count: '',
    })
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'lessson_Reserve',
        data: {
          class_id,
          $url: 'getReservedNum',
        }
      }).then((res) => {
        this.setData({
          reserved_count: res.result.total
        })
        if (res.result.total >= num_limit) {
          isNumExceed = true
        }
      })
      resolve()
    })
  },
  /**
   * 是否已报名该班次
   */
  getReservedNumByOpenId: function(event) {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'lessson_Reserve',
        data: {
          class_id,
          $url: 'getReservedNumByOpenId',
        }
      }).then((res) => {
        // this.setData({
        //   reserved_count: res.result.total
        // })
        if (res.result.total >= 1) {
          isAlreadyReserve = true
        }
      })
      resolve()
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let lesson_name = options.lesson_name;
    lesson_id = options.lesson_id;
    class_id = options.class_id;
    cover_cloudid = options.cover_cloudid;
    wx.showLoading({
      title: '加载中',
    })
    this.init()
    this.setData({
      lesson_name: lesson_name,
    });
  },
  /**
   *触发班次预定
   */
  submitReserve: function() {
    let reasonWord = ''

    reasonWord = this.verification()
    //是否通过验证
    if (!isVerifica) {
      this._setReserveinfo()
        .then(() => {
          wx.navigateTo({
            url: "/pages/resultPage/resultPage"
          })
        }).catch((reason) => {
          wx.showModal({
            title: '新增失败',
            content: reason,
            showCancel: false,
            success(res) {
              wx.switchTab({
                url: "/pages/lessons/lessons"
              })
            }
          })
        });
    } else {
      wx.showModal({
        content: reasonWord,
        showCancel: false,
        success(res) {
          wx.switchTab({
            url: "/pages/lessons/lessons"
          })
        }
      })
    }
  },
  /**
   *预定方法内部调用
   */
  _setReserveinfo: function() {
    return new Promise((resolve, reject) => {
      let lesson_name = this.data.lesson_name
      let class_name = this.data.class_name
      let reserve_date = formatTime(new Date(), 'yyyy-MM-dd hh:mm:ss')
      wx.showLoading({
        title: '加载中',
      })
      wx.cloud.callFunction({
        name: 'lessson_Reserve',
        data: {
          reserve_date,
          phone_number,
          student_name,
          message,
          lesson_id,
          lesson_name,
          cover_cloudid,
          class_id,
          class_name,
          reserve_status,
          revoke_reason,
          $url: 'setReserveinfo',
        }
      }).then((res) => {
        if (res.errMsg != 'cloud.callFunction:ok') {
          reject('网络不稳定');
        }

        wx.stopPullDownRefresh()
        wx.hideLoading()
        resolve()
      })
    })
  },

  //预定前验证
  verification: function() {
    if (isNumExceed) {
      return ('超过预定报名人数');
    }
    if (isAlreadyReserve) {
      return ('已报名此班次不能重复报名或您的预约已被退订');
    }
    if (new Date(end_date) < new Date()) {
      isExpire = true
      return ('班次过期');
    }
    if (new Date(start_date) > new Date()) {
      isStart = true
      return ('班次未开始');
    }
    if (!validInput(phone_number, 'phone')) {
      return ('无效的手机号');
    }
    if (!validInput(student_name, 'chinese')) {
      return ('请输入正确姓名');
    }
    isVerifica = false
    return;
  }
})