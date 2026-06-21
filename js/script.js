/* =========================================================
   GAIDI WEBSITE ADVANCED JAVASCRIPT
   File: js/script.js

   Controls:
   1. Animated counters
   2. Mobile hamburger menu
   3. Advanced GAIDI Assistant chatbot
   4. Time-based greetings
   5. Typing effect
   6. Chat history with localStorage
   7. Smart quick cards and related suggestions
========================================================= */


/* =========================================================
   1. ANIMATED COUNTERS
========================================================= */

const counters = document.querySelectorAll(".counter");

if (counters.length > 0) {
    counters.forEach(function(counter) {
        counter.innerText = "0";

        function updateCounter() {
            const target = Number(counter.getAttribute("data-target"));
            const current = Number(counter.innerText.replace("+", ""));
            const increment = Math.ceil(target / 100);

            if (current < target) {
                counter.innerText = current + increment;
                setTimeout(updateCounter, 25);
            } else {
                counter.innerText = target + "+";
            }
        }

        updateCounter();
    });
}


/* =========================================================
   2. MOBILE HAMBURGER MENU
========================================================= */

function toggleMenu() {
    const navMenu = document.getElementById("navMenu");

    if (navMenu) {
        navMenu.classList.toggle("show");
    }
}


/* =========================================================
   3. CHATBOT GLOBAL SETTINGS
========================================================= */

const chatStorageKey = "gaidi_advanced_chat_history";

document.addEventListener("DOMContentLoaded", function() {
    initialiseChatbot();

    const userInput = document.getElementById("userInput");

    if (userInput) {
        userInput.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                sendMessage();
            }
        });
    }
});


/* =========================================================
   4. INITIALISE CHATBOT
========================================================= */

function initialiseChatbot() {
    const chatMessages = document.getElementById("chatMessages");

    if (!chatMessages) {
        return;
    }

    const history = JSON.parse(localStorage.getItem(chatStorageKey)) || [];

    if (history.length > 0) {
        chatMessages.innerHTML = "";

        history.forEach(function(item) {
            addMessage(item.text, item.className, false);
        });

        return;
    }

    chatMessages.innerHTML = "";

    const welcomeMessage = `
        <strong>${getTimeGreeting()}</strong><br>
        Welcome to <strong>GAIDI Assistant</strong>.<br><br>
        I can help you learn about GAIDI programs, volunteering, membership,
        partnerships, resources, governance and contact information.
        <br><br>
        <div class="chat-card-grid">
            <button onclick="quickReply('Programs')">Programs</button>
            <button onclick="quickReply('Volunteer')">Volunteer</button>
            <button onclick="quickReply('Membership')">Membership</button>
            <button onclick="quickReply('Partnerships')">Partnerships</button>
            <button onclick="quickReply('Resources')">Resources</button>
            <button onclick="quickReply('Contact')">Contact</button>
        </div>
    `;

    addMessage(welcomeMessage, "bot-message", true);
}


/* =========================================================
   5. TIME-BASED GREETING
========================================================= */

function getTimeGreeting() {
    const hour = new Date().getHours();

    if (hour < 12) {
        return "Good morning";
    }

    if (hour < 17) {
        return "Good afternoon";
    }

    return "Good evening";
}


/* =========================================================
   6. OPEN AND CLOSE CHATBOT
========================================================= */

function toggleChatbot() {
    const chatbot = document.getElementById("chatbot");

    if (chatbot) {
        chatbot.classList.toggle("show");
    }
}


/* =========================================================
   7. QUICK REPLY
========================================================= */

function quickReply(question) {
    const input = document.getElementById("userInput");

    if (input) {
        input.value = question;
        sendMessage();
    }
}


/* =========================================================
   8. SEND MESSAGE
========================================================= */

