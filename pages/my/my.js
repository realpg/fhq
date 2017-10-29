// pages/my/my.js
var util = require('../../utils/util.js')
var vm = null
var app = getApp()
Page({
  data: {
    systemInfo: {},
    userPage: {},
    myBg: "http://dsyy.isart.me/bg.png",
    icon: [
      { img: "/images/mymy.png", title: "个人资料", url: "/pages/product/product" },
      { img: "/images/mymy.png", title: "我的订单", url: "/pages/product/product" },
      { img: "/images/mymy.png", title: "企业信息", url: "/pages/enterprise/enterprise" },
      { img: "/images/mymy.png", title: "申请代理", url: "/pages/product/product" },
      { img: "/images/mymy.png", title: "订单详情", url: "/pages/product/product" },
    ],
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
    var userInfo = wx.getStorageSync("userInfo")
    vm.setData({
      userPage: userInfo
    });
    console.log("信息" + JSON.stringify(userInfo))
    // vm.getByIdWithToken()
  },

  //根据用户页面
  getByIdWithToken: function (e) {
    util.getByIdWithToken({}, function (ret) {
      console.log("getByIdWithToken" + JSON.stringify(ret))
      var msgObj = ret.data.obj;
      for (var i = 0; i < msgObj.workFolderInfos.length; i++) {
        msgObj.workFolderInfos[i].folder_icon = util.qiniuUrlTool(msgObj.workFolderInfos[i].folder_icon, "folder_index");
      }
      vm.setData({
        userPage: msgObj
      });
    })
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