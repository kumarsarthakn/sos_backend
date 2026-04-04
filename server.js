const express = require("express");
const app = express();

const twilio = require("twilio");

// 🔐 Credentials
const accountSid = "ACfe2e6e19a4156c0c49999b1bb5d84e74";
const authToken = "3b2a4b6fd4ea5fd4821c152968c644fe";

const client = twilio(accountSid, authToken);

app.use(express.json());

// 📍 Locations
const locations = {
  N: "Home",
  V: "School",
  H: "Gym",
  G: "Park"
};

// 📱 Numbers
const toNumber = "+917303057483";
const fromNumber = "+12602766298";

// 🔥 FUNCTION
async function sendSOS(locationText) {
  const message = `
🚨 SOS ALERT 🚨
User: SmartSprint User
Location: ${locationText}
`;

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

  try {
    await client.calls.create({
      twiml: `<Response><Say>Emergency alert. Location is ${locationText}</Say></Response>`,
      to: toNumber,
      from: fromNumber
    });
    console.log("Call made");
  } catch (e) {
    console.error("Call error:", e.message);
  }

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

// ✅ GET
app.get("/sos", async (req, res) => {
  try {
    const key = req.query.key || "N";
    const locationText = locations[key] || locations["N"];

    await sendSOS(locationText);

    res.send("SOS sent (GET)");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});

// ✅ POST
app.post("/sos", async (req, res) => {
  try {
    const key = req.body.sosKey || "N";
    const locationText = locations[key] || locations["N"];

    await sendSOS(locationText);

    res.send("SOS sent (POST)");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running");
});
