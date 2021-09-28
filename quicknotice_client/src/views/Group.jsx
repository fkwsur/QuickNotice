import axios from "axios";
import React, { useEffect, useState } from "react";


export const Group = (props) => {
  const [createGroup, setCreateGroup] = useState("");
  const [intoGroup, setIntoGroup] = useState("");
  const [joinGroup, setJoinGroup] = useState("");
  const [groupList, setGroupList] = useState([]);
  const [select, setSelect] = useState('');
  const [change, isChange] = useState(false);

  useEffect(() => {
    List();
  }, [])

  const onChange = (e) => {
    const {
      target: { name, value },
    } = e;
    if (name === "select") setSelect(value);
    if (name === "createGroup") setCreateGroup(value);
    if (name === "intoGroup") setIntoGroup(value);
    if (name === "joinGroup") setJoinGroup(value);
    isChange(true);
  }

  const onCreate = async (e) => {
    try {
      e.preventDefault();
      await axios
        .post("http://localhost:8081/api/group/create", {
          group_name: createGroup,
          token: window.localStorage.getItem("x_auth"),
        })
        .then((res) => {
          if (res.data.result) {
            alert('그룹생성이 완료되었습니다.');
            window.localStorage.setItem("group", res.data.result.idx);
            window.localStorage.setItem("groupName", res.data.result.group_name);
            window.location.href = '/main/MyCalendar';
            window.localStorage.removeItem('groupImg');
          } else {
            alert('에러가 났습니다.');
          }
        })
        .catch((err) => {
          console.log(err);
        })
    } catch (err) {
      console.log(err);
    }
  }

  const List = async (e) => {
    try {
      await axios
        .post("http://localhost:8081/api/group/list", {
          token: window.localStorage.getItem("x_auth"),
        })
        .then((res) => {
          if (res.data.result) {
            setGroupList(res.data.result);
          } else {
            alert('에러가 났습니다.');
          }
        })
        .catch((err) => {
          console.log(err);
        })
    } catch (err) {
      console.log(err);
    }
  }

  const onSelect = async (e) => {
    try {
      e.preventDefault();
      if (change === true) {
        window.localStorage.setItem("group", select);

        await axios.post("http://localhost:8081/api/group/GroupName", {
          idx: window.localStorage.getItem("group")
        })
          .then(res => {
            if (res.data.result) {
              window.localStorage.setItem("group", res.data.result.idx);
              window.localStorage.setItem("groupName", res.data.result.group_name);
              window.localStorage.setItem("groupImg", res.data.result.group_img);
            } else if (res.data.error) {
              console.log('실패');
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
      window.location.href = '/main/MyCalendar';
    } catch (err) {
      console.log(err);
    }
  }

  const onJoinGroup = async (e) => {
    try {
      e.preventDefault()
      await axios
        .post("http://localhost:8081/api/group/joingroup", {
          token: window.localStorage.getItem("x_auth"),
          invite_code: joinGroup.toString()
        })
        .then((res) => {
          if (res.data.result) {
            alert('가입이 완료되었습니다.');
            window.localStorage.setItem("group", res.data.result.idx);
            window.localStorage.setItem("groupName", res.data.result.group_name);
            window.location.href = '/main/MyCalendar';
          } else {
            alert(error);
          }
        })
        .catch((err) => {
          console.log(err);
        })
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="group">
      <h2>Register</h2>
      <form onSubmit={onSelect}>
        <div className="select_wrap" >
          <select name="select" value={select} onChange={onChange} >
            <option value="" disabled>그룹 접속하기</option>
            {groupList ? groupList.map(k => {
              return (
                <>
                  <option value={k.group_code}>{k.group_name}</option>
                </>
              )
            }) : '에러'
            }
          </select>
        </div>
        <button type="submit">ok</button>
      </form>

      <form onSubmit={onCreate}>
        <input type="text" value={createGroup} onChange={onChange} name="createGroup" placeholder="그룹 생성하기" required />
        <button type="submit">ok</button>
      </form>

      <form onSubmit={onJoinGroup}>
        <input type="text" value={joinGroup} onChange={onChange} name="joinGroup" placeholder="초대코드 입력" required />
        <button type="submit">ok</button>
      </form>
    </div>
  )
}
