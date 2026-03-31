const express = require("express");
const app = express();

const twilio = require("twilio");

// 🔐 REPLACE THESE
const accountSid = "ACfe2e6e19a4156c0c49999b1bb5d84e74";
const authToken = "09bdd23506e5c7492d2eaa27ec1ececd";

const client = twilio(accountSid, authToken);

app.use(express.json());

const locations = {
  N: "Home",
  V: "School",
  H: "Gym",
  G: "Park"
};

app.post("/sos", async (req, res) => {
  try {
    const key = req.body.sosKey || "N";
    const locationText = locations[key] || locations["N"];

    const message = `
🚨 SOS ALERT 🚨

User: SmartSprint User
Needs immediate help!

📍 Location: ${locationText}
`;

    const toNumber = "+917005438027"; // your number
    const fromNumber = "+12602766298"; // twilio number

    await client.messages.create({
      body: message,
      from: fromNumber,
      to: toNumber
    });

    await client.messages.create({
      body: message,
      from: "whatsapp:+14155238886",
      to: `whatsapp:${toNumber}`
    });

    await client.calls.create({
      twiml: `
<Response>
  <Say voice="alice">
    Emergency alert. SmartSprint user needs help. Location is ${locationText}.
  </Say>
</Response>
`,
      to: toNumber,
      from: fromNumber
    });

    res.send("SOS sent");

  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running");
});
