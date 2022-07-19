const Player = (marker) => {
    const getMarker = () =>{
        return marker
    }
    return {getMarker}
}

const Game = (() => {
    let player_1 = Player("x")
    let player_2 = Player("o")
    let currentPlayer = player_1
    let boardSlots = document.querySelectorAll(".game-board > div")
    //let board = new Map
    const bindEvents = () =>{
        boardSlots.forEach(slot => {
            slot.addEventListener('click', function(){
                if(!slot.innerText){
                    putMark(currentPlayer.getMarker(), slot)
                }
            })
        })
    }
    const putMark = (mark, slot) => {
        slot.innerText = mark
        changeCurrentPlayer()
    }
    const changeCurrentPlayer = () =>{
        if(currentPlayer == player_1){
            currentPlayer = player_2
        }else{
            currentPlayer = player_1
        }
    }
    bindEvents()
})();