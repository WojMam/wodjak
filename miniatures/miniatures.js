/**
 * System miniaturek dla strony WODJAK Gaming
 * Wyświetla klikalne miniatury treści
 */

class MiniaturesSystem {
	constructor(options = {}) {
		this.container = null;
		this.miniaturesData = [];
		this.options = {
			autoLoad: options.autoLoad !== undefined ? options.autoLoad : true,
		};

		// Inicjalizacja systemu
		this.init();

		// Pobierz miniatury z pliku JSON, jeśli autoLoad jest włączone
		if (this.options.autoLoad) {
			this.loadMiniaturesFromJson();
		}
	}

	init() {
		// Pobierz kontener dla miniaturek z HTML
		this.container = document.getElementById("miniatures-container");
		if (!this.container) {
			console.error("Kontener miniaturek nie został znaleziony!");
			return;
		}

		// Nasłuchiwanie zmian języka
		document.addEventListener("languageChanged", e => {
			this.renderMiniatures();
		});
	}

	/**
	 * Pobiera miniatury z pliku JSON
	 */
	async loadMiniaturesFromJson() {
		try {
			const response = await fetch("miniatures/miniatures.json");
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();

			// Zapisz dane miniaturek
			this.miniaturesData = data.miniatures || [];

			// Renderuj miniatury
			this.renderMiniatures();

			// Aktualizuj tytuł sekcji
			this.updateSectionTitle(data.config);

			return data;
		} catch (error) {
			console.error("Nie udało się załadować miniaturek:", error);
			return null;
		}
	}

	/**
	 * Aktualizuje tytuł sekcji miniaturek
	 */
	updateSectionTitle(config) {
		// Title is now handled by the translation system via data-lang attribute
		// This method is kept for backward compatibility but doesn't need to do anything
		return;
	}

	/**
	 * Renderuje miniatury w kontenerze
	 */
	renderMiniatures() {
		if (!this.container) return;

		const currentLang =
			document.documentElement.getAttribute("lang") || "pl";

		// Wyczyść zawartość kontenera
		this.container.innerHTML = "";

		// Filtruj tylko aktywne miniatury i ogranicz do maksymalnie 3
		const activeMiniatures = this.miniaturesData
			.filter(m => m.active !== false)
			.slice(0, 3); // Maksymalnie 3 miniatury na stronie głównej

		if (activeMiniatures.length === 0) {
			const emptyMessage = document.createElement("div");
			emptyMessage.className = "miniatures-empty";
			emptyMessage.textContent =
				currentLang === "pl"
					? "Brak dostępnych treści"
					: "No content available";
			this.container.appendChild(emptyMessage);
			return;
		}

		// Wyświetl miniatury
		activeMiniatures.forEach((miniature, index) => {
			const title =
				miniature.title && miniature.title[currentLang]
					? miniature.title[currentLang]
					: miniature.title || "";

			// Utwórz element miniatury
			const miniatureElement = document.createElement("a");
			miniatureElement.href = miniature.link || "#";
			miniatureElement.className = "miniature-item";
			miniatureElement.target = "_blank";
			miniatureElement.setAttribute("data-miniature-id", miniature.id);
			miniatureElement.style.opacity = "0";
			miniatureElement.style.transform = "translateY(20px)";

			// Dodaj klasę platformy, jeśli istnieje
			if (miniature.platform) {
				miniatureElement.classList.add(`miniature-${miniature.platform}`);
			}

			// Pobierz ikonę platformy
			let platformIcon = "";
			if (miniature.platform) {
				const iconPath = `images/icons/icon_${miniature.platform}_32.png`;
				platformIcon = `<div class="miniature-platform-icon"><img src="${iconPath}" alt="${miniature.platform}" class="miniature-platform-icon-img" /></div>`;
			}

			// Ustaw zawartość miniatury
			miniatureElement.innerHTML = `
				<div class="miniature-image-wrapper">
					${platformIcon}
					<img src="${miniature.image}" alt="${title}" class="miniature-image" />
					<div class="miniature-overlay">
						<div class="miniature-title">${title}</div>
					</div>
				</div>
			`;

			// Dodaj do kontenera
			this.container.appendChild(miniatureElement);

			// Animacja wejścia z opóźnieniem
			setTimeout(() => {
				miniatureElement.style.transition =
					"opacity 0.6s ease, transform 0.6s ease";
				miniatureElement.style.opacity = "1";
				miniatureElement.style.transform = "translateY(0)";
			}, index * 100 + 100);
		});
	}

	/**
	 * Odświeża miniatury z pliku JSON
	 */
	async refreshMiniatures() {
		await this.loadMiniaturesFromJson();
	}
}

// Eksport klasy do użycia w innych plikach
export default MiniaturesSystem;

