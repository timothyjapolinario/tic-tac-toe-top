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
        console.log(board)
        if(board.includes(null)){
            console.log("passed!")
            while(!(board[randomNumber] == null) ){
                randomNumber = Math.floor(Math.random()*8)
            }
            markedSlots.push(randomNumber)
        }
    }

    const miniMax = () => {
        let opponentMarker = marker == "x"? "o": "x"
        let computer_player = Player(marker)
        let other_player = Player(opponentMarker)


    }
    const countAvailableSpaces = () =>{
        let notNull = board.filter(slot => !(slot == null)).length
        //total space subtract not null spaces
        return 9 - notNull
    }
    return Object.assign({}, prototype, {makeMove, randomMove, miniMax})     
}


const Game = (() => {
    //let lastMoveWinner = ["x", "x", undefined,"x","o","x", "o", "x", "o"]
    let board = Array(9).fill(null)
    let player_1 = Player("x")
    let player_2 = Computer("o", 1, board)
    let rounds = 9
    let currentPlayer = player_1
    let hasWinner = false
    let isDraw = false
    let boardSlots = document.querySelectorAll(".game-board > div")
    let resetButton = document.querySelector("#reset")
    let matchResult = document.querySelector(".match-result")

    const playTurn = (slot, index) =>{
        player_1.makeMove(index)
        updateBoard()
        endTurn()
        if(hasWinner||isDraw){
            reset()
            return
        }
        player_2.makeMove()
        updateBoard()
        renderBoard()
        endTurn()
        if(hasWinner||isDraw){
            reset()
            return
        }
        
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
            announceResult('Winner: ' + currentPlayer.getMarkedSlots())
            return
        }
        if(rounds == 0){
            announceResult('Draw!')
            isDraw = true;
            return
        }
        changeCurrentPlayer()
    }
    const checkWinner = () =>{
        const rows = [[0,1,2],[3,4,5],[6,7,8]]
        const columns = [[0,3,6],[1,4,7],[2,5,8]]
        const diagonals = [[0,4,8], [2,4,6]]
        let checker = (arr, target) => target.every(v => arr.includes(v))
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

    const getWinner = (square_index, new_letter) => {
        let row_index = Math.floor(square_index/3)*3
        let temp_row = board.slice(row_index, row_index+3)
        let winning = temp_row.every(letter =>  {
            console.log("lol")
            return new_letter == letter
        })
        console.log(winning)
        if(winning){
            console.log('winning')
            return new_letter
        }

        let column_index = square_index % 3
        temp_col = board.filter((element, index) => {
            return (index % 3 == column_index)
        })
        hasWinner = temp_col.every(letter =>  new_letter == letter)
        if(hasWinner){
            return new_letter
        }

        let left_diagonal = [board[0],board[4],board[8]]
        let right_diagonal = [board[2],board[4],board[6]]
        
        hasWinner = left_diagonal.every(letter =>  new_letter == letter)
        if(hasWinner){
            return new_letter
        }
        hasWinner = right_diagonal.every(letter =>  new_letter == letter)
        if(hasWinner){
            return new_letter
        }

    }

    const announceResult = (textResult) =>{
        matchResult.style.display = "block"
        matchResult.innerText = textResult
    }

    const removeResult = () => {
        matchResult.style.display = "none"
    }
    const getBoard = () => {
        return board
    }

    let reset = () =>{
        player_1.removeAllMarks()
        player_2.removeAllMarks()
        hasWinner = false
        isDraw = false
        rounds = 9
        boardSlots.forEach(slot=>{
            slot.innerText = ""
        })
        board.fill(null)
    }
    bindEvents()
    renderBoard()
    return{player_1, player_2, board}
})();