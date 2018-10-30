'use strict';

module.exports = app => {
  const admin = app.role.can('admin');


  //登陆

  app.get('/adminlogin', app.controller.admin.adminLogin);
  app.get('/adminlogout', app.controller.admin.adminLogout);
  app.get('/manager/index', app.controller.admin.index);
  app.get('/manager/list', app.controller.admin.list)
  app.post('/login', app.controller.admin.login);


  //商家库
  app.post('/business', admin, app.controller.business.main);
  app.get('/business', admin, app.controller.business.list);
  app.get('/manager/business', admin, app.controller.business.index);
  
  //视频库
  app.get('/manager/video/detail', admin, app.controller.video.detail);
  app.post('/video', admin, app.controller.video.main);
  app.get('/video', admin, app.controller.video.list);
  app.get('/video/listByCategory', app.controller.video.listByCategory);
  app.get('/video/listByHot', app.controller.video.listByHot);
  app.get('/manager/video', admin, app.controller.video.index);

  //人员管理
  app.post('/people', admin, app.controller.people.main);
  app.get('/people', admin, app.controller.people.list);
  app.get('/manager/people', admin, app.controller.people.index);
  
  //订单管理
  app.post('/bill', app.controller.bill.main);
  app.get('/bill', admin, app.controller.bill.list);
  app.get('/manager/bill', admin, app.controller.bill.index);
  app.get('/bill/listByUser', app.controller.bill.listByUser); 
  
  //颗粒度管理
  app.post('/key', admin, app.controller.key.main);
  app.get('/key', admin, app.controller.key.list);
  app.get('/manager/key', admin, app.controller.key.index);


  //类目管理
  app.post('/category', admin, app.controller.category.main);
  app.get('/category', app.controller.category.list);
  app.get('/manager/category', admin, app.controller.category.index);


  //颗粒度内容上传
  app.post('/keyunit', admin, app.controller.keyUnit.main);
  app.get('/keyunit', admin, app.controller.keyUnit.list);

  // 微信api登录

  app.post('/api/login', app.controller.admin.loginByWechat)


  //app.get('/manager', admin, app.controller.admin.manager);


  //登陆
  //app.post('/adminLogin', app.controller.admin.login);


  // 管理员登陆
 // app.get('/adminlogin', app.controller.site.adminLogin);
 // app.get('/adminLogout', app.controller.site.adminLogout);

 // app.get('/500', app.controller.site.error);

  // app.get('/*', app.controller.site.notFound);
};
