'use strict';

const moment = require('moment');
const marked = require('marked');
const counter = require('../lib/count');
const mail = require('../lib/mail');


exports.index = function* () {
  let categorys = yield this.service.category.list();
  categorys = categorys.filter((d)=>{return d.level === 1});
  let users = yield this.service.people.listAll()
  yield this.render('bill.html',{
    current:"bill",
    categorys: JSON.stringify(categorys),
    users : JSON.stringify(users),
    title:"订单管理"
  });

};

// 新增

exports.main = function *(){

  const body = this.request.body;
  const oper = body.oper; 
  const id = body.id;
  const name = body.name;
  const price = body.price;
  const business = body.business;
  const status = body.status;
  const is_scene = body.is_scene;
  const is_audio = body.is_audio;
  const is_show = body.is_show;
  const is_model = body.is_model;
  const is_text = body.is_text;
  const phone = body.phone;
  const category_id = body.category_id;
  const openid = body.openid;
  let result;
  if(oper === 'add'){

    result = yield this.service.bill.insert({
      work_id:this.session.user? this.session.user.id : null,
      name,
      price,
      business,
      status,
      is_scene,
      is_audio,
      is_model,
      is_text,
      is_show,
      phone,
      category_id,
      openid
    });

    if(!this.session.user){
      mail.sendMail('你收到一份来自全民星小视频的brief', '请在后台查看id为' + result.insertId +'的订单',function(info){
        console.log(info);
      })
    }

    this.body = 'success';

  }else if(oper === 'edit'){

    let work_id = this.session.user.id;

    yield this.service.bill.update({
      id,
      work_id:body.work_id,
      name,
      price,
      business,
      status,
      is_scene,
      is_audio,
      is_model,
      is_text,
      is_show,
      phone,
      category_id,
    });
    yield this.service.workerLog.insert({
      event: '修改订单'+ name,
      place:'订单管理',
      work_id
    });
    this.body = 'success';

  }else if(oper === 'del'){

    let work_id = this.session.user.id;

    yield this.service.bill.remove(id);

    yield this.service.workerLog.insert({
      event: '删除订单'+ id,
      place:'订单管理',
      work_id
    });

    this.body = 'success';
  }


}

exports.list = function* () {
  const pageNum = +this.query.page || 1;
  const pageSize = +this.query.rows || 100;
  const _search = this.query._search;
  const sql = this.query.sql;
  let result, total;

  if(_search !== 'true'){
    result = yield this.service.bill.list(pageNum, pageSize);
    total = yield this.service.bill.count('1=1');
  }else{
    result = yield this.service.bill.search(pageNum, pageSize, sql);
    total = yield this.service.bill.count(sql);
  }
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
  this.body = {
    total: total > pageSize ? (parseInt(total / pageSize) + 1) : 1,
    rows: result
  };
}

exports.listByUser = function* () {
  let result;
  const openid = this.query.openid;
  result = yield this.service.bill.listByUser(openid);
  this.body = {
    rows: result
  };
}