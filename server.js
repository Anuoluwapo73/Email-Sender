import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json());

//Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.get("/", (req, res) => {
  res.send("Email Service is Running");
});

//POST route to send email
app.post("/send", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Email 1 → Send to YOU (Admin)
  const adminMail = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: `New message from ${name}`,
    html: `
      <div style="font-family: Arial; line-height: 1.5;">
        <h2 style="color: #1D4ED8;">New User Message</h2>
        <p style="font-size: 15px;"><strong>Name:</strong> ${name}</p>
        <p style="font-size: 15px;"><strong>Email:</strong> ${email}</p>
        <p style="font-size: 15px;"><strong>Message:</strong></p>
        <p style="background: #f5f5f5; padding: 10px; border-radius: 5px;">
          ${message}
        </p>
      </div>
    `,
  };

  // Email 2 → Send to the USER
  const userMail = {
    from: process.env.EMAIL_USER,
    to: email, // this one goes to the user
    subject: "Your message was received successfully",
    html: `
      <div style="font-family: Arial; line-height: 1.5;">
        <h2 style="color: green;">Message Received ✔</h2>
        <p style="font-size: 15px;">Hi <strong>${name}</strong>,</p>
        <p style="font-size: 15px;">
          Thank you for reaching out. Your message has been delivered successfully.
          I will get back to you soon.
        </p>

        <p style="margin-top: 20px; font-size: 14px;">
          <strong>Your Message:</strong><br>
          <span style="background: #f0f0f0; padding: 10px; border-radius: 5px; display: inline-block;">
            ${message}
          </span>
        </p>

        <p style="font-size: 14px; color: gray;">
          If you didn't send this request, please ignore this email.
        </p>
      </div>
    `,
  };

  try {
    // Send email to admin
    await transporter.sendMail(adminMail);
    // Send confirmation to user
    await transporter.sendMail(userMail);

    res.json({ success: true, message: "Emails sent successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

//Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
