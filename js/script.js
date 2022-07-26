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


const Computer = (marker, difficulty, board) => {
    const prototype = Player(marker);
    const speak = () => {
        console.log("beep-boop-beep-boop")
    }

    const makeMove = () =>{
        if(difficulty == 1){
            randomMove()
        }
    }

    const randomMove = () =>{
        let randomNumber = Math.floor(Math.random()*8)
        while(board.includes(randomNumber)){
            randomNumber = Math.floor(Math.random()*8)
        }
        board[randomNumber] = marker 
    }
    return Object.assign({}, prototype, {speak})     
}


const Game = (() => {
    let player_1 = Player("x")
    let player_2 = Player("o")
    let rounds = 9
    let currentPlayer = player_1
    let boardSlots = document.querySelectorAll(".game-board > div")
    let resetButton = document.querySelector("#reset")
    let matchResult = document.querySelector(".match-result")

    const board = []

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
            //slot.innerText = mark
            board[slotIndex] = currentPlayer.getMarker()
            currentPlayer.addSlot(slotIndex)
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

    const renderBoard = () => {
        let index = 0
        boardSlots.forEach(slot =>{
            if(board[index]){
                slot.innerText = board[index]
            }
            index += 1
        })
    }

    const endTurn = () =>{
        rounds -= 1
        renderBoard()
        console.log(board)
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
        const rows = [[0,1,2],[3,4,5],[6,7,8]]
        const columns = [[0,3,6],[1,4,7],[2,5,8]]
        const diagonals = [[0,4,8], [2,4,6]]
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