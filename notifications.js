/**
 * System powiadomień dla strony WODJAK Gaming
 * Ostatnia aktualizacja: 10 kwietnia 2025
 */

class NotificationSystem {
	constructor(options = {}) {
		this.container = null;
		this.notifications = [];
		this.notificationData = [];
		this.notificationsPanel = null;
		this.notificationsPanelContent = null;
		this.notificationsButton = null;
		this.isNotificationsPanelOpen = false;
		this.isHoveringNotification = false;
		this.options = {
			maxNotifications: options.maxNotifications || 3,
			duration: options.duration || 5000,
			position: options.position || "top-right",
			theme: document.body.classList.contains("dark-mode") ? "dark" : "light",
			autoLoad: options.autoLoad !== undefined ? options.autoLoad : true,
			autoClose: options.autoClose !== undefined ? options.autoClose : true,
			showOnlyUnread:
				options.showOnlyUnread !== undefined ? options.showOnlyUnread : true,
			markAsReadOnHover:
				options.markAsReadOnHover !== undefined
					? options.markAsReadOnHover
					: true,
			hoverDelay: options.hoverDelay || 1000, // Czas w ms, po którym powiadomienie jest oznaczane jako przeczytane po najechaniu
		};

		// Inicjalizacja systemu
		this.init();

		// Pobierz powiadomienia z pliku JSON, jeśli autoLoad jest włączone
		if (this.options.autoLoad) {
			this.loadNotificationsFromJson();
		}

		// Dodanie obsługi kliknięcia na dokument, aby zamknąć panel powiadomień
		document.addEventListener("click", this.handleDocumentClick.bind(this));
	}

	init() {
		// Tworzenie kontenera na powiadomienia
		this.container = document.createElement("div");
		this.container.className = `notification-container ${this.options.position}`;
		document.body.appendChild(this.container);

		// Pobierz panel powiadomień
		this.notificationsPanel = document.getElementById("notifications-panel");
		this.notificationsPanelContent = document.getElementById(
			"notifications-panel-content"
		);
		this.notificationsButton = document.getElementById("notifications-toggle");

		// Inicjalizacja panelu powiadomień
		this.initNotificationsPanel();

		// Nasłuchiwanie zmian motywu
		document.addEventListener("themeChanged", e => {
			this.options.theme = e.detail.theme;
			this.updateNotificationsTheme();
		});

		// Nasłuchiwanie zmian języka
		document.addEventListener("languageChanged", e => {
			this.updateNotificationsLanguage(e.detail.lang);
			this.renderNotificationsPanel();
		});
	}

	/**
	 * Inicjalizacja panelu powiadomień
	 */
	initNotificationsPanel() {
		if (!this.notificationsPanel || !this.notificationsButton) return;

		// Dodaj obsługę kliknięcia przycisku powiadomień
		this.notificationsButton.addEventListener(
			"click",
			this.toggleNotificationsPanel.bind(this)
		);

		// Obsługa przycisku "Oznacz wszystkie jako przeczytane"
		const markAllReadButton = document.getElementById("mark-all-read");
		if (markAllReadButton) {
			markAllReadButton.addEventListener("click", e => {
				e.stopPropagation();
				this.markAllNotificationsAsRead();
				this.renderNotificationsPanel();
				this.updateNotificationsBadge();
			});
		}
	}

	/**
	 * Pobiera powiadomienia z pliku JSON
	 */
	async loadNotificationsFromJson() {
		try {
			const response = await fetch("notifications.json");
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();

			// Zastosuj konfigurację z pliku JSON
			if (data.config) {
				this.options.maxNotifications =
					data.config.maxNotifications || this.options.maxNotifications;
				this.options.duration =
					data.config.defaultDuration || this.options.duration;
				this.options.position = data.config.position || this.options.position;
				this.options.autoHide = data.config.autoHide;
				this.options.autoClose =
					data.config.autoClose !== undefined
						? data.config.autoClose
						: this.options.autoClose;
				this.options.showOnlyUnread =
					data.config.showOnlyUnread !== undefined
						? data.config.showOnlyUnread
						: this.options.showOnlyUnread;

				// Aktualizuj pozycję kontenera, jeśli się zmieniła
				this.container.className = `notification-container ${this.options.position}`;
			}

			// Zapisz dane powiadomień
			this.notificationData = data.notifications || [];

			// Automatycznie wyświetl powiadomienia oznaczone jako aktywne
			this.displayQueuedNotifications();

			// Renderuj panel powiadomień
			this.renderNotificationsPanel();

			// Aktualizuj licznik powiadomień
			this.updateNotificationsBadge();

			return data;
		} catch (error) {
			console.error("Nie udało się załadować powiadomień:", error);
			return null;
		}
	}

