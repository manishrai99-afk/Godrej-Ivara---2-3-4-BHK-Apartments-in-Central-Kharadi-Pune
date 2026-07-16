const ADVISOR = {
  phone: "9673000053",
  phoneDisplay: "+91 96730 00053",
  whatsapp: "919673000053"
};

const modal = document.getElementById("leadModal");
const leadForm = document.getElementById("leadForm");
const interestField = document.getElementById("interestField");
const modalTitle = document.getElementById("modalTitle");
const modalSubtitle = document.getElementById("modalSubtitle");
const successToast = document.getElementById("successToast");
const chatPanel = document.getElementById("chatPanel");
const navToggle = document.querySelector(".nav-toggle");
const siteHeader = document.querySelector(".site-header");

const modalCopy = {
  enquiry: {
    title: "Register Here & Avail The Best Offers",
    subtitle: "Share your details to receive pricing, floor plans, and a personalised consultation.",
    interest: "General Enquiry"
  },
  brochure: {
    title: "Download Godrej Ivara Brochure",
    subtitle: "Get the complete project brochure with layouts, amenities, and location highlights.",
    interest: "Download Brochure"
  },
  pricing: {
    title: "Get Detailed Costing & Price Breakup",
    subtitle: "Receive a personalised cost sheet with launch offers and spot booking benefits.",
    interest: "Pricing & Costing Details"
  },
  floorplan: {
    title: "Request Floor Plan Details",
    subtitle: "Tell us your preferred configuration and we'll share the exact layout.",
    interest: "Floor Plan Request"
  },
  masterplan: {
    title: "Download Master Plan",
    subtitle: "Access the complete township master plan and tower layout.",
    interest: "Master Plan Download"
  },
  amenities: {
    title: "Download Amenities Brochure",
    subtitle: "Explore the full list of lifestyle amenities at Godrej Ivara.",
    interest: "Amenities Download"
  },
  gallery: {
    title: "Download Project Gallery",
    subtitle: "Receive high-resolution images of the project and lifestyle visuals.",
    interest: "Gallery Download"
  },
  sitevisit: {
    title: "Schedule a Free Site Visit",
    subtitle: "Book a complimentary guided visit with our property advisor.",
    interest: "Site Visit"
  },
  virtual: {
    title: "Request a Virtual Site Tour",
    subtitle: "Experience Godrej Ivara from anywhere with a guided virtual walkthrough.",
    interest: "Virtual Site Visit"
  },
  callback: {
    title: "Get Instant Call Back",
    subtitle: "Our advisor will call you within minutes to assist with your enquiry.",
    interest: "Instant Call Back"
  },
  quote: {
    title: "Get The Best Quote",
    subtitle: "Share your requirements and receive the most competitive offer available.",
    interest: "Best Quote"
  },
  whatsapp: {
    title: "Receive Pricing on WhatsApp",
    subtitle: "Share your details and we'll send pricing, offers, and floor plans on WhatsApp.",
    interest: "WhatsApp Pricing"
  }
};

function buildLeadMessage({ name, phone, email, interest }) {
  const lines = [
    "🏠 *New Lead — Godrej Ivara Kharadi*",
    "",
    `*Name:* ${name}`,
    `*Phone:* ${phone}`,
    email ? `*Email:* ${email}` : null,
    `*Interest:* ${interest}`,
    `*Time:* ${new Date().toLocaleString("en-IN")}`
  ].filter(Boolean);

  return lines.join("\n");
}

function openWhatsApp(message) {
  const url = `https://wa.me/${ADVISOR.whatsapp}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener");
}

function openModal(type = "enquiry", planName = "") {
  const copy = modalCopy[type] || modalCopy.enquiry;
  modalTitle.textContent = copy.title;
  modalSubtitle.textContent = copy.subtitle;
  interestField.value = planName ? `${copy.interest} — ${planName}` : copy.interest;
  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function showToast(message) {
  successToast.textContent = message;
  successToast.hidden = false;
  successToast.classList.add("show");
  window.setTimeout(() => {
    successToast.hidden = true;
    successToast.classList.remove("show");
  }, 4200);
}

function getLeadConfig() {
  return window.LEAD_CONFIG || {};
}

function saveLead(data) {
  const leads = JSON.parse(localStorage.getItem("godrej_ivara_leads") || "[]");
  leads.unshift({
    ...data,
    submittedAt: new Date().toISOString()
  });
  localStorage.setItem("godrej_ivara_leads", JSON.stringify(leads.slice(0, 200)));
}

async function submitLeadToGoogleSheet(lead) {
  const config = getLeadConfig();
  const scriptUrl = (config.googleScriptUrl || "").trim();

  if (!scriptUrl) {
    console.info("Google Sheet URL not configured. See google-apps-script/SETUP.txt");
    return { ok: false, reason: "not_configured" };
  }

  const payload = {
    name: lead.name,
    phone: lead.phone,
    email: lead.email,
    interest: lead.interest,
    source: config.projectName || "Godrej Ivara Website",
    pageUrl: window.location.href,
    submittedAt: new Date().toISOString()
  };

  try {
    await fetch(scriptUrl, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    return { ok: true, method: "post" };
  } catch (error) {
    try {
      const params = new URLSearchParams({
        name: payload.name,
        phone: payload.phone,
        email: payload.email,
        interest: payload.interest,
        source: payload.source,
        pageUrl: payload.pageUrl
      });
      await fetch(`${scriptUrl}?${params.toString()}`, { method: "GET", mode: "no-cors" });
      return { ok: true, method: "get_fallback" };
    } catch (fallbackError) {
      console.error("Lead sync failed:", fallbackError);
      return { ok: false, reason: "network_error" };
    }
  }
}

function downloadLeadsBackup() {
  const leads = JSON.parse(localStorage.getItem("godrej_ivara_leads") || "[]");
  if (!leads.length) return;

  const blob = new Blob([JSON.stringify(leads, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `godrej-ivara-leads-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
}

