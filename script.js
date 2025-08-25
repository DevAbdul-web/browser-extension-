// ==============================
// Utility Selectors
// ==============================
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// ==============================
// Main DOM Elements
// ==============================
const body = document.body;
const sections = $$(".extension");
const filterButtons = $$(".filter");
const toggleButtons = $$(".sel-btn");
const stateButtons = $$(".state-btn");
const selectButtons = $$(".button");
const themeIcon = $(".theme-mode");
const themeToggleBtn = $(".icon");
const moonMode = $(".icon-btn");
const textElements = {
    paragraphs: $$("p"),
    h1: $$("h1"),
    h3: $$("h3"),
    h6: $$("h6"),
};
const allButtons = $$("button");
const btns = $$(".btn");
const headerDiv = $(".headDiv");
const logo = $(".logo-theme");
const footer = $("footer");
const removeBtns = $$(".remove");
const restoreBtn = $(".restore-all");

let isDarkMode = true;

// ==============================
// Local Storage 
// ==============================
function getRemovedExtensions() {
    return JSON.parse(localStorage.getItem("removedExtensions") || "[]");
}
function saveRemovedExtensions(removed) {
    localStorage.setItem("removedExtensions", JSON.stringify(removed));
}
function getThemeMode() {
    return localStorage.getItem("themeMode") || "dark";
}
function saveThemeMode(mode) {
    localStorage.setItem("themeMode", mode);
}
function getActiveStates() {
    return JSON.parse(localStorage.getItem("activeStates") || "[]");
}
function saveActiveStates(states) {
    localStorage.setItem("activeStates", JSON.stringify(states));
}

// ==============================
// Apply saved state on page load
// ==============================
document.addEventListener("DOMContentLoaded", () => {
    // ---------- Removed extensions ----------
    const removed = getRemovedExtensions();
    removed.forEach(i => {
        if (sections[i]) sections[i].style.display = "none";
    });

    // ---------- Theme mode ----------
    const savedTheme = getThemeMode();
    if (savedTheme === "light" && isDarkMode) {
        themeToggleBtn.click(); // Switch to light mode
    }

    // ---------- Active/inactive states ----------
    const savedStates = getActiveStates();
    savedStates.forEach((state, i) => {
        if (state === "active") {
            stateButtons[i].classList.add("active");
            stateButtons[i].classList.remove("inactive");
            selectButtons[i].classList.add("button-active");
            sections[i].classList.add("is-active");
            sections[i].classList.remove("not-active");
        } else {
            stateButtons[i].classList.add("inactive");
            stateButtons[i].classList.remove("active");
            selectButtons[i].classList.remove("button-active");
            sections[i].classList.add("not-active");
            sections[i].classList.remove("is-active");
        }
    });
});

// ==============================
// Extension Filtering
// ==============================
function extensionListFilter(category, event) {
    // Show/hide sections based on category
    sections.forEach(section => {
        if (category === "all" || section.classList.contains(category)) {
            section.classList.remove("hidden-item");
        } else {
            section.classList.add("hidden-item");
        }
    });

    // Update active button
    filterButtons.forEach(btn => btn.classList.remove("button-active"));
    event.target.classList.add("button-active");
}

// Event listeners for filter buttons
$(".all-btn")?.addEventListener("click", (e) => extensionListFilter("all", e));
$(".active-btn")?.addEventListener("click", (e) => extensionListFilter("is-active", e));
$(".inactive-btn")?.addEventListener("click", (e) => extensionListFilter("not-active", e));

// ==============================
// Toggle Extension State (Active/Inactive)
// ==============================
toggleButtons.forEach((btn, i) => {
    btn.addEventListener("click", () => {
        stateButtons[i].classList.toggle("active");
        stateButtons[i].classList.toggle("inactive");
        selectButtons[i].classList.toggle("button-active");
        sections[i].classList.toggle("is-active");
        sections[i].classList.toggle("not-active");

        // Save current states
        const states = Array.from(stateButtons).map(sb =>
            sb.classList.contains("active") ? "active" : "inactive"
        );
        saveActiveStates(states);
    });
});

// ==============================
// Theme Switcher (Dark / Light)
// ==============================
themeToggleBtn?.addEventListener("click", () => {
    if (isDarkMode) {
        // 🌞 Switch to Light Mode
        themeIcon.setAttribute("src", "./assets/images/icon-moon.svg");
        logo.setAttribute("src", "./assets/images/logo1.svg");

        body.classList.add("body-light");
        moonMode.classList.add("moon-light");

        Object.values(textElements).forEach(list =>
            list.forEach(el => el.classList.add("light"))
        );
        textElements.paragraphs.forEach(p => p.classList.add("p-light"));

        allButtons.forEach(btn => btn.classList.add("button-light"));
        stateButtons.forEach(btn => btn.classList.add("ext"));
        sections.forEach(ext => ext.classList.add("ext"));
        selectButtons.forEach(btn => {
            if (btn.classList.contains("button-active")) {
                btn.classList.remove("select-buttons-bg");
            } else { 
                btn.classList.add("select-buttons-bg");
            }
        });
        btns.forEach(b => b.classList.add("btn-light"));
        removeBtns.forEach(rem => rem.classList.add("removeBtnBorder"));

        headerDiv?.classList.add("div");
        footer?.classList.add("foot");

        isDarkMode = false;
        saveThemeMode("light");
    } else {
        // 🌙 Switch to Dark Mode
        themeIcon.setAttribute("src", "./assets/images/icon-sun.svg");
        logo.setAttribute("src", "./assets/images/logo2.svg");

        body.classList.remove("body-light");
        moonMode.classList.remove("moon-light");

        Object.values(textElements).forEach(list =>
            list.forEach(el => el.classList.remove("light"))
        );
        textElements.paragraphs.forEach(p => p.classList.remove("p-light"));

        allButtons.forEach(btn => btn.classList.remove("button-light"));
        stateButtons.forEach(btn => btn.classList.remove("ext"));
        sections.forEach(ext => ext.classList.remove("ext"));
        selectButtons.forEach(btn => {
            if (btn.classList.contains("button-active")) {
                btn.classList.remove("select-buttons-bg");
            } else { 
                btn.classList.remove("select-buttons-bg");
            }
        });
        removeBtns.forEach(rem => rem.classList.remove("removeBtnBorder"));
        btns.forEach(b => b.classList.remove("btn-light"));

        headerDiv?.classList.remove("div");
        footer?.classList.remove("foot");

        isDarkMode = true;
        saveThemeMode("dark");
    }
});

// ==============================
// Remove Extensions
// ==============================
removeBtns.forEach((btn, index) => {
    btn.addEventListener("click", () => {
        sections[index].style.display = "none";

        const removed = getRemovedExtensions();
        if (!removed.includes(index)) removed.push(index);
        saveRemovedExtensions(removed);
    });
});

// ==============================
// Restore All Removed Extensions
// ==============================
restoreBtn?.addEventListener("click", () => {
    const removed = getRemovedExtensions();
    removed.forEach(i => {
        if (sections[i]) sections[i].style.display = "block";
    });
    saveRemovedExtensions([]);
});