	/**
	 * Obsługuje kliknięcie w dokument, aby zamknąć panel powiadomień
	 */
	handleDocumentClick(event) {
		if (
			this.isNotificationsPanelOpen &&
			this.notificationsPanel &&
			!this.notificationsPanel.contains(event.target) &&
			!this.notificationsButton.contains(event.target)
		) {
			this.closeNotificationsPanel();
		}
	}

	/**
	 * Przełącza widoczność panelu powiadomień
	 */
	toggleNotificationsPanel(event) {
		event.stopPropagation();

		if (this.isNotificationsPanelOpen) {
			this.closeNotificationsPanel();
		} else {
			this.openNotificationsPanel();
		}
	}

	/**
	 * Otwiera panel powiadomień
	 */
	openNotificationsPanel() {
		if (!this.notificationsPanel) return;

		this.notificationsPanel.classList.add("active");
		this.isNotificationsPanelOpen = true;
		this.renderNotificationsPanel();

		// Ukryj istniejące powiadomienia w formie chmurki
		this.hideFloatingNotifications();
	}

	/**
	 * Zamyka panel powiadomień
	 */
	closeNotificationsPanel() {
		if (!this.notificationsPanel) return;

		this.notificationsPanel.classList.remove("active");
		this.isNotificationsPanelOpen = false;

		// Przywróć widoczność chmurkom powiadomień
		this.showFloatingNotifications();
	}

	/**
	 * Ukrywa powiadomienia w formie chmurki, gdy panel jest otwarty
	 */
	hideFloatingNotifications() {
		this.notifications.forEach(notification => {
			notification.style.visibility = "hidden";
			notification.style.opacity = "0";
		});
	}

	/**
	 * Przywraca widoczność powiadomień w formie chmurki
	 */
	showFloatingNotifications() {
		this.notifications.forEach(notification => {
			notification.style.visibility = "visible";
			notification.style.opacity = "1";
		});
	}

