!function(){const n={LLM_API_URL:"https://mkb.aisha.group/api/chat/"};class e{constructor(){this.initializeDOM(),this.bindEvents(),this.initializeVariables()}initializeDOM(){const n=document.createElement("div");n.innerHTML='\n  <div class="aisha-chat-widget">\n    <div class="animation"></div>\n    <button class="aisha-chat-toggle">\n      <img class=" aisha-logo" src="https://aisha.group/images/logo.svg" alt="AIsha Logo" />\n      <svg class="aisha-close-icon hidden" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">\n        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />\n      </svg>\n    </button>\n\n    <div class="aisha-chat-container">\n      <div class="aisha-chat-header">\n        <div class="aisha-chat-header-content">\n          <div>\n            <h2 class="aisha-title"><img class="aisha-logo" src="https://aisha.group/images/logo.svg" alt="AIsha Logo" /> AIsha AI</h2>\n            <p class="aisha-subtitle">( Chatbot test rejimida ishlamoqda )</p>\n          </div>\n          <button class="aisha-chat-close">\n            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle cx="12" cy="12" r="10" stroke="#fff" stroke-width="1.5"></circle> <path d="M14.5 9.50002L9.5 14.5M9.49998 9.5L14.5 14.5" stroke="#fff" stroke-width="1.5" stroke-linecap="round"></path> </g></svg>\n          </button>\n        </div>\n\n        <span class="aisha-error-message hidden">\n          Xabarni tushunib bo\'lmadi. Qayta yozib yuboring!\n        </span>\n\n        <div class="aisha-messages">\n          <h1 class="aisha-date"></h1>\n        </div>\n\n        <div class="aisha-message-form-container">\n          <form class="aisha-message-form ">\n            <input \n              type="text" \n              class="aisha-user-input " \n              placeholder="Xabaringizni yozing..."\n            />\n            <button \n              type="button" \n              class="aisha-send-btn"\n            >\n              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n                <line x1="22" y1="2" x2="11" y2="13"></line>\n                <polygon points="22 2 15 22 11 13 2 11 22 2"></polygon>\n              </svg>\n            </button>\n            \n            <button \n              type="button" \n              class="aisha-stop-recording-btn p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-300 hidden relative"\n            >\n              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n                <rect x="6" y="4" width="12" height="16" rx="2" ry="2"></rect>\n              </svg>\n              <span class="absolute inset-0 rounded-full animate-pulse-recording"></span>\n              <span class="w-14 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white py-1 rounded text-xs aisha-recording-time">00:00,0</span>\n            </button>\n          </form>\n        </div>\n      </div>\n    </div>\n  </div>\n',document.body.appendChild(n.firstElementChild),this.elements={widget:document.querySelector(".aisha-chat-widget"),toggleBtn:document.querySelector(".aisha-chat-toggle"),closeBtn:document.querySelector(".aisha-chat-close"),chatContainer:document.querySelector(".aisha-chat-container"),logo:document.querySelector(".aisha-logo"),closeIcon:document.querySelector(".aisha-close-icon"),messageContainer:document.querySelector(".aisha-messages"),userInput:document.querySelector(".aisha-user-input"),sendBtn:document.querySelector(".aisha-send-btn"),errorMessage:document.querySelector(".aisha-error-message"),dateDisplay:document.querySelector(".aisha-date")},this.updateDate(),this.addInitialMessage()}initializeVariables(){this.state={isChatOpen:!1,isExpanded:!1,isLoading:!1,isRecording:!1,isLoadingAudio:{},messages:[],mediaRecorder:null,audioChunks:[],recordingTime:0,recordingInterval:null,loadingIndicator:null}}bindEvents(){this.elements.toggleBtn.addEventListener("click",(()=>this.toggleChat())),this.elements.closeBtn.addEventListener("click",(()=>this.toggleChat())),this.elements.sendBtn.addEventListener("click",(()=>this.sendMessage())),this.elements.userInput.addEventListener("keypress",(n=>{"Enter"===n.key&&(n.preventDefault(),this.sendMessage())}))}updateDate(){const n=new Date,e=`${String(n.getDate()).padStart(2,"0")}.${String(n.getMonth()+1).padStart(2,"0")}.${n.getFullYear()}`;this.elements.dateDisplay.textContent=e}addInitialMessage(){this.addMessage({content:"Assalomu alaykum! Bugun sizga qanday yordam berishim mumkin?",isUser:!1})}toggleChat(){this.state.isChatOpen=!this.state.isChatOpen,this.updateChatVisibility()}toggleExpand(){this.state.isExpanded=!this.state.isExpanded,this.updateChatVisibility()}updateChatVisibility(){this.state.isChatOpen?(this.elements.chatContainer.classList.add("enterContainer"),this.elements.logo.classList.add("hidden"),this.elements.closeIcon.classList.remove("hidden")):(this.elements.chatContainer.classList.remove("enterContainer"),this.elements.logo.classList.remove("hidden"),this.elements.closeIcon.classList.add("hidden")),this.state.isExpanded?(this.elements.chatContainer.classList.remove("w-[400px]","h-[500px]"),this.elements.chatContainer.classList.add("fixed","top-0","left-0","w-full","h-full")):(this.elements.chatContainer.classList.add("w-[400px]","h-[500px]"),this.elements.chatContainer.classList.remove("fixed","top-0","left-0","w-full","h-full"))}formatMarkdown(n){if(!n)return"";n=(n=(n=(n=n.replace(/### \*\*(.*?)\*\*/g,'<h3 class="aisha-message-header">$1</h3>')).replace(/### (.*?)(\n|$)/g,'<h3 class="aisha-message-header">$1</h3>')).replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>")).replace(/\*(.*?)\*/g,"<em>$1</em>");let e=[];const t=/^\s*-\s+(.*?)$/gm;let s;for(;null!==(s=t.exec(n));)e.push(s[1]);if(e.length>0){const t='<ul class="aisha-message-list">'+e.map((n=>`<li class="aisha-message-list-item">${n}</li>`)).join("")+"</ul>",s=(n=(n=n.replace(/^\s*-\s+(.*?)$(\n|$)/gm,"")).replace(/\n\n/g,"\n")).indexOf("\n\n");-1!==s?n=n.substring(0,s)+"\n"+t+n.substring(s):n+=t}return n=n.replace(/\n/g,"<br>")}addMessage(n){const e=document.createElement("div");e.className="flex items-end gap-1 "+(n.isUser?"justify-end":"justify-start");const t=n.isUser?n.content:this.formatMarkdown(n.content),s=`\n    ${n.isUser?"":'<img src="https://aisha.group/images/main-logo.svg" alt="Main Logo" class="small-logo"/>'}\n    <div class="max-w-[70%] text-sm break-word-own overflow-hidden p-2 ${n.isUser?"bg-[#106ec4] text-white rounded-t-[13px] rounded-bl-[13px]":"bg-gray-100 rounded-t-[13px] rounded-br-[13px] aisha-message-content"}">\n      ${t}\n    </div>\n  `;e.innerHTML=s,this.elements.messageContainer.appendChild(e),this.scrollToBottom()}showLoadingIndicator(){this.hideLoadingIndicator();const n=document.createElement("div");n.className="flex items-end gap-1 justify-start aisha-loading-message";n.innerHTML='\n        <img src="https://aisha.group/images/main-logo.svg" alt="Main Logo" class="small-logo"/>\n        <div class="max-w-[70%] text-sm break-word-own overflow-hidden p-2 bg-gray-100 rounded-t-[13px] rounded-br-[13px]">\n          <div class="aisha-loading-dots">\n            <div class="aisha-loading-dot"></div>\n            <div class="aisha-loading-dot"></div>\n            <div class="aisha-loading-dot"></div>\n          </div>\n        </div>\n      ',this.elements.messageContainer.appendChild(n),this.state.loadingIndicator=n,this.state.isLoading=!0,this.scrollToBottom()}hideLoadingIndicator(){this.state.loadingIndicator&&(this.state.loadingIndicator.remove(),this.state.loadingIndicator=null),this.state.isLoading=!1}scrollToBottom(){this.elements.messageContainer.scrollTop=this.elements.messageContainer.scrollHeight}async sendMessage(){const e=this.elements.userInput.value.trim();if(e){this.addMessage({content:e,isUser:!0}),this.elements.userInput.value="",this.showLoadingIndicator();try{const t=await fetch(n.LLM_API_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({context:e})}),s=await t.json();console.log(s),this.hideLoadingIndicator(),this.addMessage({content:s.response,isUser:!1})}catch(n){this.hideLoadingIndicator(),console.error("Error:",n),this.addMessage({content:"Sorry, I couldn't process your request. Please try again.",isUser:!1})}this.scrollToBottom()}}updateRecordingTime(){const n=Math.floor(this.state.recordingTime/60),e=Math.floor(this.state.recordingTime%60),t=Math.floor(this.state.recordingTime%1*10);this.elements.recordingTimeDisplay.textContent=`${n.toString().padStart(2,"0")}:${e.toString().padStart(2,"0")},${t}`}async speechToText(e){const t=new FormData;t.append("audio",e,"recorded_audio.wav"),t.append("has_offsets","false"),t.append("has_diarization","false"),t.append("language","uz");try{const e=await fetch(n.STT_API_URL,{method:"POST",body:t,headers:{"x-api-key":n.STT_API_KEY}}),s=await e.json();this.elements.userInput.value=s.transcript,this.sendMessage()}catch(n){console.error("Speech to Text Error:",n),this.showErrorMessage()}}showErrorMessage(){this.elements.errorMessage.classList.remove("hidden"),setTimeout((()=>{this.elements.errorMessage.classList.add("hidden")}),3e3)}}function t(){if("loading"===document.readyState){document.addEventListener("DOMContentLoaded",(()=>new e));const n=document.createElement("script"),t=document.createElement("link");n.src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4",t.href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",n.async=!0,t.rel="stylesheet",document.head.appendChild(n),document.head.appendChild(t)}else new e}const s=document.createElement("style");s.type="text/css",s.innerText="\n.animate-grow-glow {\n  animation: grow-glow 2s infinite;\n  animation-timing-function: ease-in-out;\n}\n@keyframes grow-glow {\n  0% {\n    transform: scale(1);\n    opacity: 0.75;\n  }\n  25% {\n    transform: scale(2);\n    opacity: 0.5;\n  }\n  50% {\n    transform: scale(3);\n    opacity: 0.25;\n  }\n  100% {\n    transform: scale(4);\n    opacity: 0;\n  }\n}\n.animate-pulse-recording {\n  animation: pulse-recording 1.5s infinite;\n  background-color: rgba(255, 255, 255, 0.3);\n}\n@keyframes pulse-recording {\n  0%, 100% { transform: scale(1); }\n  50% { transform: scale(1.2); }\n}\n\n.aisha-message-header {\n  font-size: 16px;\n  font-weight: 600;\n  margin-bottom: 8px;\n  color: #106ec4;\n}\n\n.aisha-message-list {\n  list-style-type: none;\n  padding-left: 0;\n  margin-top: 8px;\n  margin-bottom: 8px;\n}\n\n.aisha-message-list-item {\n  position: relative;\n  padding-left: 20px;\n  margin-bottom: 6px;\n  line-height: 1.4;\n}\n\n.aisha-message-list-item:before {\n  content: \"•\";\n  position: absolute;\n  left: 0;\n  color: #106ec4;\n  font-weight: bold;\n}\n\n.aisha-message-content strong {\n  font-weight: 600;\n}\n\n.aisha-message-content em {\n  font-style: italic;\n}\n\n/* Loading animation styles */\n.aisha-loading-dots {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 4px;\n  height: 20px;\n  width: 40px;\n}\n\n.aisha-loading-dot {\n  width: 8px;\n  height: 8px;\n  background-color: #106ec4;\n  border-radius: 50%;\n  animation: dot-bounce 1s infinite ease-in-out both;\n}\n\n.aisha-loading-dot:nth-child(1) {\n  animation-delay: -0.32s;\n}\n\n.aisha-loading-dot:nth-child(2) {\n  animation-delay: -0.16s;\n}\n\n@keyframes dot-bounce {\n  0%, 80%, 100% {\n    transform: scale(0);\n  }\n  40% {\n    transform: scale(1);\n  }\n}\n\n* {\n  scroll-behavior: smooth;  \n  font-family: 'Inter', sans-serif;\n}\n::-webkit-scrollbar {\n  width: 5px;\n}\n::-webkit-scrollbar-track {\n  border-radius: 10px;\n}\n::-webkit-scrollbar-thumb {\n  background: #D0DBF0;\n  border-radius: 10px;\n}\n.aisha-chat-widget {\n  position: fixed;\n  bottom: 48px;\n  right: 48px;\n}\n.animation{\n  position: absolute;\n  z-index: -10;\n  background-color: #D6EDFF;\n  animation: grow-glow 2s infinite;\n  animation-timing-function: linear;\n  width: 48px;\n  height: 48px;\n  border-radius: 50%;\n}\n.aisha-chat-toggle {\n  background-color: #106ec4;\n  color: white;\n  width: 48px;\n  height: 48px;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);\n  transition: all 0.3s;\n  border: none;\n}\n.aisha-logo {\n  width: 24px;\n  height: 24px;\n}\n.aisha-close-icon {\n  width: 24px;\n  height: 24px;\n}\n.hidden{\n  display: none;\n}\n.aisha-chat-container {\n  position: absolute;\n  bottom: 64px;\n  right: 0;\n  width: 400px;\n  height: 500px;\n  background-color: white;\n  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);\n  overflow: hidden;\n  border-radius: 15px;\n  opacity: 0;\n  transform: scale(0);\n  transition: all 0.3s;\n  z-index: 999;\n}\n\n@media screen and (max-width: 768px) {\n  .aisha-chat-container {\n    border-radius: 0;\n    position: fixed;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n  }\n}\n\n.aisha-chat-header {\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n  border-bottom: 1px solid #D0DBF0;\n}\n.aisha-chat-header-content {\n  position: relative;\n  z-index: 20;\n  background-color: #106ec4;\n  color: white;\n  padding: 10px 1rem;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n\n\n\n.aisha-title {\n  font-size: 16px;\n  font-weight: 600;\n  display: flex;\n  gap: 8px;\n}\n.aisha-subtitle {\n  font-size: 14px;\n}\n.aisha-error-message {\n  position: absolute;\n  z-index: 10;\n  background-color: rgba(255, 255, 255, 0.3);\n  color: white;\n  padding: 4px 8px;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  border-radius: 15px;\n  transition: all 0.3s;\n}\n.aisha-messages {\n  flex: 1;\n  overflow-y: auto;\n  padding: 8px;\n  gap: 10px;\n  display: flex;\n  flex-direction: column;\n  \n}\n.aisha-date {\n  text-align: center;\n  font-size: 14px;\n}\n.aisha-message-form-container {\n  overflow-y: auto;\n  padding: 16px;\n  gap: 8px;\n  background-color: white;\n  border-top: 1px solid #D0DBF0;\n}\n.aisha-message-form {\n  display: flex;\n  gap: 12px;\n}\n.aisha-user-input {\n  flex: 1;\n  padding: 8px;\n  border-radius: 8px;\n  border: 1px solid #D0DBF0;\n  transition: all 0.3s;\n  outline: none;\n  font-size: 16px;\n  transition: all 0.3s;\n}\n.aisha-user-input:focus {\n  border-color: #106ec4;\n  outline: none;\n}\n.aisha-send-btn {\n  padding: 12px;\n  background-color: #106ec4;\n  color: white;\n  border-radius: 50%;\n  transition: all 0.5s;\n  cursor: pointer;\n}\n.aisha-send-btn:hover {\n  background-color: #3b82f6;\n}\n.aisha-chat-close{\n  display: none;\n}\n\n@media screen and (max-width: 576px) {\n  .aisha-chat-close{\n    display: block;\n  }\n}\n\n\n.enterContainer{\nopacity: 1;\ntransform: scale(1); \n}\n\n.break-word-own{\n  word-break: break-word;\n}\n\n.small-logo{\n  width: 28px;\n  height: 28px;\n}\n  \n",document.head.appendChild(s),window.initAishaWidget=t,t()}();
