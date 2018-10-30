'use strict';

module.exports = app => {
  class MonthServer extends app.Service {
    * insert(obj) {
      const result = yield app.mysql.insert('video_key_unit', {
        name: obj.name,
        url: obj.url,
        description:obj.description,
        key_id: obj.key_id,
        price:obj.price,
        work_id:obj.work_id,
        timestamp: app.mysql.literals.now,
      });

      return result.affectedRows === 1;
    }

    // 获取列表
    * list(pageNum, pageSize) {
      const articles = yield app.mysql.query('select * from video_key_unit order by timestamp desc limit ? offset ?;', [ pageSize, (pageNum - 1) * pageSize ]);
      return articles;
    }

    // 获取某条信息
    * find(id) {
      const article = yield app.mysql.get('video_key_unit', { id });

      return article;
    }

  // 总数
  * count(where) {
    const count = yield app.mysql.query('select count(*) from video_key_unit');
    return count[0]['count(*)'];
  } 

    // 更新
    * update(data) {
      const result = yield app.mysql.update('video_key_unit', data);

      return result.affectedRows === 1;
    }

    // 删除
    * remove(id) {
      const result = yield app.mysql.delete('video_key_unit', {
        id:id
      });

      return result.affectedRows === 1;
    }

  }
  return MonthServer;
};
