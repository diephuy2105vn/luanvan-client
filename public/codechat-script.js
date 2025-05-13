const BASE_URL = "https://codechat.dthhosting.uk";
const SERVER_URL = "https://codechat.dthhosting.uk/api";

let socket = null;

// Function to create and insert the AI Chat frame
function createAIChatContainer(bot, token, botToken) {
  const aiChatContainer = document.createElement("div");
  aiChatContainer.id = "codechat";
  aiChatContainer.style.cssText = `
        font-family: Roboto, 'Helvetica Neue', sans-serif;
        box-sizing: border-box;
        position: fixed;
        right: 20px;
        bottom: 20px;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
    `;

  // Create the AI Chat frame
  const aiChatFrame = document.createElement("div");
  aiChatFrame.id = "codechat-frame";
  aiChatFrame.style.cssText = `
        height: 440px;
        width: 440px;
        max-width: 80%;
        box-shadow: 0px 0px 5px 5px rgba(0, 0, 0, 0.05);
        border-radius: 14px;
        padding: 8px 0;
        margin-bottom: 8px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        background-color: white;
    `;
  aiChatFrame.innerHTML = `
        <div class="codechat-frame_header" style="display: flex; align-items: center; justify-content: space-between; padding: 4px 12px 8px; height: 40px; border-bottom: 1px solid #ddd;">
            <div style="display: flex; gap: 10px; align-items: center;">
                <img src="${
                  bot.avatar_source
                    ? SERVER_URL + "/bot/" + bot._id + "/avatar"
                    : BASE_URL + "/avatar/bot_avatar.jpg"
                }" style="height: 36px; width: 36px; border-radius: 50%" alt="..." />
                <p style="font-size: 14px; font-weight: 500">${bot.name}</p>
            </div>
            <div>
                <button id="codechat-refresh-button" style="border: 1px solid #ccc; border-radius: 50%; cursor: pointer; background-color: transparent; display: flex; justify-content: center; align-items: center; padding: 4px">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-refresh">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
                        <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
                    </svg>
                </button>
            </div>
        </div>
        <div class="codechat-frame_container" style="
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            flex: 1;
            padding: 8px 8px 4px;
            scroll-behavior: smooth;
        "></div>
        <div class="codechat-frame_footer" style="align-items: center; padding: 8px 8px 4px; border-top: 1px solid #ccc;">
            <div style="display: flex; border: 1px solid #ccc; border-radius: 5px; overflow: hidden;">
                <input id="codechat-input" placeholder="Nhập tin nhắn ..." style="flex: 1; height: 36px; padding: 0 8px; border: none; outline: none;"/>
                <button id="codechat-send-button" style="border: none; cursor: pointer; background-color: transparent; padding: 0; margin: 0; height: 36px; width: 36px; display: flex; justify-content: center; align-items: center; font-size: 14px; border-left: 1px solid #ccc;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-send-2">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M4.698 4.034l16.302 7.966l-16.302 7.966a.503 .503 0 0 1 -.546 -.124a.555 .555 0 0 1 -.12 -.568l2.468 -7.274l-2.468 -7.274a.555 .555 0 0 1 .12 -.568a.503 .503 0 0 1 .546 -.124z" />
                        <path d="M6.5 12h14.5" />
                    </svg>
                </button>
            </div>
        </div>
    `;
  aiChatFrame.style.display = "none"; // Initially hidden

  // Create the AI Chat button
  const button = document.createElement("button");
  button.id = "codechat-button";
  button.textContent = "Code Chat";
  button.style.cssText = `
    border: none;
    display: block;
    background: linear-gradient(135deg, #8e4e65, #de741c);
    color: white;
    font-size: 14px;
    padding: 8px 14px;
    border-radius: 40px;
    cursor: pointer;
  `;
  aiChatContainer.appendChild(aiChatFrame);
  aiChatContainer.appendChild(button);
  document.body.appendChild(aiChatContainer);

  const sendButton = document.getElementById("codechat-send-button");
  const inputField = document.getElementById("codechat-input");
  const refreshButton = document.getElementById("codechat-refresh-button");
  const messageContainer = aiChatFrame.querySelector(
    ".codechat-frame_container"
  );

  // Event listener to send message
  sendButton.addEventListener("click", function () {
    const message = inputField.value;
    if (message.trim() !== "" && socket) {
      addMessage(messageContainer, message, "right");
      addLoading(messageContainer);
      socket.emit("send_message", { message: message });
      inputField.value = "";
    }
  });

  refreshButton.addEventListener("click", function () {
    messageContainer.innerHTML = "";
  });

  // Add enter key event to send message
  inputField.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      sendButton.click();
    }
  });

  button.addEventListener("click", function () {
    const chatFrame = document.getElementById("codechat-frame");
    if (chatFrame.style.display === "none" || chatFrame.style.display === "") {
      chatFrame.style.display = "flex";
    } else {
      chatFrame.style.display = "none";
    }
  });
}

