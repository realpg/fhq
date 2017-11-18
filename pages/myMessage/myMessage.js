// pages/myMessage/myMessage.js
var vm = null
var util = require('../../utils/util.js')
const qiniuUploader = require("../../utils/qiniuUploader");
var qnToken = ""
var app = getApp()

// 初始化七牛相关参数
function initQiniu() {
  var options = {
    region: 'ECN', // 华东区
    uptoken: qnToken
  };
  console.log("initQiniu options:" + JSON.stringify(options))
  qiniuUploader.init(options);
}

Page({
  data: {
    userInfo: [],
    avatar:''
  },
  onLoad: function (options) {
    vm = this
    vm.getByIdWithToken()
  },
  //根据id获取用户信息
  getByIdWithToken: function (e) {
    var id = app.globalData.userInfo.id
    util.getByIdWithToken({ id: id }, function (ret) {
      console.log("getByIdWithToken" + JSON.stringify(ret))
      var msgObj = ret.data.ret;
      vm.setData({
        userInfo: msgObj
      });
    })
  },

  alertMessage: function () {
    wx.navigateTo({
      url: '../alterMyMessage/alterMyMessage',
    })
  },

  //上传图片
  chooseImage: function (e) {
    // var count = 4 - vm.data.files.length
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        console.log("tempFilePaths:" + JSON.stringify(tempFilePaths))
        wx.showLoading({
          title: '正在上传',
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 2000)
        //获取七牛上传token
        util.getQnToken({}, function (res) {
          console.log(JSON.stringify(res));
          if (res.data.result) {
            qnToken = res.data.ret;
            console.log("qiniu upload token:" + qnToken)
            initQiniu();
            //获取token成功后上传图片
            for (var i = 0; i < tempFilePaths.length; i++) {
              var tempFilePath = tempFilePaths[i]
              qiniuUploader.upload(tempFilePath, (res) => {
                console.log("qiniuUploader upload res:" + JSON.stringify(res));
                var picture = util.getImgRealUrl(res.key)
                vm.setData({
                  'userInfo.avatar': picture
                })
              }, (error) => {
                console.error('error: ' + JSON.stringify(error));
              })
            }
          }
        }, null);
      }
    })
  },

  open: function () {
    wx.showActionSheet({
      itemList: ['男', '女'],
      success: function (res) {
        // console.log("11111" + JSON.stringify(res))
        if (!res.cancel) {
          console.log(res.tapIndex)
          vm.setData({
            'userInfo.gender':res.tapIndex+1
          })
          // console.log("11111" + JSON.stringify(vm.data.userInfo.gender))
        }
      }
    });
  },

  nick_name:function(e){
    vm.setData({
      'userInfo.nick_name':e.detail.value
    })
  },
  phonenum: function (e) {
    vm.setData({
      'userInfo.phonenum': e.detail.value
    })
  },
  province: function (e) {
    vm.setData({
      'userInfo.province': e.detail.value
    })
  },
  city: function (e) {
    vm.setData({
      'userInfo.city': e.detail.value
    })
  },

  saveUserInfo: function (e) {
    console.log("111111111" + JSON.stringify(e))
    vm.openLoading()
    var province = vm.data.userInfo.province
    var avatar = vm.data.userInfo.avatar
    var nick_name = vm.data.userInfo.nick_name
    var city = vm.data.userInfo.city
    var phonenum = vm.data.userInfo.phonenum
    var gender = vm.data.userInfo.gender
    var param = ({
      province: province,
      avatar: avatar,
      nick_name: nick_name,
      city: city,
      phonenum: phonenum,
      gender:gender,
    })
    util.updateUserInfo(param, function (res) {
      console.log(JSON.stringify(res))
      vm.openToast()
    }, null)
  },

  openToast: function () {
    wx.showToast({
      title: '已完成',
      icon: 'success',
      duration: 5000
    });
  },
  openLoading: function () {
    wx.showToast({
      title: '数据加载中',
      icon: 'loading',
      duration: 10000
    });
  },

  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    vm.getByIdWithToken()
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