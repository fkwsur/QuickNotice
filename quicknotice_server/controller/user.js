const {user} = require('../models');
const { jwt, hash, mail, handler } = require('../utils');
const { errorHandler } = handler;
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

module.exports = {

  SignUp: async (req, res) => {
    try{
       let {
        userid,
        password,
        username,
        birthday,
        gender,
        email
       } = req.body 
       console.log(req.body.userId);
       let hashing = hash.generateHash(password);
       console.log(hashing);
       const rows = await user.create({
         user_id : userid, 
         password : hashing, 
         user_name : username, 
         birth : birthday, 
         gender : gender, 
         email : email 
       });
       console.log(rows);
       if(rows) return res.status(200).json({result : true});
       else throw {code : 4}
    }catch(err){
      console.log(err);
      return res.status(200).send(errorHandler(error));
    }
  },

  CheckId: async (req, res) => {
    try{
      let {
        userid
      } = req.body
      const rows = await user.findOne({
        where : {user_id : userid}
      })
      if(rows){
        return res.status(200).json({result : false});
      }else{
        return res.status(200).json({result : true});
      }
    }catch(err){
      return res.status(200).send(errorHandler(error));
    }
  },

  EmailAuth : async (req, res) => {
		try {
			let { email } = req.body;
      let authCode = Math.random().toString().substr(2,6);
      const mailing = mail.CheckMail(email, authCode)
    return res.status(200).json({result : authCode});
		} catch (error) {
      return res.status(200).send(errorHandler(error));
		}
	},

  SignIn : async (req, res) => {
    try{
      let {
        userid,
        password
      } = req.body
      console.log(req.body)
      const rows = await user.findOne({
        where : { user_id :userid }
      });
      if(!rows) throw {code : 10}
      const checking = hash.compareHash(password, rows.password);
      if(checking) {
        let token = jwt.createToken(rows.user_id);
        return res.status(200).json({token: token});
      }else throw {code : 11}
    }catch(err){
      console.log(err);
      return res.status(200).send(errorHandler(error));
    }
  },

  UserInfo : async (req, res) => {
    try{
      let {
        token
      } = req.body;
      let decoded = jwt.verifyToken(token);
      const rows = await user.findOne({
        where : { user_id : decoded.user_id}
      })
      if(rows) return res.status(200).json({result : rows});
      else throw {code : 4}
      }catch(err){
        return res.status(200).send(errorHandler(error));
      }
    },

    MemberInfo : async (req, res) => {
      try{
        let {
          user_name
        } = req.body;
        console.log(req.body);
        const rows = await user.findOne({
          where : {   user_name : user_name}
        })
        if(rows) return res.status(200).json({result : rows});
        else throw {code : 4}
        }catch(err){
          return res.status(200).send(errorHandler(error));
        }
      },

      EditProfileImg : async (req, res) => {
        try{
          let {
            token
          } = req.body;
          let decoded = jwt.verifyToken(token);
          let image = '/img/' + req.file.filename;
          const rows2 = await user.findOne({
            where : { user_id : decoded.user_id}
          })
          const rows = await user.update({
            user_img : image,
          },
          {
              where : {user_id : decoded.user_id}
          })
          if(rows2.user_img){
            const deleteImg = rows2.user_img.split('/')[2]
            fs.unlink(`./uploads/${deleteImg}`,(err)=>{
              if (err) console.log(err);
              console.log('File deleted!');
            })
          }
          if(rows) return res.status(200).json({result : true});
          else throw {code : 4}
          }catch(err){
            return res.status(200).send(errorHandler(error));
          }
        },

}