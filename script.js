addEventListener('DOMContentLoaded', () => {

    let wordContainer = document.querySelector('.container-word');
    let characterContainer = document.querySelector('.character-container');
    let triesCounter = document.getElementById('tries-counter');
    let wrongChars = document.getElementById('mistakes-counter');
    let buttonReset = document.getElementById('button-reset');
    let buttonRandom = document.getElementById('button-random');


    let currentWord = '';
    let scrambledWord = '';
    let generalIndex = 0;

    let tempTriesCounter = 0;

    const url = 'https://random-word-api.p.rapidapi.com/get_word';
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '911df0407emsh37eff4c710c6fbdp18fe3cjsn94b00785927b',
            'x-rapidapi-host': 'random-word-api.p.rapidapi.com'
        }
    };

    //obtener la palabra
    async function getWord() {
        try {
            console.log('Fetching word...');
            const response = await fetch(url, options);
            const result = await response.json();
            currentWord = result.word;
            scrambledWord = shuffleWord(currentWord);
            createWordBox(scrambledWord);

        } catch (error) {
            console.error(error);
        }
    }

    // mezclar la palabra
    function shuffleWord(word) {
        const wordArray = word.split('');
        for (let i = wordArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [wordArray[i], wordArray[j]] = [wordArray[j], wordArray[i]];
        }
        return wordArray.join('');
    }

    //crear cajas de caracteres de la palabra
    function createWordBox(word) {
        for (let i = 0; i < word.length; i++) {


            let wordBox = document.createElement('span');
            //fill the box with the letters of the word
            wordBox.classList.add('word-box');
            wordBox.textContent = word[i];
            wordContainer.appendChild(wordBox);

            // Create the blank boxes for the characters
            let charBox = document.createElement('span');
            charBox.classList.add('char-box');
            characterContainer.appendChild(charBox);

            // Add event listener to the word box
            wordBox.addEventListener('click', () => checkCorrectCharacter(wordBox.textContent));

        }
    }

    async function checkCorrectCharacter(character) {
        console.log(character)
        console.log(currentWord)
        if (character === currentWord[generalIndex]) {
            console.log('Correct character');
            // Selecciona la casilla vacía correspondiente y actualiza su contenido
            let charBoxes = document.querySelectorAll('.char-box');
            charBoxes[generalIndex].textContent = character;
            generalIndex++;
            if (generalIndex === currentWord.length) {
                setTimeout( () => {
                    alert('You Win!');
                    newWord(); 
                }, 1000);
            }
        } else {

            console.log('Incorrect character');
            tempTriesCounter++;
            triesCounter.textContent = `${tempTriesCounter}/5`;
            console.log(tempTriesCounter);
            

            if (tempTriesCounter === 1) {
                wrongChars.textContent = `${character}`; //first wrong character

            } else {
                wrongChars.textContent = wrongChars.textContent.concat(`, ${character}`);
            }
            
            if (tempTriesCounter === 5) {
                setTimeout( () => {
                    alert('You lose!');
                    newWord(); 
                }, 1000);
            
            }
        }
    }

    function resetGame() {
        let charBoxes = document.querySelectorAll('.char-box');
        charBoxes.forEach(charBox => charBox.textContent = '');

        triesCounter.textContent = "0/5";
        wrongChars.textContent = "";
        generalIndex = 0;
        tempWrongChars = "";
        tempTriesCounter = 0;
    }


    function newWord() {
        characterContainer.innerHTML = '';
        wordContainer.innerHTML = '';
        triesCounter.textContent = "0/5";
        wrongChars.textContent = "";

        generalIndex = 0;

        tempWrongChars = "";
        tempTriesCounter = 0;

        getWord();
    }

    buttonReset.addEventListener('click', resetGame);
    buttonRandom.addEventListener('click', newWord);


    getWord();
});