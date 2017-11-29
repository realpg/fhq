// pages/enterprise/enterprise.js
var util = require('../../utils/util.js')
var vm = null
Page({
  data: {
    enterprise: [],
  },
  onLoad: function (options) {
    vm = this
    vm.getListByUserId()
  },

  //获取用户企业信息列表
  getListByUserId: function () {
    util.showLoading('正在加载数据');
    util.getListByUserId({}, function (ret) {
      console.log("getListByUserId:" + JSON.stringify(ret));
      if (ret.data.code == "200") {
        vm.setData({
          enterprise: ret.data.ret
        })
        console.log("用户企业信息列表" + JSON.stringify(vm.data.enterprise))
      }
    }, null)
  },

  //更新企业信息
  jumpEnterpriseInfo: function (e) {
    var enterpriseId = JSON.stringify(e.currentTarget.dataset.id)
    console.log(JSON.stringify("企业Id" + e.currentTarget.dataset.id))
    wx.navigateTo({
      url: '/pages/updateEnterprise/updateEnterprise?id=' + enterpriseId
    })
  },
  //添加企业信息
  addEnterprise: function (e) {
    wx.navigateTo({
      url: '/pages/updateEnterprise/updateEnterprise',
    })
  },
  //删除企业信息
  deleteEnterprise: function (e) {
    // console.log("企业id" + JSON.stringify(e.currentTarget.dataset.id))
    wx.showModal({
      title: '提示',
      content: '是否删除？',
      confirmColor: "#ffcc00",
      confirmText: "删除",
      success: function (res) {
        if (res.confirm) {
          //获取列表中要删除项的下标  
          var id = e.currentTarget.dataset.id;
          console.log('删除企业success' + JSON.stringify(res))
          var param = {
            id: id
          }
          util.deleteEnterpriseById(param, function (res) {
            console.log("删除企业" + JSON.stringify(res))
            vm.getListByUserId()
          }, null)

         

        } else {
          // initdata(vm)
        }
      }
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
    vm.getListByUserId()
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