import React from 'react'

export const AlarmCard = (props) => {

  return (
    <>
      <div className="card" style={{ "backgroundColor": props.color }}>
        <h2>{props.month}/{props.date}<br />{props.time}</h2>
        <div>
          <h3 title={props.title}>{props.title}</h3>
          <p title={props.content}>
            {props.content}
          </p>
        </div>
      </div>
    </>
  )
}

export const Member = (props) => {
  return (
    <div className="profile" onClick={props.onClick}>
      <div className="image">
        <img src={props.img} alt="프로필" />
      </div>
      <p>{props.nickname}</p>
    </div>
  )
}
