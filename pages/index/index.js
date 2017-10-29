var util = require('../../utils/util.js')

//获取应用实例
var app = getApp()

var vm = null

Page({
  data: {
    systemInfo: {},
    swipers: [],  //广告图信息
    productInfo:[],//商品列表
    productUrl: {url: "/pages/product/product"},
  },
  //加载
  onShow: function () {
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
  },
  // 根据商品id获取商品
  jumpOfficeInfo: function (e) {
    // console.log(JSON.stringify("officeid:" + JSON.stringify(e.currentTarget.dataset.officeid)))
    var officeid = JSON.stringify(e.currentTarget.dataset.officeid)
    wx.navigateTo({
      url: '/pages/product/product?officeid=' + officeid
    })
  },

  //根据图书id获取图书
  // jumpBookInfo: function (e) {
  //   console.log(JSON.stringify("bookid:" + e.currentTarget.dataset.bookid))
  //   var bookid = e.currentTarget.dataset.bookid
  //   wx.navigateTo({
  //     url: '/pages/bookpage/bookpage?bookid=' + bookid
  //   })
  // },

  // 获取广告图片
  setADSwiper: function () {
    util.getAds({}, function (ret) {
      console.log("getADs:" + JSON.stringify(ret));
      if (ret.data.code == "200") {
        var msgObj = ret.data.ret.ad_infos;
        for (var i = 0; i < msgObj.length; i++) {
          msgObj[i].img = util.qiniuUrlTool(msgObj[i].img, "top_ad")
        }
        vm.setData({
          swipers: msgObj
        });

        var productObj = ret.data.ret.good_infos;
        console.log("productInfo" + JSON.stringify(productObj));
        // for (var i = 0; i < productObj.length; i++) {
        //   productObj[i].img = util.qiniuUrlTool(productObj[i].img, "top_ad")
        // }
        vm.setData({
          productInfo: productObj
        });

      }
    }, null);
  },

  //根据书吧id获取书吧页面
  bardetail: function (e) {
    console.log(JSON.stringify("barid:" + e.currentTarget.dataset.barid))
    var barid = e.currentTarget.dataset.barid
    wx.navigateTo({
      url: '/pages/barpage/barpage?barid=' + barid
    })
  },
  //点击跳转搜索页面
  clickSearch: function (e) {
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
  seeMoreBook: function (e) {
    vm.setData({
      currentNavbar: 1
    })
    if (vm.needLoadNewDataAfterSwiper()) {
      vm.loadMoreDatas()
    }
  },
  seeMoreBar: function (e) {
    vm.setData({
      currentNavbar: 2
    })
    if (vm.needLoadNewDataAfterSwiper()) {
      vm.loadMoreDatas()
    }
  },

  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: navigationBarTitleText,
      path: '/pages/index/index',
      success: function (res) {

      },
      fail: function (res) {

      }
    }
  },
  
})
