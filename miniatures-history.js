// Importy
import NotificationSystem from "./notifications/notifications.js";

// Tłumaczenia
var translations = {
	pl: {
		home: "Strona główna",
		about: "O mnie",
		links: "Linki",
		"about-title": "O mnie",
		"about-p1":
			"Witaj na mojej oficjalnej stronie! Tworzę szczegółowe poradniki i przewodniki do gier, które pomogą Ci opanować Twoje ulubione tytuły. Od podstawowych wskazówek po zaawansowane strategie, mój kanał ma wszystko, czego potrzebujesz, aby podnieść swoje umiejętności w grach.",
		"about-p2":
			"Subskrybuj, aby dołączyć do naszej rosnącej społeczności graczy!",
		youtube: "Kanał YouTube",
		twitch: "Twitch",
		tiktok: "TikTok",
		instagram: "Instagram",
		discord: "Społeczność Discord",
		email: "Email",
		"support-youtube": "Wesprzyj mnie - Youtube",
		"support-tipply": "Wesprzyj mnie - Tipply",
		facebook: "Facebook",
		pixele: "Blog 'Wypalone Pixele'",
		"miniatures-title": "Najnowsze treści",
		"all-content": "Wszystkie treści",
		"all-content-title": "Wszystkie treści",
		"all-content-subtitle": "Archiwum wszystkich opublikowanych treści",
		"back-to-main": "Powrót",
		"back-to-main-text": "Powrót do strony głównej",
		tagline: "Poradniki i przewodniki do gier",
		copyright: "WODJAK Gaming - Wszelkie prawa zastrzeżone",
		notifications: "Powiadomienia",
		"mark-all-read": "Oznacz wszystkie jako przeczytane",
	},
	en: {
		home: "Home",
		about: "About",
		links: "Links",
		"about-title": "About Me",
		"about-p1":
			"Welcome to my official site! I create detailed game tutorials and guides to help you master your favorite titles. From basic tips to advanced strategies, my channel has everything you need to level up your gaming skills.",
		"about-p2": "Subscribe to join our growing community of gamers!",
		youtube: "YouTube Channel",
		twitch: "Twitch",
		tiktok: "TikTok",
		instagram: "Instagram",
		discord: "Discord Community",
		email: "Email",
		"support-youtube": "Support Me - Youtube",
		"support-tipply": "Support Me - Tipply",
		facebook: "Facebook",
		pixele: "Blog 'Wypalone Pixele'",
		"miniatures-title": "Latest content",
		"all-content": "All content",
		"all-content-title": "All content",
		"all-content-subtitle": "Archive of all published content",
		"back-to-main": "Back",
		"back-to-main-text": "Back to main page",
		tagline: "Game tutorials and guides",
		copyright: "WODJAK Gaming - All rights reserved",
		notifications: "Notifications",
		"mark-all-read": "Mark all as read",
	},
};

// Current language
var currentLang = "pl";

// Set current year in footer
document.addEventListener("DOMContentLoaded", function () {
	var yearElement = document.getElementById("current-year");
	if (yearElement) {
		yearElement.textContent = new Date().getFullYear();
	}

	// Initialize notification system
	var notifications = new NotificationSystem();
	setupNotificationsButton(notifications);

	// Set default language
	setActiveLanguage(currentLang);

	// Setup language switcher
	setupLanguageSwitcher();

	// Setup navbar scroll behavior
	setupNavbarScroll();

	// Setup scroll reveal animations
	setupScrollReveal();

	// Setup theme toggle
	setupThemeToggle();

	// Load all miniatures (including inactive ones)
	loadAllMiniatures();
});

// Load all miniatures for history page
async function loadAllMiniatures() {
	try {
		const response = await fetch("miniatures/miniatures.json");
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
		const container = document.getElementById("history-miniatures-container");

		if (!container) {
			console.error("History miniatures container not found!");
			return;
		}

		// Get all miniatures (including inactive ones)
		const allMiniatures = data.miniatures || [];
		const currentLang =
			document.documentElement.getAttribute("lang") || "pl";

		// Clear container
		container.innerHTML = "";

		if (allMiniatures.length === 0) {
			const emptyMessage = document.createElement("div");
			emptyMessage.className = "miniatures-empty";
			emptyMessage.textContent =
				currentLang === "pl"
					? "Brak dostępnych treści"
					: "No content available";
			container.appendChild(emptyMessage);
			return;
		}

		// Sort by ID (or you could add a date field later)
		allMiniatures.sort((a, b) => parseInt(b.id) - parseInt(a.id));

		// Render all miniatures
		allMiniatures.forEach((miniature, index) => {
			const title =
				miniature.title && miniature.title[currentLang]
					? miniature.title[currentLang]
					: miniature.title || "";

			// Create miniature element
			const miniatureElement = document.createElement("a");
			miniatureElement.href = miniature.link || "#";
			miniatureElement.className = "history-miniature-item";
			miniatureElement.target = "_blank";
			miniatureElement.setAttribute("data-miniature-id", miniature.id);
			miniatureElement.style.opacity = "0";
			miniatureElement.style.transform = "translateY(20px)";

			// Add platform class
			if (miniature.platform) {
				miniatureElement.classList.add(`miniature-${miniature.platform}`);
			}

			// Get platform icon
			let platformIcon = "";
			if (miniature.platform) {
				const iconPath = `images/icons/icon_${miniature.platform}_32.png`;
				platformIcon = `<div class="miniature-platform-icon"><img src="${iconPath}" alt="${miniature.platform}" class="miniature-platform-icon-img" /></div>`;
			}

			// Set content
			miniatureElement.innerHTML = `
				<div class="history-miniature-image-wrapper">
					${platformIcon}
					<img src="${miniature.image}" alt="${title}" class="history-miniature-image" />
					<div class="history-miniature-overlay">
						<div class="history-miniature-title">${title}</div>
					</div>
				</div>
			`;

			// Add to container
			container.appendChild(miniatureElement);

			// Entrance animation with delay
			setTimeout(() => {
				miniatureElement.style.transition =
					"opacity 0.6s ease, transform 0.6s ease";
				miniatureElement.style.opacity = "1";
				miniatureElement.style.transform = "translateY(0)";
			}, index * 50 + 100);
		});
	} catch (error) {
		console.error("Failed to load miniatures:", error);
	}
}

