const prompt = require("prompt-sync")();

const ROWS = 3;
const COLUMNS = 3;

const SYMBOLS_COUNT = {
    "A": 2,
    "B": 4,
    "C": 6,
    "D": 8
};

const SYMBOL_VALUES = {
    "A": 5,
    "B": 4,
    "C": 3,
    "D": 2
};

// Function to take user input about total money they want to play with.
// Logs invalid user inputs (not numbers or negative numbers)
// Loops until user enters valid amount of money
const userDeposit = () => {
    while(true) {
        const depositAmount = prompt("Enter your initial money pool amount: ");
        const integerDepositAmount = parseFloat(depositAmount);

        if (isNaN(integerDepositAmount) || integerDepositAmount <= 0) {
            console.log("Invalid deposit amount, try again!");
        }
        else {
            return integerDepositAmount;
        }
    }
};

// Function to take user input about the number of lines they want to bet on in the game.
// Logs invalid user inputs (not numbers, negative numbers or numbers out of bounds (<=1 or >=3))
// Loops until user enters valid amount of lines
const getNumberOfLines = () => {
    while(true) {
        const lines = prompt("Enter the number of lines to bet on (1-3): ");
        const numberOfLines = parseFloat(lines);

        if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
            console.log("Invalid number of lines, try again!");
        }
        else {
            return numberOfLines;
        }
    }
};

// Function to take user input about the amount of bet they want to place in the game.
// Logs invalid user inputs (not numbers, negative numbers or numbers out of bounds (>=balance))
// Loops until user enters valid amount of bet
const getUserBet = (balance, lines) => {
    while(true) {
        const bet = prompt("Enter the bet per line: ");
        const amountOfBet = parseFloat(bet);

        if (isNaN(amountOfBet) || amountOfBet <= 0 || amountOfBet > (balance / lines)) {
            console.log("Invalid bet, try again!");
        }
        else {
            return amountOfBet;
        }
    }
};

// Function to randomly inpute symbols to wheel's individual reels
const spinWheel = () => {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }

    const reels = [];
    for (let i = 0; i < COLUMNS; i++) {
        reels.push([]);
        const reelSymbols = [...symbols];
        for (let j = 0; j < ROWS; j++) {
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1); 
        }
    }

    return reels;
};

// Function to convert column wise symbol representation to 
// row wise for easier comparison and visualisation
const transpose = (reels) => {
    const rows = [];
    for (let i = 0; i < ROWS; i++) {
        rows.push([]);
        for (let j = 0; j < COLUMNS; j++) {
            rows[i].push(reels[j][i]);
        }
    }

    return rows;
};

// Function to print obtained rows in a stylized manner
const printRows = (rows) => {
    for (const row of rows) {
        let rowString = "";
        for (const [i, symbol] of row.entries()) {
            rowString += symbol;
            if (i != row.length - 1) {
                rowString += " | ";
            }
        }
        console.log(rowString);
    }
};

// Function to calculate user winnings based on symbol multiplier defined above
const getWinnings = (rows, bet, lines) => {
    let winnings = 0;
    for (let row = 0; row < lines; row++) {
        const symbols = rows[row];
        let sameCheckPassed = true;
        for (const symbol of symbols) {
            if ( symbol != symbols[0]) {
                sameCheckPassed = false;
                break;
            }
        }
        if (sameCheckPassed) {
            winnings += bet * SYMBOL_VALUES[symbols[0]]
        }
    }

    return winnings;
}

const round = () => {
    let balance = userDeposit();

    while(true) {
        console.log("You have a balance of $" + balance);
        const numberOfLines = getNumberOfLines();
        const userBet = getUserBet(balance, numberOfLines);
        balance -= userBet * numberOfLines;
        const reels = spinWheel();
        const rows = transpose(reels);
        printRows(rows);
        const winnings = getWinnings(rows, userBet, numberOfLines);
        balance += winnings;
        console.log("You won $" + winnings.toString());

        if (balance <= 0) {
            console.log("You ran out of money!");
            break;
        }

        const playAgain = prompt("Play Again (y/n)?: ");
        if (playAgain != "y") {
            break;
        }
    }
}



round();

