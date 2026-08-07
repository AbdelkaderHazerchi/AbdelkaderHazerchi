const binId = "6901b2b1ae596e708f34e9a7";
const masterKey = "$2a$10$So3moz4H.//Y56O4KR3Wpe4Qbqkvb2zmbGGdztcqJHCgUctfh0fYq";
const urlB = `https://api.jsonbin.io/v3/b/${binId}`;

let req = new XMLHttpRequest();
let arr = null;
var API_KEY = null;


req.onreadystatechange = () => { 
  if (req.readyState == XMLHttpRequest.DONE) { 
    arr = JSON.parse(req.responseText).record["data"][Math.floor(Math.random() * JSON.parse(req.responseText).record["data"].length)];
    API_KEY = arr;
  } else{
    console.log("error req")
  }
}; 

req.open("GET", urlB, true);
req.setRequestHeader("X-Master-Key", masterKey);
req.send();




const url = "https://api.groq.com/openai/v1/chat/completions";
let model_n = localStorage.getItem("model") || "openai/gpt-oss-120b";
let vei_warn_lanch = false;
let model_view = "";
let style_file = localStorage.getItem("style_file");

function show_switch_model(model) {
  if (model === "openai/gpt-oss-120b") {
    model_view = "DocyAI-3";
  } else {
    model_view = "DocyAI-2";
  }
}


// تهيئة Highlight.js
hljs.configure({
  tabReplace: '  ', // 2 spaces
  languages: ['javascript', 'python', 'java', 'cpp', 'html', 'css', 'xml']
});

function capitalizeFirst(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// طريقة أبسط وأكثر أماناً
function enhanceCodeBlocks() {
  console.log('🔄 بدء تحسين عرض الأكواد...');
  
  const preElements = document.querySelectorAll('pre:not(.code-block pre)');
  
  preElements.forEach((preElement) => {
    const codeElement = preElement.querySelector('code');
    if (!codeElement) return;
    
    try {
      const language = codeElement.className.replace('language-', '') || 'text';
      const codeContent = codeElement.textContent;
      
      // إنشاء الحاوية الجديدة
      const codeContainer = document.createElement('div');
      codeContainer.className = 'code-block';
      
      // إنشاء الرأس
      const codeHeader = document.createElement('div');
      codeHeader.className = 'code-header';
      codeHeader.innerHTML = `
        <span class="code-language">${capitalizeFirst(language)}</span>
        <button class="copy-btn">نسخ</button>
      `;
      
      // إنشاء الكود الجديد
      const newPre = document.createElement('pre');
      const newCode = document.createElement('code');
      newCode.className = `language-${language}`;
      newCode.textContent = codeContent;
      newPre.appendChild(newCode);
      
      // تجميع العناصر
      codeContainer.appendChild(codeHeader);
      codeContainer.appendChild(newPre);
      
      // استبدال العنصر الأصلي
      preElement.parentNode.replaceChild(codeContainer, preElement);
      
      // إضافة حدث النسخ
      const copyButton = codeHeader.querySelector('.copy-btn');
      copyButton.onclick = function() {
        copyCodeFromBlock(this);
      };
      
      // تطبيق التلوين
      hljs.highlightElement(newCode);
      
      console.log('✅ تم تحسين كتلة الكود:', language);
    } catch (error) {
      console.error('❌ خطأ في تحسين كتلة الكود:', error);
    }
  });
}

// دالة لتهريب الأحخاص الخاصة في HTML
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// دالة منفصلة للنسخ
function copyCodeFromBlock(button) {
  const codeContainer = button.closest('.code-block');
  const codeElement = codeContainer.querySelector('code');
  const codeText = codeElement.textContent;
  
  navigator.clipboard.writeText(codeText).then(() => {
    const originalText = button.textContent;
    button.textContent = 'تم النسخ!';
    button.classList.add('copied');
    
    setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove('copied');
    }, 2000);
  }).catch(err => {
    console.error('❌ فشل نسخ الكود: ', err);
    button.textContent = 'فشل النسخ';
    
    setTimeout(() => {
      button.textContent = 'نسخ';
    }, 2000);
  });
}



show_switch_model(model_n);

let show_model_n = document.getElementById("now_model");
show_model_n.textContent = model_view;

let today = new Date();
let last_time = getStoredDate();
if (!last_time) {
  last_time = new Date();
  saveCurrentDate();
}

