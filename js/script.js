const Player = (marker) => {
    let markedSlots = []
    const getMarker = () =>{
        return marker
    }
    const getMarkedSlots = () =>{
        return markedSlots
    }

    const removeAllMarks = () =>{
        markedSlots.length = 0
    }


    const makeMove = (index) => {
        markedSlots.push(index)
    }
    return {getMarker, makeMove, getMarkedSlots, removeAllMarks}
}


const Computer = (marker, difficulty,board) => {
    const prototype = Player(marker);
    const markedSlots = prototype.getMarkedSlots()
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
        if(board.includes(undefined)){
            while(!(board[randomNumber] == null) ){
                
                randomNumber = Math.floor(Math.random()*8)
                console.log("selecting number")
            }
            markedSlots.push(randomNumber)
        }
    }
    return Object.assign({}, prototype, {makeMove, randomMove})     
}


const Game = (() => {
    let board = []
    let player_1 = Player("x")
    let player_2 = Computer("o", 1, board)
    let rounds = 9
    let currentPlayer = player_1
    let boardSlots = document.querySelectorAll(".game-board > div")
    let resetButton = document.querySelector("#reset")
    let matchResult = document.querySelector(".match-result")

    const playTurn = (slot, index) =>{
        //console.log("player one move")
        player_1.makeMove(index)
       // console.log("updatng board")
        updateBoard()
        //console.log("player two move")
        endTurn()
        player_2.makeMove()
        //console.log("updatng board")
        updateBoard()
        //console.log("rendering board")
        renderBoard()
        //console.log("ending turn")
        endTurn()
    }

    const updateBoard = () =>{
        player_1.getMarkedSlots().forEach(slotIndex => {
            board[slotIndex] = player_1.getMarker()
        })
        player_2.getMarkedSlots().forEach(slotIndex => {
            board[slotIndex] = player_2.getMarker()
        })
    }

    const bindEvents = () =>{
    
        boardSlots.forEach((slot, index) => {
            slot.addEventListener('click', function(){
                if(!slot.innerText){
                    playTurn(slot, index)
                }
            })
        })

        resetButton.addEventListener('click', reset)

        matchResult.addEventListener('click', removeResult)
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
        if(checkWinner()){
            announceResult('Winner: ' + currentPlayer.getMarker())
            reset()
            return
        }
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
        console.log(hasWinner)
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
        board.length = 0
    }
    bindEvents()
    return{player_1, player_2, board}
})();