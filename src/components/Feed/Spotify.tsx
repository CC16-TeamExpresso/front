import React from 'react'
import './Spotify.css'
require('dotenv').config();
function Spotify(){
    
   let BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8050"

    //obtain access token 
     const access_token = window.location.search.slice(14);
     const enterUri : any = document.getElementById("enterUri")


     function sendUri() {
        //const enterUri : any = document.getElementById("enterUri") 
        const uri = enterUri.value
        if(uri.substring(0,7)==="spotify"){
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
           if(data.result == 1) {
             alert("Successfully posted!");
             enterUri.value = "";
           }else {
             alert("Oops something went wrong!");
             enterUri.value = "";
           }
         })} else {
           alert("Did you link with spotify? If so, click autofill.\nShare does not work when you are not playing anything.")//
         }  
    };
    

   function autoFill(){
    if(access_token){
      console.log("There is access_token")
      fetch("https://api.spotify.com/v1/me/player?additional_types=episode", {
      headers: { Authorization: "Bearer " + access_token },
    })
    .then((response) => response.json())
    .then((data) => {
      const uri = data.item.uri;      
      enterUri.value = uri     
    })
    .catch((err)=>(enterUri.value = "Not playing now."));
  } else {
    console.log("no token")
  }}

    let spotifyLoginUrl = BACKEND_URL + "/spotifylogin"

    return (
    <div>
      <button className='spotify-login'id="button"><a className='spotify-link' href={spotifyLoginUrl}>Log in with Spotify</a></button>
        <form><input className='spotify-input' type="text" id="enterUri" ></input></form>
      <button className='spotify-share-button'id="share" onClick={sendUri}>Share</button>
      <button className='spotify-autofill' id="fillUri" onClick={autoFill}>Autofill</button>
    </div>
    )
}
export default Spotify;