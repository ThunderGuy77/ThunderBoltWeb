/* SLAIDE - FUNCTIONAL */
//prints slaide or user chats
function print(passText = "text", passType = "slaide") {
    if (passType === "system" && !devMode) {
        return false;
    }
    let newLine = document.createElement('p');
    //add either slaide or user class
    if (passType === "slaide") {
        newLine.classList.add('slaide');
        if(!(passText === "my name is slaide")){
            receiveNoise.play();
        }
    } else if (passType === "system" || passType === "systempass") {
        newLine.classList.add('system');
        receiveNoise.play();
    } else {
        newLine.classList.add('user');
        sendNoise.play();
    }
    newLine.textContent = passText;

    let mainSection = document.getElementById('messageArea');
    mainSection.appendChild(newLine);

    scroll();
}

function scroll() {
    window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
    });
}

//user actions
function sendChat() {
    //print
    let input = document.getElementById('chat').value;
    if (!(input === "")) {
        print(input, "user");

        //clear
        document.getElementById('chat').value = "";

        //generate response
        generate(input);
    }
}

//enter key send
let getText = document.getElementById("chat");

getText.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("send").click();
    }
});

//chat sounds
const sendNoise = new Audio("/portfolio/slaide/assets/Send.wav");
const receiveNoise = new Audio("/portfolio/slaide/assets/Receive.wav");





/* SLAIDE - ACTIONS */
function welcome() {
    print("my name is slaide");
}

function answer(answer = "i didn't understand that") {
    print(answer);
}

//go to readSentence function to continue main algorithm
function generate(passInput = "hello") {
    if(!checkCommands(passInput)){
        readSentence(passInput);
    }
}





/* SLAIDE - DATA */
//emotions
let ltAffection = 0; //long term affection

let happiness = 0; //negative = sad; positive = happy
let peace = 0; //negative = angry; positive = lighthearted
let confidence = 0; //negative = confused; positive = confident
let comfort = 0; //negative = uncomfortable; positive = comfortable
let excitement = 0; //negative = bored; positive = excited

//definition branches
//slaide uses complex arrays to store word data
let wordTree = [
    [["hello","interjection","greeting",1], //word, part of speech, definition, word version
    [5,10,1,3], //happiness, peace, confidence, comfort
    ["hi","hey","greetings"], //synonyms
    ["bye","farewell"], //antonyms
    [0,0,0,0,0,0,0,0,0], //part of speech guess, use to update main part of speech (noun, pronoun, verb, adverb, adjective, preposition, conjunction, determiner, interjection)
    ["there"]], //commonly associated with

    [["slaide","noun","me",1],
    [0,0,1,0],
    ["me"],
    [],
    [0,0,0,0,0,0,0,0,0],
    ["hi"]]
];

//sentence structure
//slaide records user sentence structure patterns ([beforeWordArray],[afterWordArray])
let posTree = [
    [[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0]], //noun
    [[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0]], //pronoun
    [[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0]], //verb
    [[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0]], //adverb
    [[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0]], //adjective
    [[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0]], //preposition
    [[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0]], //conjunction
    [[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0]], //determiner
    [[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0]]  //interjection
];

//context list slaide can use to store main key words in coversation
let context = [];

//slaide settings
let externalInput = true;

//slade extra
let commandWarning = false;
let devMode = false;





/* SLAIDE - ALGORITHMS */
//check for any commands
function checkCommands(passInput) {
    if (passInput.substring(0,1) === "/") {
        let command = passInput.substring(1);
        if(!commandWarning){
            print("*Please note commands are not read by Slaide as part of the conversation. Therefore, you cannot directly speak to Slaide about the commands, as Slaide will not understand.","systempass");
            commandWarning = true;
        }
        if (command === "stats") {
            print("Affection: " + ltAffection);
            print("Happiness: " + happiness);
            print("Peace: " + peace);
            print("Confidence: " + confidence);
            print("Comfort: " + comfort);
            print("Excitement: " + excitement);
            print("Learned " + wordTree.length + " Words"); //replace this with word tree size
            print("Context: " + context);
        } else if (command === "import") {
            print("i cant do that yet");
        } else if (command === "export") {
            print("i cant do that yet");
        } else if (command === "toggleinputexternal") {
            if(externalInput){
                externalInput = false;
                print("external data influence is off");
            } else {
                externalInput = true;
                print("external data influence is on");
            }
        } else if (command === "dev" || command === "devmode" || command === "toggledevmode") {
            if(devMode){
                devMode = false;
                print("developer mode disabled");
            } else {
                devMode = true;
                print("developer mode enabled");
            }
        } else if (command === "kill"){
            print("is that a reference");
        } else if (command === "scroll"){
            scroll();
        } else if (command === "help"){
            print("i have certain commands that you can use to access information about me. the commands that you can use right now are \"stats\", \"scroll\", and \"toggleinputexternal\"");
        } else {
            print("i dont know that command");
        }
        return true;
    }
    return false;
}