	/**
	 * Renderuje listę powiadomień w panelu
	 */
	renderNotificationsPanel() {
		if (!this.notificationsPanelContent) return;

		const currentLang = document.documentElement.getAttribute("lang") || "pl";
		const readNotifications = this.getReadNotifications();
		const deletedNotifications = this.getDeletedNotifications();

		// Wyczyść zawartość panelu
		this.notificationsPanelContent.innerHTML = "";

		// Filtruj aktywne powiadomienia, które nie zostały usunięte
		const activeNotifications = this.notificationData.filter(
			notif => notif.active && !deletedNotifications.includes(notif.id)
		);

		if (activeNotifications.length === 0) {
			// Jeśli nie ma powiadomień, wyświetl komunikat
			const emptyMessage = document.createElement("div");
			emptyMessage.className = "notifications-panel-empty";
			emptyMessage.textContent =
				currentLang === "pl" ? "Brak powiadomień" : "No notifications";
			this.notificationsPanelContent.appendChild(emptyMessage);
			return;
		}

		// Wyświetl powiadomienia w panelu
		activeNotifications.forEach(notif => {
			// Przygotuj treść powiadomienia z uwzględnieniem tłumaczeń
			let title = notif.title;
			let message = notif.message || "";

			// Zastosuj tłumaczenia, jeśli są dostępne
			if (notif.translations && notif.translations[currentLang]) {
				title = notif.translations[currentLang].title || title;
				message = notif.translations[currentLang].message || message;
			}

			// Utwórz element powiadomienia
			const notificationItem = document.createElement("div");
			notificationItem.className = "notifications-panel-item";
			notificationItem.setAttribute("data-notification-id", notif.id);

			// Dodaj klasę typu powiadomienia
			notificationItem.classList.add(notif.type);

			// Dodaj klasę dla przeczytanych/nieprzeczytanych powiadomień
			if (readNotifications.includes(notif.id)) {
				notificationItem.classList.add("read");
			} else {
				notificationItem.classList.add("unread");
			}

			// Określ odpowiednią ikonę
			let iconHTML = "";
			if (notif.icon) {
				iconHTML = `<img src="${notif.icon}" alt="${notif.type}">`;
			} else {
				// Domyślne ikony
				const iconClass = {
					info: "fas fa-info-circle",
					success: "fas fa-check-circle",
					warning: "fas fa-exclamation-triangle",
					error: "fas fa-times-circle",
					youtube: "fab fa-youtube",
					twitch: "fab fa-twitch",
					tiktok: "fab fa-tiktok",
					discord: "fab fa-discord",
					instagram: "fab fa-instagram",
				};
				iconHTML = `<i class="${iconClass[notif.type] || iconClass.info}"></i>`;
			}

			// Formatuj datę, jeśli istnieje
			let dateText = "";
			if (notif.date) {
				const date = new Date(notif.date);
				dateText = date.toLocaleDateString(
					currentLang === "pl" ? "pl-PL" : "en-US",
					{
						year: "numeric",
						month: "short",
						day: "numeric",
					}
				);
			} else {
				dateText = currentLang === "pl" ? "Dzisiaj" : "Today";
			}

			// Ustaw zawartość powiadomienia
			notificationItem.innerHTML = `
                <div class="notifications-panel-item-icon">
                    ${iconHTML}
                </div>
                <div class="notifications-panel-item-content">
                    <div class="notifications-panel-item-title">${title}</div>
                    ${
											message
												? `<div class="notifications-panel-item-message">${message}</div>`
												: ""
										}
                    <div class="notifications-panel-item-time">${dateText}</div>
                </div>
                <button class="notifications-panel-item-delete" title="${
									currentLang === "pl"
										? "Usuń powiadomienie"
										: "Delete notification"
								}">×</button>
            `;

			// Obsługa oznaczania jako przeczytane po najechaniu
			if (
				this.options.markAsReadOnHover &&
				!readNotifications.includes(notif.id)
			) {
				let hoverTimer;

				notificationItem.addEventListener("mouseenter", () => {
					hoverTimer = setTimeout(() => {
						if (!readNotifications.includes(notif.id)) {
							this.markNotificationAsRead(notif.id);
							notificationItem.classList.remove("unread");
							notificationItem.classList.add("read");
							this.updateNotificationsBadge();
						}
					}, this.options.hoverDelay);
				});

				notificationItem.addEventListener("mouseleave", () => {
					clearTimeout(hoverTimer);
				});
			}

			// Dodaj obsługę kliknięcia w powiadomienie
			notificationItem.addEventListener("click", e => {
				// Jeśli kliknięto w przycisk usuwania, nie wykonuj akcji powiadomienia
				if (e.target.classList.contains("notifications-panel-item-delete")) {
					return;
				}

				// Oznacz jako przeczytane
				this.markNotificationAsRead(notif.id);

				// Jeśli ma link, przekieruj
				if (notif.link) {
					window.open(notif.link, "_blank");
				}

				// Aktualizuj panel
				this.renderNotificationsPanel();
				this.updateNotificationsBadge();
			});

			// Dodaj obsługę przycisku usuwania
			const deleteButton = notificationItem.querySelector(
				".notifications-panel-item-delete"
			);
			if (deleteButton) {
				deleteButton.addEventListener("click", e => {
					e.stopPropagation(); // Zatrzymaj propagację, aby nie wywołać zdarzenia kliknięcia w powiadomienie
					this.deleteNotification(notif.id);
					this.renderNotificationsPanel();
				});
			}

			// Dodaj do panelu
			this.notificationsPanelContent.appendChild(notificationItem);
		});
	}

