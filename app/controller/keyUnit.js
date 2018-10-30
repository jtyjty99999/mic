'use strict';

const moment = require('moment');
const marked = require('marked');
const counter = require('../lib/count');

// 新增

exports.main = function* () {

    const body = this.request.body;
    const oper = body.oper;
    const id = body.id;
    const work_id = this.session.user.id;
    const name = body.name;
    const price = body.price;
    const description = body.description;
    const url = body.url;
    const key_id = body.key_id;

    if (oper === 'add') {
          
        yield this.service.keyUnit.insert({
            work_id,
            name,
            key_id,
            description,
            url,
            price
        });

        yield this.service.workerLog.insert({
            event: '新增颗粒库'+ name,
            place:'颗粒库',
            work_id
          });

        this.body = 'success';

    } else if (oper === 'edit') {

        yield this.service.keyUnit.update({
            id,
            work_id,
            name,
            key_id,
            description,
            url,
            price
        });

        yield this.service.workerLog.insert({
            event: '修改颗粒库'+ name,
            place:'颗粒库',
            work_id
          });

        this.body = 'success';

    } else if (oper === 'del') {

        yield this.service.workerLog.insert({
            event: '删除颗粒库'+ name,
            place:'颗粒库',
            work_id
          });

        yield this.service.keyUnit.remove(id);

        this.body = 'success';
    }


}

exports.list = function* () {
    const pageNum = +this.query.pageNumber || 1;
    const pageSize = +this.query.pageSize || 100;
    let result, total;
    result = yield this.service.keyUnit.list(pageNum, pageSize);
    total = yield this.service.keyUnit.count('1=1');

    this.body = {
        pageNumber: pageNum,
        pageSize,
        totalRow:total, 
        totalPage: total > pageSize ? (parseInt(total / pageSize) + 1) : 1,
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