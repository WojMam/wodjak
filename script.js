// Importy
import NotificationSystem from "./notifications/notifications.js";
import MiniaturesSystem from "./miniatures/miniatures.js";

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
		"read-more": "Czytaj więcej",
		tagline: "Poradniki i przewodniki do gier",
		copyright: "WODJAK Gaming - Wszelkie prawa zastrzeżone",
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
		"read-more": "Read more",
		tagline: "Game tutorials and guides",
		copyright: "WODJAK Gaming - All rights reserved",
	},
};

// Current language
var currentLang = "pl";
// Set current year in footer
document.addEventListener("DOMContentLoaded", function () {
	var yearElement = document.getElementById("current-year");
	if (yearElement) {
		yearElement.textContent = new Date().getFullYear().toString();
	}

	// Inicjalizacja systemu powiadomień
	const notifications = new NotificationSystem({
		autoLoad: true, // Automatycznie załaduj powiadomienia z pliku notifications.json
	});

	// Obsługa przycisku powiadomień
	setupNotificationsButton(notifications);

	// Inicjalizacja systemu miniaturek
	const miniatures = new MiniaturesSystem({
		autoLoad: true, // Automatycznie załaduj miniatury z pliku miniatures.json
	});

	// Wysyłanie zdarzenia zmiany języka
	document.addEventListener("languageChanged", function (e) {
		// Tu dodaj obsługę innych elementów, które reagują na zmianę języka
	});

	// Add hover effect to links
	var linkButtons = document.querySelectorAll(".link-button");
	linkButtons.forEach(function (button) {
		button.addEventListener("mouseenter", function () {
			button.classList.add("hover-effect");
		});
		button.addEventListener("mouseleave", function () {
			button.classList.remove("hover-effect");
		});
	});
	// Setup profile flip animation with random images
	var profileFlip = document.getElementById("profile-flip");
	var profileBack = document.querySelector(".profile-back img");
	var profileFront = document.querySelector(".profile-front img");
	var isFlipped = false;

	// List of available profile images
	var profileImages = [
		"images/profiles/profile_main.jpg",
		"images/profiles/profile_ac.png",
		"images/profiles/profile_cp.png",
		"images/profiles/profile_kn.png",
		"images/profiles/profile_sk.png",
		"images/profiles/profile_st.png",
		"images/profiles/profile_ft.png",
		"images/profiles/profile_fa.png",
		"images/profiles/profile_gh.png",
		"images/profiles/profile_ww.png",
	];

	// Function to get a random profile image that's different from the current one
	function getRandomProfile(currentSrc) {
		var currentImage = currentSrc.split("/").pop();
		var availableImages = profileImages.filter(function (img) {
			return img.split("/").pop() !== currentImage;
		});

		var randomIndex = Math.floor(Math.random() * availableImages.length);
		return availableImages[randomIndex];
	}

	if (profileFlip && profileBack && profileFront) {
		// Set a random image to back side initially
		profileBack.src = getRandomProfile(profileFront.src);

		profileFlip.addEventListener("click", function () {
			profileFlip.classList.toggle("flip");
			isFlipped = !isFlipped;

			// After the flip animation starts, set up the next image for the side that will be hidden
			setTimeout(function () {
				if (isFlipped) {
					// If flipped to back, prepare a new random image for the front
					profileFront.src = getRandomProfile(profileBack.src);
				} else {
					// If flipped to back, prepare a new random image for the back
					profileBack.src = getRandomProfile(profileFront.src);
				}
			}, 400); // Wait for the flip to be halfway through
		});
	}
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
});
// Function to add active state to buttons when clicked
function addActiveState(element) {
	element.classList.add("active");
	setTimeout(function () {
		element.classList.remove("active");
	}, 200);
}
// Implement click tracking (you can expand this later)
function trackClick(platform) {
	console.log("User clicked on ".concat(platform, " link"));
	// You could implement actual tracking here in the future
}
// Set up language switcher functionality
function setupLanguageSwitcher() {
	var langToggle = document.getElementById("lang-toggle");
	// Update toggle position based on current language
	updateLangToggleState();
	// Toggle language when clicked
	langToggle === null || langToggle === void 0
		? void 0
		: langToggle.addEventListener("click", function () {
				// Toggle between 'pl' and 'en'
				var newLang = currentLang === "pl" ? "en" : "pl";
				changeLanguage(newLang);
				// Update toggle state
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
	// Update HTML lang attribute
	document.documentElement.setAttribute("lang", lang);
	// Get all elements with data-lang attribute
	var elementsWithLang = document.querySelectorAll("[data-lang]");
	// First, fade out all elements
	elementsWithLang.forEach(function (element) {
		element.classList.add("lang-fade-out");
	});
	// After fade out animation completes, update content and fade in
	setTimeout(function () {
		elementsWithLang.forEach(function (element) {
			var key = element.getAttribute("data-lang");
			if (key && translations[lang][key]) {
				element.textContent = translations[lang][key];
			}
			// Remove fade out class and add fade in animation
			element.classList.remove("lang-fade-out");
			element.classList.add("lang-fade-in");
			// Remove the animation class after it completes
			setTimeout(function () {
				element.classList.remove("lang-fade-in");
			}, 500);
		});
	}, 300);
}
// Set active language on page load
function setActiveLanguage(lang) {
	var langBtn = document.querySelector(
		'.lang-btn[data-lang="'.concat(lang, '"]')
	);
	if (langBtn) {
		langBtn.classList.add("active");
	}
	changeLanguage(lang);
}
// Handle navbar visibility on scroll
function setupNavbarScroll() {
	var navbar = document.querySelector(".navbar");
	var lastScrollY = window.scrollY;
	window.addEventListener("scroll", function () {
		// Don't hide navbar on mobile devices
		if (window.innerWidth <= 600) {
			navbar === null || navbar === void 0
				? void 0
				: navbar.classList.remove("hidden");
			return;
		}
		if (lastScrollY < window.scrollY) {
			// Scrolling down
			navbar === null || navbar === void 0
				? void 0
				: navbar.classList.add("hidden");
		} else {
			// Scrolling up
			navbar === null || navbar === void 0
				? void 0
				: navbar.classList.remove("hidden");
		}
		lastScrollY = window.scrollY;
	});
	// Also check on resize to handle orientation changes
	window.addEventListener("resize", function () {
		if (window.innerWidth <= 600) {
			navbar === null || navbar === void 0
				? void 0
				: navbar.classList.remove("hidden");
		}
	});
}
// Setup scroll reveal animations using Intersection Observer
function setupScrollReveal() {
	// Immediately activate the profile image animation
	setTimeout(function () {
		var profileContainer = document.querySelector(".profile-container");
		profileContainer === null || profileContainer === void 0
			? void 0
			: profileContainer.classList.add("active");
	}, 300);
	// Set up scroll animations for other elements
	var observerOptions = {
		root: null, // Use viewport as root
		rootMargin: "0px",
		threshold: [0.1, 0.5], // Trigger at different visibility thresholds
	};
	var observer = new IntersectionObserver(function (entries) {
		entries.forEach(function (entry) {
			if (entry.isIntersecting) {
				// Element is entering the viewport
				entry.target.classList.add("active");
				entry.target.classList.remove("disappear");
			} else {
				// Element is leaving the viewport
				// Only add disappear if it was active before
				if (entry.target.classList.contains("active")) {
					entry.target.classList.add("disappear");
				}
			}
		});
	}, observerOptions);
	// Observe all elements with reveal-section class
	var revealElements = document.querySelectorAll(".reveal-section");
	revealElements.forEach(function (element) {
		observer.observe(element);
	});
	// Special handling for profile container
	var profileObserver = new IntersectionObserver(
		function (entries) {
			entries.forEach(function (entry) {
				if (entry.isIntersecting) {
					entry.target.classList.remove("disappear");
				} else {
					if (window.scrollY > 100) {
						// Only apply disappear when scrolled down
						entry.target.classList.add("disappear");
					}
				}
			});
		},
		{
			root: null,
			rootMargin: "-10% 0px -10% 0px", // Smaller margin for profile
			threshold: 0.3,
		}
	);
	var profileContainer = document.querySelector(".profile-container");
	if (profileContainer) {
		profileObserver.observe(profileContainer);
	}
}
// Set up theme toggle functionality
function setupThemeToggle() {
	var themeToggle = document.getElementById("theme-toggle");
	var prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
	// Check for saved theme preference or use the OS preference
	var savedTheme = localStorage.getItem("theme");
	if (savedTheme === "light") {
		document.body.classList.add("light-theme");
	} else if (savedTheme === null && !prefersDarkScheme.matches) {
		// If no saved preference and OS prefers light mode
		document.body.classList.add("light-theme");
	}
	// Update toggle position based on current theme
	updateToggleState();
	// Toggle theme when clicked
	themeToggle === null || themeToggle === void 0
		? void 0
		: themeToggle.addEventListener("click", function () {
				document.body.classList.toggle("light-theme");
				// Store preference
				if (document.body.classList.contains("light-theme")) {
					localStorage.setItem("theme", "light");
				} else {
					localStorage.setItem("theme", "dark");
				}
				// Update toggle state
				updateToggleState();
		  });
	// Update toggle state based on theme
	function updateToggleState() {
		var isLightTheme = document.body.classList.contains("light-theme");
		// Optional: Update any ARIA attributes for accessibility
		themeToggle === null || themeToggle === void 0
			? void 0
			: themeToggle.setAttribute("aria-checked", isLightTheme.toString());
	}
}

// Obsługa przycisku powiadomień
function setupNotificationsButton(notifications) {
	const notificationsButton = document.getElementById("notifications-toggle");
	const notificationsBadge = document.querySelector(".notifications-badge");

	if (!notificationsButton) return;

	// Aktualizuj licznik powiadomień przy inicjalizacji i po zamknięciu powiadomienia
	setTimeout(() => {
		notifications.updateNotificationsBadge();
	}, 1000);

	// Nasłuchuj zdarzeń zamknięcia powiadomień
	document.addEventListener("notificationClosed", function () {
		notifications.updateNotificationsBadge();
	});

	// Nasłuchuj zdarzeń oznaczenia wszystkich powiadomień jako przeczytane
	document.addEventListener("notificationsAllClosed", function () {
		notifications.updateNotificationsBadge();
	});
}
