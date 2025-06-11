const inputSlider = document.querySelector('[data-lengthSlider]');
const lengthDisplay = document.querySelector('[data-lengthNumber]');
const passwordDisplay = document.querySelector('[data-passwordDisplay]');
const copyBtn = document.querySelector('[data-copy]')
const copyMsg = document.querySelector('[data-copyMsg]');
const uppercaseCheck = document.querySelector('#uppercase');
const lowercaseCheck = document.querySelector('#lowercase');
const numbersCheck = document.querySelector('#numbers');
const symbolsCheck = document.querySelector('#symbols');
const indicator = document.querySelector('[data-indicator]');
const generateBtn = document.querySelector('.generateButton');
const allCheckBox = document.querySelectorAll("input[type=checkbox]")
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';



// initial values
let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
// set strength circle color to grey
setIndicator("#ccc");

/*
Functions to create : 
1) copyControl()
2) handleSlider()
3) generatePassword()
4) setIndicator() --> color --> red,green,grey, shadow
5) getRandomInteger(min, max)
6) getRandomUpperCase()
7) getRandomLowerCase()
8) getRandomNumber()
9) getRandomSymbol()
10) calculateStrength() 
*/


// set passwordLength 
// handleSlider() function reflects the passwordLength in UI
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    
    const mini = inputSlider.min;
    const maxi = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength-mini)*100 / (maxi-mini) ) + "% 100%";
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0 0 12px 1px ${color}`;
}

function getRndInteger(min, max) {
    // by doing Math.random() the number will be between 0 and 1, where 0 is inclusive but 1 is exclusive
    // by doing Math.random() * (max - min) the number will be between 0 and ( max-min) where 0 is inclusive and max-min is exclusive
    // now there is a possibility that number is a floating number so we do Math.floor(Math.random() * (max - min))
    // now the number will be between 0 to (max - min) but we want it to be min to max so what we'll do is we'll add min like this Math.floor(Math.random() * (max - min)) + min;
    return Math.floor(Math.random() * (max - min)) + min;
}


function generateRandomNumber() {
    return getRndInteger(0, 9);
}

function generateLowerCase() {
    return String.fromCharCode(getRndInteger(97, 123));
}

function generateUpperCase() {
    return String.fromCharCode(getRndInteger(65, 91));
}

function generateSymbol() {
    // charAt[randum] tells us that what character is at the particular index
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hassym = false;
    // it means that all the above four boxes are not checked right now that's why we set them to false in the starting 

    if (uppercaseCheck.checked) {
        hasUpper = true;
    }

    if (lowercaseCheck.checked) {
        hasLower = true;
    }

    if (numbersCheck.checked) {
        hasNum = true;
    }

    if (symbolsCheck.checked) {
        hassym = true;
    }

    if (hasUpper && hasLower && (hasNum || hassym) && passwordLength >= 8) {
        setIndicator("#0f0");
    }

    else if ((hasLower || hasUpper) && (hasNum || hassym) && passwordLength >= 6) {
        setIndicator("#ff0");
    }

    else {
        setIndicator("#f00");
    }
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch (e) {
        copyMsg.innerText = "Failed";
    }
    //to make copy wala span visible 
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);

}



/*
NEED FOR EVENT LISTENERS : 
1. for slider
2. for generate password
3. copy button
*/

function shufflePassword(array) {
    // Fisher Yates Method ---> you can use this method on an array to shuffle it
    for(let i = array.length-1; i > 0; i--){
        // random j, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        // swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked) {
            checkCount++;
        }
    });

    //special condition - if we have selected that the password length should be 1 by using the slider but we have checked all the boxes then the password should be of length 4 at least, it means that if your password's length is less than the check count the password length should be equal to check count

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})


inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
});


copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value) {
        copyContent();
    }
});


generateBtn.addEventListener('click', () => {
    //none of the checkbox are selected
    if (checkCount <= 0) {
        return;
    }

    //special case
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    // let's start the journey to find a new password
    console.log("Starting the Journey");
    // remove old password
    password = "";

    // let's put the stuff mentioned by the checkboxes

    // if(uppercaseCheck.checked){
    //     password += generateUpperCase();
    // }

    // if(lowercaseCheck.checked){
    //     password += generateLowerCase();
    // }

    // if(numbersCheck.checked) {
    //     password += generateRandomNumber(); 
    // }

    // if(symbolsCheck.checked) {
    //     password += generateSymbol();
    // }

    let funcArr = [];

    if (uppercaseCheck.checked) {
        funcArr.push(generateUpperCase);
    }

    if (lowercaseCheck.checked) {
        funcArr.push(generateLowerCase);
    }

    if (numbersCheck.checked) {
        funcArr.push(generateRandomNumber);
    }

    if (symbolsCheck.checked) {
        funcArr.push(generateSymbol);
    }

    // compulsory addition
    for(let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }
    console.log("Compulsory addition done");

    // remaining addition
    for(let i = 0; i < passwordLength-funcArr.length; i++){
        let randIndex = getRndInteger(0, funcArr.length);
        console.log("randIndex" + randIndex);
        password += funcArr[randIndex]();
    }
    console.log("remaining addition done");



    // shuffle the password
    password = shufflePassword(Array.from(password));
    console.log("Shuffle done");


    // Show in UI
    passwordDisplay.value = password;
    console.log("UI addition done");


    // calculate strength
    calcStrength();

});