let fetchList = []; //fetchList stores all the API returns
let words = []
//break down input
function readSentence(passInput) {
    words = separateWords(passInput);
    words = cleanWords(words);
    fetchList = [];

    //call api to check words to store in tempDefList
    for(i = 0; i < words.length; i++){
        if(separateChars.indexOf(words[i]) > -1) {
            fetchList.push(null, i);
        } else {
            let target = "https://api.dictionaryapi.dev/api/v2/entries/en/" + words[i];
            getTextFetch(target, i);
        }
    }
    
    print("fetching data from api", "system");
    waitForConditionThenExecute(conditionMet, analyzeWords);
}

const legalChars = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
const separateChars = [".","!","?"];

//organizes words into a list; only some characters other than letters are allowed
function separateWords(passInput) {
    let temp = [];
    let joiner = "";

    for(i = 0; i < passInput.length; i++){
        let j = passInput.substring(i,i+1);
        if ((j === " ") && (!(joiner === ""))) {
            temp.push(joiner);
            joiner = "";
        } else {
            if (legalChars.includes(j)) {
                joiner += j;
            } else if (separateChars.includes(j)) {
                temp.push(joiner);
                joiner = "";
                temp.push(j);
            }
        }
    }
    if (!(joiner === "")) {
        temp.push(joiner);
    }
    return temp;
}

function cleanWords(words) {
    let temp = [];
    for(i = 0; i < words.length; i++){
        let valid = true;
        for (j = 0; j < words[i].length; j++) {
            if (legalChars.indexOf(words[i].substring(j,j+1)) === -1 && separateChars.indexOf(words[i].substring(j,j+1)) === -1) {
                valid = false;
                break;
            }
        }
        if (valid && !(words[i] === "")) {
            temp.push(words[i]);
        }
    }
    return temp;
}

//used to wait until all the words have been added to fetchList
function waitForConditionThenExecute(condition, successCallback, interval = 100) {
    function checkCondition() {
        if (condition()) {
            successCallback();
        } else {
            setTimeout(checkCondition, interval);
        }
    }
    checkCondition();
}
function conditionMet() {
    return fetchList.length >= words.length;
}
async function getTextFetch(file, index) {
    let myObject = await fetch(file);
    let myText = await myObject.text();
    fetchList.push(myText, index); //adds the API result to the list
}

function organize(passFetch) {
    let arr = [];
    for(i = 0; i < passFetch.length/2; i++) {
        arr.push(passFetch[passFetch.indexOf(i)-1]);
    }
    return arr;
}

//look up words from knowledge and api results and process meaning
function analyzeWords() {
    fetchList = organize(fetchList); //sorts the fetchList to original order
    print("successfully fetched api data, length " + fetchList.length, "system");

    /*
    based on the text, each word will be rated with the highest meaning likelihood.
    after each word is assessed, the entire message will be assessed. the best
    combination of meanings will be selected to determine the meaning.
    */
    likelyMeanings = [];

    for(currentWord = 0; currentWord < words.length; currentWord++) {
        let currentFetch = fetchList[currentWord];
        if (typeof currentFetch === "string" && !(currentFetch.substring(0,1) === "{")) { //words to get from api
            let wordObject = JSON.parse(currentFetch);
            let meanings = wordObject[0].meanings; //meanings stores the array of meanings
            
            likelyMeanings.push(selectMeaning(words, currentWord, meanings));

        } else { //words not understood
            likelyMeanings.push(-1);
            
        }
    }
    print("likely meanings (in order of words): " + likelyMeanings, "system");

    //use likelyMeanings to break down the sentence
    let advancedMeanings = advancedInterpretation(words);

    answer();
}

