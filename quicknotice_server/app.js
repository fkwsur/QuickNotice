const express = require('express');
const app = express()
const cors = require('cors');
const db = require('./models');
const Router = require('./routes');
const helmet = require('helmet');
const compression = require('compression')
const rateLimit = require("express-rate-limit");
const logger = require('morgan');
const dotenv = require('dotenv');
dotenv.config();

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 0,
  onLimitReached: () => {
    //메일보내는 로직
    //이런 특정상황에 만 발생하는 이벤트는 함수안에다가 require을 쓰더라도 문제되지 않음
    require('./utils/mail').DosMail();
  }
});

app.use(cors());
//한번에 받을 양, 프로젝트 상황에 따라 변동
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: false, limit: '50mb', parameterLimit: 1000000 }))
app.use('/img', express.static('./uploads'));
app.use(helmet()); //기본적인 보안세팅
app.use(compression()); //메모리 최적화
app.use(limiter);
app.use(logger('dev'));

db.sequelize
  .authenticate()
  .then(async () => {
    try {
      console.log('db connect ok');
      await db.sequelize.sync({ force: false });
    } catch (err) {
      console.log('err');
    }
  })
  .catch(err => {
    console.log('db' + err);
  });

app.use('/api/user', Router.userRouter)
app.use('/api/board', Router.boardRouter)
app.use('/api/group', Router.groupRouter)
app.use('/api/calender', Router.calendarRouter)

app.use((req, res, next) => {
  try {
    //콘솔말고 따로 이벤트 처리해주는게 좋음
    console.log('경로오류')
  } catch (error) {
    next();
  }
})


require('http')
  .createServer(app)
  .listen(8081, () => {
    console.log('server on');
  });
