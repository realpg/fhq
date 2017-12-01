// pages/message/message.js
var util = require('../../utils/util.js')
var page = "0"
var myType = null

var vm = null;
Page({
  data: {
    messageList: [],
    policyList: [],
    recomm_list: [],
    show: false
  },
  onLoad: function (options) {
    vm = this
    // console.log("myType" + JSON.stringify(options.myType))
    myType = options.myType
    vm.getMessageList()
  },

  getMessageList: function () {
    var param = {
      "type": myType,
      "page": page
    }
    util.showLoading('获取数据');
    util.getMessageList(param, function (res) {
      if (!res.data.result) {
        util.showToast('获取失败')
        vm.setData({
          show: true
        })
        return;
      }
      console.log("资讯页数据" + JSON.stringify(res.data.ret.data))
      var messageList = res.data.ret.data
      for (var i = 0; i < messageList.length; i++) {
        messageList[i].img = util.qiniuUrlTool(messageList[i].img, "message_hi");
        messageList[i].created_at = util.convertDateFormateM(messageList[i].created_at)
      }
      console.log(JSON.stringify(messageList[0].img))
      vm.setData({
        messageList: messageList
      })
      console.log("资讯页数据" + JSON.stringify(vm.data.messageList))
    }, function (err) {
      vm.setData({
        show: true
      })
    })

  },
  //点击跳转
  jumpMessageInfo: function (e) {
    console.log(JSON.stringify("jumpMessageInfo:" + e.currentTarget.dataset.messageid))
    var messageid = e.currentTarget.dataset.messageid
    wx.navigateTo({
      url: '/pages/article/article?messageid=' + messageid
    })
  },

  /**
* 用户点击右上角分享
*/
  onShareAppMessage: function () {

  }

})