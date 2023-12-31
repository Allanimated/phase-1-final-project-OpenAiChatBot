//global variables
const API_KEY = ""

function createChatDiv(message, className) {
    const chatDiv = document.createElement('div')
    chatDiv.classList.add(className)
    if (className === "usermessage") {
        chatDiv.innerHTML = `
            <span><i class="bi bi-person-circle"></i></span>
            <p>${message}</p>
        `
    } else {
        chatDiv.innerHTML = `
            <span><i class="bi bi-robot"></i></span>
            <p>${message}</p>
        `
    }

    return chatDiv;

}

function generateResponse(message, generatingResponse) {
    const responseElement = generatingResponse.querySelector('p')
    const configurationObject = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            "model": "gpt-3.5-turbo",
            "temperature": 0.6,
            "messages": [
            {
                "role": "user",
                "content": `${message}`
            },
            ],
        })
    }
    fetch("https://api.openai.com/v1/chat/completions", configurationObject)
        .then(resp => resp.json())
        .then(data => {
            //update div content with response
            responseElement.textContent = data.choices[0].message.content;

        })
        .catch(error => {
            
            responseElement.textContent = `OOPS! Something went wrong, try again...`

        })
}

function handleChat() {
    const userInput = document.querySelector('#textarea')
    const message = userInput.value.trim()
    const chatBox = document.querySelector(".chatbox")
    //return nothing when userinput is empty
    if (!message) return;
    //append created div to chatbox
    chatBox.appendChild(createChatDiv(message, "usermessage"))
    //clear input field
    userInput.value =  ''

    setTimeout(() => {
        const generatingResponse = createChatDiv('Generating response..', "botmessage")
        chatBox.appendChild(generatingResponse)
        generateResponse(message, generatingResponse)
    }, 500)
}

//image app functions

function generateImages(message) {
    const configurationObject = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            "prompt": `${message}`,
            "n": 3,
            "size": "1024x1024"
        })

    }
    fetch("https://api.openai.com/v1/images/generations", configurationObject)
    .then(resp => resp.json())
    .then(images => {
        //pass images to be updated to the DOM 
        createImageCard(images);
    })
    .catch(error => {
        const cardDeck = document.querySelector(".card-deck")
        const h5 = document.createElement('h5');
        h5.innerText = "OOOPPSS! Looks like something went wrong. Please try again.."
        cardDeck.appendChild(h5)
    })
}

function createImageCard(images) {
    const cardDeck = document.querySelector(".card-deck")
    if (!images) return; 
    images.data.forEach(image => {
        const imageCard = document.createElement('img')
        imageCard.src = image.url;
        cardDeck.appendChild(imageCard) 
    });
}

function handleImage() {
    const userInput = document.querySelector('#imagePrompt')
    const message = userInput.value.trim();
    //return nothing when userinput is empty
    if (!message) return;
    //post message to api
    generateImages(message);
    //alert user 
    userInput.value = "Generating images, please wait...."
    setTimeout(() => {
        //clear input field
        userInput.value=""
    }, 9000);
   
}

/*audio functions*/

//communicate to whisper API
function generateAudioTranscription(audio) {
    console.log(audio);
    
    const formData = new FormData();
    formData.append('model', 'whisper-1'); // Add the "model" parameter
    formData.append('file', audio);
    formData.append("language", "en")


    const configurationObject = {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
        },
        body: formData,
    }

    fetch("https://api.openai.com/v1/audio/transcriptions", configurationObject)
    .then(resp => resp.json())
    .then(transcription => {
        const transcript = document.querySelector('#transcript')
        transcript.textContent = transcription.text; 
    })
    .catch(error => {
        console.log(error.message);
    })
}


//get user input
function receiveUserAudio(e) {
    //prevent default behaviour
    e.preventDefault();
    //get audio
    const audioElement = document.querySelector('#audio')
    const audio = audioElement.files[0]
    //check for audio input
    if (!audio) {
        alert('please choose an audio file')
        return;
    }
    // check if the size is less than 25MB
    if (audio.size > 25 * 1024 **2) {
        alert("Please upload an audio file less than 25MB");
        return;
    }
    //pass audio to fetch function
    generateAudioTranscription(audio);
}

function toggleApps(e) {
    const homePageSection = document.querySelector(".homepage");
    const chatBotSection = document.querySelector(".chatbotapp");
    const imageappSection = document.querySelector(".imageapp");
    const audioappSection =document.querySelector(".audioapp");
    switch (this.value) {
        case 'chatty':
            chatBotSection.style.display = "block"
            homePageSection.style.display = "none"
            break;
        case 'mega':
            homePageSection.style.display = "none";
            imageappSection.style.display = "block";
            break;
        case 'hermes':
            homePageSection.style.display = "none";
            audioappSection.style.display = "block"
            break;

        default:
            homePageSection.style.display = "block"
            break;
    }
}

function returnToHomePage() {
    location.reload();
}

document.addEventListener('DOMContentLoaded', (e) => {
    //display
    const chatBotSection = document.querySelector(".chatbotapp");
    chatBotSection.style.display = "none"
    const homePageSection = document.querySelector(".homepage");
    homePageSection.style.display = "block"
    const imageappSection = document.querySelector(".imageapp");
    imageappSection.style.display = "none"
    const audioappSection =document.querySelector(".audioapp");
    audioappSection.style.display = "none"
    //app elements
    const sendBtn = document.querySelector('#sendbtn');
    const imageBtn = document.querySelector('#imagebtn');
    const audiouploadform = document.querySelector('#audiouploadform');
    const buttons = document.querySelectorAll('.btn-md')
    const logos =document.querySelectorAll('img')
    // events
    sendBtn.addEventListener('click', handleChat);
    imageBtn.addEventListener('click', handleImage);
    audiouploadform.addEventListener('submit', receiveUserAudio)
    buttons.forEach(button => {
        button.addEventListener('click', toggleApps)
    })
    logos.forEach(logo => {
        logo.addEventListener('click', returnToHomePage)
    })

})

 

