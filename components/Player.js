import { VolumeUpIcon, FastForwardIcon, PauseIcon, PlayIcon, ReplyIcon, RewindIcon, SwitchHorizontalIcon, SwitchVerticalIcon } from "@heroicons/react/solid";
import { VolumeDownIcon } from "@heroicons/react/outline"
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlaylingState } from "../atoms/songAtom";
import useSongInfo from "../hooks/useSongInfo";
import useSpotify from "../hooks/useSpotify";
import { debounce } from 'lodash'

const Player = () => {

    const spotifyApi = useSpotify();
    const { data: session, status } = useSession();
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState)
    const [isPlaying, setIsPlaying] = useRecoilState(isPlaylingState)
    const [volume, setVolume] = useState(50)
    const songInfo = useSongInfo();

    const fetchCurrentSong = () => {
        if (!songInfo) {
            spotifyApi.getMyCurrentPlayingTrack().then(
                (data) => {
                    //console.log('Now playing', data.body?.item)
                    setCurrentTrackId(data.body?.item?.id);

                    spotifyApi.getMyCurrentPlaybackState().then((data) => {
                        setIsPlaying(data.body?.is_playing)
                    })

                }
            )
        }
    }

    useEffect(() => {
        if (spotifyApi.getAccessToken() && !currentTrackId) {
            fetchCurrentSong();
            setVolume(50);
        }
    }, [currentTrackId, spotifyApi, session])

    const handlePlayPause = () => {
        spotifyApi.getMyCurrentPlaybackState().then((data) => {
            if (data.body.is_playing) {
                spotifyApi.pause();
                setIsPlaying(false);
            }
            else {
                spotifyApi.play();
                setIsPlaying(true);
            }
        })
    }

    useEffect(() => {
        if (volume > 0 && volume < 100) {
            debouncedAdjustVolume(volume);
        }
    }, [volume])

    const debouncedAdjustVolume = useCallback(
        debounce((volume) => {
            spotifyApi.setVolume(volume).catch((err) => {});
        }, 500), []
    )

    return (
        <div className="h-24 bg-gradient-to-b from-gray-800 to-gray-900 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
            <div className="flex items-center space-x-4 ">
                <img className="hidden md:inline w-10 h-10" src={songInfo?.album?.images?.[0]?.url} alt="" />
                <div>
                    <h3>{songInfo?.name}</h3>
                    <p>{songInfo?.artists?.[0]?.name}</p>
                </div>
            </div>
            {/* Center */}
            <div className="flex items-center justify-evenly">
                <SwitchHorizontalIcon className="button" />
                <RewindIcon className="button" />
                {isPlaying ? (
                    <PauseIcon onClick={handlePlayPause} className="button w-10 h-10" />
                ) : (
                    <PlayIcon onClick={handlePlayPause} className="button w-10 h-10" />
                )
                }
                <FastForwardIcon className="button" />
                <ReplyIcon className="button" />


            </div>
            <div className="flex items-center space-x-3 justify-end pr-5">

                {/* <VolumeDownIcon className="button"/> */}
                <VolumeUpIcon className="button" />
                <input className="w-14 md:w-28" type="range" value={volume} mind={0} max={100}
                    onChange={e => setVolume(Number(e.target.value))}
                />
            </div>
        </div>
    )
}

export default Player
