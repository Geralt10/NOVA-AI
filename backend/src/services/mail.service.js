import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function senEmail({ to, subject, html, text }) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Nova AI <noreply@himanshudhoundiyal.xyz>",
      to,
      subject,
      html,
      text,
    });

    if (error) {
      console.error("Resend Error:", error);
      throw new Error(error.message);
    }

    console.log("Email sent successfully:", data);

    return data;
  } catch (err) {
    console.error("Send Email Error:", err);
    throw err;
  }
}