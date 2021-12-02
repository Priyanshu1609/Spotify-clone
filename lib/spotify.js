import SpotifyWebApi from "spotify-web-api-node";


const url = "&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private";
  
const queryParamString = new URLSearchParams(url);

const LOGIN_URL = "https://accounts.spotify.com/authorize?" + queryParamString.toString()

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
    clientScript: process.env.NEXT_PUBLIC_CLIENT_SECRET,
})


export default spotifyApi;
export { LOGIN_URL };