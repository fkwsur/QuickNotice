import React, { useState, useEffect, useRef } from 'react'
import { InfoCard, InviteCode } from './component/InviteCode'
import { AlarmCard, Member } from './component/Data'
import mainImg from '../image/logo.png';
import userImg from '../image/user.png';
import userSImg from '../image/user.svg';
import { UserPlus } from './svg';
import grouplistImg from '../image/grouplist.png';
import axios from "axios";
import Router from "../views";
import { Route } from "react-router-dom";

export const Main = ({ history }) => {
  const [rightBar, setRightBar] = useState(false);
  const [alarmList, isAlarmList] = useState([]);
  const [groupUserList, isGroupUserList] = useState([]);
  const [menuType, setMenuType] = useState('');
  const [infoCard, setInfoCard] = useState(false);
  const [userCard, setUserCard] = useState('');
  const [memberCard, setMemberCard] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [isMaster, setIsMaster] = useState(false);

  useEffect(() => {
    alarmcard()
    grouplist()
    cardInfo()
    UserInfo()
    CreateCode()
  }, []);

  const alarmcard = () => {
    try {
      axios.post("http://localhost:8081/api/calender/alarmcard", {
        token: window.localStorage.getItem("x_auth"),
        group_idx: window.localStorage.getItem("group")

      })
        .then(res => {
          if (res.data.result) {
            isAlarmList(res.data.result)
          }
          if (res.data.error) {
            alert(res.data.error.text);
          }
        })
        .catch(err => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  }

  // 그룹유저리스트
  const grouplist = () => {
    try {
      axios.post("http://localhost:8081/api/group/grouplist", {
        token: window.localStorage.getItem("x_auth"),
        group_idx: window.localStorage.getItem("group")

      })
        .then(res => {
          if (res.data.result) {
            isGroupUserList(res.data.result)
          }
          if (res.data.error) {
            alert(res.data.error.text);
          }
        })
        .catch(err => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  }

  // 알람카드 정보 보내기
  const cardInfo = () => {
    try {
      axios.post("http://localhost:8081/", {
        token: window.localStorage.getItem("x_auth"),
        group_idx: 1

      })
        .then(res => {
          if (res.data.result) {
            console.log('성공');
          } else if (res.data.error) {
            console.log('실패');
          }
        })
        .catch(err => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  }

  const UserInfo = () => {
    try {
      axios.post("http://localhost:8081/api/user/userinfo", {
        token: window.localStorage.getItem("x_auth"),
      })
        .then(res => {
          if (res.data.result) {
            setUserCard(res.data.result);
          } else if (res.data.error) {
            console.log('실패');
          }
        })
        .catch(err => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  }

  const lnbClick = () => {
    if (window.localStorage.getItem('group')) {
      window.location.href = '/main/MyCalendar';
    } else {
      alert('그룹을 선택해주세요.')
      history.push('/main');
    }
  }

  const lnbClick2 = () => {
    if (window.localStorage.getItem('group')) {
      window.location.href = '/main/board';
    } else {
      alert('그룹을 선택해주세요.')
      history.push('/main');
    }
  }

  const lnbClick3 = () => {
    if (window.localStorage.getItem('group')) {
      window.location.href = '/main/setting';
    } else {
      alert('그룹을 선택해주세요.')
      history.push('/main');
    }
  }

  const lnbClick4 = () => {
    window.location.href = '/main';
  }

  const MemberInfo = (k) => {
    try {
      setMenuType('member');
      setInfoCard(true);
      axios.post("http://localhost:8081/api/user/memberinfo", {
        user_name: k
      })
        .then(res => {
          if (res.data.result) {
            setMemberCard(res.data.result);
          } else if (res.data.error) {
            console.log('실패');
          }
        })
        .catch(err => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  }

  const goMain = () => {
    history.push('/main');
  }

  const remove = () => {
    window.localStorage.removeItem('user');
    window.localStorage.removeItem('x_auth');
    window.localStorage.removeItem('groupName');
    window.localStorage.removeItem('group');
    window.localStorage.removeItem('groupImg');
    history.push('/');
  }

  const CreateCode = async () => {
    try {
      axios.post("http://localhost:8081/api/group/groupcode", {
        token: window.localStorage.getItem("x_auth"),
        group_idx: window.localStorage.getItem("group")
      })
        .then(res => {
          if (res.data.result) {
            setInviteCode(res.data.result);
            setIsMaster(true);
          } else if (res.data.error) {
            console.log(res.data.error);
          }
        })
        .catch(err => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  }

  const ClickInvite = () => {
    setMenuType('invite')
    setInfoCard(true)
  }


  return (
    <div className="wrap">
      <div className="header">

        <div className="logo">
          <img src={mainImg} alt="메인이미지" />
        </div>

        <div className="search">
          <input placeholder="SEARCH" />
          <button></button>
        </div>

        <div className="menu_btn">
          <ul>
            <li onClick={lnbClick4}><img src={grouplistImg} alt="그룹" /><p>Group List</p></li>
            <li onClick={() => { setMenuType('user'); setInfoCard(true) }}><img src={userImg} alt="유저" /><p>User</p></li>
          </ul>
        </div>

      </div>

      <div className="main">
        <div className="snb">

          <div className="profile_img">
            <img
              src={window.localStorage.getItem("groupImg") === 'null' ? userSImg : window.localStorage.getItem("groupImg")}
              alt="" />
          </div>

          <div className="profile_name">
            {window.localStorage.getItem("groupName") ?
              <>
                {window.localStorage.getItem("groupName")}
                {isMaster === true ?
                  <button title="초대하기" onClick={ClickInvite}>
                    <UserPlus />
                  </button>
                  : ''}
              </> : 'Group'
            }
          </div>

          <ul>
            <li onClick={lnbClick}><span></span>HOME</li>
            <li onClick={lnbClick2}><span></span>BOARD</li>
            <li onClick={lnbClick3}><span></span>SETTING</li>
          </ul>

        </div>

        <div className="container">
          <div className="container_card">
            {window.localStorage.getItem('user')
              ?
              <>
                <Route exact path="/main" component={Router.Group} />
                <Route exact path="/main/MyCalendar" component={Router.MyCalendar} />
                <Route exact path="/main/board" component={Router.Board} />
                <Route exact path="/main/board/:id" component={Router.BoardDetail} />
                <Route exact path="/main/setting" component={Router.Setting} />
              </>
              :
              goMain()
            }
          </div>
        </div>

        <div className="alarm">
          <ul>
            <li onClick={() => setRightBar(false)}>Alarm</li>
            |
            <li onClick={() => setRightBar(true)}>Member</li>
          </ul>

          <div className="list_box">
            {rightBar == false ?
              <>
                {alarmList ? alarmList.map(k => {
                  return (
                    <AlarmCard
                      title={k.title}
                      content={k.content}
                      month={k.event_day.split("-")[1]}
                      date={k.event_day.split("-")[2].split("T")[0]}
                      time={k.time}
                      color={k.color}
                    />
                  )
                }) : "ERROR"
                }
              </>
              :
              <>
                {groupUserList ? groupUserList.map(k => {
                  return (
                    <Member
                      img={!k.user_img ? userSImg : k.user_img}
                      onClick={() => MemberInfo(k.user_name)}
                      nickname={k.user_name}
                    />
                  )
                }) : "ERROR"
                }
              </>
            }
          </div>
        </div>
      </div>

      <div className="footer">
        Copyright 2021  - Lovingly developed by HJ
      </div>

      {
        menuType == 'invite' && infoCard == true ?
          <InviteCode
            onClick={() => setInfoCard(false)}
            inviteCode={inviteCode}
          /> :
          menuType == 'member' && infoCard == true ?
            <InfoCard
              onClick={() => setInfoCard(false)}
              h2={memberCard.user_name}
              user_id={memberCard.user_id}
              email={memberCard.email}
              birth={memberCard.birth}
              gender={memberCard.gender}
              img={!memberCard.user_img ? userSImg : userCard.user_img}

            /> :
            menuType == 'user' && infoCard == true ?
              <InfoCard
                onClick={() => setInfoCard(false)}
                h2={userCard.user_name}
                user_id={userCard.user_id}
                email={userCard.email}
                birth={userCard.birth}
                gender={userCard.gender}
                edit="edit"
                LogoutName="LogOut"
                Logout={remove}
                img={!userCard.user_img ? userSImg : userCard.user_img}
              /> : ''
      }
    </div>

  )
}
