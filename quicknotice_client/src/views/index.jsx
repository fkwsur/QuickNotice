const {
  Login,
  SignUp,
  FindId,
  FoundId,
  FindPw,
  ResetPw,
} = require("./StartPage");
const { Main } = require('./Main');
const { CreateCode } = require('./Main');
const { Board } = require('./Board');
const { BoardDetail } = require('./BoardDetail');
const { MyCalendar } = require('./MyCalendar');
const { Setting } = require('./Setting');
const { Group } = require('./Group');


export default { Login, SignUp, FindId, FoundId, FindPw, ResetPw, Main, MyCalendar, Board, Group, BoardDetail, Setting, CreateCode };