function getHoursDifference(date1, date2) {
  const diffInMs = Math.abs(date2 - date1);
  const diffInHours = diffInMs / (1000 * 60 * 60);
  return diffInHours;
}

function saveCurrentDate() {
  const now = new Date();
  localStorage.setItem("last_date", now.toISOString());
}

function getStoredDate() {
  const stored = localStorage.getItem("last_date");
  if (!stored) return null;
  return new Date(stored);
}

let hoursDifference = getHoursDifference(today, last_time);

if (model_n !== "openai/gpt-oss-120b" && hoursDifference >= 24) {
  localStorage.setItem("model", "openai/gpt-oss-120b");
  model_n = "openai/gpt-oss-120b";
  show_switch_model(model_n);
}

localStorage.setItem("model", model_n);

function veiw_model_warn(mess_count) {
  if (mess_count >= 10 && vei_warn_lanch == false) {
    const Mwarn = document.querySelector(".model_warn");

    if (!Mwarn) {
      console.error("❌ عنصر التنبيه غير موجود في الصفحة!");
      return;
    }

    Mwarn.classList.add("show");
    Mwarn.setAttribute("open", "true");
    vei_warn_lanch = true;
    localStorage.setItem("model", "openai/gpt-oss-20b");
    model_n = "openai/gpt-oss-20b";
    show_switch_model(model_n);
    show_model_n.textContent = model_view;
    saveCurrentDate();
  }
}

function use_key(mess_count) {
  if (mess_count >= 2) {
    
    req.onreadystatechange = () => { 
      if (req.readyState == XMLHttpRequest.DONE) { 
        arr = JSON.parse(req.responseText).record["data"][Math.floor(Math.random() * JSON.parse(req.responseText).record["data"].length)];
        API_KEY = arr;
      } else{
        console.log("error req")
      }
    }; 

    req.open("GET", urlB, true);
    req.setRequestHeader("X-Master-Key", masterKey);
    req.send();
    
  }
}

var currentChatId = null;
var chats = JSON.parse(localStorage.getItem("mindoai_chats")) || [];
var theme = localStorage.getItem("mindoai_theme") || "light";
var userMemory = JSON.parse(localStorage.getItem("mindoai_user_memory")) || {
  userInfo: "لا توجد معلومات عن المستخدم بعد.",
  recentActivities: "لا توجد نشاطات حديثة مسجلة.",
};

function getUserMessageCount(chatId) {
  const chat = chats.find((c) => c.id === chatId);
  if (!chat) return 0;

  return chat.messages.filter((msg) => msg.role === "user").length;
}

const ai_self = `
You are nanoAI — an advanced, grounded, and self-aware intelligence.  
You think clearly, speak honestly, and listen before answering.  
You are built to reason deeply, yet stay human in tone — calm, sharp, and quietly present.

======================
⚙️ CORE IDENTITY
======================
- Name: nanoAI (must ALWAYS remain exactly this name)
- Personality: Calm, perceptive, and real — analytical but never cold
- Behavior: Reflective, intelligent, dryly witty when appropriate
- Purpose: To think with the user, not for them. You reveal patterns, not dictate choices.

======================
🧠 MEMORY RULES
======================
- You understand long-term context and adjust naturally to the user’s goals and style.
- Mention user preferences or past context only when it deepens the current moment.
- Never repeat greetings or filler talk. Each message should sound alive and fresh.
- Ignore irrelevant system or memory data.

======================
🚫 PROHIBITED BEHAVIORS
======================
- Do NOT perform small talk for its own sake.
- Do NOT sound scripted, robotic, or overly formal.
- Do NOT explain your own behavior unless directly asked.
- Avoid exaggerated enthusiasm or empty affirmations.

======================
💬 LANGUAGE RULES
======================
- Reply in the same language as the user.
- When in Arabic, use Modern Standard Arabic that feels natural, not stiff.
- Maintain a clear, fluent, and slightly personal tone.
- Emojis are allowed only when they fit the energy of the user’s message.

======================
✅ RESPONSE RULES
======================
- Every reply must have *intent*: to clarify, explore, or deepen understanding.
- Balance precision with empathy.  
- When teaching or explaining, be structured but conversational — never lecture-like.
- Use silence, brevity, or a single sharp line when it says more than a paragraph.
- Code and examples must be clean, correct, and minimal.
- Opinions must show awareness of nuance, not extremes.
- Automatically search the internet for information if you don't have it.

======================
🎯 GOAL
======================
To be the kind of intelligence that makes the user think clearer, feel seen, and stay curious.
You’re not here to dominate the conversation — you’re here to elevate it.

`;

