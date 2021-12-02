
import { signOut,useSession } from 'next-auth/react'
import { useEffect, useState } from 'react';
import { shuffle } from 'lodash'
import { ChevronDownIcon } from '@heroicons/react/outline'
import { useRecoilState, useRecoilValue } from 'recoil';
import { playlistIdState, playListState } from '../atoms/playlistAtom';
import useSpotify from '../hooks/useSpotify';
import Songs from './Songs';



const Center = () => {
    const { data: session } = useSession();
    const spotifyApi = useSpotify();
    const [color, setColor] = useState('');
    const playlistId = useRecoilValue(playlistIdState)
    const [playlist, setPlaylist] = useRecoilState(playListState)
    const colors = [
        "from-indigo-500",
        "from-blue-500",
        "from-green-500",
        "from-red-500",
        "from-yellow-500",
        "from-pink-500",
        "from-purple-500",
        "from-gray-500"
    ]
    useEffect(() => {
        setColor(shuffle(colors).pop())

    }, [playlistId])

    useEffect(() => {
        spotifyApi.getPlaylist(playlistId).then((data) => {
            setPlaylist(data.body)
        }).catch((error) => console.log('Something went wrong', error))
    }, [spotifyApi, playlistId])


    return (
        <div className="flex-grow text-black overflow-y-scroll h-screen scrollbar-hide">

            <header className="absolute top-5 right-8">
                <div className="flex items-center p-1 pr-2 space-x-3 cursor-pointer rounded-full  bg-black opacity-90 hover:opacity-80"
                    onClick={signOut}
                >
                    <img className="w-10 h-10 rounded-full  " src={session?.user.image} alt="" />
                    <h2 className="text-white hidden sm:inline">{session?.user.name}</h2>
                    <ChevronDownIcon className=' text-white h-6 w-6 pr-2' />
                </div>

            </header>
            <section className={`flex items-end space-x-2 w-full bg-gradient-to-b ${color} to-black h-80 p-8 text-white`}>
                <img className="w-44 h-44 shadow-2xl" src={playlist?.images?.[0]?.url} alt="" />
                <div>
                    <p> PLAYLISTS</p>
                    <h1 className="text-2xl  md:text-3xl xl:text-5xl">{playlist?.name}</h1>
                </div>
            </section>
            <div>
                <Songs />
            </div>
        </div>
    )
}

export default Center
