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
    const API_KEY = "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"
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
            console.log(data.choices[0].message.content);
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
        console.log(generatingResponse);
        generateResponse(message, generatingResponse)
    }, 500)
}



document.addEventListener('DOMContentLoaded', (e) => {
    const sendBtn = document.querySelector('#sendbtn');
    sendBtn.addEventListener('click', handleChat)
})