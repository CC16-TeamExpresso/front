import React, {useState, useEffect} from 'react'
import './Spotify.css'
require('dotenv').config();

function Spotify(){
    
  const [currentUri, setCurrentUri] = useState("");
  const [accessToken, setAccessToken] = useState("");
   
  let BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8050"

    //Obtain access token and put into accessToken 
    //This and the next useEffect need to be separated for the setAccessToken to work
      useEffect(()=>{
      setAccessToken(window.location.search.slice(14))
    }, [])

    //Display current music when the user links with spotify
     useEffect(()=>{
      getCurrentMusic()
    }, [accessToken])
    
     
    //Display current playing when the page is refreshed.  
    //When the user links with spotify, initally there is no token, so the function does not use  
    //alert because it stops the process.
    function getCurrentMusic(){
      if(accessToken !== ""){
        fetch("https://api.spotify.com/v1/me/player?additional_types=episode", {
          headers: {Authorization: "Bearer " + accessToken},
        })
        .then((response) => response.json())
        .then((data) => {
          console.log(data.item)
          const uri = data.item.uri;      
          setCurrentUri(uri)    
        }).catch((err)=>console.log("no response because no token"))
      } else {console.log("no current song because no token")}}
        
    //For the user to actively refresh the current music 
      function refresh(){
          if (accessToken !== ""){
            fetch("https://api.spotify.com/v1/me/player?additional_types=episode", {
              headers: {Authorization: "Bearer " + accessToken},
            })
            .then((response) => response.json())
            .then((data) => {
              const uri = data.item.uri;      
              setCurrentUri(uri)    
            })
            .catch((err)=>(alert("Not playing now.")));
          }
          else {
            alert("Did you log in with Spotify?")
          }}
          
    //Share button 
      function sendUri() {
             if (currentUri !== ""){
               const uri = currentUri
               const body = {uri: uri}
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
              })} else {alert("Log in with Spotify and get Current Song!")}
         };

      let spotifyLoginUrl = BACKEND_URL + "/spotifylogin"   
            
      return (
      <div className='spotify-container'>

          { accessToken === "" 
              ?
              <button className='spotify-login'id="button"><a className='spotify-link' href={spotifyLoginUrl}>Log in with Spotify</a></button>
              :<button className='spotify-login'id="button"><a className='spotify-link' href={spotifyLoginUrl}>Logged in</a></button>
          }
          
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