	/**
	 * Usuwa powiadomienie (oznacza jako usunięte w localStorage)
	 */
	deleteNotification(notificationId) {
		const deletedNotifications = this.getDeletedNotifications();
		if (!deletedNotifications.includes(notificationId)) {
			deletedNotifications.push(notificationId);
			localStorage.setItem(
				"deletedNotifications",
				JSON.stringify(deletedNotifications)
			);

			// Jeśli powiadomienie nie było przeczytane, oznacz je jako przeczytane
			this.markNotificationAsRead(notificationId);
		}
	}

	/**
	 * Pobiera listę usuniętych powiadomień z localStorage
	 */
	getDeletedNotifications() {
		return JSON.parse(localStorage.getItem("deletedNotifications") || "[]");
	}

	/**
	 * Czyści historię usuniętych powiadomień
	 */
	clearDeletedNotificationsHistory() {
		localStorage.removeItem("deletedNotifications");
	}

	/**
	 * Aktualizuje licznik nieprzeczytanych powiadomień
	 */
	updateNotificationsBadge() {
		if (!this.notificationsButton) return;

		const badge = this.notificationsButton.querySelector(
			".notifications-badge"
		);
		if (!badge) return;

		const readNotifications = this.getReadNotifications();
		const deletedNotifications = this.getDeletedNotifications();

		// Licz nieprzeczytane powiadomienia, które nie zostały usunięte
		const unreadCount = this.notificationData.filter(
			n =>
				n.active &&
				!readNotifications.includes(n.id) &&
				!deletedNotifications.includes(n.id)
		).length;

		if (unreadCount > 0) {
			badge.textContent = unreadCount > 99 ? "99+" : unreadCount.toString();
			badge.classList.add("visible");
			this.notificationsButton.classList.add("new-notification");
		} else {
			badge.classList.remove("visible");
			this.notificationsButton.classList.remove("new-notification");
		}
	}

	/**
	 * Wyświetla wszystkie kolejkowane powiadomienia zgodnie z ustawieniami opóźnienia
	 */
	displayQueuedNotifications() {
		const currentLang = document.documentElement.getAttribute("lang") || "pl";
		const readNotifications = this.getReadNotifications();
		const deletedNotifications = this.getDeletedNotifications();

		// Filtruj tylko aktywne powiadomienia, które nie zostały usunięte
		let activeNotifications = this.notificationData.filter(
			notif => notif.active && !deletedNotifications.includes(notif.id)
		);

		// Jeśli opcja showOnlyUnread jest włączona, filtruj tylko nieprzeczytane powiadomienia
		if (this.options.showOnlyUnread) {
			activeNotifications = activeNotifications.filter(
				notif => !readNotifications.includes(notif.id)
			);
		}

		// Ustaw timery dla każdego powiadomienia
		activeNotifications.forEach(notif => {
			setTimeout(() => {
				// Nie pokazuj chmurki powiadomienia, jeśli panel jest otwarty
				if (this.isNotificationsPanelOpen) return;

				// Przygotuj treść powiadomienia z uwzględnieniem tłumaczeń
				let title = notif.title;
				let message = notif.message || "";

				// Zastosuj tłumaczenia, jeśli są dostępne
				if (notif.translations && notif.translations[currentLang]) {
					title = notif.translations[currentLang].title || title;
					message = notif.translations[currentLang].message || message;
				}

				// Połącz tytuł i wiadomość, jeśli oba istnieją
				let content = title;
				if (message) {
					content = `<strong>${title}</strong><br>${message}`;
				}

				// Dodaj link, jeśli istnieje
				if (notif.link) {
					content = `<a href="${notif.link}" target="_blank">${content}</a>`;
				}

				// Określ, czy powiadomienie powinno być automatycznie zamykane
				// Priorytet: ustawienie indywidualne powiadomienia > ustawienie globalne z JSON > ustawienie domyślne klasy
				const shouldAutoClose =
					notif.autoClose !== undefined
						? notif.autoClose
						: this.options.autoClose !== undefined
						? this.options.autoClose
						: true;

				// Wyświetl powiadomienie z odpowiednim typem i ikoną
				const notification = this.show(
					content,
					notif.type,
					notif.icon,
					notif.duration || this.options.duration,
					notif.id,
					shouldAutoClose
				);

				// Dodaj klasy specjalne dla stałych powiadomień
				if (!shouldAutoClose) {
					notification.classList.add("notification-persistent");
				}

				// Zapisz ID powiadomienia jako przeczytane po zamknięciu
				notification.addEventListener("close", () => {
					this.markNotificationAsRead(notif.id);
				});

				// Obsługa oznaczania jako przeczytane po najechaniu
				if (this.options.markAsReadOnHover) {
					let hoverTimer;

					notification.addEventListener("mouseenter", () => {
						this.isHoveringNotification = true;
						hoverTimer = setTimeout(() => {
							if (!readNotifications.includes(notif.id)) {
								this.markNotificationAsRead(notif.id);
								this.updateNotificationsBadge();
							}
						}, this.options.hoverDelay);
					});

					notification.addEventListener("mouseleave", () => {
						this.isHoveringNotification = false;
						clearTimeout(hoverTimer);
					});
				}
			}, notif.showDelay || 0);
		});
	}

