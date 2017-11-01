// pages/enterprise/enterprise.js
var util = require('../../utils/util.js')
var vm = null
Page({
  data: {
    enterprise:[],
  },
  onLoad: function (options) {
    vm = this
    vm.getListByUserId()
  },

  getListByUserId: function(){
    util.getListByUserId({},function(ret){
      console.log("getListByUserId:" + JSON.stringify(ret));
      if (ret.data.code == "200") {
        vm.setData({
          enterprise : ret.data.ret
        })
        console.log("用户企业信息列表" + JSON.stringify(vm.data.enterprise))
      }
    },null)
  },

  jumpEnterpriseInfo:function(e){
    var enterpriseId = JSON.stringify(e.currentTarget.dataset.id)
    console.log(JSON.stringify("企业Id" + e.currentTarget.dataset.id))
    wx.navigateTo({
      url: '/pages/updateEnterprise/updateEnterprise?id=' + enterpriseId
    })
  },

  addEnterprise:function(e){
    wx.navigateTo({
      url: '/pages/updateEnterprise/updateEnterprise',
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