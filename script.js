/* GAIDI WEBSITE SCRIPT */

/* COUNTERS */
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

/* MOBILE MENU */
function toggleMenu() {
    const navMenu = document.getElementById("navMenu");
    if (navMenu) {
        navMenu.classList.toggle("show");
    }
}

/* GOOGLE SHEETS FORM URL */
const gaidiFormURL = "https://script.google.com/macros/s/AKfycbxJUEPDI-jKRszZ0P__BLKthGKGatx4methTzlhv4Ya6wbD5rB_Yjzxw-PhQ8osCzPDYQ/exec";

/* FORM SUBMISSION */
function submitGAIDIForm(formType, formData, formElement) {
    fetch(gaidiFormURL, {
        method: "POST",
        body: JSON.stringify({
            formType: formType,
            ...formData
        })
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        alert("Thank you. Your submission has been received successfully.");
        formElement.reset();
    })
    .catch(function(error) {
        alert("Submission failed. Please try again or contact GAIDI directly.");
        console.error("Error:", error);
    });
}

/* CONTACT FORM */
function submitContactForm(formElement) {
    submitGAIDIForm("contact", {
        fullName: formElement.fullName.value,
        email: formElement.email.value,
        phone: formElement.phone.value,
        subject: formElement.subject.value,
        message: formElement.message.value
    }, formElement);
}

/* VOLUNTEER FORM */
function submitVolunteerForm(formElement) {
    submitGAIDIForm("volunteer", {
        fullName: formElement.fullName.value,
        email: formElement.email.value,
        phone: formElement.phone.value,
        location: formElement.location.value,
        area: formElement.area.value,
        availability: formElement.availability.value,
        message: formElement.message.value
    }, formElement);
}

/* MEMBERSHIP FORM */
function submitMembershipForm(formElement) {
    submitGAIDIForm("membership", {
        fullName: formElement.fullName.value,
        email: formElement.email.value,
        phone: formElement.phone.value,
        location: formElement.location.value,
        category: formElement.category.value,
        message: formElement.message.value
    }, formElement);
}

/* CHATBOT */
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

function toggleChatbot() {
    const chatbot = document.getElementById("chatbot");

    if (chatbot) {
        chatbot.classList.toggle("show");
    }
}

function quickReply(question) {
    const input = document.getElementById("userInput");

    if (input) {
        input.value = question;
        sendMessage();
    }
}

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

function relatedTopics(topics) {
    let buttons = `<br><br><strong>You may also want to explore:</strong><br><div class="chat-card-grid">`;

    topics.forEach(function(topic) {
        buttons += `<button onclick="quickReply('${topic}')">${topic}</button>`;
    });

    buttons += `</div>`;

    return buttons;
}

function getBotResponse(message) {
    if (message.includes("hello") || message.includes("hi") || message.includes("good morning") || message.includes("good afternoon") || message.includes("good evening")) {
        return `${getTimeGreeting()} 👋<br>Welcome to GAIDI Assistant.${relatedTopics(["Programs", "Volunteer", "Membership", "Contact"])}`;
    }

    if (message.includes("program") || message.includes("pillar") || message.includes("what do you do")) {
        return `GAIDI works through four main pillars: Health & Wellbeing, Livelihoods & Economic Empowerment, Education, Innovation & Research, and Disability Inclusion & Empowerment.<br><br><a href="programs.html">View Programs</a>${relatedTopics(["Volunteer", "Membership", "Partnerships"])}`;
    }

    if (message.includes("volunteer")) {
        return `You can volunteer with GAIDI in health outreach, education, research, disability inclusion, communications, events and community mobilization.<br><br><a href="volunteer.html">Go to Volunteer Page</a>${relatedTopics(["Membership", "Programs", "Contact"])}`;
    }

    if (message.includes("member") || message.includes("membership")) {
        return `GAIDI offers individual, institutional, international and honorary membership.<br><br><a href="membership.html">Apply for Membership</a>${relatedTopics(["Volunteer", "Governance", "Contact"])}`;
    }

    if (message.includes("partner") || message.includes("donor") || message.includes("support")) {
        return `GAIDI welcomes partnerships with donors, NGOs, government institutions, academic institutions, private sector actors and community groups.<br><br><a href="partners.html">Visit Partnerships Page</a>${relatedTopics(["Impact", "Resources", "Contact"])}`;
    }

    if (message.includes("contact") || message.includes("phone") || message.includes("email")) {
        return `Phone: +256 779 481 284 / +256 773 028 180<br>Email: info@gaidiuganda.org<br>Location: Gulu City, Uganda.<br><br><a href="contact.html">Open Contact Page</a>`;
    }

    if (message.includes("resource") || message.includes("download") || message.includes("constitution") || message.includes("report")) {
        return `You can download GAIDI documents from the Resource Centre.<br><br><a href="resources.html">Open Resource Centre</a>`;
    }

    if (message.includes("governance") || message.includes("board")) {
        return `GAIDI is governed through structures including the General Assembly, Board of Trustees, Executive Committee, Executive Director, Secretariat and Standing Committees.<br><br><a href="governance.html">View Governance Page</a>`;
    }

    if (message.includes("founder") || message.includes("leadership")) {
        return `GAIDI was founded by Dr. Felix Eling Michael and co-founded by Mr. Ayaka Isaac.<br><br><a href="founders.html">View Founders Page</a>`;
    }

    return `Thank you for your question. Please contact GAIDI directly through WhatsApp or the Contact page for more assistance.<br><br><a href="contact.html">Contact GAIDI</a>`;
}