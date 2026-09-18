// @ts-nocheck -- Unmigrated behavior; JavaScript checks cover the React foundation.
import { setScrollLock } from "./scroll-lock";
import {
  siRuby,
  siJavascript,
  siHtml5,
  siCss3,
  siSass,
  siRubyonrails,
  siReact,
  siNodedotjs,
  siPostgresql,
  siGit,
  siGithub,
  siPostman,
  siHeroku,
  siSelenium,
  siFigma,
  siAdobephotoshop,
  siAdobeillustrator,
  siAmazonaws,
  siElasticsearch,
  siPhp,
  siPython,
  siLaravel,
  siJenkins,
  siTensorflow,
  siScikitlearn,
  siPandas,
  siPowerbi,
  siNumpy,
  siTableau,
  siTailwindcss,
} from "simple-icons";
import { inject } from "@vercel/analytics";

// 1. Render skill icons
const languagesEl = document.querySelector(".language-icons");
const developmentEl = document.querySelector(".development-icons");
const toolsEl = document.querySelector(".tool-icons");
const dataAiMlEl = document.querySelector(".data-ai-ml-icons");
const designEl = document.querySelector(".design-icons");

const languageIcons = [
  siRuby,
  siJavascript,
  siPython,
  siPhp,
  siHtml5,
  siCss3,
  siSass,
];
const developmentIcons = [
  siRubyonrails,
  siLaravel,
  siReact,
  siTailwindcss,
  siNodedotjs,
  siPostgresql,
  siElasticsearch,
];
const toolIcons = [
  siGit,
  siGithub,
  siPostman,
  siJenkins,
  siAmazonaws,
  siHeroku,
  siSelenium,
];
const dataAiMlIcons = [
  siPandas,
  siNumpy,
  siPowerbi,
  siTableau,
  siScikitlearn,
  siTensorflow,
];
const designIcons = [siFigma, siAdobephotoshop, siAdobeillustrator];

function renderSkillIcons(el, iconsArr) {
  iconsArr.forEach((iconObj) => {
    const icon = document.createElement("li");
    icon.classList.add("skill-icon");
    icon.innerHTML = iconObj.svg;
    el.insertAdjacentElement("beforeend", icon);

    const label = document.createElement("span");
    label.classList.add("icon-label");
    label.innerHTML = iconObj.title;
    label.style.opacity = 0;
    label.style.transition = "opacity 0.25s ease-in-out";
    icon.insertAdjacentElement("beforeend", label);

    icon.addEventListener("mouseover", () => {
      icon.children[0].style.fill = `#${iconObj.hex}`;
      label.style.opacity = 1;
    });

    icon.addEventListener("mouseleave", () => {
      icon.children[0].style.fill = "";
      label.style.opacity = 0;
    });
  });
}

[
  [languagesEl, languageIcons],
  [developmentEl, developmentIcons],
  [toolsEl, toolIcons],
  [dataAiMlEl, dataAiMlIcons],
  [designEl, designIcons],
].forEach((arr) => renderSkillIcons(arr[0], arr[1]));

// 2. Handle modal window

const modal = document.querySelector(".modal");
const modalDialog = document.querySelector(".modal-dialog");
const btnCloseModal = document.querySelector(".modal__close");
const allContactButtons = document.querySelectorAll(".btn-contact");
let contactReturnFocus;

// Temporary React-to-legacy boundary; keep form submission owned here until #29.
export function openLegacyContact(returnFocus = document.activeElement) {
  contactReturnFocus = returnFocus;
  modal.classList.remove("hidden");
  modalDialog.classList.remove("hidden");
  setScrollLock("contact", true);
  btnCloseModal.focus();

  // Initialize time-to-submit timestamp and reset honeypot
  try {
    const ts = document.getElementById("form-started-at");
    if (ts) ts.value = Date.now().toString();
    const hp = document.getElementById("website");
    if (hp) hp.value = "";
  } catch (_) {}
};

const closeModal = function () {
  modal.classList.add("hidden");
  modalDialog.classList.add("hidden");
  setScrollLock("contact", false);
  contactReturnFocus?.focus();
};

allContactButtons.forEach((btn) => btn.addEventListener("click", () => openLegacyContact(btn)));

btnCloseModal.addEventListener("click", closeModal);

// Close modal if clicking outside of it
// window.onclick = function (e) {
//   if (e.target == modal && !modal.classList.contains("hidden")) {
//     closeModal();
//   }
// };

document.addEventListener("keydown", (event) => {
  if (modal.classList.contains("hidden")) return;
  if (event.key === "Escape") closeModal();
  if (event.key === "Tab") {
    const controls = modal.querySelectorAll('button, input:not([type="hidden"]):not([tabindex="-1"]), textarea');
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

// Handle contact form

const contactForm = document.getElementById("contact-form");
const formStatus = contactForm.querySelector(".form-status");
const modalBody = document.querySelector(".modal__body");

const successMarkup = `
    <div class="notice-success">
        <span class="icon-success"></span>
        <p class="message-success">Thanks for contacting me. I will get back to you ASAP.</p>
    </div>
`;

async function handleFormSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const payload = {
    name: form.querySelector("#name")?.value || "",
    email: form.querySelector("#email")?.value || "",
    phone: form.querySelector("#phone")?.value || "",
    subject: form.querySelector("#subject")?.value || "",
    message: form.querySelector("#message")?.value || "",
    website: form.querySelector("#website")?.value || "",
    formStartedAt: form.querySelector("#form-started-at")?.value || "",
  };

  // Refresh reCAPTCHA v3 token right before submit to avoid expiry
  try {
    const siteKey = form?.dataset?.recaptchaSiteKey;
    if (window.grecaptcha && siteKey) {
      await grecaptcha.ready(async function () {
        try {
          const token = await grecaptcha.execute(siteKey, { action: "submit" });
          const hidden = form.querySelector("#g-recaptcha-response");
          if (hidden) hidden.value = token;
          payload["g-recaptcha-response"] = token;
        } catch (e) {
          console.error("Error fetching reCAPTCHA token:", e);
        }
      });
    }
  } catch (_) {
    console.error("Error initializing reCAPTCHA:", _);
  }

  try {
    const response = await fetch(e.target.action, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      formStatus.classList.remove("hidden");
      modalBody.innerHTML = successMarkup;
    } else {
      const data = await response.json().catch(() => ({}));
      if (Object.hasOwn(data, "errors")) {
        throw new Error(
          data["errors"].map((error) => error["message"]).join(", ")
        );
      } else {
        throw new Error(
          "Oops! Something weird has happened. Please try again."
        );
      }
    }
  } catch (error) {
    formStatus.classList.remove("hidden");
    formStatus.innerHTML = error.message;
  }
}

contactForm.addEventListener("submit", handleFormSubmit);

// Update footer year
(function () {
  try {
    var el = document.getElementById("current-year");
    if (el) el.textContent = new Date().getFullYear();
  } catch (e) {
    console.error(e);
  }
})();

// Vercel analytics
inject();
