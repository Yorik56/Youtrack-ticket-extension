const express = require("express");
const cors = require("cors");
const { simpleParser } = require("mailparser");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: "10mb" })); // Support des emails volumineux

// ✅ Fonction utilitaire : récupérer le vrai ID projet
async function getProjectIdFromShortName(ytUrl, ytToken, shortName) {
	const res = await fetch(`${ytUrl}/api/admin/projects?fields=id,shortName`, {
		headers: { Authorization: `Bearer ${ytToken}` }
	});
	if (!res.ok) throw new Error(`Impossible de récupérer les projets : ${res.statusText}`);
	const projects = await res.json();
	const match = projects.find(p => p.shortName === shortName);
	if (!match) throw new Error(`Projet introuvable pour le code : ${shortName}`);
	return match.id;
}

app.post("/create-ticket", async (req, res) => {
	console.log("📥 Requête reçue sur /create-ticket");

	let {
		ytUrl,
		ytToken,
		ytProject,
		summary,
		description,
		descriptionHtml,
		rawEmail
	} = req.body;

	// 🧠 Si email brut fourni, on le parse avec mailparser
	if (rawEmail) {
		try {
			const parsed = await simpleParser(rawEmail);
			console.log("📩 Email parsé avec mailparser");

			// 🔁 Remplacement des cid:images par des data:image/... en base64
			if (parsed.html && parsed.attachments?.length) {
				for (const att of parsed.attachments) {
					if (att.contentId && att.contentType.startsWith("image/")) {
						const base64 = att.content.toString("base64");
						const dataUrl = `data:${att.contentType};base64,${base64}`;
						const cidRegex = new RegExp(`cid:${att.contentId}`, "g");
						parsed.html = parsed.html.replace(cidRegex, dataUrl);
					}
				}
			}

			// 🎯 Génération des champs description
			description = `Expéditeur : ${parsed.from?.text || "inconnu"}\n\nContenu :\n${parsed.text || "(vide)"}`;
			descriptionHtml = `<p><strong>Expéditeur :</strong> ${parsed.from?.text || "inconnu"}</p><hr>${parsed.html || ""}`;

		} catch (err) {
			console.warn("⚠️ Erreur mailparser :", err.message);
		}
	}

	console.log("🔍 Données reçues :", {
		ytUrl,
		ytToken: ytToken ? `${ytToken.slice(0, 10)}...` : undefined,
		ytProject,
		summary,
		descriptionPreview: (descriptionHtml || description)?.substring(0, 100)
	});

	if (!ytUrl || !ytToken || !ytProject || !summary || (!description && !descriptionHtml)) {
		console.warn("❌ Requête incomplète");
		return res.status(400).json({ error: "Requête incomplète" });
	}

	try {
		const projectId = await getProjectIdFromShortName(ytUrl, ytToken, ytProject);

		const finalDescription = descriptionHtml || description;
		const issue = {
			summary,
			description: finalDescription,
			project: { id: projectId }
		};

		const targetUrl = `${ytUrl}/api/issues?fields=id,idReadable,summary`;
		console.log("➡️ Envoi vers YouTrack :", targetUrl, issue);

		const ytRes = await fetch(targetUrl, {
			method: "POST",
			headers: {
				"Authorization": `Bearer ${ytToken}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify(issue)
		});

		const rawText = await ytRes.text();
		console.log(`📡 Réponse YouTrack (${ytRes.status}):`, rawText);

		let json;
		try {
			json = JSON.parse(rawText);
		} catch (e) {
			console.warn("⚠️ Réponse non JSON");
			json = { raw: rawText };
		}

		res.status(ytRes.status).json(json);
	} catch (err) {
		console.error("💥 Erreur proxy :", err.message);
		res.status(500).json({ error: err.message });
	}
});

app.listen(PORT, () => {
	console.log(`🚀 Proxy YouTrack en écoute sur http://localhost:${PORT}`);
});
