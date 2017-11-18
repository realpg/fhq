var TESTMODE = false;

//服务器地址
var SERVER_URL = "https://fhq.isart.me/api";
var DEBUG_URL = "http://localhost/DSYYServer";
var SERVER_URL = (TESTMODE) ? DEBUG_URL : SERVER_URL;

///////七牛相关///////////////////////////////////
//根据key值获取图片真实链接
function getImgRealUrl(key_v) {
  return "http://dsyy.isart.me/" + key_v;  
}

//获取七牛URL，进行图片剪裁
function qiniuUrlTool(img_url, type) {
  if ((img_url == undefined || img_url == null) && type == "head_icon") {
    return "../../images/jiazai.png";
  }
  if (img_url == undefined || img_url == null) {
    return "";
  }
  var pos = img_url.indexOf("?");
  //alert(pos);
  if (pos != -1) {
    img_url = img_url.substr(0, pos);
  }
  var qn_img_url;
  switch (type) {
    case "top_ad":      //广告图片
      qn_img_url = img_url + "?imageView2/2/w/320/h/165/interlace/1";
      break;
    case "folder_index":        //首页图片
      qn_img_url = img_url + "?imageView2/2/w/450/q/75/interlace/1";
      break;
    case "work_step":           //编辑的画夹步骤
      qn_img_url = img_url + "?imageView2/2/w/750/interlace/1";
      break;
    case "user_hi":  //头像
      qn_img_url = img_url + "?imageView2/1/w/200/h/200/interlace/1";
    case "bar_detail":  //书吧详情页
      qn_img_url = img_url + "?imageView2/1/w/750/h/384/interlace/1";
    case "user_bg":  //我的背景
      qn_img_url = img_url + "?imageView2/1/w/750/interlace/1";
      break;
  }
  return qn_img_url;
}

//获取真实的七牛云存储链接
function getRealImgUrl(img_url) {
  //如果img_url为空
  if (judgeIsAnyNullStr(img_url)) {
    return img_url
  }
  var pos = img_url.indexOf("?");
  return img_url.substring(0, pos)
}

//是否还有本地图片
function isLocalImg(img) {
  if (judgeIsAnyNullStr(img)) {
    return false;
  }
  if (img.indexOf("wxfile") >= 0) {
    return true;
  }
  return false;
}

// 获取头像
function getHeadIconA(dir, hi) {
  // console.log(hi);
  if (hi == undefined || hi.length < 15) {
    if (dir == "html") {
      return "../image/default_head_logo.png";
    } else {
      return "../image/default_head_logo.png";
    }
  }
  if (hi.indexOf('7xku37.com') < 0) {
    return hi;
  }
  return qiniuUrlTool(hi, "head_icon");
}

///接口调用相关方法///////////////////////////////////////////

//进行接口调用的基本方法
function wxRequest(url, param, method, successCallback, errorCallback) {
  console.log("wxRequest url:" + JSON.stringify(url) + " param:" + JSON.stringify(param));
  // console.log("globalData userInfo:" + JSON.stringify(getApp().globalData.userInfo))
  if (!judgeIsAnyNullStr(getApp().globalData.userInfo)) {
    //user_id未设置
    if (judgeIsAnyNullStr(param.user_id)) {
      param.user_id = getApp().globalData.userInfo.id;
    }
    param.token = getApp().globalData.userInfo.token;
  }
  console.log("param：" + JSON.stringify(param))
  wx.request({
    url: url,
    data: param,
    header: {
      "Content-Type": "application/json"
    },
    method: method,
    success: function (res) {
      successCallback(res)
      hideLoading()
    },
    fail: function (err) {
      console.log("wxRequest fail:" + JSON.stringify(err))
      hideLoading()
    }
  });
}

function test(param) {
  console.log(JSON.stringify("11"));
}

//获取七牛上传token
function getQnToken(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/user/getQiniuToken', param, "GET", successCallback, errorCallback);
}
//获取首页ads及商品
function getAds(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/home', param, "GET", successCallback, errorCallback);
}
//获取办公类、办理类商品列表
function getProductList(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/good/list', param, "GET", successCallback, errorCallback);
}
//获取资讯政策列表
function getMessageList(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/zx/list', param, "GET", successCallback, errorCallback);
}
//根据id获取资讯政策简介信息
function getMessagegetById(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/zx/getById', param, "GET", successCallback, errorCallback);
}
//根据code获取用户openid
function getOpenId(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/user/getXCXOpenId', param, "GET", successCallback, errorCallback);
}
//用户登录
function login(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/user/login', param, "POST", successCallback, errorCallback);
}
//更新用户信息
function updateUserInfo(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/user/updateById', param, "POST", successCallback, errorCallback);
}
//根据id获取商品
function getOfficePageByOfficeId(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/good/getById', param, "GET", successCallback, errorCallback);
}
//获取用户录入的企业列表
function getListByUserId(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/enter/getListByUserId', param, "GET", successCallback, errorCallback);
}
//更新用户录入的企业信息
function updateEnterprise(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/enter/edit', param, "POST", successCallback, errorCallback);
}

