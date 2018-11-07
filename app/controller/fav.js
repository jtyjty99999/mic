'use strict';

const moment = require('moment');

// 新增

exports.fav = function* () {

    const body = this.request.body;
    const video_id = body.video_id;
    const openid = body.openid;
    yield this.service.fav.insert({
        video_id,
        user_id: openid
    });
    this.body = 'success';
}


exports.listByUser = function* () {
    const pageNum = +this.query.pageNumber || 1;
    const pageSize = +this.query.pageSize || 100;
    let result;
    const openid = this.query.openid;
    result = yield this.service.fav.listByUser(pageNum, pageSize, openid);
    this.body = {
        rows: result
    };
}