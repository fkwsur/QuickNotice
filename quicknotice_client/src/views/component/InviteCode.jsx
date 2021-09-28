import React, { useState, useRef } from 'react'
import axios from "axios";

export const InfoCard = (props) => {
  const [profile, setProfile] = useState(false);
  const [image, setImage] = useState('');
  const [nickName, setNickName] = useState('');

  const onChange = (e) => {
    const {
      target: { name, value },
    } = e;
    if (name === "nickName") setNickName(value);
  }

  const FileChange = (e) => {
    const {
      target: { name, files },
    } = e;
    if (name === "image") {
      setImage(files[0]);
    }
  };

  const ImgSubmit = async (e) => {
    try {
      e.preventDefault();
      const formData = new FormData();
      formData.append("token", window.localStorage.getItem('x_auth'));
      formData.append("image", image);
      await axios
        .post("/api/user/userimg", formData)
        .then((res) => {
          console.log(res);
          if (res.data.result === true) {
            alert("프로필 이미지 업데이트가 완료되었습니다.");
            window.location.reload()
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

  return (
    <div className="info">
      <div className="bg_layer" onClick={props.onClick}></div>
      <div className="infocard ">
        <button className="exit" onClick={props.onClick}>x</button>
        {!profile ?
          <>
            <div className="image">
              <img src={props.img} alt="프로필" />
            </div>
            <h2>{props.h2}</h2>
            <button className={props.edit} onClick={() => setProfile(true)}>{props.edit}</button>
          </>
          :
          <>
            <form onSubmit={ImgSubmit}>
              <p><span>Profile Image</span><br /></p>
              <input type="file" name="image" file={image} onChange={FileChange} />
              <button type="submit" >OK</button>
            </form>
            <form>
              <p><span>Nick Name</span><br /></p>
              <input type="text" value={nickName} onChange={onChange} name="nickName" placeholder={props.user_id} />
              <button type="submit" onClick={() => setProfile(false)}>OK</button>
            </form>
          </>
        }

        <p><span>ID</span><br />{props.user_id}</p>
        <p><span>EMAIL</span><br />{props.email}</p>
        <p><span>BIRTH</span><br />{props.birth}</p>
        <p><span>GENDER</span><br />{props.gender}</p>
        <button onClick={props.Logout} className={props.edit}>{props.LogoutName}</button>
      </div>
    </div >
  )
}

export const InviteCode = (props) => {
  const [isCopy, setIsCopy] = useState(false);

  const textInput = useRef();

  const copy = () => {
    const el = textInput.current
    el.select()
    document.execCommand("copy")
    setIsCopy(true);
    setTimeout(() => {
      setIsCopy(false);
    }, 2000)
  }

  return (
    <div className="info">
      <div className="bg_layer" onClick={props.onClick}></div>
      <div className="infocard invite">
        <button className="exit" onClick={props.onClick}>x</button>
        <h2>다른 사용자 초대하기</h2>
        <div className="copy_box">
          <input type="text" value={props.inviteCode} ref={textInput} readOnly />
          <button className="btn" onClick={copy}>
            {isCopy ? "복사됨" : "복사"}
          </button>
        </div>
      </div>
    </div>
  )
}

