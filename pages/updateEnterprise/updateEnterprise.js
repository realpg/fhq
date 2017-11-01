// pages/updateEnterprise/updateEnterprise.js
var vm = null
var util = require('../../utils/util.js')
const qiniuUploader = require("../../utils/qiniuUploader");

var app = getApp()
// var token = ""
var qnToken = ""
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
    showTopTips: false,
    enterpriseName: "",
    address: "",
    postcode: "",
    taxNum: "",
    name: "",
    idNumber: "",
    phone: "",
    files: [],//营业执照
    files1: [],//税务登记证
    files2: [],//身份证正面
    files3: [],//身份证反面
    test: [{ one: '企业名称', placeholder: "请输入企业名称", name: 'enterpriseName' },
    { one: '地址', placeholder: "请输入地址", name: 'address' },
    { one: '邮编', placeholder: "请输入邮编", name: 'postcode' },
    { one: '税号', placeholder: "请输入税号", name: 'taxNum' },
    { one: '法人姓名', placeholder: "请输入法人姓名", name: 'name' },
    { one: '法人身份证号', placeholder: "请输入法人身份证号", name: 'idNumber' },
    { one: '法人电话', placeholder: "请输入法人电话", name: 'phone' }
    ],
    enterprise: {},
    id: ""
  },
  onLoad: function (options) {
    vm = this
    if (options.id) {
      var param = {
        id: options.id
      }
      console.log("111" + options.id)
      util.getEnterpriseById(param, function (res) {
        console.log("根据Id获取企业" + JSON.stringify(res))
        var files = []
        var files1 = []
        var files2 = []
        var files3 = []
        if (res.data.ret.lice_img !== null) {
        files.push(res.data.ret.lice_img)
        }
        if (res.data.ret.tax_img!==null){
        files1.push(res.data.ret.tax_img)
        }
        if (res.data.ret.owner_card1 !== null) {
        files2.push(res.data.ret.owner_card1)
        }
        if (res.data.ret.owner_card2 !== null) {
        files3.push(res.data.ret.owner_card2)
        }
        console.log("test" + JSON.stringify(files))
        vm.setData({
          'test[0].placeholder': res.data.ret.name,
          'test[1].placeholder': res.data.ret.address,
          'test[2].placeholder': res.data.ret.code,
          'test[3].placeholder': res.data.ret.tax_code,
          'test[4].placeholder': res.data.ret.owner,
          'test[5].placeholder': res.data.ret.owner_no,
          'test[6].placeholder': res.data.ret.owner_tel,
           files: files,
           files1: files1,
           files2: files2,
           files3: files3,
        })
      }, null)
    }
  },

  showTopTips: function () {
    var that = this;
    this.setData({
      showTopTips: true
    });
    setTimeout(function () {
      that.setData({
        showTopTips: false
      });
    }, 3000);
  },
  // bindAgreeChange: function (e) {
  //   this.setData({
  //     isAgree: !!e.detail.value.length
  //   });
  // },

  //上传图片
  chooseImage: function (e) {
    // var count = 4 - vm.data.files.length
    var that = this;
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
                  files: vm.data.files.concat(picture)
                })
                console.log("files" + JSON.stringify(vm.data.files))
              }, (error) => {
                console.error('error: ' + JSON.stringify(error));
              })
            }
          }
        }, null);
      }
    })
  },
  chooseImage1: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        wx.showLoading({
          title: '正在上传',
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 2000)
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
                  files1: vm.data.files1.concat(picture)
                })
                console.log("files1" + JSON.stringify(vm.data.files))
              }, (error) => {
                console.error('error: ' + JSON.stringify(error));
              })
            }
          }
        }, null);
      }
    })
  },
  chooseImage2: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        wx.showLoading({
          title: '正在上传',
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 2000)
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
                  files2: vm.data.files2.concat(picture)
                })
                console.log("files2" + JSON.stringify(vm.data.files2))
              }, (error) => {
                console.error('error: ' + JSON.stringify(error));
              })
            }
          }
        }, null);
      }
    })
  },
  chooseImage3: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        wx.showLoading({
          title: '正在上传',
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 2000)
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
                  files3: vm.data.files3.concat(picture)
                })
                console.log("files3" + JSON.stringify(vm.data.files3))
              }, (error) => {
                console.error('error: ' + JSON.stringify(error));
              })
            }
          }
        }, null);
      }
    })
  },
  //删除图片
  updateImage: function (e) {
    var id = e.currentTarget.dataset.id
    console.log(JSON.stringify(e))
    console.log(vm.data.files[id])
    var files = vm.data.files
    files.splice(id, 1)
    vm.setData({
      files: files
    });
    console.log("图片组：" + JSON.stringify(vm.data.files))
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  previewImage1: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files1 // 需要预览的图片http链接列表
    })
  },
  previewImage2: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files2 // 需要预览的图片http链接列表
    })
  },
  previewImage3: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files3 // 需要预览的图片http链接列表
    })
  },

  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var enterpriseName = e.detail.value.enterpriseName
    var address = e.detail.value.address
    var postcode = e.detail.value.postcode
    var taxNum = e.detail.value.taxNum
    var name = e.detail.value.name
    var idNumber = e.detail.value.idNumber
    var phone = e.detail.value.phone
    var files0 = vm.data.files[0]
    var files1 = vm.data.files1[0]
    var files2 = vm.data.files2[0]
    var files3 = vm.data.files3[0]
    // console.log("files0" + JSON.stringify(files0))    
    vm.setData({
      enterpriseName: enterpriseName,
      address: address,
      postcode: postcode,
      taxNum: taxNum,
      name: name,
      idNumber: idNumber,
      phone: phone
    })
    var param = {
      name: vm.data.enterpriseName,//企业名称
      lice_img: files0,//营业执照
      address: vm.data.address,//地址
      code: vm.data.postcode,//邮编
      tax_code: vm.data.taxNum,//税号
      tax_img: files1,//税务登记证
      owner: vm.data.name,//法人姓名
      owner_card1: files2,//法人身份证正面
      owner_card2: files3,//法人身份证反面
      owner_no: vm.data.idNumber,//法人身份证号
      owner_tel: vm.data.phone,//法人电话
    }
    util.updateEnterprise(param, function (res) {
      console.log("更新企业" + JSON.stringify(res))
      if (res.data.code == "200") {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '发布信息成功',
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                // url: "/pages/read/read"
              })
            }
          }
        })
      }
      else {
        wx.showModal({
          title: '提示',
          content: '发布信息失败',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            }
          }
        })
      }
    })

  },
  // formReset: function () {
  //   console.log('form发生了reset事件')
  // },

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