//chooses meaning based on common english patterns
const partsOfSpeech = ["noun","pronoun","verb","adverb","adjective","preposition","conjunction","determiner","interjection"];
function selectMeaning(words, index, meanings) {
    let guessPOS = [0, 0, 0, 0, 0, 0, 0, 0, 0]; //points assigned for the guess

    //check previous word
    if (index > 0) {
        let tryWord = getFirstPOS(index - 1);
        if (!(tryWord === null)) {
            if(tryWord === "noun") {
                guessPOS[0] += 7; //noun chance
                guessPOS[1] += 6; //pronoun chance
                guessPOS[2] += 5; //verb chance
                guessPOS[3] += 4; //adverb chance
                guessPOS[4] += 8; //adjective chance
                guessPOS[5] += 3; //preposition chance
                guessPOS[6] += 2; //conjunction chance
                guessPOS[7] += 9; //determiner chance
                guessPOS[8] += 1; //interjection chance
            }
            if(tryWord === "pronoun") {
                guessPOS[0] += 7; //noun chance
                guessPOS[1] += 6; //pronoun chance
                guessPOS[2] += 5; //verb chance
                guessPOS[3] += 4; //adverb chance
                guessPOS[4] += 8; //adjective chance
                guessPOS[5] += 3; //preposition chance
                guessPOS[6] += 2; //conjunction chance
                guessPOS[7] += 9; //determiner chance
                guessPOS[8] += 1; //interjection chance
            }
            if(tryWord === "verb") {
                guessPOS[0] += 8; //noun chance
                guessPOS[1] += 9; //pronoun chance
                guessPOS[2] += 6; //verb chance
                guessPOS[3] += 5; //adverb chance
                guessPOS[4] += 7; //adjective chance
                guessPOS[5] += 4; //preposition chance
                guessPOS[6] += 3; //conjunction chance
                guessPOS[7] += 2; //determiner chance
                guessPOS[8] += 1; //interjection chance
            }
            if(tryWord === "adverb") {
                guessPOS[0] += 6; //noun chance
                guessPOS[1] += 5; //pronoun chance
                guessPOS[2] += 7; //verb chance
                guessPOS[3] += 8; //adverb chance
                guessPOS[4] += 9; //adjective chance
                guessPOS[5] += 4; //preposition chance
                guessPOS[6] += 2; //conjunction chance
                guessPOS[7] += 3; //determiner chance
                guessPOS[8] += 1; //interjection chance
            }
            if(tryWord === "adjective") {
                guessPOS[0] += 7; //noun chance
                guessPOS[1] += 6; //pronoun chance
                guessPOS[2] += 5; //verb chance
                guessPOS[3] += 4; //adverb chance
                guessPOS[4] += 8; //adjective chance
                guessPOS[5] += 3; //preposition chance
                guessPOS[6] += 2; //conjunction chance
                guessPOS[7] += 9; //determiner chance
                guessPOS[8] += 1; //interjection chance
            }
            if(tryWord === "preposition") {
                guessPOS[0] += 8; //noun chance
                guessPOS[1] += 9; //pronoun chance
                guessPOS[2] += 6; //verb chance
                guessPOS[3] += 5; //adverb chance
                guessPOS[4] += 7; //adjective chance
                guessPOS[5] += 4; //preposition chance
                guessPOS[6] += 3; //conjunction chance
                guessPOS[7] += 2; //determiner chance
                guessPOS[8] += 1; //interjection chance
            }
            if(tryWord === "conjunction") {
                guessPOS[0] += 9; //noun chance
                guessPOS[1] += 8; //pronoun chance
                guessPOS[2] += 6; //verb chance
                guessPOS[3] += 5; //adverb chance
                guessPOS[4] += 7; //adjective chance
                guessPOS[5] += 4; //preposition chance
                guessPOS[6] += 2; //conjunction chance
                guessPOS[7] += 3; //determiner chance
                guessPOS[8] += 1; //interjection chance
            }
            if(tryWord === "determiner") {
                guessPOS[0] += 8; //noun chance
                guessPOS[1] += 7; //pronoun chance
                guessPOS[2] += 6; //verb chance
                guessPOS[3] += 5; //adverb chance
                guessPOS[4] += 9; //adjective chance
                guessPOS[5] += 4; //preposition chance
                guessPOS[6] += 3; //conjunction chance
                guessPOS[7] += 2; //determiner chance
                guessPOS[8] += 1; //interjection chance
            }
            if(tryWord === "interjection") {
                guessPOS[0] += 9; //noun chance
                guessPOS[1] += 8; //pronoun chance
                guessPOS[2] += 6; //verb chance
                guessPOS[3] += 5; //adverb chance
                guessPOS[4] += 7; //adjective chance
                guessPOS[5] += 4; //preposition chance
                guessPOS[6] += 2; //conjunction chance
                guessPOS[7] += 3; //determiner chance
                guessPOS[8] += 1; //interjection chance
            }
        }
    }
    //check next word
    if (index < meanings.length - 1) {
        let tryWord = getFirstPOS(index + 1);
        if (!(tryWord === null)) {
            if(tryWord === "noun") {
                guessPOS[0] += 8; //noun chance
                guessPOS[1] += 3; //pronoun chance
                guessPOS[2] += 5; //verb chance
                guessPOS[3] += 4; //adverb chance
                guessPOS[4] += 9; //adjective chance
                guessPOS[5] += 7; //preposition chance
                guessPOS[6] += 2; //conjunction chance
                guessPOS[7] += 6; //determiner chance
                guessPOS[8] += 1; //interjection chance
            }
            if(tryWord === "pronoun") {
                guessPOS[0] += 5; //noun chance
                guessPOS[1] += 3; //pronoun chance
                guessPOS[2] += 9; //verb chance
                guessPOS[3] += 4; //adverb chance
                guessPOS[4] += 6; //adjective chance
                guessPOS[5] += 8; //preposition chance
                guessPOS[6] += 2; //conjunction chance
                guessPOS[7] += 7; //determiner chance
                guessPOS[8] += 1; //interjection chance
            }
            if(tryWord === "verb") {
                guessPOS[0] += 8; //noun chance
                guessPOS[1] += 7; //pronoun chance
                guessPOS[2] += 3; //verb chance
                guessPOS[3] += 9; //adverb chance
                guessPOS[4] += 4; //adjective chance
                guessPOS[5] += 6; //preposition chance
                guessPOS[6] += 2; //conjunction chance
                guessPOS[7] += 5; //determiner chance
                guessPOS[8] += 1; //interjection chance
            }
            if(tryWord === "adverb") {
                guessPOS[0] += 3; //noun chance
                guessPOS[1] += 4; //pronoun chance
                guessPOS[2] += 8; //verb chance
                guessPOS[3] += 7; //adverb chance
                guessPOS[4] += 9; //adjective chance
                guessPOS[5] += 6; //preposition chance
                guessPOS[6] += 2; //conjunction chance
                guessPOS[7] += 5; //determiner chance
                guessPOS[8] += 1; //interjection chance
            }
            if(tryWord === "adjective") {
                guessPOS[0] += 9; //noun chance
                guessPOS[1] += 4; //pronoun chance
                guessPOS[2] += 6; //verb chance
                guessPOS[3] += 7; //adverb chance
                guessPOS[4] += 8; //adjective chance
                guessPOS[5] += 5; //preposition chance
                guessPOS[6] += 2; //conjunction chance
                guessPOS[7] += 3; //determiner chance
                guessPOS[8] += 1; //interjection chance
            }
            if(tryWord === "preposition") {
                guessPOS[0] += 9; //noun chance
                guessPOS[1] += 8; //pronoun chance
                guessPOS[2] += 3; //verb chance
                guessPOS[3] += 5; //adverb chance
                guessPOS[4] += 6; //adjective chance
                guessPOS[5] += 4; //preposition chance
                guessPOS[6] += 2; //conjunction chance
                guessPOS[7] += 7; //determiner chance
                guessPOS[8] += 1; //interjection chance
            }
            if(tryWord === "conjunction") {
                guessPOS[0] += 9; //noun chance
                guessPOS[1] += 8; //pronoun chance
                guessPOS[2] += 7; //verb chance
                guessPOS[3] += 4; //adverb chance
                guessPOS[4] += 5; //adjective chance
                guessPOS[5] += 4; //preposition chance
                guessPOS[6] += 3; //conjunction chance
                guessPOS[7] += 6; //determiner chance
                guessPOS[8] += 1; //interjection chance
            }
            if(tryWord === "determiner") {
                guessPOS[0] += 9; //noun chance
                guessPOS[1] += 7; //pronoun chance
                guessPOS[2] += 6; //verb chance
                guessPOS[3] += 4; //adverb chance
                guessPOS[4] += 8; //adjective chance
                guessPOS[5] += 5; //preposition chance
                guessPOS[6] += 2; //conjunction chance
                guessPOS[7] += 3; //determiner chance
                guessPOS[8] += 1; //interjection chance
            }
            if(tryWord === "interjection") {
                guessPOS[0] += 8; //noun chance
                guessPOS[1] += 6; //pronoun chance
                guessPOS[2] += 4; //verb chance
                guessPOS[3] += 5; //adverb chance
                guessPOS[4] += 7; //adjective chance
                guessPOS[5] += 3; //preposition chance
                guessPOS[6] += 1; //conjunction chance
                guessPOS[7] += 2; //determiner chance
                guessPOS[8] += 9; //interjection chance
            }
        }
    }
    //other cases
    if (words.length === 1) {
        guessPOS[8] += 18; //lots of one-word messages are interjections
    }

    //populate wordRatings via sorting the guessPOS
    let wordRatings = [];
    for (i = 0; i < guessPOS.length; i++) {
        let max = -1;
        let maxID = -1;
        for (j = i; j < guessPOS.length; j++) {
            if (guessPOS[j] > max) {
                max = guessPOS[j];
                maxID = j;
            }
        }
        wordRatings.push(partsOfSpeech[maxID]);
    }

    //select the meaning with the most accurate part of speech
    let selectMeaning = null;
    for (i = 0; i < wordRatings.length; i++) {
        for(j = 0; j < meanings.length; j++) {
            if(wordRatings[i] === meanings[j].partOfSpeech){
                selectMeaning = j;
                break;
            }
        }
        if(!(selectMeaning === null)) {
            break;
        }
    }
    if(selectMeaning === null) {
        selectMeaning = 0;
    }
    
    //return selected meaning
    return selectMeaning;
}

