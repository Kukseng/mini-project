const button = document.getElementById("theme-toggle");
const icon = document.getElementById("theme-icon");
const text = document.getElementById("theme-text");

const initTheme = () => {
  if (
    localStorage.theme === "dark" ||
    (!localStorage.theme &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.documentElement.classList.add("dark");
    updateButton("dark");
  } else {
    document.documentElement.classList.remove("dark");
    updateButton("light");
  }
};

// Update button appearance
const updateButton = (theme) => {
  if (theme === "dark") {
    icon.innerHTML =
      '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>';
    text.textContent = "Dark Mode";
  } else {
    icon.innerHTML = `
                    <circle cx="12" cy="12" r="4"/>
                    <path d="M12 2v2"/>
                    <path d="M12 20v2"/>
                    <path d="m4.93 4.93 1.41 1.41"/>
                    <path d="m17.66 17.66 1.41 1.41"/>
                    <path d="M2 12h2"/>
                    <path d="M20 12h2"/>
                    <path d="m6.34 17.66-1.41 1.41"/>
                    <path d="m19.07 4.93-1.41 1.41"/>
                `;
    text.textContent = "Light Mode";
  }
};

// Toggle theme
button.addEventListener("click", () => {
  const isDark = document.documentElement.classList.toggle("dark");
  localStorage.theme = isDark ? "dark" : "light";
  updateButton(isDark ? "dark" : "light");
});
initTheme();
