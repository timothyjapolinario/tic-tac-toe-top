const Player = (marker) => {
    let markedSlots = []
    const getMarker = () =>{
        return marker
    }
    const getMarkedSlots = () =>{
        return markedSlots
    }
    const addSlot = (index) => {
        markedSlots.push(index)
    }
    return {getMarker, addSlot, getMarkedSlots}
}

const Game = (() => {
    let player_1 = Player("x")
    let player_2 = Player("o")
    let currentPlayer = player_1
    let boardSlots = document.querySelectorAll(".game-board > div")

    let rows = [[1,2,3],[4,5,6],[7,8,9]]
    let columns = [[1,4,7],[2,5,8],[3,6,9]]
    let diagonals = [[1,5,9], [3,5,7]]

    const bindEvents = () =>{
        boardSlots.forEach((slot, index) => {
            console.log(index)
            slot.addEventListener('click', function(){
                putMark(currentPlayer.getMarker(), slot, index)
            })
        })
    }
    const putMark = (mark, slot, slotIndex) => {
        if(!slot.innerText){
            slot.innerText = mark
            currentPlayer.addSlot(slotIndex+1)
            console.log(checkWinner())
            changeCurrentPlayer()
        }
    }
    const changeCurrentPlayer = () =>{
        if(currentPlayer == player_1){
            currentPlayer = player_2
        }else{
            currentPlayer = player_1
        }
    }

    let checker = (arr, target) => target.every(v => arr.includes(v))
    const checkWinner = () =>{
        let hasWinner = false
        markedSlots = currentPlayer.getMarkedSlots()

        //check rows
        rows.forEach(row=>{
            if(checker(markedSlots, row)){
                hasWinner = true
            }
        })
        if(hasWinner){
            return hasWinner
        }
        //check column
        columns.forEach(column=>{
            if(checker(markedSlots, column)){
                hasWinner = true
            }
        })
        if(hasWinner){
            return hasWinner
        }
        //check diagonal
        diagonals.forEach(diagonal=>{
            if(checker(markedSlots, diagonal)){
                hasWinner = true
            }
        })

        return hasWinner
    }
    bindEvents()
    return{player_1, player_2}
})();