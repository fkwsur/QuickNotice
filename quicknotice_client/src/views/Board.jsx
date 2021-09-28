import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import ReactPaginate from "react-paginate";

export const Board = () => {
    const [popup, isPopup] = useState(false);
    const [title, isTitle] = useState("");
    const [content, isContent] = useState("");
    const [notice, isNotice] = useState("");
    const [boardList, setBoardList] = useState([]);
    const [noticeList, setNoticeList] = useState([]);

    const [offset, setOffset] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageCount, setPageCount] = useState(0);

    useEffect(() => {
        List(0);
        NoticeList();
    }, []);


    const onChange = (e) => {
        const {
            target: { name, value },
        } = e;
        if (name === "title") isTitle(value);
        if (name === "content") isContent(value);
        if (name === "notice") isNotice(value);
    }

    const onEdit = async (e) => {
        try {
            e.preventDefault();
            await axios
                .post("http://localhost:8081/api/board/write", {
                    group_idx: window.localStorage.getItem("group"),
                    token: window.localStorage.getItem("x_auth"),
                    title: title,
                    desc: content,
                    notice: notice,
                })
                .then((res) => {
                    if (res.data.result === true) {
                        alert('작성완료');
                        isPopup(false);
                    } else {
                        alert('에러가 났습니다.');
                    }
                    // window.location.reload();
                    window.location.href = '/main/board';
                })
                .catch((err) => {
                    console.log(err);
                })
        } catch (err) {
            console.log(err);
        }
    }

    const List = async (page) => {
        try {
            await axios.post(`http://localhost:8081/api/board/list?page=${page + 1}`, {
                group_idx: window.localStorage.getItem("group")
            })
                .then((res) => {
                    if (res.data.result) {
                        console.log(res.data.result);
                        setBoardList(res.data.result.rows);
                        let total_page = res.data.result.count / 7;
                        setPageCount(total_page);
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

    const NoticeList = async () => {
        try {
            await axios.post("http://localhost:8081/api/board/notice_list", {
                group_idx: window.localStorage.getItem("group")
            })
                .then((res) => {
                    if (res.data.result) {
                        setNoticeList(res.data.result);
                        console.log(res.data.result);
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

    const loadMoreData = (page) => {
        List(page);
    };

    const handlePageClick = (e) => {
        const selecetedPage = e.selected;
        const offset = selecetedPage * perPage;
        setOffset(offset)
        loadMoreData(selecetedPage)
    };

    return (
        <div className="board">

            {popup == false ?
                <>
                    <div className="board_header">
                        <div className="board_title">
                            Board
                        </div>
                        <div className="edit" onClick={() => isPopup(true)}>
                            Edit
                        </div>
                    </div>

                    <div className="content">
                        <table>

                            <tr>
                                <th>No</th>
                                <th>제목</th>
                                <th>글쓴이</th>
                                <th>작성일</th>
                                <th>조회</th>
                            </tr>

                            {noticeList ? noticeList.map(k => {
                                return (
                                    <>
                                        <tr className="board_notice">
                                            <td>{k.idx}</td>
                                            <td><Link to={`/main/board/${k.idx}`}>{k.title}</Link></td>
                                            <td>{k.writer}</td>
                                            <td>{k.updatedAt.split("T")[0]}</td>
                                            <td>조회수로직은 아직.</td>
                                        </tr>
                                    </>
                                )
                            }) : ""
                            }

                            {boardList ? boardList.map(k => {
                                return (
                                    <>

                                        <tr >
                                            <td>{k.idx}</td>
                                            <td><Link to={`/main/board/${k.idx}`}>{k.title}</Link></td>
                                            <td>{k.writer}</td>
                                            <td>{k.updatedAt.split("T")[0]}</td>
                                            <td>조회수로직은 아직.</td>
                                        </tr>
                                    </>
                                )
                            }) : ""
                            }
                        </table>
                    </div>

                    <ReactPaginate
                        previousLabel={"prev"}
                        nextLabel={"next"}
                        breakLabel={"..."}
                        breakClassName={"break-me"}
                        pageCount={pageCount}
                        pageRangeDisplayed={7}
                        onPageChange={handlePageClick}
                        containerClassName={"pagination"}
                        marginPagesDisplayed={2}
                        subContainerClassName={"pages pagination"}
                        activeClassName={"active"}
                    />
                    {/* 
                        <li>◁</li>
                        <li>1</li>
                        <li>2</li>
                        <li>3</li>
                        <li>4</li>
                        <li>5</li>
                        <li>▷</li>
                        */}
                </>
                :
                <form onSubmit={onEdit}>
                    <div className="board_header">
                        <div className="board_title">
                            Board
                        </div>
                        <div className="edit_btn">
                            <button className="edit" type="submit">
                                Edit
                            </button>
                            <button className="edit" onClick={() => { isPopup(false), isTitle(''), isContent(''), isNotice('') }}>
                                Delete
                            </button>
                        </div>
                    </div>

                    <input
                        placeholder="Title"
                        name="title"
                        value={title}
                        onChange={onChange}
                        required
                    /><br />
                    <textarea
                        placeholder="Content"
                        name="content"
                        value={content}
                        onChange={onChange}
                        required
                    />

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
                </form>
            }
        </div >
    )
}
