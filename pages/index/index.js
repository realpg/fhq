var util = require('../../utils/util.js')
//获取应用实例
var app = getApp()
var vm = null
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
Page({
  data: {
    systemInfo: {},
    swipers: [],  //广告图信息
    productInfo: [],//商品列表
    productUrl: { url: "/pages/product/product" },
    banli: [],

    tabs: ["办公类商品", "办理类商品"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0
  },
  //加载
  onShow: function () {
    console.log('onLoad')
    vm = this
    //初始化sysInfo
    app.getSystemInfo(function (res) {
      console.log("getSystemInfo:" + JSON.stringify(res));

      vm.setData({
        sliderLeft: (res.windowWidth / vm.data.tabs.length - sliderWidth) / 2,
        sliderOffset: res.windowWidth / vm.data.tabs.length * vm.data.activeIndex,
        systemInfo: res
      })
    })
    vm.setADSwiper()
    vm.getProductList()
  },
  //获取商品信息
  getProductList: function () {
    var param = ({
      type: '1',
      page: '0'
    })
    util.getProductList(param, function (res) {
      console.log("办理类商品" + JSON.stringify(res.data.ret.data))
      vm.setData({
        banli: res.data.ret.data
      })
    }, null)
  },
  //tab切换
  tabClick: function (e) {
    // console.log(JSON.stringify(e))
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
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
          msgObj[i].img = util.qiniuUrlTool(msgObj[i].img, "top_ad")
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
