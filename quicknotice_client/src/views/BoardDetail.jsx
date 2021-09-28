import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';

export const BoardDetail = () => {
  const [detailList, setDetailList] = useState([]);
  const [urlCategory, setUrlCategory] = useState('');
  const [updated, setUpdated] = useState("");
  const [comment, setComment] = useState("");
  const [updatePage, setUpdatePage] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [notice, setNotice] = useState('');

  const List = async () => {
    try {
      const urlCate = window.location.pathname.split('/')[2]
      setUrlCategory(urlCate);
      const url = window.location.pathname;
      const idx = url.split('/')[3];
      await axios.post("http://localhost:8081/api/board/detail", {
        group_idx: window.localStorage.getItem("group"),
        idx: idx
      })
        .then((res) => {
          setDetailList(res.data.result);
          setUpdated(res.data.result.updatedAt.split("T")[0])
        })
        .catch((err) => {
          console.log(err);
        })
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    List();
  }, []);

  const onComment = (e) => {
    setComment(e.target.value);
  }

  const onClickComment = async (e) => {
    try {
      e.preventDefault();
      await axios
        .post("http://localhost:8081/api/board/write_comment", {
          token: window.localStorage.getItem("x_auth"),
          idx: detailList.idx,
          comment: comment
        })
        .then((res) => {
          console.log(res);
          if (res.data.result === true) {
            alert('작성완료');
            window.location.reload();
          } else {
            alert(res.data.result)
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
    if (name === "title") setTitle(value);
    if (name === "desc") setDesc(value);
    if (name === "notice") setNotice(value);
  }

  const onUpdate = async (e) => {
    try {
      e.preventDefault();
      await axios
        .post("http://localhost:8081/api/board/update", {
          token: window.localStorage.getItem("x_auth"),
          title: title,
          desc: desc,
          notice: notice,
          idx: detailList.idx,
        })
        .then((res) => {
          if (res.data.result === true) {
            alert('수정완료');
            window.location.reload();
          } else {
            console.log('실패');
          }
        })
        .catch((err) => {
          console.log(err);
        })
    } catch (err) {
      console.log(err);

    }
  }

  const onDelete = async (e) => {
    e.preventDefault();
    const urlCate = window.location.pathname.split('/')[2]
    setUrlCategory(urlCate);
    const url = window.location.pathname;
    const idx = url.split('/')[3];
    await axios
      .post("http://localhost:8081/api/board/delete", {
        token: window.localStorage.getItem("x_auth"),
        idx: idx,
      })
      .then((res) => {
        window.location.href = '/main/board';
      })
      .catch((err) => {
        console.log(err);
      })
  }


  return (
    <div className="board">



      {updatePage == false ?
        <>
          <div className="board_header">
            <div className="board_title">
              Board
            </div>
            <div className="edit_btn">
              {detailList.writer === window.localStorage.getItem("user") ?
                <>
                  <button onClick={() => setUpdatePage(true)} className="edit">
                    수정하기
                  </button>
                  <button className="edit" onClick={onDelete}>
                    삭제하기
                  </button>
                </>
                : ''
              }
              <div className="edit">
                <Link to="/main/board/">뒤로가기</Link>
              </div>
            </div>
          </div>
          <div className="content_wrap">
            <div className="content desc">
              <div>
                <h2>{detailList.title}</h2>
                <h3>No.{detailList.idx} &nbsp;{detailList.writer} &nbsp;{updated}</h3>
              </div>
              <p>{detailList.desc}</p>
            </div>


            <div className="comment_color">
              <Comments
                onComment={onComment}
              />
              <div className="comment">
                <form onSubmit={onClickComment}>
                  <input type="text" name="comment" value={comment} onChange={onComment} required />
                  <button type="submit">comment</button>
                </form>
              </div>
            </div>
          </div>
        </>
        :
        <form onSubmit={onUpdate}>
          <div className="board_header">
            <div className="board_title">
              Board Edit
            </div>
            <div className="edit_btn">
              <button className="edit" type="submit">
                수정하기
              </button>
              <div className="edit" onClick={() => setUpdatePage(false)}>
                뒤로가기
              </div>
            </div>
          </div>
          <div className="content_wrap">
            <div className="content">
              <input type="text" name="title" value={title} onChange={onChange} required />
              <textarea type="text" name="desc" value={desc} onChange={onChange} required />
              <div className="notice_btn">
                <p>Notice</p>
                <input
                  type="radio"
                  name="notice"
                  value="On"
                  className="input"
                  onChange={onChange}
                  required
                />
                On
                <input
                  type="radio"
                  name="notice"
                  value="Off"
                  className="input"
                  onChange={onChange}
                  required
                />
                Off
              </div>
            </div>
          </div>
        </form>
      }

    </div>
  )
}

const Comments = () => {
  const [urlCategory, setUrlCategory] = useState('');
  const [replyList, setReplyList] = useState([]);
  const [editComment, setEditComment] = useState('');

  const commentList = async (e) => {
    try {
      const urlCate = window.location.pathname.split('/')[2]
      setUrlCategory(urlCate);
      const url = window.location.pathname;
      const idx = url.split('/')[3];
      await axios.post("http://localhost:8081/api/board/comment", {
        idx: idx
      })
        .then((res) => {
          if (res.data.result) {
            setReplyList(res.data.result);
          } else {
            console.log(err);
          }
        })
        .catch((err) => {
          console.log(err);
        })
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    commentList();
  }, [])


  const onChange = (e) => {
    const {
      target: { name, value },
    } = e;
    if (name === "commentName") setEditComment(value);
  }

  const comment_update = async (idx) => {
    try {
      await axios
        .post("http://localhost:8081/api/board/update_comment", {
          token: window.localStorage.getItem("x_auth"),
          idx: idx,
          content: editComment,
        })
        .then((res) => {
          if (res.data.result === true) {
            alert('댓글수정완료');
            window.location.reload();
          } else {
            console.log(err);
          }
        })
        .catch((err) => {
          console.log(err);
        })
    } catch (err) {
      console.log(err);
    }
  }

  const onDelete = async (idx) => {
    try {
      await axios
        .post("http://localhost:8081/api/board/delete_comment", {
          token: window.localStorage.getItem("x_auth"),
          idx: idx
        })
        .then((res) => {
          if (res.data.result === true) {
            alert('댓글삭제완료');
            window.location.reload();
          } else {
            console.log('err1');
          }
        })
        .catch((err) => {
          console.log('err2');
        })
    } catch (err) {
      console.log('err3');
    }
  }


  return (
    <>
      {replyList ? replyList.map(k => {
        return (
          <>
            <CommentDrawer
              idx={k.idx}
              created={k.updatedAt.split("T")[0]}
              writer={k.writer}
              comment={k.content}
              editComment={editComment}
              commentName="commentName"
              comment_delete={onDelete}
              onChange={onChange}
              comment_update={comment_update}
            />
          </>
        )
      }) : ''
      }
    </>
  )
}

const CommentDrawer = (props) => {
  const [commentUpdateClick, setCommentUpdateClick] = useState(false);

  return (
    <div className="comment_format">
      {commentUpdateClick === false ?
        <>
          <p className="idx">No.{props.idx}</p>
          <p className="comments">{props.writer}</p>
          <p className="created">{props.created} <br /> {props.comment}</p>
          {props.writer === window.localStorage.getItem("user") ?
            <div className="comment_btn">
              <button onClick={() => setCommentUpdateClick(true)}>수정</button>
              <button onClick={() => props.comment_delete(props.idx)}>삭제</button>
            </div>
            : ''}
        </>
        :
        <>
          <input type="text" name={props.commentName} value={props.editComment} onChange={props.onChange} />
          <button onClick={() => props.comment_update(props.idx)}>수정완료</button>
          <button onClick={() => setCommentUpdateClick(false)}>취소</button>
        </>
      }
    </div>
  )
}

