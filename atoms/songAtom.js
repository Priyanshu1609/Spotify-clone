import { atom } from 'recoil'

export const currentTrackIdState = atom({
    key : 'currentTrackIdState', //unique id of current playing songs
    default : null,
});

export const isPlaylingState = atom({
    key : 'isPlaylingState',
    default : false,
});