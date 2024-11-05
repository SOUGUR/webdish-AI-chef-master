import React from 'react'

function DishComponent(props) {
  return (
    <div className="cards" onClick = {async(e)=>{
        await fetch(`${import.meta.env.VITE_API_URL}/recent-history`,{
          method:"POST",
          headers:{
            "Content-Type":"application/json",
            "Access-Control-Allow-Origin": "*"
          },
          body:JSON.stringify({
            chef:JSON.parse(localStorage.getItem("user")).user_id,
            dish:props.title
          })
        }).then((e)=>{
          console.log(e.json())
        })
      }}>
      <img className="dish-photo" src={props.img} />
      <div className="info">
        <p className="title">{props.title.slice(0,40)+"...."}</p>
      </div>
    </div>
  )
}

export default DishComponent
