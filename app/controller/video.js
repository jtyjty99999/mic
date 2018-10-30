'use strict';

const moment = require('moment');
const marked = require('marked');
const counter = require('../lib/count');


exports.index = function* () {
  let categorys = yield this.service.category.list();
  categorys = categorys.filter((d)=>{return d.level === 1});
  let users = yield this.service.people.listAll()
  yield this.render('video.html',{
    current:"video",
    categorys: JSON.stringify(categorys),
    title:"视频库",
    users:JSON.stringify(users)
  });
};

exports.detail = function* () {

  const id = this.request.query.id;
  const detail = yield this.service.video.find(id);
  console.log(detail);
  console.log(99999);
  yield this.render('video-detail.html',{
    title:"视频库",
    detail: detail[0]
  });
};


// 新增

exports.main = function *(){

  const body = this.request.body;
  const oper = body.oper; 
  const id = body.id;
  const work_id = this.session.user.id;
  const name = body.name;
  const description = body.description;
  const category_id = body.category_id;
  const price = body.price;
  const business = body.business;
  const time = body.time;
  const format = body.format;
  const url = body.url;
  const is_scene = body.is_scene;
  const is_audio = body.is_audio;
  const is_show = body.is_show;
  const is_model = body.is_model;
  const is_text = body.is_text;


  // work_id 从session里获取

  if(oper === 'add'){

    yield this.service.video.insert({
      work_id,
      name,
      description,
      category_id,
      price,
      business,
      time,
      format,
      url,
      is_audio,
      is_model,
      is_scene,
      is_show,
      is_text
    });

    yield this.service.workerLog.insert({
      event: '上传视频' + name,
      place:'视频库',
      work_id
    });
    
    this.body = 'success';
    

  }else if(oper === 'edit'){

    yield this.service.video.update({
      id,
      work_id,
      name,
      description,
      category_id,
      price,
      business,
      time,
      format,
      url,
      is_audio,
      is_model,
      is_scene,
      is_show,
      is_text
    });

    yield this.service.workerLog.insert({
      event: '修改视频'+name,
      place:'视频库',
      work_id
    });

    this.body = 'success';

  }else if(oper === 'del'){

    yield this.service.workerLog.insert({
      event: '删除视频'+ id,
      place:'视频库',
      work_id
    });

    yield this.service.video.remove(id);

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
    result = yield this.service.video.list(pageNum, pageSize);
    total = yield this.service.video.count('1=1');
  }else{
    result = yield this.service.video.search(pageNum, pageSize, sql);
    total = yield this.service.video.count(sql);
  }
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
  this.body = {
    total: parseInt(total / pageSize) + 1,
    rows: result
  };
}

exports.listByCategory = function *(){
  const pageNum = +this.query.page || 1;
  const pageSize = +this.query.rows || 100;
  const category_id = this.query.category_id;
  const sql = `category_id = ${category_id}`

  let result, total;
  result = yield this.service.video.search(pageNum, pageSize, sql);
  total = yield this.service.video.count();

  this.body = {
    total: total % pageSize,
    rows: result,
    pageNum,
    pageSize
  }; 
}

exports.listByHot = function *(){
  const pageSize = +this.query.rows || 100;
  let result = yield this.service.video.listByHot(pageSize);
  this.body = {
    rows: result,
  }; 
}