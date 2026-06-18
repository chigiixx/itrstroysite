import nodemailer from 'nodemailer';
import dns from 'dns';
import dotenv from 'dotenv';

dotenv.config();

// Принудительно используем IPv4 для всех сетевых подключений
dns.setDefaultResultOrder('ipv4first');

export async function sendContactEmail(name: string, email: string, message: string) {
  const to = 'itrstroy.help@yandex.ru';
  const subject = `Новое сообщение с сайта от ${name}`;
  const text = `Имя: ${name}\nEmail: ${email}\nСообщение:\n${message}`;
  const html = `<p><strong>Имя:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Сообщение:</strong><br>${message.replace(/\n/g, '<br>')}</p>`;

  const transporter = nodemailer.createTransport({
  host: 'smtp.beget.com',
  port: 2525,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

  await transporter.sendMail({
    from: `"ИТР-СТРОЙ" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  });

  console.log(`✅ Письмо успешно отправлено на ${to}`);
}