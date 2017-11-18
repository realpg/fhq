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
    // myType:null
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
    util.getMessageList(param, function (res) {
      // util.showLoading('获取数据');
      // util.getIndexFoldersSim(param, function (res) {
      //   if (!res.data.result) {
      //     util.showToast('获取失败')
      //     return;
      //   }
      // },null);
      console.log("资讯页数据" + JSON.stringify(res.data.ret.data))
      var messageList = res.data.ret.data
      for (var i = 0; i < messageList.length; i++) {
        messageList[i].img = util.qiniuUrlTool(messageList[i].img, "folder_index");
      }
      console.log(JSON.stringify(messageList[0].img)) 
      vm.setData({
        messageList: messageList
      })
    }, null)
  },

  jumpMessageInfo: function (e) {
    console.log(JSON.stringify("哈哈哈:" + e.currentTarget.dataset.messageid))
    var messageid = e.currentTarget.dataset.messageid
    wx.navigateTo({
      url: '/pages/article/article?messageid=' + messageid
    })
  },

  //设置画夹
  getFolderList: function (currentNavbar) {
    console.log("getFolderList currentNavbar:" + currentNavbar)
    //获取首页详细信息
    var param = {
      num: num
    }
    //推荐
    if (currentNavbar == 0) {
      param.start = start_r
      param.flag = "1"
    }
    //全部
    if (currentNavbar == 1) {
      param.start = start_a
      param.flag = ""
    }
    util.showLoading('获取数据');
    util.getIndexFoldersSim(param, function (res) {
      // console.log(JSON.stringify(res))
      if (!res.data.result) {
        util.showToast('获取失败')
        return;
      }
      var msgObj = res.data.obj;
      for (var i = 0; i < msgObj.length; i++) {
        msgObj[i].workFolderInfo.folder_icon = util.qiniuUrlTool(msgObj[i].workFolderInfo.folder_icon, "folder_index");
        msgObj[i].workFolderInfo.user_my_icon = util.qiniuUrlTool(msgObj[i].workFolderInfo.user_my_icon, "user_hi");
      }
      //如果是重新获取数据
      vm.setFolderList(msgObj, currentNavbar)
      //设置加载数据
      if (currentNavbar == 0) {
        start_r = start_r + num
      }
      if (currentNavbar == 1) {
        start_a = start_a + num
      }
      loadding_flag = false
    }, null);
  },
  //设置作品列表
  setFolderList: function (msgObj, currentNavbar) {
    // console.log("setFolderList msgObj:" + JSON.stringify(msgObj) + "  currentNavbar:" + currentNavbar)
    //推荐
    if (currentNavbar == 0) {
      if (start_r == 0) {
        vm.setData({
          recomm_list: msgObj
        })
      } else {
        vm.setData({
          recomm_list: vm.data.recomm_list.concat(msgObj)
        })
      }
      // console.log("setFolderList recomm_list:" + JSON.stringify(vm.data.recomm_list))
    }
    //全部
    if (currentNavbar == 1) {
      if (start_a == 0) {
        vm.setData({
          all_list: msgObj
        })
      } else {
        vm.setData({
          all_list: vm.data.all_list.concat(msgObj)
        })
      }
      // console.log("setFolderList all_list:" + JSON.stringify(vm.data.all_list))
    }
  },

})