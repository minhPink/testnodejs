// CLIENT SEND MESSAGE
const formSendData = document.querySelector(".chatbot .inner-form");
if(formSendData) {
    formSendData.addEventListener("submit", (e) => {
        e.preventDefault();
        const content = e.target.elements.content.value;
        if(content) {
            socket.emit("CLIENT_SEND_MESSAGE", content);
            e.target.elements.content.value = "";
        }
    })
}
// END CLIENT SEND MESSAGE

// SEVER RETURN MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
    const bodyChat = document.querySelector(".chatbox");
    const myId = document.querySelector("[my-id]").getAttribute("my-id");
    const li = document.createElement("li");

    if(myId == data.user_id) {
        li.classList.add("chat", "outgoing");
        li.innerHTML = `
        <p>${data.content}</p>
    `;
    bodyChat.appendChild(li);
    } else {
        li.classList.add("chat", "incoming");
        li.innerHTML = `
        <span>
            <i class="fa-solid fa-person"></i>
        </span>
        <div class="inner-content">
            <b>${data.fullName}</b>
            <p>${data.content}</p>
        </div>
    `;
    bodyChat.appendChild(li);
    }
})
// END SEVER RETURN MESSAGE