	/**
	 * Pobiera listę przeczytanych powiadomień z localStorage
	 */
	getReadNotifications() {
		return JSON.parse(localStorage.getItem("readNotifications") || "[]");
	}

	/**
	 * Sprawdza, czy powiadomienie zostało już przeczytane
	 */
	isNotificationRead(notificationId) {
		const readNotifications = this.getReadNotifications();
		return readNotifications.includes(notificationId);
	}

	/**
	 * Oznacza powiadomienie jako przeczytane
	 */
	markNotificationAsRead(notificationId) {
		const readNotifications = this.getReadNotifications();
		if (!readNotifications.includes(notificationId)) {
			readNotifications.push(notificationId);
			localStorage.setItem(
				"readNotifications",
				JSON.stringify(readNotifications)
			);

			// Wyemituj zdarzenie zamknięcia powiadomienia
			const notificationClosedEvent = new CustomEvent("notificationClosed", {
				detail: { id: notificationId },
			});
			document.dispatchEvent(notificationClosedEvent);
		}
	}

	/**
	 * Oznacza wszystkie powiadomienia jako przeczytane
	 */
	markAllNotificationsAsRead() {
		const activeNotificationIds = this.notificationData
			.filter(notif => notif.active)
			.map(notif => notif.id);

		localStorage.setItem(
			"readNotifications",
			JSON.stringify(activeNotificationIds)
		);

		// Wyemituj zdarzenie zamknięcia powiadomień
		const notificationClosedEvent = new CustomEvent("notificationsAllClosed");
		document.dispatchEvent(notificationClosedEvent);
	}

	/**
	 * Czyści historię przeczytanych powiadomień
	 */
	clearReadNotificationsHistory() {
		localStorage.removeItem("readNotifications");
		this.renderNotificationsPanel();
		this.updateNotificationsBadge();
	}

	/**
	 * Czyści historię usuniętych powiadomień
	 */
	clearDeletedNotificationsHistory() {
		localStorage.removeItem("deletedNotifications");
	}

	updateNotificationsTheme() {
		const notifications = document.querySelectorAll(".notification");
		notifications.forEach(notification => {
			notification.classList.remove("light", "dark");
			notification.classList.add(this.options.theme);
		});
	}