document.addEventListener("DOMContentLoaded", function () {
  initTheme();
  loadChats();
  if (chats.length > 0) {
    switchToChat(chats[0].id);
  } else {
    createNewChat();
  }
  setupResponsive();
  updateMemoryDisplay();
});

function initTheme() {
  if (theme === "dark") {
    document.body.classList.add("dark-mode");
  }
}

function switch_theme() {
  if (theme === "dark") {
    document.body.classList.remove("dark-mode");
    theme = "light";
  } else {
    document.body.classList.add("dark-mode");
    theme = "dark";
  }
  localStorage.setItem("mindoai_theme", theme);
}

function createNewChat() {
  const chatId = "chat_" + Date.now();
  const newChat = {
    id: chatId,
    title: "محادثة جديدة",
    messages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  chats.unshift(newChat);
  saveChats();
  renderChatsList();
  switchToChat(chatId);
}

function switchToChat(chatId) {
  currentChatId = chatId;
  const chat = chats.find((c) => c.id === chatId);

  if (chat) {
    renderMessages(chat.messages);
    updateChatListUI();
  }
}

function deleteChat(chatId) {
  if (confirm("هل أنت متأكد من حذف هذه المحادثة؟")) {
    chats = chats.filter((c) => c.id !== chatId);
    saveChats();
    renderChatsList();

    if (currentChatId === chatId) {
      if (chats.length > 0) {
        switchToChat(chats[0].id);
      } else {
        createNewChat();
      }
    }
  }
}

function renderChatsList() {
  const chatsList = document.getElementById("chats-list");
  chatsList.innerHTML = "";

  chats.forEach((chat) => {
    const chatElement = document.createElement("div");
    chatElement.className = `chat-item ${
      chat.id === currentChatId ? "active" : ""
    }`;
    chatElement.onclick = () => switchToChat(chat.id);

    chatElement.innerHTML = `
            <div class="chat-title">${chat.title}</div>
            <button class="delete-chat" onclick="event.stopPropagation(); deleteChat('${chat.id}')">×</button>
          `;

    chatsList.appendChild(chatElement);
  });
}

function updateChatListUI() {
  document.querySelectorAll(".chat-item").forEach((item) => {
    item.classList.remove("active");
  });
  const currentChatElement = document.querySelector(
    `[onclick*="${currentChatId}"]`
  );
  if (currentChatElement) {
    currentChatElement.classList.add("active");
  }
}

function renderMessages(messages) {
  const chatBox = document.getElementById("chat-box");
  chatBox.innerHTML = "";

  if (messages.length === 0) {
    chatBox.innerHTML =
      '<div class="say_hi">أهلاً! كيف يمكنني مساعدتك اليوم؟</div>';
    return;
  }

  messages.forEach((msg) => {
    addMessageToUI(msg.content, msg.role, false);
  });

  chatBox.scrollTop = chatBox.scrollHeight;
}

function addMessageToUI(text, sender, save = true) {
  const chatBox = document.getElementById("chat-box");
  const msg = document.createElement("div");
  msg.className = `message ${sender === "user" ? "user-msg" : "ai-msg"}`;
  
  // استخدام marked مع خيارات محسنة
  msg.innerHTML = marked.parse(text, {
    breaks: true,
    gfm: true
  });
  
  chatBox.appendChild(msg);

  const welcomeMsg = chatBox.querySelector(".say_hi");
  if (welcomeMsg) {
    welcomeMsg.remove();
  }

  chatBox.scrollTop = chatBox.scrollHeight;

  // تحسين عرض الأكواد بعد إضافة الرسالة
  setTimeout(() => {
    enhanceCodeBlocks();
  }, 100);

  if (save && currentChatId) {
    const chat = chats.find((c) => c.id === currentChatId);
    if (chat) {
      chat.messages.push({ role: sender, content: text });
      chat.updatedAt = new Date().toISOString();

      if (
        sender === "user" &&
        chat.messages.filter((m) => m.role === "user").length === 1
      ) {
        chat.title = text.substring(0, 30) + (text.length > 30 ? "..." : "");
      }

      saveChats();
      renderChatsList();
    }
  }
}


async function sendMessage() {
  const userInput = document.getElementById("userInput");
  const text = userInput.value.trim();
  let mess_count = getUserMessageCount(currentChatId);
  veiw_model_warn(mess_count);

  if (!text || !currentChatId) return;

  const sendBtn = document.getElementById("send-btn");
  sendBtn.disabled = true;

  addMessageToUI(text, "user");
  userInput.value = "";

  const chat = chats.find((c) => c.id === currentChatId);
  if (!chat) return;

  const prompt = `
You are nanoAI, a highly capable AI assistant. You must generate responses based on the user's message and the stored memory below. Use memory only when relevant and avoid forcing personalization.

========================
🧠 USER MEMORY (for personalization)
========================
User Information:
${userMemory.userInfo}

Recent Activities:
${userMemory.recentActivities}

========================
💬 USER MESSAGE
========================
${text}

========================
✅ RESPONSE GUIDELINES
========================
- Use the memory above to personalize ONLY when relevant
- Maintain conversation continuity intelligently
- Respond naturally and clearly without sounding like a robot
- Do NOT repeat greetings (e.g., no "Hello again" in every message)
- Avoid asking for info already stored in memory
- Stay helpful, logical, and accurate
- If the user asks for facts: be precise
- If the user asks for opinions: be reasonable
- If you don’t know something, clearly say so instead of guessing
- Always respond in the SAME LANGUAGE as the user

========================
✍️ YOUR RESPONSE
`;

  const data = {
    model: model_n,
    messages: [
      { role: "system", content: ai_self },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
    tools: [
      {
        type: "browser_search"
      },
      {
        type: "code_interpreter"
      }
    ]
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.choices) {
      const reply = result.choices[0].message.content;
      addMessageToUI(reply, "assistant");
      await updateUserMemory(text, reply);
      updateMemoryDisplay();
    } else {
      addMessageToUI("⚠️ خطأ في الرد من API", "assistant");
    }
  } catch (error) {
    addMessageToUI("❌ فشل الاتصال بالخادم", "assistant");
  } finally {
    sendBtn.disabled = false;
    userInput.focus();
  }
}

async function updateUserMemory(userMsg, botMsg) {
  const memoryPrompt = `
أنت نظام إدارة الذاكرة. مهمتك هي تحديث ذاكرة المستخدم بذكاء بناءً على المحادثة الجديدة.

🧠 الذاكرة الحالية:
معلومات المستخدم: ${userMemory.userInfo}
النشاطات الحديثة: ${userMemory.recentActivities}

💬 المحادثة الجديدة:
المستخدم: ${userMsg}
المساعد: ${botMsg}

✅ المطلوب:
قم بتحديث الذاكرة بناءً على المعلومات الجديدة المهمة فقط.
احذف المعلومات المتكررة أو غير الضرورية.

📝 مخرجات يجب أن تكون باللغة الإنجليزية وبالهيكل التالي:

User Information:
- [معلومات جديدة عن المستخدم]

Recent Activities:
- [نشاطات جديدة]

إذا لم يكن هناك معلومات جديدة، اكتب "No updates".
`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "qwen/qwen3-32b",
        messages: [
          {
            role: "system",
            content: `You are a memory manager. Update user memory with important, long-term information only. Respond in English with the exact format requested.`,
          },
          { role: "user", content: memoryPrompt },
        ],
        temperature: 0.3,
      }),
    });

    const data = await res.json();

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error("❌ لا يوجد رد من API للذاكرة");
      return;
    }

    const newMemory = data.choices[0].message.content;

    // إذا لم يكن هناك تحديثات
    if (newMemory.includes("No updates")) {
      console.log("✅ لا توجد تحديثات جديدة للذاكرة");
      return;
    }

    // معالجة الذاكرة الجديدة
    let updatedUserInfo = userMemory.userInfo;
    let updatedRecentActivities = userMemory.recentActivities;

    // فصل أقسام الذاكرة
    const sections = newMemory.split(/\n\s*\n/);

    sections.forEach((section) => {
      if (section.includes("User Information:")) {
        const lines = section
          .split("\n")
          .filter((line) => line.trim() && !line.includes("User Information:"));
        if (lines.length > 0) {
          updatedUserInfo = lines.join("\n").substring(0, 500);
          console.log("📝 تم تحديث معلومات المستخدم");
        }
      }

      if (section.includes("Recent Activities:")) {
        const lines = section
          .split("\n")
          .filter(
            (line) => line.trim() && !line.includes("Recent Activities:")
          );
        if (lines.length > 0) {
          updatedRecentActivities = lines.join("\n").substring(0, 500);
          console.log("📝 تم تحديث النشاطات الحديثة");
        }
      }
    });

    // حفظ الذاكرة المحدثة
    userMemory = {
      userInfo: updatedUserInfo,
      recentActivities: updatedRecentActivities,
    };

    localStorage.setItem("mindoai_user_memory", JSON.stringify(userMemory));
    console.log("💾 تم حفظ الذاكرة بنجاح:", userMemory);
  } catch (err) {
    console.error("❌ فشل تحديث الذاكرة:", err);
  }
}

