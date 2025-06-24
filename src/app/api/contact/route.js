import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const { name, email, phone, message } = await req.json();
    if (!email || !message || !name) {
      return new Response(JSON.stringify({ error: 'Nom, email et message requis.' }), { status: 400 });
    }

    // Config SMTP (Gmail, à adapter avec mot de passe d'application)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER, // exemple: 'amaaliousama@gmail.com'
        pass: process.env.GMAIL_PASS, // mot de passe d'application
      },
    });

    const htmlContent = `
      <h2>Nouveau message depuis le site Fiduciaire Amaali</h2>
      <p><strong>Nom complet :</strong> ${name}</p>
      <p><strong>Email :</strong> ${email}</p>
      <p><strong>Téléphone :</strong> ${phone || 'Non renseigné'}</p>
      <p><strong>Message :</strong><br/>${message.replace(/\n/g, '<br/>')}</p>
    `;

    await transporter.sendMail({
      from: email,
      to: 'amaaliousama@gmail.com',
      subject: 'Nouveau message depuis le site Fiduciaire Amaali',
      text: `Nom: ${name}\nEmail: ${email}\nTéléphone: ${phone}\n\nMessage:\n${message}`,
      html: htmlContent,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Erreur lors de l\'envoi.' }), { status: 500 });
  }
} 