const Player = (marker) => {

    const getMarker = () =>{
        return marker
    }
    return {getMarker}
}

const Game = (() => {
    let player_1 = Player("x")
    let player_2 = Player("o")


    console.log(player_1.getMarker())
    let board = [[],[],[]]


    const startGame = () =>{
        
    }

    

    return{
        startGame
    }
})();