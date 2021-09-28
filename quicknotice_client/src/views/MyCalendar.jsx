import React, { useEffect, useState } from "react";
import FullCalendar, { isPropsEqual } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import axios from "axios";
import store from "../store";

export const MyCalendar = () => {
  const [calendarWeekends, setCalendarWeekends] = useState("true");
  const [calendarEvents, setCalendarEvents] = useState([
    { title: "Today", start: new Date() },
  ]);
  const [eventColor, setEventColor] = useState("red");
  const [popup, setPopup] = useState(false);
  const [EditPopup, setEditPopup] = useState(false);
  const [alarmOption, setAlarmOption] = useState("on");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [color, setColor] = useState("");
  const [time, setTime] = useState("");
  const [alarm, setAlarm] = useState("");
  const [calenderTitle, setCalenderTitle] = useState([]);
  const [calenderStart, setCalenderStart] = useState("");

  const [idx, setIdx] = useState("");
  const [EditTitle, setEditTitle] = useState("");
  const [EditContent, setEditContent] = useState("");
  const [EditCategory, setEditCategory] = useState("");
  const [EditTime, setEditTime] = useState("");
  const [EditAlarm, setEditAlarm] = useState("");
  const [EditColor, setEditColor] = useState("");

  const [BackgroundColor, setBackgroundColor] = useState("");

  const onChange = (e) => {
    const {
      target: { name, value },
    } = e;
    if (name === "title") setTitle(value);
    if (name === "content") setContent(value);
    if (name === "category") setCategory(value);
    if (name === "color") setColor(value);
    if (name === "time") setTime(value);
    if (name === "alarm") setAlarm(value);
  };

  const onChange2 = (e) => {
    const {
      target: { name, value },
    } = e;
    if (name === "title") setEditTitle(value);
    if (name === "content") setEditContent(value);
    if (name === "category") setEditCategory(value);
    if (name === "color") setEditColor(value);
    if (name === "time") setEditTime(value);
    if (name === "alarm") setEditAlarm(value);
  };


  const onSubmit = async (e) => {
    const arg = store.getState().arg;
    const get_month = arg.dateStr.split("-")[1];
    e.preventDefault();
    await axios
      .post("http://localhost:8081/api/calender/addcalender", {
        title: title,
        token: window.localStorage.getItem("x_auth"),
        category: category,
        category_color: color,
        desc: content,
        schedule: time,
        date: arg.dateStr,
        alarm: alarm,
        month: Number(get_month),
        group_idx: window.localStorage.getItem("group"),
      })
      .then((res) => {
        if (res.data.result) {
          alert("작성완료");
          setPopup(false);
          location.reload();
        }
        if (res.data.error) {
          alert(res.data.error.text);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };


  const onFixSubmit = async (e) => {
    e.preventDefault();
    await axios
      .post("http://localhost:8081/api/calender/updatecalender", {
        idx: idx,
        title: EditTitle,
        token: window.localStorage.getItem("x_auth"),
        category: EditCategory,
        category_color: EditColor,
        desc: EditContent,
        schedule: EditTime,
        alarm: EditAlarm,
        group_idx: window.localStorage.getItem("group"),
      })
      .then((res) => {
        if (res.data.result) {
          alert("작성완료!!!!!");
          setEditPopup(false);
          location.reload();
        }
        if (res.data.error) {
          alert(res.data.error.text);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const onDelete = async (e) => {
    e.preventDefault();
    await axios
      .post("http://localhost:8081/api/calender/deletecalender", {
        token: window.localStorage.getItem("x_auth"),
        group_idx: window.localStorage.getItem("group"),
        idx: idx,
      })
      .then((res) => {
        if (res.data.result === true) {
          alert("삭제완료!!!!!");
          setEditPopup(false);
          location.reload();
        }
        if (res.data.error) {
          alert(res.data.error.text);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const List = async () => {
    await axios
      .post("http://localhost:8081/api/calender/list", {
        token: window.localStorage.getItem("x_auth"),
        group_idx: window.localStorage.getItem("group"),
      })
      .then((res) => {
        if (res.data.result) {
          setCalenderTitle(res.data.result[0]);
          let eventarr = [];
          for (let i = 0; i < res.data.result.length; i++) {
            let data = {
              idx: res.data.result[i].idx,
              title: res.data.result[i].title,
              color: res.data.result[i].color,
              start: res.data.result[i].event_day.split("T")[0],
              allDay: true,
            };
            setBackgroundColor(res.data.result[i].category_color);
            eventarr.push(data);
          }
          setCalendarEvents(calendarEvents.concat(eventarr));
        }
        if (res.data.error) {
          alert(res.data.error.text);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    List();
  }, []);

  const handleDateClick = (arg) => {
    console.log(arg);
    store.dispatch({ type: "get_arg", arg: arg });
    setPopup(true);
  };

  const get_month = (month) => {
    console.log(month.startStr.split("T")[0]);
    console.log(month.endStr.split("T")[0]);
  };

  const eventClick = async (info) => {
    setIdx(info.event.extendedProps.idx);

    await axios.post("http://localhost:8081/api/calender/detail", {
      idx: info.event.extendedProps.idx,
      token: window.localStorage.getItem("x_auth")
    })
      .then((res) => {
        if (res.data.result) {
          console.log(res.data.result);
          setEditPopup(true);
          setEditTitle(res.data.result.title);
          setEditContent(res.data.result.content);
          setEditCategory(res.data.result.category);
          setEditTime(res.data.result.time);
          setEditAlarm(res.data.result.alarm);
          setEditColor(res.data.result.color);
        }
        if (res.data.error) {
          alert(res.data.error.text);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale="en"
        dateClick={handleDateClick} //이걸로 날짜별 스케줄은 가능
        datesSet={(res) => get_month(res)}
        headerToolbar={{
          left: "prev,title,next",
          right: "today,dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={calendarEvents}
        eventClick={(info) => eventClick(info)}
        dayMaxEventRows={2}
      />
      {popup == false ? (
        ""
      ) : (
        <Popup
          onSubmit={onSubmit}
          onChange={onChange}
          onClick={() => setPopup(false)}
          title={title}
          content={content}
          category={category}
          alarm={alarm}
          deleteName={"delete_none"}
          idxName={"idx_none"}
        />
      )}
      {EditPopup == false ?
        ""
        :
        <Popup
          onSubmit={onFixSubmit}
          onChange={onChange2}
          onClick={() => setEditPopup(false)}
          title={EditTitle}
          content={EditContent}
          category={EditCategory}
          time={EditTime}
          alarm={EditAlarm}
          color={EditColor}
          idx={idx}
          delete={onDelete}
          deleteName={"delete"}
          idxName={"idx_none"}
        />
      }
    </>
  );
};

const Popup = (props) => {
  return (
    <div className="popup_wrap">
      <div className="bg_layer" onClick={props.onClick}></div>
      <div className="popup">
        <form onSubmit={props.onSubmit}>
          <div className="head">
            <h2>Schdule</h2>
            <div className="btn">
              <button type="submit">Save</button>
              <button type="button" className={props.deleteName} onClick={props.delete}>{props.deleteName}</button>
              <button type="button" onClick={props.onClick}>X</button>
            </div>
          </div>

          <div className={props.idxName}>
            <p>{props.idx}</p>
          </div>

          <div className="title">
            <h3>Title</h3>
            <input
              type="text"
              name="title"
              value={props.title}
              onChange={props.onChange}
              required
            />
          </div>

          <div className="content">
            <h3>Content</h3>
            <textarea
              name="content"
              value={props.content}
              onChange={props.onChange}
              required
            />
          </div>

          <div className="category">
            <h3>Category</h3>
            <select
              name="category"
              onChange={props.onChange}
              value={props.category}
              required
            >
              <option value="" disabled>
                선택해주세요
              </option>
              <option value="생일">생일</option>
              <option value="회의">회의</option>
              <option value="약속">약속</option>
            </select>
          </div>

          <div className="time">
            <h3>Time</h3>
            <input
              type="time"
              name="time"
              onChange={props.onChange}
              value={props.time}
              required
            />
          </div>

          <div className="alarm">
            <h3>Alarm</h3>
            <div className="alarm_input">
              <div>
                <input
                  type="radio"
                  name="alarm"
                  value="On"
                  onChange={props.onChange}
                  checked={props.checked}

                  required
                />

                On
              </div>
              <div>
                <input
                  type="radio"
                  name="alarm"
                  value="Off"
                  onChange={props.onChange}
                  required
                />
                <p>Off</p>
              </div>

            </div>
          </div>

          <div className="color">
            <h3>Color</h3>
            <div className="color_input">
              <input
                type="radio"
                name="color"
                value="#E67B72"
                id="red"
                onChange={props.onChange}
                required
              />
              <label
                for="red"
                style={{ "backgroundColor": "#E67B72", "borderColor": "#E67B72" }}></label>
              <input
                type="radio"
                name="color"
                value="#7A86C2"
                id="purple"
                onChange={props.onChange}
                required
              />
              <label
                for="purple"
                style={{ "backgroundColor": "#7A86C2", "borderColor": "#7A86C2" }}></label>
              <input
                type="radio"
                name="color"
                value="#068042"
                id="green"
                onChange={props.onChange}
                required
              />
              <label
                for="green"
                style={{ "backgroundColor": "#068042", "borderColor": "#068042" }}></label>
              <input
                type="radio"
                name="color"
                value="#F5BF24"
                id="yellow"
                onChange={props.onChange}
                required
              />
              <label
                for="yellow"
                style={{ "backgroundColor": "#F5BF24", "borderColor": "#F5BF24" }}></label>
              <input
                type="radio"
                name="color"
                value="#2A98D4"
                id="blue"
                onChange={props.onChange}
                required
              />
              <label
                for="blue"
                style={{ "backgroundColor": "#2A98D4", "borderColor": "#2A98D4" }}></label>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};