const express = require("express");
const app = express();
const twilio = require("twilio");

// 🔐 Credentials (keep as-is since you said not to worry)
const accountSid = "ACfe2e6e19a4156c0c49999b1bb5d84e74";
const authToken = "92d1a6272ecbe6980ac11c008276f28b";

const client = twilio(accountSid, authToken);

// 🔥 CORS FIX
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(express.json());

// 📍 LOCATIONS (Synced with your reference sheet)
const locations = {
  N: {
    name: "KV Ganeshkhind",
    region: "Pune, Maharashtra",
    maps: "https://www.google.com/maps?q=18.554437,73.818063"
  },
  V: {
    name: "KV CME",
    region: "Pune, Maharashtra",
    maps: "https://www.google.com/maps?q=18.587912,73.835297"
  },
  H: {
    name: "G Block, Ajnara",
    region: "Raj Nagar Ext, Ghaziabad",
    maps: "https://www.google.com/maps?q=28.702694,77.422361"
  },
  S: {
    name: "KV Hindan",
    region: "Ghaziabad, Uttar Pradesh",
    maps: "https://www.google.com/maps?q=28.6994,77.3792"
  },
  R: {
    name: "KV Aligarh",
    region: "Aligarh, Uttar Pradesh",
    maps: "https://www.google.com/maps?q=27.9269,78.1185"
  }
};

// 📱 Numbers
const toNumber = "+917303057483";
const fromNumber = "+12602766298";

// 🚨 SOS FUNCTION
async function sendSOS(location) {
  const message = `🚨 SOS
User: Sarthak
Last known location: ${location.name}, ${location.region}
Google Maps: ${location.maps}`;

  // SMS
  try {
    await client.messages.create({
      body: message,
      from: fromNumber,
      to: toNumber
    });
    console.log("SMS sent");
  } catch (e) {
    console.error("SMS error:", e.message);
  }

  // CALL
  try {
    await client.calls.create({
      twiml: `<Response><Say>Emergency alert. Sarthak's last known location is ${location.name}.</Say></Response>`,
      to: toNumber,
      from: fromNumber
    });
    console.log("Call made");
  } catch (e) {
    console.error("Call error:", e.message);
  }

  // WHATSAPP
  try {
    await client.messages.create({
      body: message,
      from: "whatsapp:+14155238886",
      to: `whatsapp:${toNumber}`
    });
    console.log("WhatsApp sent");
  } catch (e) {
    console.error("WhatsApp error:", e.message);
  }
}

// ✅ GET ENDPOINT
app.get("/sos", async (req, res) => {
  try {
    const key = req.query.sosKey || "N";
    const location = locations[key] || locations["N"];

    await sendSOS(location);

    res.send("SOS sent (GET)");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});

// ✅ POST ENDPOINT
app.post("/sos", async (req, res) => {
  try {
    const key = req.body.sosKey || "N";
    const location = locations[key] || locations["N"];

    await sendSOS(location);

    res.send("SOS sent (POST)");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});

// 🚀 START SERVER
app.listen(process.env.PORT || 3000, () => {
  console.log("Server running");
});
