browser.messageDisplayAction.onClicked.addListener(async () => {
	console.log("🟡 [Thunderbird] Clic sur 'Créer un ticket'");

	const config = await browser.storage.local.get(["ytUrl", "ytToken", "ytProject"]);
	console.log("📦 Configuration chargée :", config);

	if (!config.ytUrl || !config.ytToken || !config.ytProject) {
		console.warn("❌ Configuration incomplète. Abandon.");
		return;
	}

	const messageList = await browser.mailTabs.getSelectedMessages();
	if (!messageList.messages.length) {
		console.warn("❌ Aucun message sélectionné.");
		return;
	}

	const message = messageList.messages[0];
	console.log("📨 Message sélectionné :", message);

	let rawEmail = "";

	try {
		rawEmail = await browser.messages.getRaw(message.id);
		console.debug("📧 Email brut récupéré (taille) :", rawEmail.length);
	} catch (e) {
		console.warn("⚠️ Impossible de récupérer le raw email :", e.message);
	}

	const payload = {
		ytUrl: config.ytUrl,
		ytToken: config.ytToken,
		ytProject: config.ytProject,
		summary: `[Thunderbird] ${message.subject || "(Sans objet)"}`,
		rawEmail, // 🧠 C'est ça que le proxy va parser avec mailparser
	};

	console.log("📤 Données envoyées au proxy :", {
		url: "http://localhost:3000/create-ticket",
		payload
	});

	try {
		const res = await fetch("http://localhost:3000/create-ticket", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload)
		});

		console.log("🔁 Réponse brute du proxy :", res);

		if (!res.ok) {
			console.error("❌ Réponse proxy NOK :", res.status, res.statusText);
			return;
		}

		const json = await res.json();
		console.log("✅ Ticket créé :", json);
	} catch (e) {
		console.error("💥 Erreur réseau ou proxy :", e.message);
	}
});
