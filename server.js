const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const otpGenerator = require("otp-generator");
const { sendOTPEmail, sendOTPSMS, generateToken } = require("./helpers");
const Details = require("./details");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const CONNECTION_URL =
  "mongodb+srv://root:M5dKa_G29EvVhrR@cluster0.8mjtkdf.mongodb.net/?retryWrites=true&w=majority";
const PORT = process.env.PORT || 5000;
// Connect to MongoDB
mongoose.connect(CONNECTION_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.post("/sendOTP", async (req, res) => {
  const { name, email, mobile } = req.body;
  const mailOTP = otpGenerator.generate(6, {
    upperCase: false,
    specialChars: false,
    alphabets: false,
  });
  const phoneOTP = otpGenerator.generate(6, {
    upperCase: false,
    specialChars: false,
    alphabets: false,
  });

  const newDetails = new Details({ name, email, mobile, mailOTP, phoneOTP });

  try {
    await newDetails.save();
    sendOTPEmail(
      email,
      "Your verification OTP",
      `Your authentication otp is ${mailOTP}`
    );
    sendOTPSMS(mobile, phoneOTP);

    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});

app.post("/verify", async (req, res) => {
  const { email, mailOTP, phoneOTP } = req.body();

  try {
    const details = await Details.findOne(email);
    if (details.mailOTP == mailOTP && details.phoneOTP == phoneOTP) {
      const token = generateToken(email);
      res.send(token);
    } else {
      res.send("Invalid OTP");
    }
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

app.post("/invite", async (req, res) => {
  const token = req.body;

  try {
    const decode = jwt.verify(token, "ssllhh");
    const email = decode.email;
    const link = "https://discord.gg/2x6d6tT7yX"
    sendOTPEmail(email, "Your invite link", `You are invited to join TSAW community at ${link}`)
    res.status(200).json(email)
  } catch (error) {
    res.status(409).json({message: error.message});
  }
});

app.listen(PORT, () => {
  console.log("");
});