	/**
	 * Aktualizuje język powiadomień, które są już wyświetlone
	 */
	updateNotificationsLanguage(lang) {
		// Dla każdego aktualnie wyświetlanego powiadomienia
		this.notifications.forEach(notification => {
			const notificationId = notification.getAttribute("data-notification-id");
			if (!notificationId) return;

			// Znajdź dane powiadomienia
			const notifData = this.notificationData.find(
				n => n.id === notificationId
			);
			if (
				!notifData ||
				!notifData.translations ||
				!notifData.translations[lang]
			)
				return;

			// Aktualizuj tekst na podstawie tłumaczeń
			const translation = notifData.translations[lang];
			const contentElement = notification.querySelector(
				".notification-content p"
			);

			if (contentElement) {
				let content = translation.title;
				if (translation.message) {
					content = `<strong>${translation.title}</strong><br>${translation.message}`;
				}

				// Dodaj link, jeśli istnieje
				if (notifData.link) {
					content = `<a href="${notifData.link}" target="_blank">${content}</a>`;
				}

				contentElement.innerHTML = content;
			}
		});
	}

	show(
		message,
		type = "info",
		icon = null,
		duration = null,
		notificationId = null,
		autoClose = true
	) {
		// Tworzenie elementu powiadomienia
		const notification = document.createElement("div");
		notification.className = `notification ${type} ${this.options.theme}`;

		// Dodaj klasę dla stałych powiadomień
		if (!autoClose) {
			notification.classList.add("notification-persistent");
		}

		// Dodaj ID powiadomienia jako atrybut data
		if (notificationId) {
			notification.setAttribute("data-notification-id", notificationId);
		}

		// Zawartość powiadomienia
		let iconHTML = "";
		if (icon) {
			iconHTML = `<img src="${icon}" class="notification-icon" alt="${type}">`;
		} else {
			// Domyślne ikony
			const iconClass = {
				info: "fas fa-info-circle",
				success: "fas fa-check-circle",
				warning: "fas fa-exclamation-triangle",
				error: "fas fa-times-circle",
				youtube: "fab fa-youtube",
				twitch: "fab fa-twitch",
				tiktok: "fab fa-tiktok",
				discord: "fab fa-discord",
				instagram: "fab fa-instagram",
			};
			iconHTML = `<i class="${iconClass[type] || iconClass.info}"></i>`;
		}

		notification.innerHTML = `
            <div class="notification-icon-container">
                ${iconHTML}
            </div>
            <div class="notification-content">
                <p>${message}</p>
            </div>
            <button class="notification-close">×</button>
        `;

		// Dodawanie do kontenera
		this.container.appendChild(notification);

		// Dodawanie do listy aktywnych powiadomień
		this.notifications.push(notification);

		// Usuwanie najstarszych powiadomień, jeśli przekroczono limit
		if (this.notifications.length > this.options.maxNotifications) {
			this.close(this.notifications[0]);
		}

		// Obsługa przycisku zamknięcia
		const closeButton = notification.querySelector(".notification-close");
		closeButton.addEventListener("click", () => this.close(notification));

		// Zdarzenie zamknięcia powiadomienia
		const closeEvent = new Event("close");

		// Automatyczne zamknięcie po określonym czasie, tylko jeśli autoClose jest true
		if (autoClose && this.options.autoHide !== false && duration !== 0) {
			const notificationDuration = duration || this.options.duration;
			setTimeout(() => {
				if (this.notifications.includes(notification)) {
					notification.dispatchEvent(closeEvent);
					this.close(notification);
				}
			}, notificationDuration);
		}

		// Animacja wejścia
		setTimeout(() => {
			notification.classList.add("show");
		}, 10);

		return notification;
	}

	close(notification) {
		notification.classList.remove("show");
		notification.classList.add("hide");

		// Zdarzenie zamknięcia powiadomienia
		const notificationId = notification.getAttribute("data-notification-id");
		const notificationClosedEvent = new CustomEvent("notificationClosed", {
			detail: { id: notificationId },
		});
		document.dispatchEvent(notificationClosedEvent);

		// Usuwanie z DOM i z listy po zakończeniu animacji
		setTimeout(() => {
			if (notification.parentNode === this.container) {
				this.container.removeChild(notification);
			}
			this.notifications = this.notifications.filter(n => n !== notification);
		}, 300); // czas trwania animacji
	}

	info(
		message,
		icon = null,
		duration = null,
		notificationId = null,
		autoClose = true
	) {
		return this.show(
			message,
			"info",
			icon,
			duration,
			notificationId,
			autoClose
		);
	}