document.querySelectorAll("[data-open-modal]").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const type = trigger.dataset.openModal;
    const plan = trigger.dataset.plan || "";
    openModal(type, plan);
    if (chatPanel && !chatPanel.hidden) {
      chatPanel.hidden = true;
      document.querySelector(".chat-toggle").setAttribute("aria-expanded", "false");
    }
  });
});

document.querySelectorAll("[data-close-modal]").forEach((el) => {
  el.addEventListener("click", closeModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("active")) {
    closeModal();
  }
});

leadForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(leadForm);
  const name = String(formData.get("name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const country = String(formData.get("country") || "+91");
  const interest = String(formData.get("interest") || "General Enquiry");
  const fullPhone = `${country} ${phone}`;
  const submitBtn = leadForm.querySelector('button[type="submit"]');

  if (!name || phone.length !== 10) {
    showToast("Please enter a valid name and 10-digit mobile number.");
    return;
  }

  const lead = { name, phone: fullPhone, email, interest };
  const config = getLeadConfig();

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";
  }

  saveLead(lead);
  await submitLeadToGoogleSheet(lead);

  if (config.openWhatsAppOnSubmit !== false) {
    openWhatsApp(buildLeadMessage(lead));
  }

  leadForm.reset();
  closeModal();

  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.textContent = "Get Instant Call Back";
  }

  const hasSheet = Boolean((config.googleScriptUrl || "").trim());
  showToast(
    hasSheet
      ? "Thank you! Lead saved. We'll contact you shortly."
      : "Thank you! Lead sent on WhatsApp. We'll call you shortly."
  );
});

const chatToggle = document.querySelector(".chat-toggle");
const chatClose = document.querySelector(".chat-close");
const chatBody = document.getElementById("chatBody");

// Chat inline reply content for each action
const chatReplies = {
  pricing: {
    userMsg: "Pricing & Floor Plans",
    botMsg: `📊 <strong>Godrej Ivara Pricing:</strong><br>
• 2 BHK Premium — ₹1.15 Cr onwards (725–750 sq.ft.)<br>
• 3 BHK Elite — ₹1.41 Cr onwards (875–900 sq.ft.)<br>
• 3 BHK Ultra — ₹1.83 Cr onwards (1100–1150 sq.ft.)<br>
• 4 BHK Iconic — ₹2.79 Cr onwards (1550–1650 sq.ft.)<br>
<em>🎁 Launch Offer + Spot Booking Benefits available!</em>`,
    modalType: "pricing"
  },
  brochure: {
    userMsg: "Download Brochure",
    botMsg: `📄 <strong>Godrej Ivara Brochure</strong> includes:<br>
• Complete floor plans & layouts<br>
• Amenities & lifestyle details<br>
• Location map & connectivity<br>
• RERA & legal details<br>
<em>Share your details to receive it instantly!</em>`,
    modalType: "brochure"
  },
  quote: {
    userMsg: "Get The Best Quote",
    botMsg: `💰 <strong>Exclusive Launch Benefits:</strong><br>
• EOI from just ₹2 Lakhs<br>
• Spot Booking offer: Save ₹5–30 Lakhs<br>
• Pre-launch pricing advantage<br>
• Priority unit selection<br>
<em>Share your details for a personalised quote!</em>`,
    modalType: "quote"
  },
  virtual: {
    userMsg: "Site Visit / Virtual Tour",
    botMsg: `🏠 <strong>Visit Godrej Ivara:</strong><br>
• 📍 Upper Kharadi Main Rd, Wagholi, Pune<br>
• Free complimentary site visit arranged<br>
• Virtual walkthrough available from home<br>
• Mon–Sun: 10 AM – 7 PM<br>
<em>Book your slot — it's 100% free!</em>`,
    modalType: "virtual"
  },
  whatsapp: {
    userMsg: "Pricing on WhatsApp",
    botMsg: `💬 <strong>Get on WhatsApp:</strong><br>
• Instant pricing sheet sent to your WhatsApp<br>
• Floor plans & layout images<br>
• Latest offers & cost sheet<br>
• Quick query resolution<br>
<em>Share your number — we'll send it now!</em>`,
    modalType: "whatsapp"
  },
  callback: {
    userMsg: "Get A Call Back",
    botMsg: `📞 <strong>Call Back within 5 Minutes!</strong><br>
• Speak directly with Rahul Agarwal<br>
• Get personalised pricing guidance<br>
• All queries answered on call<br>
• Available: Mon–Sun, 9 AM – 9 PM<br>
<em>Drop your number — calling you shortly!</em>`,
    modalType: "callback"
  }
};

