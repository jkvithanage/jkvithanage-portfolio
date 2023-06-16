import * as icons from "simple-icons";

const languagesEl = document.querySelector(".language-icons");
const developmentEl = document.querySelector(".development-icons");
const toolsEl = document.querySelector(".tool-icons");
const designEl = document.querySelector(".design-icons");

const languageIcons = [icons.siRuby, icons.siJavascript, icons.siTypescript, icons.siHtml5, icons.siCss3, icons.siSass];

const developmentIcons = [
    icons.siRubyonrails,
    icons.siReact,
    icons.siRedux,
    icons.siNodedotjs,
    icons.siBootstrap,
    icons.siPostgresql,
];

const toolIcons = [
    icons.siGit,
    icons.siGithub,
    icons.siPostman,
    icons.siVisualstudiocode,
    icons.siHeroku,
    icons.siSelenium,
];

const designIcons = [icons.siFigma, icons.siAdobephotoshop, icons.siAdobeillustrator];

function renderSkillIcons(el, iconsArr) {
    iconsArr.forEach((iconObj) => {
        console.log(iconObj);
        const icon = document.createElement("li");
        icon.classList.add("skill-icon");
        icon.innerHTML = iconObj.svg;
        el.insertAdjacentElement("beforeend", icon);

        const label = document.createElement("span");
        label.classList.add("icon-label");
        label.innerHTML = iconObj.title;
        label.style.opacity = 0;
        label.style.transition = "opacity 0.25s ease-in";
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
