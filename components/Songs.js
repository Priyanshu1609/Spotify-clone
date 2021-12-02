import { useRecoilValue } from "recoil"
import { playListState } from "../atoms/playlistAtom"
import Song from "./Song"

const Songs = () => {

    const playlist = useRecoilValue(playListState)
    return (
        <div className="text-white px-8 flex flex-col pb-28 space-y-1">
            {playlist?.tracks.items.map((track, i) => (
                <Song track={track} key={track.track.id} order={i} />
            ))}
        </div>
    )
}

export default Songs
