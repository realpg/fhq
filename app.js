//app.js
const util = require('./utils/util.js')

var vm = null

App({
  onLaunch: function () {
    //获取vm
    vm = this
    //获取用户缓存数据
    var userInfo = wx.getStorageSync("userInfo");
    console.log("local storage userInfo:" + JSON.stringify(userInfo));
    //如果没有缓存
    if (userInfo == null || userInfo == undefined || userInfo == "") {
      //调用登录接口
      vm.login(null);
    } else {
      vm.globalData.userInfo = wx.getStorageSync("userInfo");
      console.log("vm.globalData.userInfo:" + JSON.stringify(vm.globalData.userInfo));
    }
  },
  //监听小程序打开
  onShow: function () {
  },

  //用户登录
  login: function (callBack) {
    wx.login({
      success: function (res) {
        console.log("wx.login:" + JSON.stringify(res))
        if (res.code) {
          util.getOpenId({ code: res.code }, function (ret) {
            console.log("getOpenId:" + JSON.stringify(ret))
            var openId = ret.data.ret.openid
            var param = {
              account_type: 'xcx',
              xcx_openid: openId
            }
            //后端注册
            util.login(param, function (ret) {
              console.log("login:" + JSON.stringify(ret));
              if (ret.data.code == "200") {
                vm.storeUserInfo(ret.data.ret)
                vm.updateUserInfo(function (ret) {
                })
              }
            }, null);
          }, null);
        }
      }
      
    })
  },

  storeUserInfo: function (obj) {
    console.log("storeUserInfo :" + JSON.stringify(obj));
    wx.setStorage({
      key: "userInfo",
      data: obj
    });
    vm.globalData.userInfo = obj;
    console.log("vm.globalData.userInfo：" + JSON.stringify(vm.globalData.userInfo))
  },

  //更新用户信息
  updateUserInfo: function (callBack) {
    //获取用户基本信息
    wx.getUserInfo({
      //成功
      success: function (res) {
        console.log("wx.getUserInfo success:" + JSON.stringify(res))
        var param = {
          nick_name: res.userInfo.nickName,
          avatar: res.userInfo.avatarUrl,
          gender: res.userInfo.gender,
          province: res.userInfo.province,
          city: res.userInfo.city
        }
        util.updateUserInfo(param, function (ret, err) {
          console.log("updateUserInfo ret:" + JSON.stringify(ret))
          //更新缓存及globalData
          if (ret.data.code == "200") {
            vm.storeUserInfo(ret.data.ret)
          }
        })
        callBack()
      },
      //失败
      fail: function (res) {
        console.log("wx.getUserInfo fail:" + JSON.stringify(res))
        //引导用户授权
        vm.showModal()
      },
      complete: function (res) {
        console.log("wx.getUserInfo complete:" + JSON.stringify(res))
      }
    })
  },

  getUserInfo: function (cb) {
    typeof cb == "function" && cb(vm.globalData.userInfo)
  },

  getSystemInfo: function (cb) {

    if (vm.globalData.systemInfo) {
      typeof cb == "function" && cb(vm.globalData.systemInfo)
    } else {
      wx.getSystemInfo({
        success: function (res) {
          vm.globalData.systemInfo = res
          typeof cb == "function" && cb(vm.globalData.systemInfo)
        }
      })
    }
  },
  openSetting: function () {
    wx.openSetting({
      success: (res) => {
        console.log("Result" + JSON.stringify(res))
        if (!res.authSetting["scope.userInfo"] || !res.authSetting["scope.userLocation"]) {
          vm.showModal()
        }
        else {
          vm.updateUserInfo(function (ret) {
          })
        }
      }
    })
  },
  //全局变量
  globalData: {
    userInfo: null,
    systemInfo: null
  }
})