function addChatMessage(html, isUser = false) {
  const row = document.createElement("div");
  row.className = `chat-msg-row ${isUser ? "user" : "advisor"}`;

  if (!isUser) {
    const av = document.createElement("span");
    av.className = "chat-msg-avatar";
    av.textContent = "RA";
    row.appendChild(av);
  }

  const bubble = document.createElement("p");
  bubble.className = "chat-bubble";
  bubble.innerHTML = html;
  row.appendChild(bubble);

  // Insert before chat-actions
  const actions = document.getElementById("chatActions");
  chatBody.insertBefore(row, actions);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function handleChatAction(actionKey) {
  const reply = chatReplies[actionKey];
  if (!reply) return;

  // Hide actions after selection
  const actions = document.getElementById("chatActions");
  if (actions) actions.style.display = "none";

  // Add user message bubble
  addChatMessage(reply.userMsg, true);

  // Add bot typing indicator then reply
  const typingRow = document.createElement("div");
  typingRow.className = "chat-msg-row advisor";
  typingRow.innerHTML = `<span class="chat-msg-avatar">RA</span><p class="chat-bubble chat-typing"><span></span><span></span><span></span></p>`;
  chatBody.insertBefore(typingRow, document.getElementById("chatActions"));
  chatBody.scrollTop = chatBody.scrollHeight;

  window.setTimeout(() => {
    typingRow.remove();
    addChatMessage(reply.botMsg, false);

    // After showing reply, add "Share Details" CTA bubble
    window.setTimeout(() => {
      const ctaRow = document.createElement("div");
      ctaRow.className = "chat-msg-row advisor";

      const av = document.createElement("span");
      av.className = "chat-msg-avatar";
      av.textContent = "RA";

      const ctaBubble = document.createElement("p");
      ctaBubble.className = "chat-bubble chat-cta-bubble";

      const ctaBtn = document.createElement("button");
      ctaBtn.className = "chat-cta-btn";
      ctaBtn.textContent = "Share My Details →";
      ctaBtn.addEventListener("click", () => {
        openModal(reply.modalType);
      });

      ctaBubble.appendChild(ctaBtn);
      ctaRow.appendChild(av);
      ctaRow.appendChild(ctaBubble);
      chatBody.insertBefore(ctaRow, document.getElementById("chatActions"));
      chatBody.scrollTop = chatBody.scrollHeight;

      // Show actions again with "Ask something else" option
      const resetRow = document.createElement("div");
      resetRow.className = "chat-msg-row center";
      resetRow.innerHTML = `<button class="chat-reset-btn" id="chatResetBtn">⬅ Ask something else</button>`;
      chatBody.insertBefore(resetRow, document.getElementById("chatActions"));

      document.getElementById("chatResetBtn").addEventListener("click", () => {
        // Remove all dynamic rows and show actions again
        chatBody.querySelectorAll(".chat-msg-row:not(.advisor:first-child)").forEach(el => el.remove());
        if (actions) actions.style.display = "";
        chatBody.scrollTop = 0;
      });

      chatBody.scrollTop = chatBody.scrollHeight;
    }, 400);
  }, 900);
}

// Bind chat action buttons
document.querySelectorAll("[data-chat-action]").forEach((btn) => {
  btn.addEventListener("click", () => {
    handleChatAction(btn.dataset.chatAction);
  });
});

if (chatToggle && chatPanel) {
  chatToggle.addEventListener("click", () => {
    const isOpen = !chatPanel.hidden;
    chatPanel.hidden = isOpen;
    chatToggle.setAttribute("aria-expanded", String(!isOpen));
  });
}

if (chatClose && chatPanel) {
  chatClose.addEventListener("click", () => {
    chatPanel.hidden = true;
    chatToggle.setAttribute("aria-expanded", "false");
  });
}

if (navToggle && siteHeader) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteHeader.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

window.setTimeout(() => openModal("enquiry"), 1200);

window.GodrejIvaraLeads = {
  getAll: () => JSON.parse(localStorage.getItem("godrej_ivara_leads") || "[]"),
  export: downloadLeadsBackup,
  advisor: ADVISOR
};
