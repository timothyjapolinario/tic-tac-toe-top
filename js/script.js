const Player = (marker, board) => {
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

    const makeMove = (index) =>{
        board[index] = marker
    }
    return {getMarker, makeMove}
}


const Computer = (marker, difficulty,board) => {
    const prototype = Player(marker);
    let boardCopy
    let iteration = 1
    let opponentMarker = marker == "x"? "o": "x"
    let computer_player = Player(marker)
    let other_player = Player(opponentMarker)
    let currentPlayer = computer_player

    const speak = () => {
        console.log("beep-boop-beep-boop")
    }

    const makeMove = () =>{
        if(difficulty == 1){
            let randomIndex = randomMove()
            boardCopy = board.slice(0)
            miniMax()
            console.log("iteration: "+ iteration)
            return randomIndex
        }
        if(difficulty == 2){
            boardCopy = board.slice(0)
        }
    }
    const randomMove = () =>{
        
        let randomNumber = Math.floor(Math.random()*8)
        if(board.includes(null)){
            while(!(board[randomNumber] == null) ){
                randomNumber = Math.floor(Math.random()*8)
            }
            board[randomNumber] = marker
            return randomNumber
        }
    }

    const miniMax = () => {
        let nextSpaceIndex
        if(countAvailableSpaces(boardCopy) < 1){
            console.log("Board is Filled!")
            return
        }

        nextSpaceIndex = fillNextSpace(boardCopy, currentPlayer.getMarker())
        if(getWinner(nextSpaceIndex, currentPlayer.getMarker())){
            return
        }
        changeCurrentPlayer()
        iteration += 1
        miniMax()
    }

    const resetMiniMax = () =>{
        iteration = 1
        boardCopy = board.slice(0)
    }

    const changeCurrentPlayer = () => {
        if(currentPlayer == computer_player){
            currentPlayer = other_player
        }else{
            currentPlayer = computer_player
        }
    }

    const fillNextSpace = (newBoard, mark) =>{
        let index = newBoard.findIndex(slot => slot == null)
        newBoard[index] = mark
        return index
    }
    const countAvailableSpaces = (newBoard) =>{
        let notNull = newBoard.filter(slot => !(slot == null)).length
        //total space subtract not null spaces
        return 9 - notNull
    }


    const getWinner = (square_index, new_letter) => {
        let row_index = Math.floor(square_index/3)*3
        let temp_row = boardCopy.slice(row_index, row_index+3)
        let winning = temp_row.every(letter => new_letter == letter)
        if(winning){
            return new_letter
        }

        let column_index = square_index % 3
        temp_col = boardCopy.filter((element, index) => {
            return (index % 3 == column_index)
        })
        winning = temp_col.every(letter =>  new_letter == letter)
        if(winning){
            return new_letter
        }

        let left_diagonal = [boardCopy[0],boardCopy[4],boardCopy[8]]
        let right_diagonal = [boardCopy[2],boardCopy[4],boardCopy[6]]
        
        winning = left_diagonal.every(letter =>  new_letter == letter)
        if(winning){
            return new_letter
        }
        winning = right_diagonal.every(letter =>  new_letter == letter)
        if(winning){
            return new_letter
        }
        return false
    } 
    return Object.assign({}, prototype, {makeMove, randomMove, miniMax})    
}


const Game = (() => {
    //let lastMoveWinner = ["x", "x", undefined,"x","o","x", "o", "x", "o"]
    let board = Array(9).fill(null)
    let player_1 = Player("x", board)
    let player_2 = Computer("o", 1, board)
    let rounds = 9
    let currentPlayer = player_1
    let hasWinner = false
    let isDraw = false
    let boardSlots = document.querySelectorAll(".game-board > div")
    let resetButton = document.querySelector("#reset")
    let matchResult = document.querySelector(".match-result")


    const playTurn = (slot, index) =>{
        //Human Player
        player_1.makeMove(index)
        endTurn(index, currentPlayer.getMarker())
        if(hasWinner||isDraw){
            reset()
            return
        }
        
        //Computer Player
        let computer_move = player_2.makeMove()
        endTurn(computer_move, currentPlayer.getMarker())
        if(hasWinner||isDraw){
            reset()
            return
        }
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

    const endTurn = (index, marker) =>{
        rounds -= 1
        renderBoard()
        if(getWinner(index, marker)){
            hasWinner = true
            announceResult('Winner: ' + currentPlayer.getMarker())
            return 
        }
        // if(checkWinner()){
        //     announceResult('Winner: ' + currentPlayer.getMarkedSlots())
        //     return
        // }
        if(rounds == 0){
            announceResult('Draw!')
            isDraw = true;
            return
        }
        changeCurrentPlayer()
    }

    const getWinner = (square_index, new_letter) => {
        let row_index = Math.floor(square_index/3)*3
        let temp_row = board.slice(row_index, row_index+3)
        let winning = temp_row.every(letter => new_letter == letter)
        if(winning){
            return new_letter
        }

        let column_index = square_index % 3
        temp_col = board.filter((element, index) => {
            return (index % 3 == column_index)
        })
        winning = temp_col.every(letter =>  new_letter == letter)
        if(winning){
            return new_letter
        }

        let left_diagonal = [board[0],board[4],board[8]]
        let right_diagonal = [board[2],board[4],board[6]]
        
        winning = left_diagonal.every(letter =>  new_letter == letter)
        if(winning){
            return new_letter
        }
        winning = right_diagonal.every(letter =>  new_letter == letter)
        if(winning){
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

    let reset = () =>{
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