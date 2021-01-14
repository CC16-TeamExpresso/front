import React, {useState} from 'react'
import './Spotify.css'
require('dotenv').config();
function Spotify(){
    
   const [currentUri, setCurrentUri] = useState("");
   const [loginStatus, setLoginStatus] = useState(false);
  
   

   let BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8050"

    //obtain access token 
     const access_token = window.location.search.slice(14);
    
     //const enterUri : any = document.getElementById("enterUri") 

     function sendUri() {
        if (currentUri !== ""){
          const uri = currentUri
          const body = {uri: uri}
          console.log("the uri is " + uri)
        fetch(BACKEND_URL+"/api/music", {
        method: "POST",
        headers: {
          "Content-Type":"application/json",
          "token": localStorage.getItem("token") || ""
        },
        body:JSON.stringify(body)})
         .then(res => res.json())
         .then(data => {
           if(data.result === 1) {
             alert("Successfully posted!");
            // enterUri.value = "";
           }else {
             alert("Oops something went wrong!");
            // enterUri.value = "";
           }
         })} else {alert("Press Refresh!")}
    };
    

   function refresh(){
    if(access_token){
      fetch("https://api.spotify.com/v1/me/player?additional_types=episode", {
      headers: { Authorization: "Bearer " + access_token },
    })
    .then((response) => response.json())
    .then((data) => {
      const uri = data.item.uri;      
      setCurrentUri(uri)    
    })
    .catch((err)=>(alert("Not playing now.")));
  } else {
    alert("Log in with Spotify!")
    console.log("no token")
  }}

    let spotifyLoginUrl = BACKEND_URL + "/spotifylogin"
  
    return (
    <div className='spotify-container'>

      { !access_token 
      ?
      <button className='spotify-login'id="button"><a className='spotify-link' href={spotifyLoginUrl}>Log in with Spotify</a></button>
      :<button className='spotify-login'id="button"><a className='spotify-link' href={spotifyLoginUrl}>Logged in</a></button>
      }
      {/* <form><input className='spotify-input' type="text" id="enterUri" ></input></form> */}
      <button className='spotify-refresh' id="fillUri" onClick={refresh}>Current Song</button>
      <button className='spotify-share-button'id="share" onClick={sendUri}>Share</button>
      { currentUri !== "" 
      ?
      <iframe
              src={`https://open.spotify.com/embed/${currentUri.slice(8).replace(":", "/")}`}
              width="300"
              height="80"
              frameBorder="0"
              allowTransparency={true}
              allow="encrypted-media"
        ></iframe>
      : null}
    </div>
    )
}
export default Spotify;

