// pages/updateEnterprise/updateEnterprise.js
var vm = null
var util = require('../../utils/util.js')
const qiniuUploader = require("../../utils/qiniuUploader");
// var addressJson = require('../../data/data.js');
var app = getApp()
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
    enterpriseName: "",//企业名称
    address: "",//地址
    postcode: "",//
    taxNum: "",
    name: "",
    idNumber: "",
    phone: "",
    files: [],//营业执照
    files1: [],//税务登记证
    files2: [],//身份证正面
    files3: [],//身份证反面
    enterprise: {},
    id: "",

    sheng: [],//获取到的所有的省
    shi: [],//选择的该省的所有市
    qu: [],//选择的该市的所有区县
    sheng_index: 0,//picker-view省项选择的value值
    shi_index: 0,//picker-view市项选择的value值
    qu_index: 0,//picker-view区县项选择的value值
    shengshi: null,//取到该数据的所有省市区数据
    jieguo: {},//最后取到的省市区名字
    animationData: {},
  },

  //点击事件，点击弹出选择页
  dianji: function () {
    //这里写了一个动画，让其高度变为满屏
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })
    this.animation = animation
    animation.height(1332 + 'rpx').step()
    this.setData({
      animationData: animation.export()
    })

  },
  //取消按钮
  quxiao: function () {
    //这里也是动画，然其高度变为0
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })

    this.animation = animation
    animation.height(0 + 'rpx').step()
    this.setData({
      animationData: animation.export()
    });
    //取消不传值，这里就把jieguo 的值赋值为{}
    this.setData({
      jieguo: {}
    });
    console.log(this.data.jieguo);
  },
  //确认按钮
  queren: function () {
    //一样是动画，级联选择页消失，效果和取消一样
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })
    this.animation = animation
    animation.height(0 + 'rpx').step()
    this.setData({
      animationData: animation.export()
    });
    //打印最后选取的结果
    console.log(this.data.jieguo);
  },
  //滚动选择的时候触发事件
  bindChange: function (e) {
    //这里是获取picker-view内的picker-view-column 当前选择的是第几项

    const val = e.detail.value
    this.setData({
      sheng_index: val[0],
      shi_index: val[1],
      qu_index: val[2]
    })
    this.jilian();
    console.log(val);

    console.log(this.data.jieguo);
  },
  //这里是判断省市名称的显示
  jilian: function () {
    var that = this,
      shengshi = that.data.shengshi,
      sheng = [],
      shi = [],
      qu = [],
      qu_index = that.data.qu_index,
      shi_index = that.data.shi_index,
      sheng_index = that.data.sheng_index;
    //遍历所有的省，将省的名字存到sheng这个数组中
    for (let i = 0; i < shengshi.length; i++) {
      sheng.push(shengshi[i].name)
    }

    if (shengshi[sheng_index].regions) {//这里判断这个省级里面有没有市（如数据中的香港、澳门等就没有写市）
      if (shengshi[sheng_index].regions[shi_index]) {//这里是判断这个选择的省里面，有没有相应的下标为shi_index的市，因为这里的下标是前一次选择后的下标，比如之前选择的一个省有10个市，我刚好滑到了第十个市，现在又重新选择了省，但是这个省最多只有5个市，但是这时候的shi_index为9，而这里的市根本没有那么多，所以会报错
        //这里如果有这个市，那么把选中的这个省中的所有的市的名字保存到shi这个数组中
        for (let i = 0; i < shengshi[sheng_index].regions.length; i++) {
          shi.push(shengshi[sheng_index].regions[i].name);
        }
        console.log('执行了区级判断');

        if (shengshi[sheng_index].regions[shi_index].regions) {//这里是判断选择的这个市在数据里面有没有区县
          if (shengshi[sheng_index].regions[shi_index].regions[qu_index]) {//这里是判断选择的这个市里有没有下标为qu_index的区县，道理同上面市的选择
            console.log('这里判断有没有进区里');
            //有的话，把选择的这个市里面的所有的区县名字保存到qu这个数组中
            for (let i = 0; i < shengshi[sheng_index].regions[shi_index].regions.length; i++) {
              console.log('这里是写区得');
              qu.push(shengshi[sheng_index].regions[shi_index].regions[i].name);
            }
          } else {
            //这里和选择市的道理一样
            that.setData({
              qu_index: 0
            });
            for (let i = 0; i < shengshi[sheng_index].regions[shi_index].regions.length; i++) {
              qu.push(shengshi[sheng_index].regions[shi_index].regions[i].name);
            }
          }
        } else {
          //如果这个市里面没有区县，那么把这个市的名字就赋值给qu这个数组
          qu.push(shengshi[sheng_index].regions[shi_index].name);
        }
      } else {
        //如果选择的省里面没有下标为shi_index的市，那么把这个下标的值赋值为0；然后再把选中的该省的所有的市的名字放到shi这个数组中
        that.setData({
          shi_index: 0
        });
        for (let i = 0; i < shengshi[sheng_index].regions.length; i++) {
          shi.push(shengshi[sheng_index].regions[i].name);
        }

      }
    } else {
      //如果该省级没有市，那么就把省的名字作为市和区的名字
      shi.push(shengshi[sheng_index].name);
      qu.push(shengshi[sheng_index].name);
    }

    console.log(sheng);
    console.log(shi);
    console.log(qu);
    //选择成功后把相应的数组赋值给相应的变量
    that.setData({
      sheng: sheng,
      shi: shi,
      qu: qu
    });
    //有时候网络慢，会出现区县选择出现空白，这里是如果出现空白那么执行一次回调
    if (sheng.length == 0 || shi.length == 0 || qu.length == 0) {
      that.jilian();
      console.log('这里执行了回调');
      // console.log();
    }
    console.log(sheng[that.data.sheng_index]);
    console.log(shi[that.data.shi_index]);
    console.log(qu[that.data.qu_index]);
    //把选择的省市区都放到jieguo中
    let jieguo = {
      sheng: sheng[that.data.sheng_index],
      shi: shi[that.data.shi_index],
      qu: qu[that.data.qu_index]
    };

    that.setData({
      jieguo: jieguo
    });

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
        if (res.data.ret.tax_img !== null) {
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
          id: options.id
        })
      }, null)
    }

    var that = this;
    wx.request({
      url: 'https://wxxapp.duapp.com/quanguo.json',
      data: {},
      method: 'GET',
      success: function (res) {

        console.log(res.data.regions);
        that.setData({
          shengshi: res.data.regions
        });
        that.jilian();
      },
      fail: function () {
      },
      complete: function () {
      }
    })

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
    if (vm.data.id == "") {
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
    } else {
      var param = {
        id: vm.data.id,
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
                url: '/pages/enterprise/enterprise'
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
    // wx.navigateTo({
    //   url: '/pages/product/product?officeid=' + officeid
    // })
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