import React, { useState, useEffect } from "react";
import axios from "axios";

export const Setting = () => {
  const [image, setImage] = useState('');
  const [groupName, setGroupName] = useState('');
  const [isMaster, setIsMaster] = useState(false);

  useEffect(() => {
    onSelect()
  }, []);

  const FileChange = (e) => {
    const {
      target: { name, files },
    } = e;
    if (name === "image") {
      setImage(files[0]);
    }
  };

  const onSelect = async (e) => {
    try {
      await axios.post("http://localhost:8081/api/group/GroupName", {
        idx: window.localStorage.getItem("group")
      })
        .then(res => {
          if (res.data.result.manager === window.localStorage.getItem('user')) {
            setIsMaster(true);
          } else {
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


  const ImgSubmit = async (e) => {
    try {
      e.preventDefault();
      const formData = new FormData();
      formData.append("token", window.localStorage.getItem('x_auth'));
      formData.append("group", window.localStorage.getItem("group"));
      formData.append("image", image);
      console.log(formData);
      await axios
        .post("/api/group/groupimg", formData)
        .then((res) => {
          console.log(res);
          if (res.data.result) {
            alert("그룹 이미지 업데이트가 완료되었습니다.");
            window.localStorage.setItem("groupImg", res.data.result);
            window.location.reload();
          }
          else {
            alert('잘못된 정보를 입력했습니다.');
            return false;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err); //서버자체 문제가 아니라 함수 자체가 오류일때
    };
  }

  const NameUpdate = async (e) => {
    try {
      e.preventDefault()
      await axios
        .post("http://localhost:8081/api/group/NameUpdate", {
          token: window.localStorage.getItem("x_auth"),
          group: window.localStorage.getItem("group"),
          group_name: groupName,
        })
        .then((res) => {
          if (res.data.result) {
            alert("그룹 이름 업데이트가 완료되었습니다.");
            window.localStorage.setItem("groupName", res.data.result.group_name);
            window.location.reload();
          } else {
            alert(res.data.error);
          }
        })
        .catch((err) => {
          console.log(err);
        })
    } catch (err) {
      console.log(err);
    }
  }

  const DeleteGroup = async (e) => {
    try {
      e.preventDefault()
      await axios
        .post("http://localhost:8081/api/group/DeleteGroup", {
          token: window.localStorage.getItem("x_auth"),
          group: window.localStorage.getItem("group")
        })
        .then((res) => {
          if (res.data.result === true) {
            alert("그룹 이름 업데이트가 완료되었습니다.");
            window.localStorage.removeItem("group");
            window.localStorage.removeItem("groupName");
            window.location.href = '/main';
          } else {
            alert(res.data.error);
          }
        })
        .catch((err) => {
          console.log(err);
        })
    } catch (err) {
      console.log(err);
    }
  }

  const onChange = (e) => {
    const {
      target: { name, value },
    } = e;
    if (name === "groupName") setGroupName(value);
  }

  return (
    <div className="setting">

      <h2>Setting</h2>

      {isMaster ?
        <>
          <form onSubmit={ImgSubmit}>
            <p>그룹 이미지 변경</p>
            <input type="file" id="image" name="image" file={image} onChange={FileChange} required />
            <button type="submit" >OK</button>
          </form>
          <form onSubmit={NameUpdate}>
            <p>그룹 이름 변경</p>
            <input type="text" name="groupName" value={groupName} onChange={onChange} required />
            <button type="submit" >OK</button>
          </form>

          <button type="button" onClick={DeleteGroup}>그룹 삭제</button>
        </>
        : <p>매니저 권한이 필요합니다.</p>}
    </div>
  );
};