//get the JSON object from fetchList for the word
function getFirstPOS(wordIndex) {
    let currentFetch = fetchList[wordIndex];
    let subMeanings;
    if (typeof currentFetch === "string" && !(currentFetch.substring(0,1) === "{")) { //check if valid word
        let wordObject = JSON.parse(currentFetch);
        subMeanings = wordObject[0].meanings;
    } else {
        return null; //invalid word
    }
    //return first part of speech listed for the word
    return subMeanings[0].partOfSpeech;
}

//chooses most likely interpretation based on sentence structure and training
function advancedInterpretation(words) {
    for(thisWord = 0; thisWord < words.length; thisWord++){
        //analyze previous cases (training)
        let guessPOSID = []; //guesses on all POS
        let currentFetch = fetchList[thisWord];
        let subMeanings;
        let wordObject;
        if (typeof currentFetch === "string" && !(currentFetch.substring(0,1) === "{")) { //check if valid word
            wordObject = JSON.parse(currentFetch);
            subMeanings = wordObject[0].meanings;
        } else {
            wordObject = null; //invalid word
            subMeanings = 0;
        }
        for (thisPOS = 0; thisPOS < subMeanings.length; thisPOS++){ //run through all possible parts of speech
            let likelihood = [0,0,0,0,0,0,0,0,0];
            let pos = getFirstPOS(thisPOS);
            if (typeof pos != null) {
                pos = partsOfSpeech.indexOf(pos); //number from pos word
                if (thisPOS > 0) { //check before word
                    for (j = 0; j < likelihood.length; j++) {
                        likelihood[j] += posTree[pos][0][j];
                    }
                }
                if (thisPOS < likelihood.length-1) { //check after word
                    for (j = 0; j < likelihood.length; j++) {
                        likelihood[j] += posTree[pos][1][j];
                    }
                }
            }
            let max = 0;
            let maxID = -1;
            for(i = 0; i < likelihood.length; i++) {
                if(likelihood[i] > max){
                    max = likelihood[i];
                    maxID = i;
                }
            }

            if(wordObject != null) {
                guessPOSID.push(maxID); //guess
            } else {
                guessPOSID.push(-1);
            }

            console.log(guessPOSID);
        }
        
        //analyze sentence structure


        //use sentence structure to determine most likely meaning


        //use knowledge of previous words to 
    }
}