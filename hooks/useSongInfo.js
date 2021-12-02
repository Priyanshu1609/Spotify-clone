
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlaylingState } from "../atoms/songAtom";
import useSpotify from "../hooks/useSpotify";


const useSongInfo = () => {
    const spotifyApi = useSpotify();
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState)
    const [isPlaying, setIsPlaying] = useRecoilState(isPlaylingState)
    const [songInfo, setSongInfo] = useState(null)

    useEffect(() => {
        const fetchSongInfo = async ()=>{
            if(currentTrackId){
                const trackInfo  = await fetch(
                    `https://api.spotify.com/v1/tracks/${currentTrackId}`,
                    {
                        headers:{
                            Authorization: `Bearer ${spotifyApi.getAccessToken()}`
                        }
                    }
                ).then(res => res.json())
                
                setSongInfo(trackInfo)
            }
        }
    }, [currentTrackId, spotifyApi])

    return songInfo;
}

export default useSongInfo
