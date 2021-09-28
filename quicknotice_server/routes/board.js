const router = require('express').Router();
const { boardController: controller } = require('../controller');

 router.post('/write', controller.Write);
 router.post('/list', controller.BoardList);
 router.post('/notice_list', controller.BoardNoticeList);
 router.post('/detail', controller.BoardDetail);
 router.post('/update', controller.BoardUpdate);
 router.post('/delete', controller.BoardDelete);
 router.post('/write_comment', controller.WriteComment);
 router.post('/comment', controller.CommentList);
 router.post('/update_comment', controller.CommentUpdate);
 router.post('/delete_comment', controller.CommentDelete);

module.exports = router;