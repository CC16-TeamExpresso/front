import React from 'react'

function Spotify(){
    
    //obtain access token 
     const access_token = window.location.search.slice(14);
     const enterUri : any = document.getElementById("enterUri")

     function sendUri() {
        //const enterUri : any = document.getElementById("enterUri") 
        const uri = enterUri.value
        const body = {uri: uri}
        console.log(body)
        fetch('http://localhost:8050/senduri', { 
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body:JSON.stringify(body)})        
    };
    

   function autoFill(){
    if(access_token){
      fetch("https://api.spotify.com/v1/me/player?additional_types=episode", {
      headers: { Authorization: "Bearer " + access_token },
    })
    .then((response) => response.json())
    .then((data) => {
      const uri = data.item.uri;      
      enterUri.value = uri      
    })
    .catch((err)=>(console.log("No uri now.")));
  } else {
    console.log("no token")
  }}

    return (
    <div>
    <button id="button"><a href="http://localhost:8050/spotifylogin">Log in with Spotify</a></button>
    <form><input type="text" id="enterUri" ></input></form>
    <button id="share" onClick={sendUri}>Share</button>
    <button id="fillUri" onClick={autoFill}>Autofill</button>
    </div>
    )
}
export default Spotify;