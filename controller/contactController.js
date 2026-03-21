const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendContactEmail = async (req, res) => {
  const { name, phone, email, message } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'tiwarivaibhavi123@gmail.com',
    subject: 'New Call Back Request – Soulful India Tours',
    html: `
      <h2>New Call Back Request</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong> ${message || 'No message'}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Contact request sent successfully' });
  } catch (error) {
    console.error('Error sending contact email:', error);
    res.status(500).json({ message: 'Failed to send contact request' });
  }
};

module.exports = {
  sendContactEmail,
};