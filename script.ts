// Language translation data
interface Translations {
	[key: string]: {
		[key: string]: string;
	};
}

const translations: Translations = {
	en: {
		home: "Home",
		about: "About Me",
		links: "Links",
		plans: "Plans",
		tagline: "Gaming Tutorials & Guides",
		"about-title": "About Me",
		"about-p1":
			"Welcome to my official page! I create in-depth gaming tutorials and guides to help you master your favorite games. From beginner tips to advanced strategies, my channel has everything you need to level up your gaming skills.",
		"about-p2": "Subscribe to join our growing community of gamers!",
		youtube: "YouTube Channel",
		twitch: "Twitch",
		discord: "Discord Community - coming soon",
		tiktok: "TikTok",
		instagram: "Instagram",
		email: "Contact Me",
		support: "Support me - coming soon",
		"future-title": "Upcoming Content",
		"future-p":
			"I'm currently working on new tutorial series for the latest game releases. Stay tuned for in-depth guides, tips & tricks, and gameplay strategies coming soon!",
		copyright: "WODJAK Gaming - All Rights Reserved",
	},
	pl: {
		home: "Strona główna",
		about: "O mnie",
		links: "Linki",
		plans: "Plany",
		tagline: "Poradniki i przewodniki do gier",
		"about-title": "O mnie",
		"about-p1":
			"Witaj na mojej oficjalnej stronie! Tworzę szczegółowe poradniki i przewodniki do gier, które pomogą Ci opanować Twoje ulubione tytuły. Od podstawowych wskazówek po zaawansowane strategie, mój kanał ma wszystko, czego potrzebujesz, aby podnieść swoje umiejętności w grach.",
		"about-p2":
			"Subskrybuj, aby dołączyć do naszej rosnącej społeczności graczy!",
		youtube: "Kanał YouTube",
		twitch: "Twitch",
		discord: "Społeczność Discord - wkrótce",
		tiktok: "TikTok",
		instagram: "Instagram",
		email: "Napisz do mnie",
		support: "Wesprzyj mnie - wkrótce",
		"future-title": "Nadchodzące treści",
		"future-p":
			"Aktualnie pracuję nad nowymi seriami poradników do najnowszych gier. Bądź na bieżąco, aby nie przegapić szczegółowych przewodników, wskazówek i strategii, które wkrótce się pojawią!",
		copyright: "WODJAK Gaming - Wszelkie prawa zastrzeżone",
	},
};

// Current language
let currentLang = "pl";

// Set current year in footer
document.addEventListener("DOMContentLoaded", () => {
	const yearElement = document.getElementById("current-year");
	if (yearElement) {
		yearElement.textContent = new Date().getFullYear().toString();
	}

	// Add hover effect to links
	const linkButtons = document.querySelectorAll(".link-button");
	linkButtons.forEach(button => {
		button.addEventListener("mouseenter", () => {
			button.classList.add("hover-effect");
		});

		button.addEventListener("mouseleave", () => {
			button.classList.remove("hover-effect");
		});
	});

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
function addActiveState(element: HTMLElement) {
	element.classList.add("active");
	setTimeout(() => {
		element.classList.remove("active");
	}, 200);
}

// Implement click tracking (you can expand this later)
function trackClick(platform: string) {
	console.log(`User clicked on ${platform} link`);
	// You could implement actual tracking here in the future
}

// Set up language switcher functionality
function setupLanguageSwitcher() {
	const langToggle = document.getElementById("lang-toggle");

	// Update toggle position based on current language
	updateLangToggleState();

	// Toggle language when clicked
	langToggle?.addEventListener("click", () => {
		// Toggle between 'pl' and 'en'
		const newLang = currentLang === "pl" ? "en" : "pl";
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
function changeLanguage(lang: string) {
	if (!translations[lang]) return;

	currentLang = lang;

	// Update HTML lang attribute
	document.documentElement.setAttribute("lang", lang);

	// Get all elements with data-lang attribute
	const elementsWithLang = document.querySelectorAll("[data-lang]");

	// First, fade out all elements
	elementsWithLang.forEach(element => {
		element.classList.add("lang-fade-out");
	});

	// After fade out animation completes, update content and fade in
	setTimeout(() => {
		elementsWithLang.forEach(element => {
			const key = element.getAttribute("data-lang");
			if (key && translations[lang][key]) {
				element.textContent = translations[lang][key];
			}

			// Remove fade out class and add fade in animation
			element.classList.remove("lang-fade-out");
			element.classList.add("lang-fade-in");

			// Remove the animation class after it completes
			setTimeout(() => {
				element.classList.remove("lang-fade-in");
			}, 500);
		});
	}, 300);
}

// Set active language on page load
function setActiveLanguage(lang: string) {
	const langBtn = document.querySelector(`.lang-btn[data-lang="${lang}"]`);
	if (langBtn) {
		langBtn.classList.add("active");
	}
	changeLanguage(lang);
}

// Handle navbar visibility on scroll
function setupNavbarScroll() {
	const navbar = document.querySelector(".navbar");
	let lastScrollY = window.scrollY;

	window.addEventListener("scroll", () => {
		if (lastScrollY < window.scrollY) {
			// Scrolling down
			navbar?.classList.add("hidden");
		} else {
			// Scrolling up
			navbar?.classList.remove("hidden");
		}

		lastScrollY = window.scrollY;
	});
}

// Setup scroll reveal animations using Intersection Observer
function setupScrollReveal() {
	// Immediately activate the profile image animation
	setTimeout(() => {
		const profileContainer = document.querySelector(".profile-container");
		profileContainer?.classList.add("active");
	}, 300);

	// Set up scroll animations for other elements
	const observerOptions = {
		root: null, // Use viewport as root
		rootMargin: "0px",
		threshold: [0.1, 0.5], // Trigger at different visibility thresholds
	};

	const observer = new IntersectionObserver(entries => {
		entries.forEach(entry => {
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
	const revealElements = document.querySelectorAll(".reveal-section");
	revealElements.forEach(element => {
		observer.observe(element);
	});

	// Special handling for profile container
	const profileObserver = new IntersectionObserver(
		entries => {
			entries.forEach(entry => {
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

	const profileContainer = document.querySelector(".profile-container");
	if (profileContainer) {
		profileObserver.observe(profileContainer);
	}
}

// Set up theme toggle functionality
function setupThemeToggle() {
	const themeToggle = document.getElementById("theme-toggle");
	const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

	// Check for saved theme preference or use the OS preference
	const savedTheme = localStorage.getItem("theme");

	if (savedTheme === "light") {
		document.body.classList.add("light-theme");
	} else if (savedTheme === null && !prefersDarkScheme.matches) {
		// If no saved preference and OS prefers light mode
		document.body.classList.add("light-theme");
	}

	// Update toggle position based on current theme
	updateToggleState();

	// Toggle theme when clicked
	themeToggle?.addEventListener("click", () => {
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
		const isLightTheme = document.body.classList.contains("light-theme");
		// Optional: Update any ARIA attributes for accessibility
		themeToggle?.setAttribute("aria-checked", isLightTheme.toString());
	}
}
