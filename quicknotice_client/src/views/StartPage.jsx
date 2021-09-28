import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import store from "../store";
import mainImg from '../image/logo.png';

export const Login = ({ history }) => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const login = async (e) => {
    e.preventDefault();
    await axios
      .post("/api/user/signin", {
        userid: userId,
        password: password,
      })
      .then((res) => {
        console.log(res);
        if (res.data.result) {
          alert(res.data.result);
          return false;
        } else {
          alert('로그인에 성공하였습니다.');
          window.localStorage.setItem("user", userId);
          window.localStorage.setItem("x_auth", res.data.token);
          history.push("/main")
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const goMain = () => {
    history.push('/main');
  }

  return (
    <>
      {window.localStorage.getItem('user')
        ?
        goMain()
        :
        <div className="sign_wrap">
          <img src={mainImg} alt="메인이미지" />
          <div className="auth">
            <label>아이디</label>
            <input
              placeholder="USERID"
              className="userid"
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
            <label>패스워드</label>
            <input
              placeholder="PASSWORD"
              className="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="signin"
              onClick={login}
            >
              SIGH IN
            </button>
            <div className="find">
              <Link to="/findid">FIND USERID</Link>
              <Link to="/findpw">FIND PASSWORD</Link>
            </div>
            <div className="signup">Don’t have an account?<Link to="/signup">Sign Up</Link></div>
          </div>
        </div>
      }
    </>
  );
};

export const SignUp = ({ history }) => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [birthday, setBirthDay] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [authcode, setAuthCode] = useState("");
  const [mailcode, setMailCode] = useState("");
  const [IdCheck, setIdCheck] = useState(false);

  const multi_check = async (e) => {
    e.preventDefault();
    if (userId.length === 0) {
      alert("아이디를 입력해주세요.");
      return false;
    }
    await axios
      .post("/api/user/idcheck", {
        userid: userId,
      })
      .then((res) => {
        console.log(res);
        if (res.data.error) {
          alert(res.data.error.text);
          return false;
        }
        if (res.data.result === false) {
          alert("이미 존재하는 아이디입니다.");
          return false;
        }
        alert("사용가능한 아이디입니다.");
        setIdCheck(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const email_auth = async (e) => {
    e.preventDefault();
    if (email.length === 0) {
      alert("이메일을 입력해주세요");
      return false;
    }
    await axios
      .post("/api/user/emailauth", {
        email: email,
      })
      .then((res) => {
        if (res.data.error) {
          alert(res.data.error.text);
          return false;
        }
        if (res.data.result) {
          alert("인증 이메일이 발송되었습니다.");
          setMailCode(res.data.result);
        }
      })
      .catch((err) => console.log(err));
  };

  const signup = async (e) => {
    e.preventDefault();
    if (
      !userId &&
      !password &&
      !checkPassword &&
      !userName &&
      !birthday &&
      !gender &&
      !email &&
      !authcode &&
      !mailcode
    ) {
      alert("양식을 완성해주세요.");
      return false;
    }
    if (IdCheck === false) {
      alert("아이디 중복체크를 해주세요.");
      return false;
    }
    if (Number(authcode) !== Number(mailcode)) {
      alert("인증코드가 일치하지 않습니다.");
      return false;
    }
    if (password !== checkPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return false;
    }
    await axios
      .post("/api/user/signup", {
        userid: userId,
        password: password,
        username: userName,
        birthday: birthday,
        gender: gender,
        email: email,
      })
      .then((res) => {
        console.log(res);
        if (res.data.error) {
          alert(res.data.error.text);
          return false;
        }
        if (res.data.result === true) {
          alert("가입이 성공하였습니다.");
          history.push("/");
        }
      });
  };

  return (
    <div className="sign_wrap">
      <img src={mainImg} alt="메인이미지" />
      <div className="auth">
        <form>
          <label>아이디</label>
          <input
            className="userid"
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
            placeholder="USERID"
          />
          <button className="check check1" onClick={multi_check}>아이디 중복체크</button>
          <label>패스워드</label>
          <input
            placeholder="PASSWORD"
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label>패스워드 확인</label>
          <input
            placeholder="CHECK PASSWORD"
            type="text"
            value={checkPassword}
            onChange={(e) => setCheckPassword(e.target.value)}
            required
          />
          <label>이름</label>
          <input
            placeholder="USER NAME"
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
          <label>생년월일</label>
          <input
            placeholder="BIRTH"
            type="text"
            value={birthday}
            onChange={(e) => setBirthDay(e.target.value)}
            required
          />
          <label>성별</label>
          <input
            placeholder="GENDER"
            type="text"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          />
          <label>이메일</label>
          <input
            className="email"
            placeholder="EMAIL"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button onClick={email_auth} className="check check2">이메일 인증하기</button>
          <label>인증코드</label>
          <input
            placeholder="EMAIL CODE"
            type="text"
            value={authcode}
            onChange={(e) => setAuthCode(e.target.value)}
            required
          />
          <button className="signin signin2" onClick={signup}>SIGN UP</button>
        </form>
      </div>
    </div>
  );
};

export const FindId = ({ history }) => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");

  const find_go = async (e) => {
    e.preventDefault();
    await axios
      .post("/api/user/find_email", {
        usename: userName,
        email: email,
      })
      .then((res) => {
        if (res.data.error) {
          alert(res.data.error.text);
          return false;
        }
        if (res.data.result) {
          store.dispatch({ type: "find_id", user_id: res.data.result });
          history.push("/found_id");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="sign_wrap">
      <img src={mainImg} alt="메인이미지" />
      <div className="auth">
        <label>가입한 이름을 입력해주세요.</label>
        <input
          placeholder="USERID"
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <label>가입한 이메일을 입력해주세요.</label>
        <input
          placeholder="EMAIL"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="signin" onClick={find_go}>FIND USERID</button>
      </div>
    </div>
  );
};

export const FoundId = ({ history }) => {
  const check_ok = () => {
    history.push("/login");
  };
  return (
    <div className="sign_wrap">
      <h1>회원님의 아이디</h1>
      <p>{store.getState().user_id}</p>
      <button onClick={check_ok}>확인</button>
    </div>
  );
};

export const FindPw = ({ history }) => {
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [authcode, setAuthCode] = useState("");
  const [mailauth, setMailAuth] = useState("");

  const reset_pw = async (e) => {
    e.preventDefault();
    await axios
      .post("/api/user/reset_email", {
        userid: userId,
        email: email,
      })
      .then((res) => {
        if (res.data.error) {
          alert(res.data.error.text);
          return false;
        }
        if (res.data.result) {
          setMailAuth(res.data.result);
        }
      });
  };

  const resetting = (e) => {
    e.preventDefault();
    if (Number(authcode) === Number(mailauth)) {
      store.dispatch({ type: "find_pw", user_id: userId });
      history.push("/password_reset");
    } else {
      alert("인증코드가 올바르지 않습니다.");
    }
  };

  return (
    <div className="sign_wrap">
      <img src={mainImg} alt="메인이미지" />
      <div className="auth">
        <label>가입한 아이디 입력란</label>
        <input
          placeholder="USERID"
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <label>가입한 이메일 입력란</label>
        <input
          className="email2"
          placeholder="EMAIL"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="check check3" onClick={reset_pw}>이메일 인증하기</button>
        <label>이메일 인증코드</label>
        <input
          placeholder="EMAIL CODE"
          type="text"
          value={authcode}
          onChange={(e) => setAuthCode(e.target.value)}
        />
        <button className="signin" onClick={resetting}>FIND PASSWORD</button>
      </div>
    </div>
  );
};

export const ResetPw = ({ history }) => {
  const [password, setPassword] = useState("");
  const [r_password, setR_Password] = useState("");

  const reset_go = async (e) => {
    e.preventDefault();
    await axios
      .post("/api/user/resetpassword", {
        userid: store.getState().user_id,
        password: password,
      })
      .then((res) => {
        if (res.data.error) {
          alert(res.data.error.text);
          return false;
        }
        if (res.data.result) {
          alert("비밀번호가 재설정되었습니다.");
          history.push("/login");
        }
      });
  };

  return (
    <div className="sign_wrap">
      <img src={mainImg} alt="메인이미지" />
      <label>새로운 비밀번호</label>
      <input
        type="text"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <label>비밀번호 재확인</label>
      <input
        type="text"
        value={r_password}
        onChange={(e) => setR_Password(e.target.value)}
      />
      <button onClick={reset_go}>비밀번호 재설정하기</button>
    </div>
  );
};
