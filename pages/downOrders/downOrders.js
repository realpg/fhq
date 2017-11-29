// pages/orders/orders.js
var util = require('../../utils/util.js')
var vm = null
Page({
  data: {
    officeid: '',//商品id
    enterprise: [],//企业信息
    good_info: {},//商品详情
    tw_steps: [],//图文
    title: '',//标题
    price: '',//单价
    en_id: '',//企业id
    enterpriseIsNull: false,//判断企业信息是否为空

    // input默认是1  
    num: 1,
    // 使用data数据对象设置样式名
    minusStatus: 'disabled',

    // radioItems: [],
    money: '',//总价格
  },

  onLoad: function (options) {
    vm = this
    vm.loadOfficePage(options)//加载商品详情
    
  },
  //加载商品详情
  loadOfficePage: function (e) {
    // console.log("1111111111111111" + JSON.stringify(e))
    util.showLoading('正在加载数据');
    var param = {
      id: e.officeid
    }
    util.getOfficePageByOfficeId(param, function (ret) {
      console.log("getOfficePageByOfficeId :" + JSON.stringify(ret))
      if (ret.data.code == "200") {
        var good_info = ret.data.ret.good_info
        var tw_steps = ret.data.ret.tw_steps
        var title = ret.data.ret.good_info.title
        var price = ret.data.ret.good_info.price / 100
        vm.setData({
          good_info: good_info,
          tw_steps: tw_steps,
          title: title,
          price: price,
          money: price
        })
        // console.log("商品详情" + JSON.stringify(vm.data.good_info))
        var title = vm.data.title
        wx.setNavigationBarTitle({ title: title })
      }
    }, null)
  },

  //加载企业信息列表
  getListByUserId: function () {
    util.getListByUserId({}, function (res) {
      var enterprise = res.data.ret
      // 判断企业是否为空
      if (util.judgeIsAnyNullStr(enterprise)) {
        vm.setData({
          enterpriseIsNull: true
        })
        console.log("是否为空" + vm.data.enterpriseIsNull)
        return
      }
      enterprise[0].checked = true
      vm.setData({
        enterprise: enterprise,
        en_id: enterprise[0].id
      })
      console.log("getListByUserId" + JSON.stringify(vm.data.enterprise))
    }, null)
  },

  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    var enterprise = vm.data.enterprise;
    for (var i = 0, len = enterprise.length; i < len; ++i) {
      // enterprise[i].checked = true;
      enterprise[i].checked = i == e.detail.value;
      if (i == e.detail.value) {
        vm.setData({
          en_id: enterprise[i].id
        })
      }
    }
    console.log("dataENterprise" + JSON.stringify(vm.data.enterprise))
    this.setData({
      enterprise: enterprise,
    });
    // vm.enterpriseId()
  },

  /* 点击减号 */
  bindMinus: function () {
    var num = this.data.num;
    // 如果大于1时，才可以减  
    if (num > 1) {
      num--;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    // 将数值与状态写回 
    var money = (vm.data.price * num).toFixed(2)
    this.setData({
      num: num,
      minusStatus: minusStatus,
      money: money
    });
  },
  /* 点击加号 */
  bindPlus: function () {
    var num = this.data.num;
    // 不作过多考虑自增1  
    num++;
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num < 1 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    var money = (vm.data.price * num).toFixed(2)    
    this.setData({
      num: num,
      minusStatus: minusStatus,
      money: money
    });
  },
  /* 输入框事件 */
  bindManual: function (e) {
    var num = e.detail.value;
    // 将数值与状态写回  
    this.setData({
      num: num,
      money: vm.data.price * num
    });
  },

  clickOpen: function (e) {
    wx.redirectTo({
      url: '/pages/enterprise/enterprise'
    })
  },

  clickClose: function (e) {
    wx.navigateBack({
      delta: 1
    })
  },

  addEnterprise: function (e) {
    wx.navigateTo({
      url: '/pages/updateEnterprise/updateEnterprise'
    })
  },

  recharge: function (e) {
    var en_id = vm.data.en_id
    var good_id = vm.data.good_info.id
    var param = ({
      en_id: en_id,
      good_id: good_id,
      count: vm.data.num
    })
    util.prepay(param, function (res) {
      console.log("支付" + JSON.stringify(res))
      var msgObj = res.data.ret
      wx.requestPayment({
        'timeStamp': msgObj.timeStamp + "",
        'nonceStr': msgObj.nonceStr,
        'package': msgObj.package,
        'signType': msgObj.signType,
        'paySign': msgObj.paySign,
        'success': function (res) {
          console.log("pay success：" + JSON.stringify(res))

          // wx.navigateTo({
          //   url: '/pages/mine/mine'
          // })
          wx.switchTab({
            url: '/pages/mine/mine'
          })

        },
        'fail': function (res) {
          console.log("fail" + JSON.stringify(res))
        }
      })
    }, null)
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
    vm.getListByUserId()//加载企业信息列表
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