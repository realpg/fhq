// pages/manage/manage.js
var util = require('../../utils/util.js')
var vm = null
Page({
  data: {
    productList: [],
    page: ''
  },
  onLoad: function (options) {
    vm = this
    vm.setData({
      page: 1
    })
  },

  getProductList: function () {
    var param = {
      'type': 1,
      'page': vm.data.page
    }
    util.getProductList(param, function (res) {
      util.showLoading("加载中")
      console.log("办理数据" + JSON.stringify(res))
      var productList = res.data.ret.data
      console.log("111111" + JSON.stringify(productList))
      vm.setData({
        productList: productList
      })
    }, null)
  },

  jumpProduct: function (e) {
    console.log("111" + JSON.stringify(e))
    var officeid = e.currentTarget.dataset.officeid
    wx.navigateTo({
      url: '/pages/product/product?officeid=' + officeid,
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
    vm.getProductList()
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