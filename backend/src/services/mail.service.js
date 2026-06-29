import nodemailer from "nodemailer";

const transpoter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.GOOGLE_USER,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    clientId: process.env.GOOGLE_CLIENT_ID,
  },
});



// transpoter
//   .verify()
//   .then(() => {
//     console.log("email transporter is ready to send emails");
//   })
//   .catch((err) => {
//     console.error("email transport verification failed", err);
//   });


export async function senEmail({ to, subject, html, text }) {
  try {
    console.log("Before sendMail");

    const details = await transpoter.sendMail({
      from: process.env.GOOGLE_USER,
      to,
      subject,
      html,
      text,
    });

    console.log("After sendMail");
    console.log(details);

    return details;
  } catch (err) {
    console.error("sendMail error:", err);
    throw err;
  }
}

//   const details = await transpoter.sendMail(mailOptions);
//   console.log("email sent:", details);

//   return "email has sent successfully to " + to;
// }