async function fetchBotById(token, botToken) {
  const res = await fetch(`${SERVER_URL}/bot/${botToken}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  return data;
}

async function joinChat(token, botToken) {
  const res = await fetch(
    `${SERVER_URL}/chat_history/join_chat_bot/${botToken}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  const data = await res.json();
  socket.emit("join_chat", {
    bot_id: botToken,
    chat_history_id: data._id,
  });
  return data;
}

function connectSocketIO(token, botToken) {
  socket = io(`ws://localhost:8000/`, {
    transports: ["websocket"],
    query: {
      token: token,
    },
    path: "/ws",
  });

  socket.on("connect", () => {
    joinChat(token, botToken);
  });

  socket.on("message", (data) => {
    const messageContainer = document.querySelector(
      ".codechat-frame_container"
    );

    deleteLoading(messageContainer);
    addMessage(messageContainer, data.message.answer, "left");
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from the server");
  });

  socket.on("error", (error) => {
    console.error("Socket.IO error:", error);
  });
}

function disconnectSocketIO() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

function addMessage(container, message, position) {
  const messageElement = document.createElement("div");
  messageElement.style.cssText = `
        margin-bottom: 10px;
        padding: 10px;
        min-width: 80px;
        max-width: 70%;
        word-break: break-word;
        font-size: 14px;
        ${
          position === "right"
            ? "background-color: rgba(222, 116, 28, 0.2); align-self: flex-end; align-self: flex-end; border-radius: 16px 16px 4px 16px"
            : "background-color: rgba(142, 78, 101, 0.2); align-self: flex-start;  border-radius: 16px 16px 16px 4px"
        }`;
  messageElement.textContent = message;
  container.appendChild(messageElement);
  container.scrollTop = container.scrollHeight;
}

// Add status loading
function addLoading(container) {
  const loadingElement = document.createElement("div");

  loadingElement.id = "codechat-message_loading";
  loadingElement.style.cssText = `
    padding: 16px 0;
    width: 100%;
    display: flex;
    gap: 6px;
    justify-content: flex-start;
    margin-top: 4px;
  `;

  loadingElement.innerHTML = `
    <span
      style="
        opacity: 0;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #8e4e65;
        animation: fadeInOut_custom 1.5s infinite;
        animation-delay: 0s">
    </span>
    <span
      style="
        opacity: 0;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #8e4e65;
        animation: fadeInOut_custom 1.5s infinite;
        animation-delay: 0.5s;
      "></span>
    <span
      style="
        opacity: 0;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #8e4e65;
        animation: fadeInOut_custom 1.5s infinite;
        animation-delay: 1s;">
    </span>`;

  container.appendChild(loadingElement);
  container.scrollTop = container.scrollHeight;
}

function deleteLoading() {
  const loadingElement = document.getElementById("codechat-message_loading");
  if (loadingElement) {
    loadingElement.remove();
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const styleElement = document.createElement("style");
  const keyframes = `@keyframes fadeInOut_custom {
    0%,
    100% {
      opacity: 0;
      }
    50% {
      opacity: 1;
    }
  }`;

  styleElement.appendChild(document.createTextNode(keyframes));
  document.head.appendChild(styleElement);

  const scriptElement = document.getElementById("codechat-script");

  if (scriptElement) {
    //Lây dữ liệu từ thẻ script
    const token = scriptElement.getAttribute("token");
    const botToken = scriptElement.getAttribute("botToken");

    //Lấy bot
    const bot = await fetchBotById(token, botToken);

    //Connect SocketIO
    connectSocketIO(token, botToken);
    createAIChatContainer(bot, token, botToken);
  }
});
