var util = require('../../utils/util.js')
//获取应用实例
var app = getApp()
var vm = null
var page = 0
Page({
  data: {
    systemInfo: {},
    swipers: [],  //广告图信息
    productInfo: [],//商品列表
    productUrl: { url: "/pages/product/product" },
    banli: [],
  },


  onLoad: function (options) {
    console.log('onLoad')
    vm = this
    //初始化sysInfo
    app.getSystemInfo(function (res) {
      console.log("getSystemInfo:" + JSON.stringify(res));

      vm.setData({
        systemInfo: res
      })
    })
    vm.setADSwiper()
    vm.getProductList()
    // vm.GetList()
  },

  //加载
  onShow: function () {

  },

  //该方法绑定了页面滑动到底部的事件
  bindDownLoad: function () {
    util.showLoading("加载")
    console.log("bindDownLoad执行")
    vm.GetList();
  },

  GetList: function () {
    var param = ({
      type: '0',
      page: page
    })
    console.log("getList执行" + page)
    util.getProductList(param, function (res) {
      console.log("返回参数" + JSON.stringify(res))
      var banliList = vm.data.banli;
      var resList = res.data.ret.data
      for (var i = 0; i < resList.length; i++) {
        banliList.push(resList[i]);
      }
      vm.setData({
        banli: banliList
      });
      page++;
      util.hideLoading()
    })
  },

  //获取商品信息
  getProductList: function () {
    var param = ({
      type: '0',
      page: page
    })
    util.getProductList(param, function (res) {
      console.log("办理类商品" + JSON.stringify(res.data.ret.data))
      vm.setData({
        banli: res.data.ret.data
      })
    }, null)
  },
  // 根据商品id获取商品
  jumpOfficeInfo: function (e) {
    var officeid = JSON.stringify(e.currentTarget.dataset.officeid)
    wx.navigateTo({
      url: '/pages/product/product?officeid=' + officeid
    })
  },
  // 获取广告图片
  setADSwiper: function () {
    util.getAds({}, function (ret) {
      console.log("getADs:" + JSON.stringify(ret));
      if (ret.data.code == "200") {
        var msgObj = ret.data.ret.ad_infos;
        for (var i = 0; i < msgObj.length; i++) {
          // msgObj[i].img = util.qiniuUrlTool(msgObj[i].img, "top_ad")
        }
        vm.setData({
          swipers: msgObj
        });

        var productObj = ret.data.ret.good_infos;
        console.log("productInfo" + JSON.stringify(productObj));
        vm.setData({
          productInfo: productObj
        });
      }
    }, null);
  },
  /**
 * 页面上拉触底事件的处理函数
 */
  onReachBottom: function () {

  },
})


