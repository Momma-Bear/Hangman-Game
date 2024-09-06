import * as readlinePromises from 'node:readline/promises';
import {ANSI} from './ansi.mjs';
import {HANGMAN_UI} from './hm_graphics.mjs';

const r1 = readlinePromises.createInterface({ input: process.stdin, output: process.stdout });
async function askQuestion(question) {
    return await r1.question(question);    
}
function ifPlayerGuessedLetter(answer) {
    return answer.length == 1;
}

let gameTrulyOver = false;
while (gameTrulyOver == false) {

const wordOptions = ["suggestion", "hospital", "coffee", "bonus", "farmer", "bedroom", "departure", "independence", "funeral", "boyfriend", "analyst", "orange", "science", "meat", "tooth", "platform", "paper", "analysis"];
const number = Math.random() * (wordOptions.length - 1);
const roundedNumber = Math.round(number);
let correctWord = wordOptions[roundedNumber].toLowerCase();
let guessedWord = "".padStart(correctWord.length, "_");
let gameOver = false;
let wasPlayerSuccessful = false;
let wrongGuessesLetters = [];
let wrongGuessesWords = [];
let nrOfTries = 0;

function drawWordDisplay(){
let wordDisplay = "";
for (let i = 0; i < correctWord.length; i++){
    if (guessedWord[i] != "_") {
        wordDisplay += ANSI.COLOR.GREEN;
    }
    else {
        wordDisplay += ANSI.RESET;
    }
    wordDisplay = wordDisplay + guessedWord[i] + " ";
}
return wordDisplay
}

function drawList(list, color) {
    let output = color;
    for (let i = 0; i < list.length; i++){
        output += list[i] + " ";
    }
    return output + ANSI.RESET;
}

function createDisplay() {
    console.log(ANSI.CLEAR_SCREEN);
    console.log(drawWordDisplay());
    console.log(drawList(wrongGuessesLetters, ANSI.COLOR.RED));
    console.log(drawList(wrongGuessesWords, ANSI.COLOR.RED));
    console.log(HANGMAN_UI[wrongGuessesLetters.length + wrongGuessesWords.length])
}

while (gameOver == false) {
    createDisplay();

    let answer = (await askQuestion("Guess a letter or word: ")).toLowerCase();
    
    while (wrongGuessesLetters.includes(answer) == true || wrongGuessesWords.includes(answer) == true || guessedWord.includes(answer) == true){
        answer = (await askQuestion("This guess has already been tried. Guess another letter or word: ")).toLowerCase();
    }

    

    if (answer == correctWord) {
        nrOfTries = nrOfTries + 1;
        gameOver = true;
        wasPlayerSuccessful = true;
    } else if (ifPlayerGuessedLetter(answer)) {
        nrOfTries = nrOfTries + 1;
        let originalWord = guessedWord;
        guessedWord = "";

        let isCorrect = false;
        for (let j = 0; j < correctWord.length; j++) {
            if (correctWord[j] == answer) {
                guessedWord += answer;
                isCorrect = true;
            } else {
                guessedWord += originalWord[j];
            }
        }
    if (isCorrect == false) {
        wrongGuessesLetters.push(answer);
    } else if (guessedWord == correctWord) {
        gameOver = true;
        wasPlayerSuccessful = true;
    }
    } else {
        nrOfTries = nrOfTries + 1;
        wrongGuessesWords.push(answer);
    }
    

    if (wrongGuessesLetters.length + wrongGuessesWords.length == HANGMAN_UI.length - 1) {
        gameOver = true;
    }
}

createDisplay();

if (wasPlayerSuccessful) {
    console.log(ANSI.COLOR.GREEN + "Congratulations, you've won!");
    console.log(ANSI.COLOR.YELLOW + "You guessed the word in " + ANSI.COLOR.BLUE + nrOfTries + ANSI.COLOR.YELLOW + " attempts.");
}
else if (wasPlayerSuccessful == false) {
    console.log(ANSI.COLOR.YELLOW + "Nice try.");
    console.log(ANSI.COLOR.RED + "You failed to guess the word in " + ANSI.COLOR.BLUE + nrOfTries + ANSI.COLOR.RED + " attempts.");
}

console.log(ANSI.RESET + "Game Over");
let tryAgain = (await askQuestion("Would you like to play again? (Yes/No): ")).toLowerCase();

if (tryAgain != "yes") {
    gameTrulyOver = true;
}
}
process.exit();