//根据id获取企业信息详情
function getEnterpriseById(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/enter/getById', param, "GET", successCallback, errorCallback);
}
//删除企业信息
function deleteEnterpriseById(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/enter/del', param, "POST", successCallback, errorCallback);
}
// 根据id获取用户信息（带token）
function getByIdWithToken(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/user/getByIdWithToken', param, "GET", successCallback, errorCallback);
}
// 根据id获取用户信息（不带token）
function getById(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/user/getById', param, "GET", successCallback, errorCallback);
}
// 下单接口
function postTemPrepay(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/wxpay/temPrepay', param, "POST", successCallback, errorCallback);
}
// 获取用户订单
function getPayListByUserId(param, successCallback, errorCallback) {
  wxRequest(SERVER_URL + '/wxpay/getListByUserId', param, "GET", successCallback, errorCallback);
}
//返回
function navigateBack(delta) {
  wx.navigateBack({
    delta: delta
  })
}
//判断是否有空字符串
function judgeIsAnyNullStr() {
  if (arguments.length > 0) {
    for (var i = 0; i < arguments.length; i++) {
      if (arguments[i] == null || arguments[i] == "" || arguments[i] == undefined || arguments[i] == "undefined" || arguments[i] == "未设置") {
        return true;
      }
    }
  }
  return false;
}

