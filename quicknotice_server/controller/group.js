const {user, group_collection,group_member, QueryTypes, sequelize} = require('../models');
const {jwt, handler} = require('../utils');
const { errorHandler } = handler;
const fs = require('fs');

module.exports = {

  CreateGroup : async (req, res) => {
    try{
      let {
        group_name,
        token
      } = req.body
      let decoded = jwt.verifyToken(token);
      const rows = await group_collection.create({
        group_name : group_name,
        manager : decoded.user_id
      })
      if(!rows) throw {code : 4}
      const rows2 = await group_member.create({
        group_code : rows.idx,
        member : decoded.user_id
      })
      if(rows2) return res.status(200).json({result : rows});
      else throw {code : 4}
    }catch(err){
      return res.status(200).send(errorHandler(error));
    }
  },

  List : async (req, res) => {
    try{
      let {token} = req.body;
      let decoded = jwt.verifyToken(token);
      let data = [decoded.user_id];
      let query = `select * from group_collection inner join group_member 
      on group_collection.idx = group_member.group_code 
      where group_member.member = ?`;
      const rows = await sequelize.query(query, { replacements: data, type: QueryTypes.SELECT})
    if(rows) return res.status(200).json({result: rows});
    else throw {code : 4}
    }catch(err){
      return res.status(200).send(errorHandler(error));
    }
  },

  GroupName : async (req, res) => {
    try{
      let {idx} = req.body;
      const rows = await group_collection.findOne({
        where : {idx : idx}
      })
      if(rows) return res.status(200).json({result : rows});
      else throw {code : 4}
    }catch(err){
      return res.status(200).send(errorHandler(error));
    }
  },
    
  GroupList : async (req, res) => {
    try{
      let {
        group_idx
      } = req.body
      console.log(req.body);
      let data = [group_idx];
      let query = `select * from user inner join group_member 
      on user.user_id = group_member.member 
      where group_member.group_code = ?`;
      const rows = await sequelize.query(query, { replacements: data, type: QueryTypes.SELECT})
      if(rows) return res.status(200).json({result : rows});
      else throw {code : 4}
    }catch(err){
      return res.status(200).send(errorHandler(error));
    }
  },

  GroupCode : async (req, res) => {
    try{
      let {
        token,
        group_idx
      } = req.body; 
      let decoded = jwt.verifyToken(token);
      const rows = await group_collection.findOne({
        where : {
          idx : group_idx,
          manager : decoded.user_id
        }
      })
      if(!rows) throw {code : 6}
      const now = new Date().toString().split("G")[0];
      const base64EncodedText = Buffer.from(now, "utf8").toString('base64');
      if(!rows.invite_code){
        const rows2 = await group_collection.update({
          invite_code : base64EncodedText
        },
        {
           where : {idx : group_idx}
         })
        if(rows2) return res.status(200).json({result : base64EncodedText});
        else throw {code : 4}
      }else return res.status(200).json({result : rows.invite_code});
    }catch(err){
      return res.status(200).send(errorHandler(error));
    }
  },

  JoinGroup : async (req, res) => {
    try {
      let {
        token,
        invite_code
      } = req.body; 
      let decoded = jwt.verifyToken(token);
      const rows = await group_collection.findOne({
        where : {
          invite_code : invite_code
        }
      })
      if(!rows) throw {code : 7}
      const rows2 = await group_member.findOne({
        where : {
          group_code : rows.idx, 
          member : decoded.user_id
        }
      })
      if(rows2) throw {code : 8}
      const rows3 = await group_member.create({
      group_code : rows.idx, 
      member : decoded.user_id
      });
      if(rows3) return res.status(200).json({result : rows});
      else throw {code : 9}
    } catch (error) {
      return res.status(200).send(errorHandler(error));
    }
  },

  EditGroupImg : async (req, res) => {
    try{
      let {
        token,
        group
      } = req.body;
      let decoded = jwt.verifyToken(token);
      let image = '/img/' + req.file.filename;
      const rows = await group_collection.findOne({
        where : {idx : group, manager : decoded.user_id}
      })
      console.log(rows.group_img);
      const rows2 = await group_collection.update({
        group_img : image,
      },
      {
          where : {manager : decoded.user_id, idx: group }
      })
      if(rows.group_img){
        const deleteImg = rows.group_img.split('/')[2]
        fs.unlink(`./uploads/${deleteImg}`,(err)=>{
          if (err) console.log(err);
          console.log('File deleted!');
        })
      }
      return res.status(200).json({result : image})
      }catch(err){
        return res.status(200).send(errorHandler(error));
      }
    },

    NameUpdate : async (req, res) => {
      try{
        let {
          token,
          group,
          group_name
        } = req.body;
        console.log(req.body);
        let decoded = jwt.verifyToken(token);
        console.log(decoded)
        const rows = await group_collection.update({
          group_name : group_name,
        },
        {
            where : {manager : decoded.user_id, idx: group }
        })
        if(rows) {
          const rows2 = await group_collection.findOne({
            where : {idx : group}
          })
          console.log(rows2);
          return res.status(200).json({result : rows2});
        }
        else throw {code : 4}
        }catch(err){
          return res.status(200).send(errorHandler(error));
        }
      },

    DeleteGroup : async (req, res) => {
      try{
        let {
          token,
          group
        } = req.body;
        console.log(req.body);
        let decoded = jwt.verifyToken(token);
        console.log(decoded)
        const rows = await group_collection.destroy({
            where : {idx: group, manager : decoded.user_id  }
        })
        if(rows) return res.status(200).json({result : true});
        else throw {code : 4}
        }catch(err){
          return res.status(200).send(errorHandler(error));
        }
      },

}