// pages/product/product.js
var util = require('../../utils/util.js')
var vm = null

var base64 = require("../base64/base64.js");

Page({
  data: {
    officeid: '',
    good_info: {},//商品信息
    tw_steps: [],//图文步骤
    title: null,
  },
  onLoad: function (options) {
    // console.log("officeid:"+JSON.stringify(options.officeid))
    // if (util.judgeIsAnyNullStr(options.officeid)) {
    //   return;
    // }
    vm = this

    vm.setData({
      icon20: base64.icon20,
      icon60: base64.icon60,
      officeid: options.officeid
    });
    // console.log("officeid" + JSON.stringify(vm.data.officeid))
    vm.loadOfficePage()  //加载商品信息
  },
  //获取商品信息
  loadOfficePage: function () {
    var param = {
      id: vm.data.officeid
    }
    util.getOfficePageByOfficeId(param, function (ret) {
      console.log("getOfficePageByOfficeId :" + JSON.stringify(ret))
      if (ret.data.code == "200") {
        var good_info = ret.data.ret.good_info
        var tw_steps = ret.data.ret.tw_steps
        var title = ret.data.ret.good_info.title
        // bookInfo.images_medium = util.qiniuUrlTool(bookInfo.images_medium, "folder_index")
        vm.setData({
          good_info: good_info,
          tw_steps: tw_steps,
          title: title
        })
        // console.log("商品详情" + JSON.stringify(vm.data.good_info))
        var title = vm.data.title
        wx.setNavigationBarTitle({ title: title })
      }
    }, null)
  },
  gotobuy: function () {
    var officeid = vm.data.officeid
    wx.navigateTo({
      url: "/pages/downOrders/downOrders?officeid=" + officeid
    })
  },
})