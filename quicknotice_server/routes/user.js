const router = require('express').Router();
const { userController: controller } = require('../controller');
const { multer } = require('../utils');

 router.post('/signup', controller.SignUp);
 router.post('/idcheck', controller.CheckId);
 router.post('/emailauth', controller.EmailAuth);
 router.post('/signin', controller.SignIn);
 router.post('/userinfo', controller.UserInfo);
 router.post('/memberinfo', controller.MemberInfo);
 router.post('/userimg', multer.single_uploader,controller.EditProfileImg);
 
module.exports = router;