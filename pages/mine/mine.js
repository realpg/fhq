// pages/my/my.js
var util = require('../../utils/util.js')
var vm = null
var app = getApp()
Page({
  data: {
    systemInfo: {},
    userInfo: {},
    bg: { img: "http://ozhs589fk.bkt.clouddn.com/bg.png?imageView2/1/w/375/h/150/interlace/1" },
    orders: []
  },

  //事件处理函数
  toOrder: function () {
    wx.navigateTo({
      url: '../orders/orders'
    })
  },


  onLoad: function (options) {
    vm = this
    //初始化sysInfo
    app.getSystemInfo(function (res) {
      console.log("getSystemInfo:" + JSON.stringify(res));
      vm.setData({
        systemInfo: res
      })
    })
    // var userInfo = app.globalData.userInfo  
    // vm.setData({
    //   userInfo: userInfo
    // });
    // console.log("信息" + JSON.stringify(userInfo))
    vm.getByIdWithToken()
  },

  //根据id获取用户信息
  getByIdWithToken: function (e) {
    var id = app.globalData.userInfo.id
    util.getByIdWithToken({ id: id }, function (ret) {
      console.log("getByIdWithToken" + JSON.stringify(ret))
      var msgObj = ret.data.ret;
      vm.setData({
        userInfo: msgObj
      });
    })
  },

  getPayListByUserId: function () {
    util.getPayListByUserId({}, function (res) {
      util.showLoading("加载订单中")    
      var orders = res.data.ret
      for (var i = 0; i < orders.length; i++) {
        if (orders[i].status == 0) {
          orders[i].status = "未支付"
        } else if (orders[i].status == 1) {
          orders[i].status = "过期"
        } else if (orders[i].status == 2) {
          orders[i].status = "支付成功"
        } else if (orders[i].status == 3) {
          orders[i].status = "支付失败"
        } else {
          orders[i].status = "已经退款"
        }
      }
      vm.setData({
        orders: orders
      })
      console.log("根据id获取订单" + JSON.stringify(vm.data.orders))

    }, null)
  },

  jumpOrders: function (e) {
    wx.navigateTo({
      url: '/pages/orders/orders?id=' + e.currentTarget.dataset.id,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    vm.getPayListByUserId()
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