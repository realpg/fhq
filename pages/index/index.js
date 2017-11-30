var util = require('../../utils/util.js')
//获取应用实例
var app = getApp()
var vm = null
var page = 0
Page({
  data: {
    systemInfo: {},
    swipers: [],  //广告图信息
    productInfo: [],//获取首页商品列表
    productUrl: { url: "/pages/product/product" },
    workProduct: [],//商品列表
    show: false
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
    // vm.GetList()
  },
  //加载
  onShow: function () {
    vm.setData({
      workProduct: []
    })
    vm.setADSwiper()
    vm.getProductList()
  },

  //获取商品信息
  getProductList: function () {
    util.showLoading("加载商品信息")
    var param = ({
      type: '0',
      page: page
    })
    util.getProductList(param, function (res) {
      if (!res.data.result) {
        util.showToast('获取失败')
        return;
        vm.setData({
          show: true
        })
      }
      console.log("办理类商品" + JSON.stringify(res))
      if (res.data.code == "200") {
        vm.setData({
          workProduct: res.data.ret.data
        })
      }
    }, function (err) {
      vm.setData({
        show: true
      })
    })
  },
  // 跳转到商品详情页
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

  /**
 * 用户点击右上角分享
 */
  onShareAppMessage: function () {

  }

})


