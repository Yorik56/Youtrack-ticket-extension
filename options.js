document.addEventListener("DOMContentLoaded", () => {
	// Restauration des valeurs enregistrées
	browser.storage.local.get(["ytUrl", "ytToken", "ytProject"]).then(data => {
		document.getElementById("yt-url").value = data.ytUrl || "";
		document.getElementById("yt-token").value = data.ytToken || "";
		document.getElementById("yt-project").value = data.ytProject || "";
	});

	// Sauvegarde et feedback visuel
	document.getElementById("options-form").addEventListener("submit", (e) => {
		e.preventDefault();

		browser.storage.local.set({
			ytUrl: document.getElementById("yt-url").value,
			ytToken: document.getElementById("yt-token").value,
			ytProject: document.getElementById("yt-project").value
		}).then(() => {
			const msg = document.getElementById("success-message");
			msg.style.display = "block";
			setTimeout(() => msg.style.display = "none", 3000);
		});
	});
});
