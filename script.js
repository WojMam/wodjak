/**
 * WODJAK — strona główna: język PL/EN, navbar przy scrollu, animacje reveal, flip avatara.
 * Stały motyw ciemny (bez przełącznika).
 */

const translations = {
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
		tagline: "Game tutorials and guides",
		copyright: "WODJAK Gaming - All rights reserved",
	},
};

let currentLang = "pl";

document.addEventListener("DOMContentLoaded", () => {
	const yearEl = document.getElementById("current-year");
	if (yearEl) {
		yearEl.textContent = String(new Date().getFullYear());
	}

	setupProfileFlip();
	applyLanguage(currentLang);
	setupLanguageSwitcher();
	setupNavbarScroll();
	setupScrollReveal();
});

function setupProfileFlip() {
	const profileFlip = document.getElementById("profile-flip");
	const profileBack = document.querySelector(".profile-back img");
	const profileFront = document.querySelector(".profile-front img");
	if (!profileFlip || !profileBack || !profileFront) return;

	const profileImages = [
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

	const randomOtherThan = currentSrc => {
		const currentFile = currentSrc.split("/").pop();
		const pool = profileImages.filter(img => img.split("/").pop() !== currentFile);
		return pool[Math.floor(Math.random() * pool.length)];
	};

	profileBack.src = randomOtherThan(profileFront.src);
	let flipped = false;

	profileFlip.addEventListener("click", () => {
		profileFlip.classList.toggle("flip");
		flipped = !flipped;
		window.setTimeout(() => {
			if (flipped) {
				profileFront.src = randomOtherThan(profileBack.src);
			} else {
				profileBack.src = randomOtherThan(profileFront.src);
			}
		}, 400);
	});
}

function setupLanguageSwitcher() {
	const langToggle = document.getElementById("lang-toggle");
	if (!langToggle) return;

	syncLangToggleUi();

	langToggle.addEventListener("click", () => {
		currentLang = currentLang === "pl" ? "en" : "pl";
		applyLanguage(currentLang);
		syncLangToggleUi();
	});
}

function syncLangToggleUi() {
	if (currentLang === "en") {
		document.body.classList.add("lang-en");
	} else {
		document.body.classList.remove("lang-en");
	}

	const toggle = document.getElementById("lang-toggle");
	toggle?.setAttribute("aria-checked", currentLang === "en" ? "true" : "false");
}

function applyLanguage(lang) {
	if (!translations[lang]) return;

	currentLang = lang;
	document.documentElement.setAttribute("lang", lang);

	const nodes = document.querySelectorAll("[data-lang]");
	nodes.forEach(el => el.classList.add("lang-fade-out"));

	window.setTimeout(() => {
		nodes.forEach(el => {
			const key = el.getAttribute("data-lang");
			if (key && translations[lang][key]) {
				el.textContent = translations[lang][key];
			}
			el.classList.remove("lang-fade-out");
			el.classList.add("lang-fade-in");
			window.setTimeout(() => el.classList.remove("lang-fade-in"), 500);
		});
	}, 300);
}

function setupNavbarScroll() {
	const navbar = document.querySelector(".navbar");
	if (!navbar) return;

	let lastY = window.scrollY;

	window.addEventListener("scroll", () => {
		if (window.innerWidth <= 600) {
			navbar.classList.remove("hidden");
			return;
		}
		if (lastY < window.scrollY) {
			navbar.classList.add("hidden");
		} else {
			navbar.classList.remove("hidden");
		}
		lastY = window.scrollY;
	});

	window.addEventListener("resize", () => {
		if (window.innerWidth <= 600) {
			navbar.classList.remove("hidden");
		}
	});
}

function setupScrollReveal() {
	window.setTimeout(() => {
		document.querySelector(".profile-container")?.classList.add("active");
	}, 300);

	const revealObserver = new IntersectionObserver(
		entries => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					entry.target.classList.add("active");
					entry.target.classList.remove("disappear");
				} else if (entry.target.classList.contains("active")) {
					entry.target.classList.add("disappear");
				}
			});
		},
		{ root: null, rootMargin: "0px", threshold: [0.1, 0.5] }
	);

	document.querySelectorAll(".reveal-section").forEach(el => revealObserver.observe(el));

	const profileObserver = new IntersectionObserver(
		entries => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					entry.target.classList.remove("disappear");
				} else if (window.scrollY > 100) {
					entry.target.classList.add("disappear");
				}
			});
		},
		{ root: null, rootMargin: "-10% 0px -10% 0px", threshold: 0.3 }
	);

	const profile = document.querySelector(".profile-container");
	if (profile) profileObserver.observe(profile);
}
