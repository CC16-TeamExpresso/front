import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Post from '../Feed/Post';
import './user.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8050";

export default function User(props: any) {
  const [user, setUser] = useState("");
  const [feedUsers, setFeedUsers] = useState([]);
  const [follow,setFollow] = useState("Peek");
  const [isFollow, setIsFollow] = useState(true);
  const { params } = props.match;
  const userid = params.userid;
  const history = useHistory();
  useEffect(() => {
    fetch(BACKEND_URL + "/api/user/" + userid, {
      method:"GET",
      headers: {
        'Content-Type': 'application/json',
        'token': localStorage.getItem('token') || ''
      }
    })
      .then(res => res.json())
      .then(data => {
        setUser(data.result.username);
        setFeedUsers(data.result.posts);
        if (data.result.follow) {
          setFollow("Peeking");
        } else {
          setIsFollow(false);
        }
      })
  },[])

  const followUser = () => {
    if (isFollow) {
      alert("You've already followed this user!");
    } else {
      fetch(BACKEND_URL + '/api/follow/' + userid,{
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json',
          'token': localStorage.getItem('token') || ''
        }
      })
        .then(res => res.json())
        .then(data => {
          if(data.status === "ok") {
            setIsFollow(true);
            setFollow("Peeking");
          } else {
            alert('Something wrong. Please try again.');
          }
        })
    }
  }
  return (
		<div className='App'>
      <h1 className='posthistory-title'>Currently Peeking on {user}</h1>
      <div className='user-button'>
        <button className='follow-button' onClick={followUser}>{follow}</button>
        <button className='goback-button' onClick={() => history.goBack()}>Go Back</button>		
      </div>
      <div className='history-feed'>
        {feedUsers.map((feedUser:any) => {
          return <Post isHistory={true} username={user} uri={feedUser.uri} id={feedUser._id} like={feedUser.like} />
        })}	
      </div>
      <div className='profile-info-box'>
      </div>
		</div>
	);
}
