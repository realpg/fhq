// pages/orders/orders.js
var util = require('../../utils/util.js');
var vm = null
Page({
  data: {
    orders: [],

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
    vm.getPayListByUserId()
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