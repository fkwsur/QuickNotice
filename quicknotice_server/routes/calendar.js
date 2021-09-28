const router = require('express').Router();
const { calendarController: controller } = require('../controller');

 router.post('/addcalender', controller.CreateCalendar);
 router.post('/list', controller.AllCalendar);
 router.post('/detail', controller.DetailCalendar);
 router.post('/updatecalender', controller.UpdateCalendar);
 router.post('/deletecalender', controller.DeleteCalendar);
 router.post('/alarmcard', controller.AlarmCard);
 router.post('/fcm', controller.FCM);

module.exports = router;