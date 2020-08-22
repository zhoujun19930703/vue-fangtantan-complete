export const api_getTestNumber = { // 首页-第一页
  url: '',
  method: ''
}

export const api_getImgList = { // 第二页-获取图片列表
  url: '/v1/categorytest/index/pictureList',
  method: 'get'
}

export const api_getTestData = { // 第三页-上传测试数据
  url: '/v1/categorytest/index/computeScore',
  method: 'post'
}

export const api_getTestResult = { // 第四页-获取测试结果
  url: '/v1/categorytest/index/result',
  method: 'get'
}
