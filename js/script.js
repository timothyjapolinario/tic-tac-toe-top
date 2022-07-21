const Player = (marker) => {
    let markedSlots = []
    const getMarker = () =>{
        return marker
    }
    const getMarkedSlots = () =>{
        return markedSlots
    }

    const removeAllMarks = () =>{
        markedSlots = []
    }

    const addSlot = (index) => {
        markedSlots.push(index)
    }
    return {getMarker, addSlot, getMarkedSlots, removeAllMarks}
}

const Game = (() => {
    let player_1 = Player("x")
    let player_2 = Player("o")
    let rounds = 9
    let currentPlayer = player_1
    let boardSlots = document.querySelectorAll(".game-board > div")
    let resetButton = document.querySelector("#reset")
    let matchResult = document.querySelector(".match-result")
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

        resetButton.addEventListener('click', reset)

        matchResult.addEventListener('click', removeResult)
    }
    const putMark = (mark, slot, slotIndex) => {
        if(!slot.innerText){
            slot.innerText = mark
            currentPlayer.addSlot(slotIndex+1)
            endTurn()
        }
    }
    const changeCurrentPlayer = () =>{
        if(currentPlayer == player_1){
            currentPlayer = player_2
        }else{
            currentPlayer = player_1
        }
    }

    const endTurn = () =>{
        rounds -= 1
        
        if(checkWinner()){
            announceResult('Winner: ' + currentPlayer.getMarker())
            reset()
            return
        }
        console.log('still running')
        if(rounds == 0){
            announceResult('Draw!')
            reset()
            return
        }
        changeCurrentPlayer()
    }
    const checkWinner = () =>{
        let checker = (arr, target) => target.every(v => arr.includes(v))
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

    const announceResult = (textResult) =>{
        matchResult.style.display = "block"
        matchResult.innerText = textResult
    }

    const removeResult = () => {
        matchResult.style.display = "none"
    }

    let reset = () =>{
        player_1.removeAllMarks()
        player_2.removeAllMarks()
        boardSlots.forEach(slot=>{
            slot.innerText = ""
        })
    }
    bindEvents()
    return{player_1, player_2}
})();