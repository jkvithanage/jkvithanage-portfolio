import {
    siRuby,
    siJavascript,
    siTypescript,
    siHtml5,
    siCss3,
    siSass,
    siRubyonrails,
    siReact,
    siRedux,
    siNodedotjs,
    siBootstrap,
    siPostgresql,
    siGit,
    siGithub,
    siPostman,
    siVisualstudiocode,
    siHeroku,
    siSelenium,
    siFigma,
    siAdobephotoshop,
    siAdobeillustrator,
} from "simple-icons";

// 1. Render skill icons
const languagesEl = document.querySelector(".language-icons");
const developmentEl = document.querySelector(".development-icons");
const toolsEl = document.querySelector(".tool-icons");
const designEl = document.querySelector(".design-icons");

const languageIcons = [siRuby, siJavascript, siTypescript, siHtml5, siCss3, siSass];
const developmentIcons = [siRubyonrails, siReact, siRedux, siNodedotjs, siBootstrap, siPostgresql];
const toolIcons = [siGit, siGithub, siPostman, siVisualstudiocode, siHeroku, siSelenium];
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
    [designEl, designIcons],
].forEach((arr) => renderSkillIcons(arr[0], arr[1]));

// 2. Handle modal window

const body = document.querySelector("body");
const modal = document.querySelector(".modal");
const btnCloseModal = document.querySelector(".modal__close");
const allContactButtons = document.querySelectorAll(".btn-contact");
const navbar = document.querySelector(".nav");
const navClickables = document.querySelectorAll("nav .nav__link");
const ham = document.querySelector("#hamburger");

const openModal = function () {
    modal.classList.remove("visually-hidden");
    ham.checked = false;
    body.classList.add("overflow-hidden");
};

const closeModal = function () {
    modal.classList.add("visually-hidden");
    body.classList.remove("overflow-hidden");
};

allContactButtons.forEach((btn) => btn.addEventListener("click", openModal));

btnCloseModal.addEventListener("click", closeModal);

window.onclick = function (e) {
    if (e.target == modal && !modal.classList.contains("visually-hidden")) {
        closeModal();
    }
};

window.onkeydown = function (e) {
    if (e.key === "Escape" && !modal.classList.contains("visually-hidden")) {
        closeModal();
    }
};

// Show/hide navbar based on scroll direction
let oldScrollY = 0;
window.onscroll = function (e) {
    navbar.classList.toggle("hidden", window.scrollY > 0 && window.scrollY > oldScrollY && !ham.checked);
    oldScrollY = window.scrollY;
};

// Disable body scroll while mobile nav menu is opened

ham.addEventListener("click", (e) => {
    if (e.target.checked) {
        body.classList.add("overflow-hidden");
    } else {
        body.classList.remove("overflow-hidden");
    }
});

navClickables.forEach((el) => {
    el.addEventListener("click", (e) => {
        ham.checked = false;
        body.classList.remove("overflow-hidden");
    });
});

// Reveal sections on scroll

const sections = document.querySelectorAll(".section, .section-full");

const observer = new IntersectionObserver(
    function (entries) {
        const [entry] = entries;
        if (!entry.isIntersecting) return;

        entry.target.classList.add("reveal", entry.isIntersecting);
        observer.unobserve(entry.target);
    },
    {
        threshold: 0.1,
    }
);

sections.forEach((section) => {
    observer.observe(section);

    section.classList.remove("reveal");
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
    const formData = new FormData(e.target);
    try {
        const response = await fetch(e.target.action, {
            method: contactForm.method,
            body: formData,
            headers: {
                Accept: "application/json",
            },
        });

        if (response.ok) {
            formStatus.classList.remove("hidden");
            modalBody.innerHTML = successMarkup;
        } else {
            const data = await response.json();

            console.log(data);
            if (Object.hasOwn(data, "errors")) {
                throw new Error(data["errors"].map((error) => error["message"]).join(", "));
            } else {
                throw new Error("Oops! Something weird has happened. Please try again.");
            }
        }
    } catch (error) {
        formStatus.classList.remove("hidden");
        formStatus.innerHTML = error.message;
    }
}

contactForm.addEventListener("submit", handleFormSubmit);
