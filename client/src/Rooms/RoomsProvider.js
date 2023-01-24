import React, {Children, useContext} from 'react'
import UseLocalStorage from './UseLocalStorage';

const RoomsContext = React.createContext()
export function useRooms(){
    return useContext(RoomsContext)
}

export  function RoomsProvider({children}) {
    const [rooms, setRooms] = UseLocalStorage('rooms', [])

        function createRoom(name){
        setRooms(prevRooms => {
            return [...prevRooms, {name}]
        })
    }
    return (
        <RoomsContext.Provider value={{ rooms, createRoom}}>
            {children}
        </RoomsContext.Provider>
         
    )
}
