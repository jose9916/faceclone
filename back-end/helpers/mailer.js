const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const { EMAIL, MAILING_ID, MAILING_REFRESH, MAILING_SECRET } = process.env;

const { OAuth2 } = google.auth;

// La URI de redirección de OAuth2 es fija
const oauth2Client = new OAuth2(
  MAILING_ID,
  MAILING_SECRET,
  "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
  refresh_token: MAILING_REFRESH, // Aquí le pasamos el refresh token
});

exports.sendVerificationEmail = async (email, name, url) => {
  try {
    // Obtenemos el token de acceso usando el refresh_token
    const { token } = await oauth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: EMAIL,
        clientId: MAILING_ID,
        clientSecret: MAILING_SECRET,
        refreshToken: MAILING_REFRESH,
        accessToken: token,
      },
      tls: {
        rejectUnauthorized: false, // Permite la conexión sin validación estricta de certificados
      },
    });

    const mailOptions = {
      from: EMAIL,
      to: email,
      subject: "Facebook Email Verification",
      html: `
        <div style="max-width:700px;margin-bottom:1rem;display:flex;align-items:center;gap:10px;font-family:Roboto;font-weight:600;color:#3b5998">
          <img src="https://upload.wikimedia.org/wikipedia/commons/c/cd/Facebook_logo_%28square%29.png" alt="" style="width:30px" />
          <span>Action required: Activate your Facebook account.</span>
        </div>
        <div style="padding:1rem 0;border-top:1px solid #e5e5e5;border-bottom:1px solid #e5e5e5;color:#141833;font-size:17px;font-family:Roboto">
          <span>Hello ${name},</span>
          <div style="padding:20px 0">
            <span>To complete your registration on Facebook Clone, please confirm your email by clicking the button below.</span>
          </div>
          <a href="${url}" style="width:200px;padding:10px 15px;background:#4c649b;color:#fff;text-decoration:none;font-weight:600">Confirm your account</a>
          <div style="padding-top:20px">
            <span style="color:#898f9c">After verifying your account, you’ll be able to connect with friends, share posts, and enjoy the platform!</span>
          </div>
        </div>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.error("❌ Error sending verification email:", error.message);
    return { error: error.message };
  }
};

exports.sendResetCode = async (email, name, code) => {
  try {
    // Obtenemos el token de acceso usando el refresh_token
    const { token } = await oauth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: EMAIL,
        clientId: MAILING_ID,
        clientSecret: MAILING_SECRET,
        refreshToken: MAILING_REFRESH,
        accessToken: token,
      },
      tls: {
        rejectUnauthorized: false, // Permite la conexión sin validación estricta de certificados
      },
    });

    const mailOptions = {
      from: EMAIL,
      to: email,
      subject: "Reset facebook password",
      html: `
        <div style="max-width:700px;margin-bottom:1rem;display:flex;align-items:center;gap:10px;font-family:Roboto;font-weight:600;color:#3b5998">
          <img src="https://upload.wikimedia.org/wikipedia/commons/c/cd/Facebook_logo_%28square%29.png" alt="" style="width:30px" />
          <span>Action required: Activate your Facebook account.</span>
        </div>
        <div style="padding:1rem 0;border-top:1px solid #e5e5e5;border-bottom:1px solid #e5e5e5;color:#141833;font-size:17px;font-family:Roboto">
          <span>Hello ${name},</span>
          <div style="padding:20px 0">
            <span>To complete your registration on Facebook Clone, please confirm your email by clicking the button below.</span>
          </div>
          <a  style="width:200px;padding:10px 15px;background:#4c649b;color:#fff;text-decoration:none;font-weight:600">${code}</a>
          <div style="padding-top:20px">
            <span style="color:#898f9c">After verifying your account, you’ll be able to connect with friends, share posts, and enjoy the platform!</span>
          </div>
        </div>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.error("❌ Error sending verification email:", error.message);
    return { error: error.message };
  }
};
