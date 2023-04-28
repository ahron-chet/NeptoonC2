document.addEventListener("DOMContentLoaded", function () {
  const chatIcon = document.querySelector(".chat-icon");
  const chatContainer = document.querySelector(".container");
  

  chatContainer.style.display = "none";

  chatIcon.addEventListener("click", function () {
    if (chatContainer.style.display === "none") {
      chatContainer.style.display = "block";
    } else {
      chatContainer.style.display = "none";
    }
  });
});

const chatBody = document.querySelector(".chat-body");
const txtInput = document.querySelector("#txtInput");
const send = document.querySelector(".send");

send.addEventListener("click", () => renderUserMessage());

txtInput.addEventListener("keyup", (event) => {
  if (event.keyCode === 13) {
    renderUserMessage();
  }
});

const renderUserMessage = () => {
  const userInput = txtInput.value;
  renderMessageEle(userInput, "user");
  txtInput.value = "";
  setTimeout(() => {
    renderChatbotResponse(userInput);
  }, 600);
};

const renderChatbotResponse = async (userInput) => {
  try {
    const response = await fetch("/send_message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: userInput })
    });
    const data = await response.json();
    const chatbotResponse = data.message;
    renderMessageEle(chatbotResponse);
  } catch (error) {
    console.error("Error:", error);
  }
};

const renderMessageEle = (txt, type) => {
  let className = "user-message";
  if (type !== "user") {
    className = "chatbot-message";
  }
  const messageEle = document.createElement("div");
  const txtNode = document.createTextNode(txt);
  messageEle.classList.add(className);
  messageEle.append(txtNode);
  chatBody.append(messageEle);
  setTimeout(() => {
    setScrollPosition();
  }, 10);
};

const setScrollPosition = () => {
  if (chatBody.scrollHeight > 0) {
    chatBody.scrollTop = chatBody.scrollHeight;
  }
};


