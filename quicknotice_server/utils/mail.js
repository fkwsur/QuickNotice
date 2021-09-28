const dotenv = require('dotenv')
dotenv.config();
const nodemailer = require('nodemailer');
//메일 이벤트가 여러군데 있는 경우는 smtp -pool을 이용해야 메일이 안오는 경우를 대비할 수 있음
const smtpPool = require('nodemailer-smtp-pool');
const {EMAIL_ID, EMAIL_PASSWORD} = process.env;

const smtpTransport = nodemailer.createTransport(
  smtpPool({
    service : 'Gmail',
    auth : {
      user : EMAIL_ID,
      pass : EMAIL_PASSWORD
    },
    tls : {
      rejectUnauthorized : false
    }
  })
)

module.exports = {
  DosMail : async (req,res) => {
    try {
      const mailOptions = {
        from : EMAIL_ID,
        to : EMAIL_ID,
        subject : "limiter onreached메일",
        text : "한계치 도달"
      };
      smtpTransport.sendMail(mailOptions, (err, res) => {
        if (err) throw console.log(err);
        smtpTransport.close();
      });
    } catch (error) {
      console.log(error);
    }
  },

  CheckMail : async ( email, authCode ) => {
    try {
			const mailOptions = {
        from: EMAIL_ID,
        to: email,
        subject: 'QuickNotice 인증메일 입니다.',
        text: `인증 번호 ${authCode} 를 입력해주세요.`,
      };
      smtpTransport.sendMail(mailOptions, (err, res) => {
        if (err) console.log(`mail${err}`);
        smtpTransport.close();
        return res.status(200).json({error : '잘못된 코드입니다.'});
    });
    } catch (error) {
      console.log(error);
    }
  }
}