// Listen for language changes to re-render miniatures
document.addEventListener("languageChanged", function () {
	loadAllMiniatures();
});

// Set up language switcher functionality
function setupLanguageSwitcher() {
	var langToggle = document.getElementById("lang-toggle");
	updateLangToggleState();
	langToggle === null || langToggle === void 0
		? void 0
		: langToggle.addEventListener("click", function () {
				var newLang = currentLang === "pl" ? "en" : "pl";
				changeLanguage(newLang);
				updateLangToggleState();
		  });
}

// Function to update language toggle state
function updateLangToggleState() {
	if (currentLang === "en") {
		document.body.classList.add("lang-en");
	} else {
		document.body.classList.remove("lang-en");
	}
}

// Change language on the page
function changeLanguage(lang) {
	if (!translations[lang]) return;
	currentLang = lang;
	document.documentElement.setAttribute("lang", lang);
	var elementsWithLang = document.querySelectorAll("[data-lang]");
	elementsWithLang.forEach(function (element) {
		element.classList.add("lang-fade-out");
	});
	setTimeout(function () {
		elementsWithLang.forEach(function (element) {
			var key = element.getAttribute("data-lang");
			if (key && translations[lang][key]) {
				element.textContent = translations[lang][key];
			}
			element.classList.remove("lang-fade-out");
			element.classList.add("lang-fade-in");
			setTimeout(function () {
				element.classList.remove("lang-fade-in");
			}, 500);
		});
		// Trigger language change event for miniatures
		document.dispatchEvent(new CustomEvent("languageChanged"));
	}, 300);
}

// Set active language on page load
function setActiveLanguage(lang) {
	var langBtn = document.querySelector(`.lang-btn[data-lang="${lang}"]`);
	if (langBtn) {
		document.querySelectorAll(".lang-btn").forEach(function (btn) {
			btn.classList.remove("active");
		});
		langBtn.classList.add("active");
	}
	changeLanguage(lang);
}

// Setup navbar scroll behavior
function setupNavbarScroll() {
	var lastScrollTop = 0;
	var navbar = document.querySelector(".navbar");
	var scrollThreshold = 100;
	window.addEventListener(
		"scroll",
		function () {
			var scrollTop =
				window.pageYOffset || document.documentElement.scrollTop;
			if (scrollTop > scrollThreshold) {
				if (scrollTop > lastScrollTop) {
					navbar.classList.add("hidden");
				} else {
					navbar.classList.remove("hidden");
				}
			} else {
				navbar.classList.remove("hidden");
			}
			lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
		},
		false
	);
}

// Setup scroll reveal animations
function setupScrollReveal() {
	var revealElements = document.querySelectorAll(".reveal-section");
	var revealObserver = new IntersectionObserver(
		function (entries) {
			entries.forEach(function (entry) {
				if (entry.isIntersecting) {
					entry.target.classList.add("active");
				}
			});
		},
		{ threshold: 0.1 }
	);
	revealElements.forEach(function (element) {
		revealObserver.observe(element);
	});
}

// Set up theme toggle functionality
function setupThemeToggle() {
	var themeToggle = document.getElementById("theme-toggle");
	var prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
	var savedTheme = localStorage.getItem("theme");
	if (savedTheme === "light") {
		document.body.classList.add("light-theme");
	} else if (savedTheme === null && !prefersDarkScheme.matches) {
		document.body.classList.add("light-theme");
	}
	updateToggleState();
	themeToggle === null || themeToggle === void 0
		? void 0
		: themeToggle.addEventListener("click", function () {
				document.body.classList.toggle("light-theme");
				if (document.body.classList.contains("light-theme")) {
					localStorage.setItem("theme", "light");
				} else {
					localStorage.setItem("theme", "dark");
				}
				updateToggleState();
		  });
	function updateToggleState() {
		var isLightTheme = document.body.classList.contains("light-theme");
		themeToggle === null || themeToggle === void 0
			? void 0
			: themeToggle.setAttribute("aria-checked", isLightTheme.toString());
	}
}

// Setup notifications button
function setupNotificationsButton(notifications) {
	const notificationsButton = document.getElementById("notifications-toggle");
	if (!notificationsButton) return;

	notificationsButton.addEventListener("click", function () {
		const panel = document.getElementById("notifications-panel");
		if (panel) {
			panel.classList.toggle("active");
		}
	});

	// Close panel when clicking outside
	document.addEventListener("click", function (event) {
		const panel = document.getElementById("notifications-panel");
		const button = document.getElementById("notifications-toggle");
		if (
			panel &&
			button &&
			!panel.contains(event.target) &&
			!button.contains(event.target)
		) {
			panel.classList.remove("active");
		}
	});
}