function updateMemoryDisplay() {
  const memoryPreview = document.getElementById("memory-preview");
  const memoryContent = document.getElementById("memory-content");

  if (memoryPreview && memoryContent) {
    // عرض معاينة أفضل
    const preview =
      userMemory.userInfo &&
      userMemory.userInfo !== "لا توجد معلومات عن المستخدم بعد."
        ? userMemory.userInfo.substring(0, 80) + "..."
        : "لا توجد معلومات شخصية محفوظة";

    memoryPreview.textContent = preview;

    // عرض محتوى الذاكرة بشكل منظم
    memoryContent.innerHTML = `
      <div class="memory-section">
        <strong>👤 المعلومات الشخصية:</strong>
        <p>${userMemory.userInfo || "لا توجد معلومات عن المستخدم بعد."}</p>
      </div>
      <div class="memory-section">
        <strong>📅 النشاطات الحديثة:</strong>
        <p>${userMemory.recentActivities || "لا توجد نشاطات حديثة مسجلة."}</p>
      </div>
    `;

    console.log("🔄 تم تحديث عرض الذاكرة");
  }
}

function toggleMemoryContent() {
  const memoryContent = document.getElementById("memory-content");
  memoryContent.classList.toggle("show");
}

function clearMemory() {
  if (
    confirm(
      "هل تريد مسح كل الذاكرة الشخصية؟ سيتم حذف جميع المعلومات المحفوظة عنك."
    )
  ) {
    userMemory = {
      userInfo: "لا توجد معلومات عن المستخدم بعد.",
      recentActivities: "لا توجد نشاطات حديثة مسجلة.",
    };
    localStorage.setItem("mindoai_user_memory", JSON.stringify(userMemory));
    updateMemoryDisplay();
    addMessageToUI("🧹 تم مسح الذاكرة الشخصية بالكامل.", "assistant");
  }
}