//获取日期 2017-06-13
function getDateStr(str) {
  if (judgeIsAnyNullStr(str)) {
    return str
  }
  var pos = str.indexOf(' ');
  if (pos < 0) {
    return str
  }
  return str.substr(0, pos)
}
//格式化日期时间
function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
//展示toast
function showToast(msg, img) {
  console.log(img);
  if (judgeIsAnyNullStr(img)) {
    wx.showToast({
      title: msg,
      icon: 'success',
      duration: 1500,
    })
  } else {
    wx.showToast({
      title: msg,
      icon: 'success',
      duration: 1500,
      image: img
    })
  }
}
//展示modal
function showModal(title, content, confirmCallBack, cancelCallBack) {
  wx.showModal({
    title: title,
    content: content,
    success: function (res) {
      if (res.confirm) {
        console.log('用户点击确定')
        confirmCallBack(res)
      } else if (res.cancel) {
        console.log('用户点击取消')
        cancelCallBack(res)
      }
    }
  })
}
//错误modal
function showErrorModal(msg) {
  wx.showModal({
    title: '调用失败',
    content: msg,
    success: function (res) {
      if (res.confirm) {
        console.log('用户点击确定')
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    }
  })
}
//展示loadding
function showLoading(msg) {
  if (!wx.canIUse('showLoading')) {
    return;
  }
  wx.showLoading({
    title: msg,
  })
}

//隐藏loadding
function hideLoading() {
  if (!wx.canIUse('hideLoading')) {
    return;
  }
  wx.hideLoading();
}
//优化字符串输出，如果str为空，则返回r_str
function conStr(str, r_str) {
  if (judgeIsAnyNullStr(str)) {
    return r_str;
  }
  return str;
}

//判断是否为空图
function judgeIsNullImg(img_url) {
  if (judgeIsAnyNullStr(img_url)) {
    return true
  }
  if (img_url.indexOf('def.png') >= 0) {
    return true
  }
  return false
}

function judgeIsAnyNullStrImp(obj) {
  if (obj.length > 0) {
    for (var i = 0; i < obj.length; i++) {
      var value = obj[i].value;
      var name = obj[i].name;
      if (value == null || value == "" || value == undefined || value == "未设置") {
        showToast("请设置" + convertEnNameToChiName(name), "../../images/close_icon.png");
        return true;
      }
    }
  }
  return false;
}


//是否还有本地图片
function isLocalImg(img) {
  if (img.indexOf("wxfile") >= 0) {
    return true;
  }
  return false;
}

//util.js
function imageUtil(e) {
  var imageSize = {};
  var originalWidth = e.detail.width;//图片原始宽
  var originalHeight = e.detail.height;//图片原始高
  var originalScale = originalHeight / originalWidth;//图片高宽比
  console.log('originalWidth: ' + originalWidth)
  console.log('originalHeight: ' + originalHeight)
  //获取屏幕宽高
  wx.getSystemInfo({
    success: function (res) {
      var windowWidth = res.windowWidth;
      var windowHeight = res.windowHeight;
      var windowscale = windowHeight / windowWidth;//屏幕高宽比
      console.log('windowWidth: ' + windowWidth)
      console.log('windowHeight: ' + windowHeight)
      //图片缩放后的宽为屏幕宽
      imageSize.imageWidth = windowWidth;
      imageSize.imageHeight = (windowWidth * originalHeight) / originalWidth;
    }
  })
  console.log('缩放后的宽: ' + imageSize.imageWidth)
  console.log('缩放后的高: ' + imageSize.imageHeight)
  return imageSize;
}



///选择图片////////////////////////////////////////////////////////
function chooseImage(param, successCallBack, errorCallBack, completeCallBack) {

  //进行参数配置
  if (judgeIsAnyNullStr(param.count)) {
    param.count = 9
  }
  if (judgeIsAnyNullStr(param.sizeType)) {
    param.sizeType = ['compressed']
  }
  if (judgeIsAnyNullStr(param.sourceType)) {
    param.sourceType = ['album']
  }
  console.log("param :" + JSON.stringify(param))

  wx.chooseImage({
    sizeType: param.sizeType, // 可以指定是原图还是压缩图，默认二者都有
    sourceType: param.sourceType, // 可以指定来源是相册还是相机，默认二者都有
    count: param.count,
    success: function (res) {
      // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
      console.log("wx.chooseImage success:" + JSON.stringify(res))
      successCallBack(res)
    },
    fail: function (res) {
      console.log("wx.chooseImage fail:" + JSON.stringify(res))
      if (typeof errorCallBack == "function") {
        errorCallBack(res)
      }
      errorCallBack(res);
    },
    complete: function (res) {
      console.log("wx.chooseImage complete:" + JSON.stringify(res))
      if (typeof completeCallBack == "function") {
        completeCallBack(res)
      }
    }
  })
}

function clone(myObj) {
  if (typeof (myObj) != 'object') return myObj;
  if (myObj == null) return myObj;

  var myNewObj = new Object();

  for (var i in myObj)
    myNewObj[i] = clone(myObj[i]);

  return myNewObj;
}

function getErrorMsg(error_code) {
  switch (error_code) {
    case "999":
      return "调用失败"
  }
  return "未知错误";
}

/*
** randomWord 产生任意长度随机字母数字组合
** randomFlag-是否任意长度 min-任意长度最小位[固定位数] max-任意长度最大位
** xuanfeng 2014-08-28
** 生成3-32位随机串：randomWord(true, 3, 32)
** 生成43位随机串：randomWord(false, 43)
*/

function randomWord(randomFlag, min, max) {
  var str = "",
    range = min,
    arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  // 随机产生
  if (randomFlag) {
    range = Math.round(Math.random() * (max - min)) + min;
  }
  for (var i = 0; i < range; i++) {
    var pos = Math.round(Math.random() * (arr.length - 1));
    str += arr[pos];
  }
  return str;
}


/* 时间戳产生函数   */
function createTimeStamp() {
  return parseInt(new Date().getTime() / 1000) + ''
}

/* 随机数 */
function randomString() {
  var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  var maxPos = chars.length;
  var pwd = '';
  for (var i = 0; i < 32; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}

module.exports = {
  INDEX_PAGE: "/pages/index/index",
  getOpenId: getOpenId,
  getAds: getAds,
  login: login,
  updateUserInfo: updateUserInfo,
  getDateStr: getDateStr,
  navigateBack: navigateBack,
  judgeIsAnyNullStr: judgeIsAnyNullStr,
  showLoading: showLoading,
  hideLoading: hideLoading,
  showToast: showToast,
  showModal: showModal,
  showErrorModal: showErrorModal,
  conStr: conStr,
  clone: clone,
  randomWord: randomWord,
  judgeIsAnyNullStrImp: judgeIsAnyNullStrImp,
  isLocalImg: isLocalImg,
  getImgRealUrl: getImgRealUrl,
  qiniuUrlTool: qiniuUrlTool,
  getRealImgUrl: getRealImgUrl,
  judgeIsNullImg: judgeIsNullImg,
  chooseImage: chooseImage,
  getErrorMsg: getErrorMsg,
  test:test,

  getOfficePageByOfficeId: getOfficePageByOfficeId,
  getMessageList: getMessageList,
  imageUtil: imageUtil,
  getByIdWithToken: getByIdWithToken,
  getMessagegetById: getMessagegetById,
  updateEnterprise: updateEnterprise,
  getQnToken: getQnToken,
  getListByUserId: getListByUserId,
  getEnterpriseById: getEnterpriseById,
  deleteEnterpriseById: deleteEnterpriseById,
  postTemPrepay: postTemPrepay,
  getPayListByUserId: getPayListByUserId,
  getById: getById,
  getProductList: getProductList
}