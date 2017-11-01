// pages/enterpriseById/enterpriseById.js
var vm = null
var util = require('../../utils/util.js')
Page({
  data: {
    id: "",
    enterprise:{}
  },
  onLoad: function (options) {
    console.log(options.id)
    vm = this
    vm.setData({
      id: options.id
    })
    vm.getEnterpriseById()
  },
  getEnterpriseById: function () {
    var param = {
      id : vm.data.id
    }
    util.getEnterpriseById(param,function(res){
      console.log("根据Id获取企业" + JSON.stringify(res))
      vm.setData({
        enterprise:res.data.ret
      })
    },null)
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