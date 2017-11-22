// pages/orders/orders.js
var util = require('../../utils/util.js');
var vm = null
Page({
  data: {
    orders: [],//总订单
    product:{},//商品
    enter:{},//企业信息

    tab1: {
      list: [{
        title: '全部'
      }, {
        title: '待付款'
      }, {
        title: '待发货'
      }, {
        title: '待收货'
      }, {
        title: '待评价'
      }],
      selectedId: 0,
      scroll: false,
    },

  },

  onLoad: function (options) {
    vm = this
    vm.getPayById(options.id)
  },


  getPayListByUserId: function () {
    util.getPayListByUserId({}, function (res) {
      console.log("根据id获取订单" + JSON.stringify(res))
      vm.setData({
        orders: res.data.ret
      })
      console.log("根据id获取订单" + JSON.stringify(vm.data.orders))

    }, null)
  },

  getPayById:function(obj){
    var param = {
      id: obj
    }
    util.getPayById(param,function(res){
      console.log("订单详情" + JSON.stringify(res.data.ret.enter))
      var orders = res.data.ret//订单
      var product = res.data.ret.good.good_info//商品
      var enter = res.data.ret.enter//企业
      vm.setData({
        orders: orders,
        product:product,
        enter:enter
      })
    },null)
  },

  // handleZanTabChange(e) {
  //   var componentId = e.componentId;
  //   var selectedId = e.selectedId;
  //   this.setData({
  //     `${componentId}.selectedId`: selectedId
  //   });
  // }

  // 导航切换监听
  navbarTap: function (e) {
    console.debug(e);
    console.log(e.currentTarget.dataset.idx)
    this.setData({
      'tab1.selectedId': e.currentTarget.dataset.idx
    })
  },

});