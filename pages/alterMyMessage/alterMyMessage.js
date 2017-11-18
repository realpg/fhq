// pages/alterMyMessage/alterMyMessage.js
var vm = null
var util = require('../../utils/util.js')
Page({
  data: {
    gender: [
      { name: '男', value: '1', checked: true },
      { name: '女', value: '2', },
      { name: '保密', value: '0', }
    ],
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);

    var gender = this.data.gender;
    for (var i = 0, len = gender.length; i < len; ++i) {
      gender[i].checked = gender[i].value == e.detail.value;
    }
    this.setData({
      gender: gender
    });
  },
  formSubmit: function (e) {
    // console.log(e.detail.value.province)
    var province = e.detail.value.province
    // console.log(province)
    var city = e.detail.value.city
    var phonenum = e.detail.value.phonenum
    var gender = vm.data.gender
    var genderValue = ''
    for (var i = 0; i < gender.length; i++) {
      if (gender[i].checked) {
        genderValue = gender[i].value
      }
    }
    // console.log("性别id" + JSON.stringify(genderValue))
    var param = ({
      province: province,
      city: city,
      phonenum: phonenum,
      gender: genderValue,
    })
    util.updateUserInfo(param, function (res) {
      console.log(JSON.stringify(res))
    }, null)
    wx.navigateBack({
      delta: 1
    })
  },
  onLoad: function (options) {
    vm = this
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