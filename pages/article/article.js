// pages/article/article.js
var util = require('../../utils/util.js')
var vm = null
Page({
  data: {
    messageid: "",
    zx_info: {},//简介政策咨询信息
    tw_steps: [],//图文步骤
    title: null,
    show: false
  },
  onLoad: function (options) {
    if (util.judgeIsAnyNullStr(options.messageid)) {
      vm.setData({
        show: true
      })
      return;
    }
    vm = this
    vm.setData({
      messageid: options.messageid
    });
    console.log("officeid" + JSON.stringify(vm.data.officeid))
    vm.loadmessagePage()  //加载图文信息
  },

  loadmessagePage: function () {
    var param = {
      id: vm.data.messageid
    }
    util.getMessagegetById(param, function (ret) {
      if (!ret.data.result) {
        vm.setData({
          show: true
        })
        util.showToast('获取失败')
        return;
      }
      console.log("getMessagegetById :" + JSON.stringify(ret))
      if (ret.data.code == "200") {
        //咨询信息
        var zx_info = ret.data.ret.zx_info;
        zx_info.created_at = util.convertDateFormateM(zx_info.created_at);
        zx_info.show_num = "阅读 " + zx_info.show_num;
        //图文步骤信息
        var tw_steps = ret.data.ret.tw_steps
        var title = ret.data.ret.zx_info.title

        vm.setData({
          zx_info: zx_info,
          tw_steps: tw_steps,
          title: title
        })
        var title = vm.data.title
        wx.setNavigationBarTitle({ title: title })
      }
    }, function (err) {
      vm.setData({
        show: true
      })
    })
  },

  //加载图像
  imageLoad: function (e) {
    console.log("imageLoad e:" + JSON.stringify(e))
    var imageSize = util.imageUtil(e)
    console.log("index:" + e.currentTarget.id)
    var index = parseInt(e.currentTarget.id)
    var obj = vm.data.tw_steps
    var lr_margin = 10
    obj[index].imageWidth = imageSize.imageWidth - lr_margin //20为左右边距
    obj[index].imageHeight = imageSize.imageHeight * ((imageSize.imageWidth - lr_margin) / imageSize.imageWidth)
    console.log("obj:"+JSON.stringify(obj))
    vm.setData({
      tw_steps: obj
    })
  },
  //点击图片，进行预览
  clickImg: function (e) {
    console.log(JSON.stringify(e))
    var currentUrl = e.currentTarget.dataset.currUrl;
    var img_arr = [];
    for (var i = 0; i < vm.data.tw_steps.length; i++) {
      img_arr.push(vm.data.tw_steps[i].img)
    }
    wx.previewImage({
      current: currentUrl, // 当前显示图片的http链接
      urls: img_arr // 需要预览的图片http链接列表
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