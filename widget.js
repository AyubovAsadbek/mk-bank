(function () {
  const CONFIG = {
    LLM_API_URL: "https://mkb.aisha.group/api/chat/",
  };
  function createChatWidgetHTML() {
    return `
  <div class="aisha-chat-widget">
    <div class="animation"></div>
    <button class="aisha-chat-toggle">
      <img class=" aisha-logo" src="https://aisha.group/images/logo.svg" alt="AIsha Logo" />
      <svg class="aisha-close-icon hidden" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <div class="aisha-chat-container">
      <div class="aisha-chat-header">
        <div class="aisha-chat-header-content">
          <div>
            <h2 class="aisha-title"><img class="aisha-logo" src="https://aisha.group/images/logo.svg" alt="AIsha Logo" /> AIsha AI</h2>
            <p class="aisha-subtitle">( Chatbot test rejimida ishlamoqda )</p>
          </div>
          <button class="aisha-chat-close">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle cx="12" cy="12" r="10" stroke="#fff" stroke-width="1.5"></circle> <path d="M14.5 9.50002L9.5 14.5M9.49998 9.5L14.5 14.5" stroke="#fff" stroke-width="1.5" stroke-linecap="round"></path> </g></svg>
          </button>
        </div>

        <span class="aisha-error-message hidden">
          Xabarni tushunib bo'lmadi. Qayta yozib yuboring!
        </span>

        <div class="aisha-messages">
          <h1 class="aisha-date"></h1>
        </div>

        <div class="aisha-message-form-container">
          <form class="aisha-message-form ">
            <input 
              type="text" 
              class="aisha-user-input " 
              placeholder="Xabaringizni yozing..."
            />
            <button 
              type="button" 
              class="aisha-send-btn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 11 22 2"></polygon>
              </svg>
            </button>
            
            <button 
              type="button" 
              class="aisha-stop-recording-btn p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-300 hidden relative"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="6" y="4" width="12" height="16" rx="2" ry="2"></rect>
              </svg>
              <span class="absolute inset-0 rounded-full animate-pulse-recording"></span>
              <span class="w-14 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white py-1 rounded text-xs aisha-recording-time">00:00,0</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
`;
  }
  class AishaAIWidget {
    constructor() {
      this.initializeDOM();
      this.bindEvents();
      this.initializeVariables();
    }
    initializeDOM() {
      const widgetContainer = document.createElement("div");
      widgetContainer.innerHTML = createChatWidgetHTML();
      document.body.appendChild(widgetContainer.firstElementChild);
      this.elements = {
        widget: document.querySelector(".aisha-chat-widget"),
        toggleBtn: document.querySelector(".aisha-chat-toggle"),
        closeBtn: document.querySelector(".aisha-chat-close"),
        chatContainer: document.querySelector(".aisha-chat-container"),
        logo: document.querySelector(".aisha-logo"),
        closeIcon: document.querySelector(".aisha-close-icon"),
        messageContainer: document.querySelector(".aisha-messages"),
        userInput: document.querySelector(".aisha-user-input"),
        sendBtn: document.querySelector(".aisha-send-btn"),
        errorMessage: document.querySelector(".aisha-error-message"),
        dateDisplay: document.querySelector(".aisha-date"),
      };

      this.updateDate();
      this.addInitialMessage();
    }
    initializeVariables() {
      this.state = {
        isChatOpen: !1,
        isExpanded: !1,
        isLoading: !1,
        isRecording: !1,
        isLoadingAudio: {},
        messages: [],
        mediaRecorder: null,
        audioChunks: [],
        recordingTime: 0,
        recordingInterval: null,
        loadingIndicator: null,
      };
    }
    bindEvents() {
      this.elements.toggleBtn.addEventListener("click", () =>
        this.toggleChat()
      );
      this.elements.closeBtn.addEventListener("click", () => this.toggleChat());
      this.elements.sendBtn.addEventListener("click", () => this.sendMessage());
      this.elements.userInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          this.sendMessage();
        }
      });
    }
    updateDate() {
      const now = new Date();
      const formattedDate = `${String(now.getDate()).padStart(2, "0")}.${String(
        now.getMonth() + 1
      ).padStart(2, "0")}.${now.getFullYear()}`;
      this.elements.dateDisplay.textContent = formattedDate;
    }
    addInitialMessage() {
      this.addMessage({
        content: "Assalomu alaykum! Bugun sizga qanday yordam berishim mumkin?",
        isUser: !1,
      });
    }
    toggleChat() {
      this.state.isChatOpen = !this.state.isChatOpen;
      this.updateChatVisibility();
    }
    toggleExpand() {
      this.state.isExpanded = !this.state.isExpanded;
      this.updateChatVisibility();
    }
    updateChatVisibility() {
      if (this.state.isChatOpen) {
        this.elements.chatContainer.classList.add("enterContainer");
        this.elements.logo.classList.add("hidden");
        this.elements.closeIcon.classList.remove("hidden");
      } else {
        this.elements.chatContainer.classList.remove("enterContainer");
        this.elements.logo.classList.remove("hidden");
        this.elements.closeIcon.classList.add("hidden");
      }
      if (this.state.isExpanded) {
        this.elements.chatContainer.classList.remove("w-[400px]", "h-[500px]");
        this.elements.chatContainer.classList.add(
          "fixed",
          "top-0",
          "left-0",
          "w-full",
          "h-full"
        );
      } else {
        this.elements.chatContainer.classList.add("w-[400px]", "h-[500px]");
        this.elements.chatContainer.classList.remove(
          "fixed",
          "top-0",
          "left-0",
          "w-full",
          "h-full"
        );
      }
    }

    // Format markdown text to HTML
    formatMarkdown(text) {
      if (!text) return "";

      // Format headers (### Header)
      text = text.replace(
        /### \*\*(.*?)\*\*/g,
        '<h3 class="aisha-message-header">$1</h3>'
      );
      text = text.replace(
        /### (.*?)(\n|$)/g,
        '<h3 class="aisha-message-header">$1</h3>'
      );

      // Format bold text (**text**)
      text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

      // Format italic text (*text*)
      text = text.replace(/\*(.*?)\*/g, "<em>$1</em>");

      // Format lists
      let listItems = [];
      const listRegex = /^\s*-\s+(.*?)$/gm;
      let match;

      while ((match = listRegex.exec(text)) !== null) {
        listItems.push(match[1]);
      }

      if (listItems.length > 0) {
        const listHTML =
          '<ul class="aisha-message-list">' +
          listItems
            .map((item) => `<li class="aisha-message-list-item">${item}</li>`)
            .join("") +
          "</ul>";

        text = text.replace(/^\s*-\s+(.*?)$(\n|$)/gm, "");
        text = text.replace(/\n\n/g, "\n");

        // Find where to insert the list
        const listPosition = text.indexOf("\n\n");
        if (listPosition !== -1) {
          text =
            text.substring(0, listPosition) +
            "\n" +
            listHTML +
            text.substring(listPosition);
        } else {
          text += listHTML;
        }
      }

      // Convert newlines to <br>
      text = text.replace(/\n/g, "<br>");

      return text;
    }

    addMessage(message) {
      const messageEl = document.createElement("div");
      messageEl.className = `flex items-end gap-1 ${
        message.isUser ? "justify-end" : "justify-start"
      }`;

      // Format the content if it's from the AI
      const formattedContent = !message.isUser
        ? this.formatMarkdown(message.content)
        : message.content;

      const messageContent = `
    ${
      !message.isUser
        ? `<img src="https://aisha.group/images/main-logo.svg" alt="Main Logo" class="small-logo"/>`
        : ""
    }
    <div class="max-w-[70%] text-sm break-word-own overflow-hidden p-2 ${
      message.isUser
        ? "bg-[#106ec4] text-white rounded-t-[13px] rounded-bl-[13px]"
        : "bg-gray-100 rounded-t-[13px] rounded-br-[13px] aisha-message-content"
    }">
      ${formattedContent}
    </div>
  `;
      messageEl.innerHTML = messageContent;
      this.elements.messageContainer.appendChild(messageEl);
      this.scrollToBottom();
    }

    // Show loading indicator
    showLoadingIndicator() {
      // Remove any existing loading indicator first
      this.hideLoadingIndicator();

      // Create a new loading indicator
      const loadingEl = document.createElement("div");
      loadingEl.className =
        "flex items-end gap-1 justify-start aisha-loading-message";
      const loadingContent = `
        <img src="https://aisha.group/images/main-logo.svg" alt="Main Logo" class="small-logo"/>
        <div class="max-w-[70%] text-sm break-word-own overflow-hidden p-2 bg-gray-100 rounded-t-[13px] rounded-br-[13px]">
          <div class="aisha-loading-dots">
            <div class="aisha-loading-dot"></div>
            <div class="aisha-loading-dot"></div>
            <div class="aisha-loading-dot"></div>
          </div>
        </div>
      `;
      loadingEl.innerHTML = loadingContent;

      // Add to the message container
      this.elements.messageContainer.appendChild(loadingEl);

      // Store reference to the loading indicator
      this.state.loadingIndicator = loadingEl;
      this.state.isLoading = true;

      this.scrollToBottom();
    }

    // Hide loading indicator
    hideLoadingIndicator() {
      if (this.state.loadingIndicator) {
        this.state.loadingIndicator.remove();
        this.state.loadingIndicator = null;
      }
      this.state.isLoading = false;
    }

    scrollToBottom() {
      this.elements.messageContainer.scrollTop =
        this.elements.messageContainer.scrollHeight;
    }

    async sendMessage() {
      const userMessage = this.elements.userInput.value.trim();
      if (!userMessage) return;

      // Add user message
      this.addMessage({ content: userMessage, isUser: !0 });
      this.elements.userInput.value = "";

      // Show loading indicator
      this.showLoadingIndicator();

      try {
        const response = await fetch(CONFIG.LLM_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            context: userMessage,
          }),
        });

        const data = await response.json();
        console.log(data);

        // Hide loading indicator before adding the response
        this.hideLoadingIndicator();

        this.addMessage({
          content: data.response,
          isUser: !1,
        });
      } catch (error) {
        // Hide loading indicator before adding the error message
        this.hideLoadingIndicator();

        console.error("Error:", error);
        this.addMessage({
          content: "Sorry, I couldn't process your request. Please try again.",
          isUser: !1,
        });
      }

      this.scrollToBottom();
    }

    updateRecordingTime() {
      const minutes = Math.floor(this.state.recordingTime / 60);
      const seconds = Math.floor(this.state.recordingTime % 60);
      const tenths = Math.floor((this.state.recordingTime % 1) * 10);
      this.elements.recordingTimeDisplay.textContent = `${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")},${tenths}`;
    }
    async speechToText(audioBlob) {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recorded_audio.wav");
      formData.append("has_offsets", "false");
      formData.append("has_diarization", "false");
      formData.append("language", "uz");
      try {
        const response = await fetch(CONFIG.STT_API_URL, {
          method: "POST",
          body: formData,
          headers: { "x-api-key": CONFIG.STT_API_KEY },
        });
        const data = await response.json();
        this.elements.userInput.value = data.transcript;
        this.sendMessage();
      } catch (error) {
        console.error("Speech to Text Error:", error);
        this.showErrorMessage();
      }
    }
    showErrorMessage() {
      this.elements.errorMessage.classList.remove("hidden");
      setTimeout(() => {
        this.elements.errorMessage.classList.add("hidden");
      }, 3000);
    }
  }
  function initAishaWidget() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => new AishaAIWidget());
      const script = document.createElement("script");
      const link = document.createElement("link");
      script.src = "https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4";
      link.href =
        "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap";
      script.async = !0;
      link.rel = "stylesheet";
      document.head.appendChild(script);
      document.head.appendChild(link);
    } else {
      new AishaAIWidget();
    }
  }
  const styles = `
.animate-grow-glow {
  animation: grow-glow 2s infinite;
  animation-timing-function: ease-in-out;
}
@keyframes grow-glow {
  0% {
    transform: scale(1);
    opacity: 0.75;
  }
  25% {
    transform: scale(2);
    opacity: 0.5;
  }
  50% {
    transform: scale(3);
    opacity: 0.25;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
}
.animate-pulse-recording {
  animation: pulse-recording 1.5s infinite;
  background-color: rgba(255, 255, 255, 0.3);
}
@keyframes pulse-recording {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.aisha-message-header {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #106ec4;
}

.aisha-message-list {
  list-style-type: none;
  padding-left: 0;
  margin-top: 8px;
  margin-bottom: 8px;
}

.aisha-message-list-item {
  position: relative;
  padding-left: 20px;
  margin-bottom: 6px;
  line-height: 1.4;
}

.aisha-message-list-item:before {
  content: "•";
  position: absolute;
  left: 0;
  color: #106ec4;
  font-weight: bold;
}

.aisha-message-content strong {
  font-weight: 600;
}

.aisha-message-content em {
  font-style: italic;
}

/* Loading animation styles */
.aisha-loading-dots {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 20px;
  width: 40px;
}

.aisha-loading-dot {
  width: 8px;
  height: 8px;
  background-color: #106ec4;
  border-radius: 50%;
  animation: dot-bounce 1s infinite ease-in-out both;
}

.aisha-loading-dot:nth-child(1) {
  animation-delay: -0.32s;
}

.aisha-loading-dot:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes dot-bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

* {
  scroll-behavior: smooth;  
  font-family: 'Inter', sans-serif;
}
::-webkit-scrollbar {
  width: 5px;
}
::-webkit-scrollbar-track {
  border-radius: 10px;
}
::-webkit-scrollbar-thumb {
  background: #D0DBF0;
  border-radius: 10px;
}
.aisha-chat-widget {
  position: fixed;
  bottom: 48px;
  right: 48px;
}
.animation{
  position: absolute;
  z-index: -10;
  background-color: #D6EDFF;
  animation: grow-glow 2s infinite;
  animation-timing-function: linear;
  width: 48px;
  height: 48px;
  border-radius: 50%;
}
.aisha-chat-toggle {
  background-color: #106ec4;
  color: white;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  border: none;
}
.aisha-logo {
  width: 24px;
  height: 24px;
}
.aisha-close-icon {
  width: 24px;
  height: 24px;
}
.hidden{
  display: none;
}
.aisha-chat-container {
  position: absolute;
  bottom: 64px;
  right: 0;
  width: 400px;
  height: 500px;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border-radius: 15px;
  opacity: 0;
  transform: scale(0);
  transition: all 0.3s;
  z-index: 999;
}

@media screen and (max-width: 768px) {
  .aisha-chat-container {
    border-radius: 0;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}

.aisha-chat-header {
  display: flex;
  flex-direction: column;
  height: 100%;
  border-bottom: 1px solid #D0DBF0;
}
.aisha-chat-header-content {
  position: relative;
  z-index: 20;
  background-color: #106ec4;
  color: white;
  padding: 10px 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}



.aisha-title {
  font-size: 16px;
  font-weight: 600;
  display: flex;
  gap: 8px;
}
.aisha-subtitle {
  font-size: 14px;
}
.aisha-error-message {
  position: absolute;
  z-index: 10;
  background-color: rgba(255, 255, 255, 0.3);
  color: white;
  padding: 4px 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 15px;
  transition: all 0.3s;
}
.aisha-messages {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
  gap: 10px;
  display: flex;
  flex-direction: column;
  
}
.aisha-date {
  text-align: center;
  font-size: 14px;
}
.aisha-message-form-container {
  overflow-y: auto;
  padding: 16px;
  gap: 8px;
  background-color: white;
  border-top: 1px solid #D0DBF0;
}
.aisha-message-form {
  display: flex;
  gap: 12px;
}
.aisha-user-input {
  flex: 1;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #D0DBF0;
  transition: all 0.3s;
  outline: none;
  font-size: 16px;
  transition: all 0.3s;
}
.aisha-user-input:focus {
  border-color: #106ec4;
  outline: none;
}
.aisha-send-btn {
  padding: 12px;
  background-color: #106ec4;
  color: white;
  border-radius: 50%;
  transition: all 0.5s;
  cursor: pointer;
}
.aisha-send-btn:hover {
  background-color: #3b82f6;
}
.aisha-chat-close{
  display: none;
}

@media screen and (max-width: 576px) {
  .aisha-chat-close{
    display: block;
  }
}


.enterContainer{
opacity: 1;
transform: scale(1); 
}

.break-word-own{
  word-break: break-word;
}

.small-logo{
  width: 28px;
  height: 28px;
}
  
`;
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
  window.initAishaWidget = initAishaWidget;
  initAishaWidget();
})();