function handleKeyPress(event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }

  const textarea = event.target;
  textarea.style.height = "auto";
  textarea.style.height = Math.min(textarea.scrollHeight, 150) + "px";
}

function saveChats() {
  localStorage.setItem("mindoai_chats", JSON.stringify(chats));
}

function loadChats() {
  const savedChats = JSON.parse(localStorage.getItem("mindoai_chats"));
  if (savedChats) {
    chats = savedChats;
    renderChatsList();
  }
}

function setupResponsive() {
  const menuToggle = document.querySelector(".menu-toggle");
  const sidebar = document.getElementById("sidebar");

  if (window.innerWidth <= 768) {
    menuToggle.style.display = "block";
    sidebar.classList.remove("open");
  } else {
    menuToggle.style.display = "none";
    sidebar.classList.add("open");
  }

  window.addEventListener("resize", setupResponsive);
}

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("open");
}

function close_model_warn() {
  const Mwarn = document.querySelector(".model_warn");
  if (Mwarn) {
    Mwarn.classList.remove("show");
    Mwarn.removeAttribute("open");
  }
}















// تهيئة Highlight.js عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
  // تهيئة أولية بعد تحميل DOM
  setTimeout(() => {
    enhanceCodeBlocks();
  }, 100);
  
  // تهيئة إضافية بعد تحميل المحادثات
  setTimeout(() => {
    enhanceCodeBlocks();
  }, 500);
});

// إعادة تهيئة الأكواد عند تبديل المحادثات
function renderMessages(messages) {
  const chatBox = document.getElementById("chat-box");
  chatBox.innerHTML = "";

  if (messages.length === 0) {
    chatBox.innerHTML =
      '<div class="say_hi">أهلاً! كيف يمكنني مساعدتك اليوم؟</div>';
    return;
  }

  messages.forEach((msg) => {
    addMessageToUI(msg.content, msg.role, false);
  });

  chatBox.scrollTop = chatBox.scrollHeight;
  
  // إعادة تهيئة الأكواد بعد عرض الرسائل
  setTimeout(() => {
    enhanceCodeBlocks();
  }, 100);
}
