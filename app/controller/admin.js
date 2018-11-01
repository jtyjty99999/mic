'use strict';


exports.loginByWechat = function* () {

  try {
    let appId = "wx52c4f518bbba52b5";
    let secret = "a03859eb4bcb57f3cc09995a01077c56";
    let { js_code } = this.request.body;
    let url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${secret}&js_code=${js_code}&grant_type=authorization_code`;
    let result = yield this.curl(url);
    this.body = JSON.parse(result.data);
  }
  catch (e) {
    console.log(e);
    this.body = '';
  }
  
}

const loginRule = {
  name: 'name',
  password: 'password',
};


exports.index = function* () {
  const work_id = this.session.user.id;
  yield this.render('index.html', {
    current: "people",
    key: yield this.service.keyUnit.count({
      work_id
    }),
    video: yield this.service.video.count({
      work_id
    }),
    business: yield this.service.business.count({
      work_id
    }),
    bill: yield this.service.bill.count({
      work_id
    }),
    title: "员工信息"
  });

};


exports.list = function* () {
  const pageNum = +this.query.pageNumber || 1;
  const pageSize = +this.query.pageSize || 100;
  const work_id = this.session.user.id;

  let result, total;
  result = yield this.service.workerLog.listByUser(pageNum, pageSize, work_id);
  total = yield this.service.workerLog.count();

  this.body = {
    pageNumber: pageNum,
    pageSize,
    totalRow: total,
    totalPage: total > pageSize ? total % pageSize : 1,
    list: result
  };
  /*
  this.body = {
      "pageSize": 10,
      "pageNumber": 1,
      "totalRow": 11,
      "totalPage": 2,
      "list": [
          {
              "expert": "计算机网络",
              "birthday": "2014-11-12",
              "sex": 1,
              "status": 1,
              "remark": "asdfasdfsdf",
              "sexName": "男",
              "statusName": "启用",
              "phone2": "13777777777",
              "password": "e10adc3949ba59abbe56e057f20f883e",
              "phone1": "13655555555",
              "id": 1,
              "update_time": "2014-11-24 15:50:22",
              "email": "aaa@aa.com",
              "login_name": "zhangsan",
              "name": "张三",
              "create_time": "2014-09-08 16:22:01",
              "qq": "44444444"
          },
          {
              "expert": "计算机网络1",
              "birthday": "2014-11-03",
              "sex": 0,
              "status": 1,
              "remark": "124312431",
              "sexName": "女",
              "statusName": "启用",
              "phone2": "1234123421",
              "password": "",
              "phone1": "1241342341431",
              "id": 5620,
              "update_time": "2014-11-24 13:37:58",
              "email": "341431@aa.comn",
              "login_name": "lisi",
              "name": "李四",
              "create_time": "2014-09-08 22:24:05",
              "qq": "34124121"
          }
      ]
  }*/
}


exports.adminLogin = function* () {

  yield this.render('login.html', {

  });
};

exports.adminLogout = function* () {
  this.session.adminLogin = false;
  this.session.user = null;
  yield this.render('login.html');

};

exports.login = function* () {
  // this.validate(loginRule);
  const name = this.request.body.name;
  const password = this.request.body.password;
  const login = yield this.service.people.login(name, password);

  if (login && login.length !== 0) {
    this.session.adminLogin = true;
    this.session.user = login[0];
    if (this.session.user.auth === 0) {
      this.session.user.position = '管理员'
    } else {
      this.session.user.position = '员工'
    }
    this.redirect('/manager/index');
  } else {
    yield this.render('login.html', {
      msg: '用户名或密码错误',
    });
  }

};