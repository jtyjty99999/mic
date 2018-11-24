'use strict';


module.exports = app => {
  class MonthServer extends app.Service {
    * insert(obj) {
      const result = yield app.mysql.insert('video_bill', {
        name: obj.name,
        work_id: obj.work_id || 0,
        price:obj.price,
        status:obj.status || 0,
        business:obj.business,
        is_scene:obj.is_scene,
        is_audio:obj.is_audio,
        is_model:obj.is_model,
        is_show:obj.is_show,
        is_text:obj.is_text,
        time:obj.time,
        scale:obj.scale,
        channel:obj.channel,
        phone:obj.phone,
        category_id:obj.category_id,
        openid: obj.openid,
        timestamp: app.mysql.literals.now,
      });

      return result;
    }

    // 获取列表
    * list(pageNum, pageSize) {
      const articles = yield app.mysql.query('select id,name,work_id,price,status,business,is_scene,is_audio,is_model,is_show,is_text,time,scale,channel,timestamp,phone,category_id from video_bill order by timestamp desc limit ? offset ?;', [ pageSize, (pageNum - 1) * pageSize ]);
      return articles;
    }

    // 获取列表byren
    * listByUser(openid) {
      const articles = yield app.mysql.query('select video_bill.id,video_bill.name,work_id,price,status,business,is_scene,is_audio,is_model,is_show,is_text,time,scale,channel,timestamp,phone,category_id,video_category.name from video_bill LEFT JOIN video_category on video_bill.category_id=video_category.id  where openid = ? and status != 3 order by timestamp desc;', [ openid ]);
      return articles;
    }

    // 获取某条信息
    * find(id) {
      const article = yield app.mysql.get('video_bill', { id });

      return article;
    }

    // 搜索
    * search(pageNum, pageSize, where) {
        let sql = 'select id,name,work_id,price,status,business,is_scene,is_audio,is_model,is_show,is_text,time,scale,channel,timestamp,phone,category_id,openid from video_bill where'
        sql += ' '+ where;
        sql += ' order by timestamp desc limit ? offset ?;'
        const articles = yield app.mysql.query(sql, [pageSize, (pageNum - 1) * pageSize ]);
        return articles;
    }
    // 总数
    * count(where) {
        const count = yield app.mysql.query('select count(*) from video_bill where ?', [where]);

        return count[0]['count(*)'];
    } 

    // 更新
    * update(data) {
      const result = yield app.mysql.update('video_bill', data);

      return result.affectedRows === 1;
    }

    // 删除
    * remove(id) {
      const result = yield app.mysql.delete('video_bill', {
        id:id
      });

      return result.affectedRows === 1;
    }

  }
  return MonthServer;
};
