const admin = require('firebase-admin');
const serAccount = require('../firebasekey.json');

module.exports = {
  Init: () => {
    admin.initializeApp({
      credential: admin.credential.cert(serAccount),
    })
  },
  Send: async (title, message, push_token) => {
    try {
      let fcm_msg = {
        notification: {
          title: title,
          body: message,
          style: '굳굳',
        },
        token: push_token,
      }
      const send_fcv = await admin.messaging().send(fcm_msg)
      console.log(send_fcv);
    } catch (error) {
      console.log(error);
    }
  }
}