function sendMessage() {
    const input = document.getElementById("userInput");

    if (!input) {
        return;
    }

    const userMessage = input.value.trim();

    if (userMessage === "") {
        return;
    }

    addMessage(userMessage, "user-message", true);

    input.value = "";

    if (
        userMessage.toLowerCase() === "clear" ||
        userMessage.toLowerCase() === "clear chat" ||
        userMessage.toLowerCase() === "reset"
    ) {
        setTimeout(function() {
            clearChatHistory();
        }, 300);

        return;
    }

    showTyping();

    setTimeout(function() {
        removeTyping();

        const botResponse = getBotResponse(userMessage.toLowerCase());

        addMessage(botResponse, "bot-message", true);

    }, 1000);
}


/* =========================================================
   9. ADD MESSAGE
========================================================= */

function addMessage(text, className, saveToHistory) {
    const chatMessages = document.getElementById("chatMessages");

    if (!chatMessages) {
        return;
    }

    const messageDiv = document.createElement("div");
    messageDiv.className = className;
    messageDiv.innerHTML = text;

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    if (saveToHistory) {
        saveMessage(text, className);
    }
}


/* =========================================================
   10. TYPING EFFECT
========================================================= */

function showTyping() {
    const chatMessages = document.getElementById("chatMessages");

    if (!chatMessages) {
        return;
    }

    const typingDiv = document.createElement("div");
    typingDiv.className = "bot-message typing-message";
    typingDiv.id = "typingMessage";
    typingDiv.innerHTML = "GAIDI Assistant is typing...";

    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTyping() {
    const typingMessage = document.getElementById("typingMessage");

    if (typingMessage) {
        typingMessage.remove();
    }
}


/* =========================================================
   11. SAVE AND CLEAR CHAT HISTORY
========================================================= */

function saveMessage(text, className) {
    let history = JSON.parse(localStorage.getItem(chatStorageKey)) || [];

    history.push({
        text: text,
        className: className
    });

    localStorage.setItem(chatStorageKey, JSON.stringify(history));
}

function clearChatHistory() {
    localStorage.removeItem(chatStorageKey);

    const chatMessages = document.getElementById("chatMessages");

    if (chatMessages) {
        chatMessages.innerHTML = "";

        const resetMessage = `
            Chat cleared successfully.<br><br>
            ${getTimeGreeting()} 👋<br>
            I am GAIDI Assistant. How can I help you today?
            <br><br>
            <div class="chat-card-grid">
                <button onclick="quickReply('Programs')">Programs</button>
                <button onclick="quickReply('Volunteer')">Volunteer</button>
                <button onclick="quickReply('Membership')">Membership</button>
                <button onclick="quickReply('Partnerships')">Partnerships</button>
                <button onclick="quickReply('Resources')">Resources</button>
                <button onclick="quickReply('Contact')">Contact</button>
            </div>
        `;

        addMessage(resetMessage, "bot-message", true);
    }
}


/* =========================================================
   12. RELATED TOPIC SUGGESTIONS
========================================================= */

function relatedTopics(topics) {
    let buttons = `<br><br><strong>You may also want to explore:</strong><br><div class="chat-card-grid">`;

    topics.forEach(function(topic) {
        buttons += `<button onclick="quickReply('${topic}')">${topic}</button>`;
    });

    buttons += `</div>`;

    return buttons;
}


/* =========================================================
   13. CHATBOT RESPONSE ENGINE
========================================================= */

function getBotResponse(message) {

    if (
        message.includes("hello") ||
        message.includes("hi") ||
        message.includes("good morning") ||
        message.includes("good afternoon") ||
        message.includes("good evening") ||
        message.includes("hey")
    ) {
        return `
            ${getTimeGreeting()} 👋<br>
            Welcome to GAIDI Assistant. I can help you find information about
            programs, volunteering, membership, partnerships, resources and contact details.
            ${relatedTopics(["Programs", "Volunteer", "Membership", "Contact"])}
        `;
    }

    if (
        message.includes("what is gaidi") ||
        message.includes("about") ||
        message.includes("who are you") ||
        message.includes("meaning of gaidi")
    ) {
        return `
            GAIDI stands for <strong>Global All Integrated Development Initiative</strong>.
            It is a community-driven organization based in Gulu City, Uganda.
            GAIDI focuses on health, livelihoods, education, research and disability inclusion.
            <br><br>
            <a href="about.html">Learn More About GAIDI</a>
            ${relatedTopics(["Programs", "Governance", "Founders"])}
        `;
    }

    if (
        message.includes("vision") ||
        message.includes("mission")
    ) {
        return `
            GAIDI's vision is to be a leading catalyst for inclusive and sustainable
            socio-economic transformation among vulnerable and underserved communities.
            <br><br>
            Its mission is to empower vulnerable populations through integrated,
            innovative and community-driven interventions.
            <br><br>
            <a href="about.html">Read About GAIDI</a>
            ${relatedTopics(["Programs", "Impact", "Partnerships"])}
        `;
    }

    if (
        message.includes("program") ||
        message.includes("pillar") ||
        message.includes("what do you do") ||
        message.includes("activities")
    ) {
        return `
            GAIDI works through four main programmatic pillars:
            <br><br>
            1. Health & Wellbeing<br>
            2. Livelihoods & Economic Empowerment<br>
            3. Education, Innovation & Research<br>
            4. Disability Inclusion & Empowerment
            <br><br>
            <a href="programs.html">View Programs</a>
            ${relatedTopics(["Health", "Education", "Agriculture", "Disability"])}
        `;
    }

    if (
        message.includes("volunteer") ||
        message.includes("join as volunteer") ||
        message.includes("volunteering")
    ) {
        return `
            You can volunteer with GAIDI in health outreach, education, research,
            disability inclusion, communications, events and community mobilization.
            <br><br>
            <a href="volunteer.html">Go to Volunteer Page</a>
            ${relatedTopics(["Membership", "Programs", "Contact"])}
        `;
    }

    if (
        message.includes("member") ||
        message.includes("membership") ||
        message.includes("join gaidi")
    ) {
        return `
            GAIDI offers individual, institutional, international and honorary membership.
            Members support the organization's mission, governance, programs and community impact.
            <br><br>
            <a href="membership.html">Apply for Membership</a>
            ${relatedTopics(["Volunteer", "Governance", "Contact"])}
        `;
    }

    if (
        message.includes("partner") ||
        message.includes("donor") ||
        message.includes("support") ||
        message.includes("fund") ||
        message.includes("collaborate")
    ) {
        return `
            GAIDI welcomes partnerships with donors, NGOs, government institutions,
            academic institutions, private sector actors and community groups.
            <br><br>
            <a href="partners.html">Visit Partnerships Page</a>
            ${relatedTopics(["Impact", "Resources", "Contact"])}
        `;
    }

    if (
        message.includes("contact") ||
        message.includes("phone") ||
        message.includes("email") ||
        message.includes("call")
    ) {
        return `
            You can contact GAIDI through:
            <br><br>
            <strong>Phone:</strong> +256 779 481 284 / +256 773 028 180<br>
            <strong>Email:</strong> info@gaidiuganda.org<br>
            <strong>Location:</strong> Gulu City, Uganda
            <br><br>
            <a href="contact.html">Open Contact Page</a>
            ${relatedTopics(["Volunteer", "Membership", "Partnerships"])}
        `;
    }

    if (
        message.includes("disability") ||
        message.includes("pwd") ||
        message.includes("sign language") ||
        message.includes("inclusion")
    ) {
        return `
            GAIDI promotes disability inclusion through advocacy, sign language training,
            accessibility promotion, inclusive education, talent development and empowerment
            of persons with disabilities.
            <br><br>
            <a href="programs.html">View Disability Inclusion Programs</a>
            ${relatedTopics(["Volunteer", "Programs", "Impact"])}
        `;
    }

    if (
        message.includes("health") ||
        message.includes("wellbeing") ||
        message.includes("wash") ||
        message.includes("nutrition")
    ) {
        return `
            GAIDI promotes health and wellbeing through community health education,
            disease prevention, nutrition, WASH, mental health and community wellbeing initiatives.
            <br><br>
            <a href="programs.html">View Health Programs</a>
            ${relatedTopics(["Volunteer", "Impact", "Partnerships"])}
        `;
    }

    if (
        message.includes("education") ||
        message.includes("research") ||
        message.includes("innovation") ||
        message.includes("students")
    ) {
        return `
            GAIDI supports education, innovation and research through mentorship,
            digital literacy, learning support, community research and knowledge sharing.
            <br><br>
            <a href="programs.html">View Education and Research Programs</a>
            ${relatedTopics(["Resources", "Volunteer", "Impact"])}
        `;
    }

    if (
        message.includes("livelihood") ||
        message.includes("agriculture") ||
        message.includes("farming") ||
        message.includes("business") ||
        message.includes("entrepreneurship")
    ) {
        return `
            GAIDI supports livelihoods through agriculture, agribusiness, entrepreneurship,
            vocational skills, financial literacy and economic empowerment.
            <br><br>
            <a href="programs.html">View Livelihood Programs</a>
            ${relatedTopics(["Programs", "Partnerships", "Impact"])}
        `;
    }

    if (
        message.includes("resource") ||
        message.includes("download") ||
        message.includes("constitution") ||
        message.includes("strategic plan") ||
        message.includes("report")
    ) {
        return `
            You can download GAIDI documents such as the Constitution,
            Strategic Plan, Annual Report and Newsletter from the Resource Centre.
            <br><br>
            <a href="resources.html">Open Resource Centre</a>
            ${relatedTopics(["Governance", "Impact", "Contact"])}
        `;
    }

    if (
        message.includes("founder") ||
        message.includes("leadership") ||
        message.includes("director")
    ) {
        return `
            GAIDI was founded by Dr. Felix Eling Michael and co-founded by Mr. Ayaka Isaac.
            You can learn more about their professional backgrounds and vision on the Founders page.
            <br><br>
            <a href="founders.html">View Founders Page</a>
            ${relatedTopics(["Governance", "About", "Contact"])}
        `;
    }

    if (
        message.includes("governance") ||
        message.includes("board") ||
        message.includes("trustees") ||
        message.includes("structure")
    ) {
        return `
            GAIDI is governed through structures including the General Assembly,
            Board of Trustees, Executive Committee, Executive Director,
            Secretariat and Standing Committees.
            <br><br>
            <a href="governance.html">View Governance Page</a>
            ${relatedTopics(["Resources", "Founders", "Membership"])}
        `;
    }

    if (
        message.includes("news") ||
        message.includes("updates") ||
        message.includes("activities")
    ) {
        return `
            You can follow GAIDI updates, announcements and activities on the News page.
            <br><br>
            <a href="news.html">Open News Page</a>
            ${relatedTopics(["Gallery", "Impact", "Programs"])}
        `;
    }

    if (
        message.includes("gallery") ||
        message.includes("photos") ||
        message.includes("pictures")
    ) {
        return `
            You can view GAIDI photos and activity images in the Photo Gallery.
            <br><br>
            <a href="gallery.html">Open Gallery</a>
            ${relatedTopics(["News", "Impact", "Programs"])}
        `;
    }

    if (
        message.includes("impact") ||
        message.includes("results") ||
        message.includes("achievements")
    ) {
        return `
            GAIDI tracks its work through monitoring, evaluation, research and learning.
            The Impact page highlights program areas, future targets and community transformation priorities.
            <br><br>
            <a href="impact.html">View Impact Page</a>
            ${relatedTopics(["Resources", "Partnerships", "News"])}
        `;
    }

    if (
        message.includes("clear") ||
        message.includes("reset")
    ) {
        return `
            To clear this conversation, type <strong>clear chat</strong>.
        `;
    }

    return `
        Thank you for your question. I may not have a full answer yet.
        Please contact GAIDI directly through WhatsApp or the Contact page for more assistance.
        ${relatedTopics(["Programs", "Volunteer", "Membership", "Contact"])}
    `;
}