	success(
		message,
		icon = null,
		duration = null,
		notificationId = null,
		autoClose = true
	) {
		return this.show(
			message,
			"success",
			icon,
			duration,
			notificationId,
			autoClose
		);
	}

	warning(
		message,
		icon = null,
		duration = null,
		notificationId = null,
		autoClose = true
	) {
		return this.show(
			message,
			"warning",
			icon,
			duration,
			notificationId,
			autoClose
		);
	}

	error(
		message,
		icon = null,
		duration = null,
		notificationId = null,
		autoClose = true
	) {
		return this.show(
			message,
			"error",
			icon,
			duration,
			notificationId,
			autoClose
		);
	}

	newVideo(
		title,
		url,
		duration = null,
		notificationId = null,
		autoClose = true
	) {
		const message = `<strong>Nowy film:</strong> <a href="${url}" target="_blank">${title}</a>`;
		return this.show(
			message,
			"youtube",
			"images/icons/icon_youtube_32.png",
			duration,
			notificationId,
			autoClose
		);
	}

	newStream(
		title,
		url,
		duration = null,
		notificationId = null,
		autoClose = true
	) {
		const message = `<strong>Rozpoczynam stream:</strong> <a href="${url}" target="_blank">${title}</a>`;
		return this.show(
			message,
			"twitch",
			"images/icons/icon_twitch_32.png",
			duration,
			notificationId,
			autoClose
		);
	}

	newTikTok(
		title,
		url,
		duration = null,
		notificationId = null,
		autoClose = true
	) {
		const message = `<strong>Nowy TikTok:</strong> <a href="${url}" target="_blank">${title}</a>`;
		return this.show(
			message,
			"tiktok",
			"images/icons/icon_tiktok_32.png",
			duration,
			notificationId,
			autoClose
		);
	}

	/**
	 * Ręczne wyświetlenie konkretnego powiadomienia z pliku JSON po ID
	 */
	showNotificationById(notificationId) {
		const notif = this.notificationData.find(n => n.id === notificationId);
		if (!notif) {
			console.error(`Powiadomienie o ID "${notificationId}" nie istnieje.`);
			return null;
		}

		const currentLang = document.documentElement.getAttribute("lang") || "pl";
		let title = notif.title;
		let message = notif.message || "";

		// Zastosuj tłumaczenia, jeśli są dostępne
		if (notif.translations && notif.translations[currentLang]) {
			title = notif.translations[currentLang].title || title;
			message = notif.translations[currentLang].message || message;
		}

		// Połącz tytuł i wiadomość, jeśli oba istnieją
		let content = title;
		if (message) {
			content = `<strong>${title}</strong><br>${message}`;
		}

		// Dodaj link, jeśli istnieje
		if (notif.link) {
			content = `<a href="${notif.link}" target="_blank">${content}</a>`;
		}

		// Określ, czy powiadomienie powinno być automatycznie zamykane
		const shouldAutoClose =
			notif.autoClose !== undefined
				? notif.autoClose
				: this.options.autoClose !== undefined
				? this.options.autoClose
				: true;

		// Wyświetl powiadomienie z odpowiednim typem i ikoną
		return this.show(
			content,
			notif.type,
			notif.icon,
			notif.duration || this.options.duration,
			notif.id,
			shouldAutoClose
		);
	}

	/**
	 * Odświeża powiadomienia z pliku JSON
	 */
	async refreshNotifications() {
		// Usuń wszystkie aktywne powiadomienia
		while (this.notifications.length > 0) {
			this.close(this.notifications[0]);
		}

		// Załaduj powiadomienia ponownie
		await this.loadNotificationsFromJson();
	}

	/**
	 * Przywraca wszystkie usunięte powiadomienia
	 */
	restoreDeletedNotifications() {
		this.clearDeletedNotificationsHistory();
		this.renderNotificationsPanel();
		this.updateNotificationsBadge();
	}
}

// Eksport klasy do użycia w innych plikach
export default NotificationSystem;
