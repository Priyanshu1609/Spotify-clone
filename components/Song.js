import { useRecoilState } from "recoil"
import useSpotify from "../hooks/useSpotify"
import { millisToMinutesAndSeconds } from "../lib/time"
import { currentTrackIdState, isPlaylingState } from '../atoms/songAtom';



const Song = ({ order, track }) => {
    const spotifyApi = useSpotify();

    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState)
    const [isPlaying, setIsPlaying] = useRecoilState(isPlaylingState)

    const playing = ()=>{
        setCurrentTrackId(track.track.id)
        setIsPlaying(true);
        spotifyApi.play({
            uris: [track.track.uri],
        })
    }

    return (
        <div className="grid grid-cols-2 text-gray-500 py-4 px-5 hover:bg-gray-900 hover:rounded-lg cursor:pointer"
            onClick={playing}
        >
            <div className="flex items-center space-x-4">
                <p>{order + 1}</p>
                <img className="h-10 w-10" src={track.track.album.images[0].url} alt="" />
                <div>
                    <p className="w-36 lg:w-64 truncate text-white">{track.track.name}</p>
                    <p className="w-40">{track.track.artists[0].name}</p>
                </div>
            </div>
            <div className="flex items-center justify-between ml-auto md:ml-0">
                <p className="hidden md:inline w-40">{track.track.album.name}</p>
                <p>{millisToMinutesAndSeconds(track.track.duration_ms)}</p>
            </div>
        </div>
    )
}

export default Song
