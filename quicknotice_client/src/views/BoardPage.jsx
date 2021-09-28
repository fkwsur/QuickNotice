import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import axios from "axios";

export const BoardList = () => {
  const [offset, setOffset] = useState(0);
  const [tableDate, setTableData] = useState([]);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
    getPage(1);
  }, []);

  const getPage = async (page) => {
    await axios
      .post(`/api/board/board?page=${page + 1}`, {
        token: window.localStorage.getItem("x_auth"),
        idx: window.localStorage.getItem("group_idx"),
      })
      .then((res) => {
        if (res.data.error) {
          alert(res.data.error.text);
          return false;
        }
        let total_page = res.data.count / 10;
        setPageCount(total_page);
        setTableData(res.data.rows);
      })
      .catch((err) => {
        alert(err);
      });
  };

  const loadMoreData = (page) => {
    getPage(page);
  };

  const handlePageClick = (e) => {
    const selecetedPage = e.selected;
    const offset = selecetedPage * perPage;
    setCurrentPage(selecetedPage);
    setOffset(offset);
    loadMoreData(currentPage);
  };

  return (
    <>
      <table>
        <thead>
          <th>게시글번호</th>
          <th>게시글번호</th>
          <th>게시글번호</th>
        </thead>
        {tableDate.map((k) => {
          return (
            <tbody>
              <td>{k.idx}</td>
              <td>{k.idx}</td>
              <td>{k.idx}</td>
            </tbody>
          );
        })}
      </table>
      <div>
        <ReactPaginate
          previousLabel={"이전"}
          nextLabel={"다음"}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={pageCount}
          pageRangeDisplayed={10}
          onPageChange={handlePageClick}
          containerClassName={""}
          marginPagesDisplayed={2}
          subContainerClassName={""}
          activeClassName={""}
        />
      </div>
    </>
  );
};

export const BoardWrite = () => { };

export const BoardUpdate = () => { };

export const BoardDetail = () => { };
