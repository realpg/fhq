// pages/product/product.js
var util = require('../../utils/util.js')
var vm = null
Page({
  data: {
    officeid: '',
    good_info: {},//商品信息
    tw_steps: [],//图文步骤
    title: null,
  },
  onLoad: function (options) {
    if (util.judgeIsAnyNullStr(options.officeid)) {
      return;
    }
    vm = this
    vm.setData({
      officeid: options.officeid
    });
    vm.loadOfficePage()  //加载商品信息
  },
  //获取商品信息
  loadOfficePage: function () {
    util.showLoading('获取商品信息');
    var param = {
      id: vm.data.officeid
    }
    util.getOfficePageByOfficeId(param, function (ret) {
      console.log("getOfficePageByOfficeId :" + JSON.stringify(ret))
      if (util.judgeIsAnyNullStr(ret)) {
        util.showToast('获取失败')
        return;
      }
      var good_info = ret.data.ret.good_info
      var tw_steps = ret.data.ret.tw_steps
      var title = ret.data.ret.good_info.title
      vm.setData({
        good_info: good_info,
        tw_steps: tw_steps,
        title: title
      })
      // console.log("商品详情" + JSON.stringify(vm.data.good_info))
      var title = vm.data.title
      wx.setNavigationBarTitle({ title: title })
    }, function (err) {
      util.showToast('您的网络似乎有点问题')
    })
  },
  gotobuy: function () {
    var officeid = vm.data.officeid
    wx.navigateTo({
      url: "/pages/downOrders/downOrders?officeid=" + officeid
    })
  },
  //加载图像
  imageLoad: function (e) {
    console.log("imageLoad e:" + JSON.stringify(e))
    var imageSize = util.imageUtil(e)
    console.log("index:" + e.currentTarget.id)
    var index = parseInt(e.currentTarget.id)
    var obj = vm.data.tw_steps
    var lr_margin = 20
    obj[index].imageWidth = imageSize.imageWidth - lr_margin //20为左右边距
    obj[index].imageHeight = imageSize.imageHeight * ((imageSize.imageWidth - lr_margin) / imageSize.imageWidth)
    console.log("obj:" + JSON.stringify(obj))
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
})