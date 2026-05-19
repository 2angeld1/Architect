import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '2525'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendQuoteEmail = async (to: string, reservationDetails: any) => {
  const mailOptions = {
    from: `"Architect Admin" <${process.env.SMTP_FROM}>`,
    to,
    subject: `Confirmación de Reserva/Cotización: ${reservationDetails.reservationNumber}`,
    html: `
      <div style="font-family: sans-serif; max-w-[600px] margin: 0 auto;">
        <h2>¡Hola ${reservationDetails.buyerName}!</h2>
        <p>Hemos recibido tu solicitud para el proyecto <strong>${reservationDetails.projectName}</strong>.</p>
        <p>El ID de tu transacción es: <strong>${reservationDetails.reservationNumber}</strong></p>
        <p>Pronto nos pondremos en contacto contigo para los siguientes pasos.</p>
        <br/>
        <p>Atentamente,</p>
        <p>El equipo de Architect</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error('Error sending email: ', error);
    throw error;
  }
};

export const sendResetPasswordEmail = async (to: string, resetLink: string) => {
  const mailOptions = {
    from: `"Architect Admin" <${process.env.SMTP_FROM}>`,
    to,
    subject: 'Restablecer contraseña - Architect Admin',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e4e4e7; border-radius: 12px; background-color: #ffffff;">
        <h2 style="color: #09090b; font-weight: 300;">Restablecer tu Contraseña</h2>
        <p style="color: #71717a; font-size: 14px; line-height: 1.5;">Hemos recibido una solicitud para restablecer la contraseña de tu cuenta de administrador en Architect.</p>
        <p style="color: #71717a; font-size: 14px; line-height: 1.5;">Haz clic en el siguiente botón para restablecer tu contraseña. Este enlace es válido por 1 hora:</p>
        <div style="margin: 24px 0; text-align: center;">
          <a href="${resetLink}" style="background-color: #09090b; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 500; display: inline-block;">Restablecer Contraseña</a>
        </div>
        <p style="color: #71717a; font-size: 12px;">O copia y pega el siguiente enlace en tu navegador:</p>
        <p style="color: #3b82f6; font-size: 12px; word-break: break-all;">${resetLink}</p>
        <p style="color: #a1a1aa; font-size: 12px; line-height: 1.5; margin-top: 32px; border-top: 1px solid #e4e4e7; padding-top: 16px;">Si no solicitaste este cambio, puedes ignorar este correo de forma segura. Tu contraseña seguirá siendo la misma.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error('Error sending reset email: ', error);
    throw error;
  }
};

export const sendTestimonialEmail = async (to: string, testimonial: { name: string; role?: string; rating: number; comment: string }) => {
  const mailOptions = {
    from: `"Architect Admin" <${process.env.SMTP_FROM}>`,
    to,
    subject: `✨ Nuevo Testimonio Recibido: ${testimonial.name} (${testimonial.rating} ⭐)`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e4e4e7; border-radius: 12px; background-color: #ffffff;">
        <h2 style="color: #09090b; font-weight: 300; border-bottom: 1px solid #e4e4e7; padding-bottom: 12px; margin-bottom: 16px;">¡Nuevo Testimonio Recibido!</h2>
        <p style="color: #71717a; font-size: 14px; line-height: 1.5;">Un cliente ha enviado su opinión sobre vuestros servicios desde el portal web público.</p>
        
        <div style="background-color: #f4f4f5; padding: 16px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #09090b;"><strong>Cliente:</strong> ${testimonial.name}</p>
          ${testimonial.role ? `<p style="margin: 0 0 8px 0; font-size: 14px; color: #71717a;"><strong>Empresa / Puesto:</strong> ${testimonial.role}</p>` : ''}
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #eab308;"><strong>Calificación:</strong> ${'★'.repeat(testimonial.rating)}${'☆'.repeat(5 - testimonial.rating)} (${testimonial.rating}/5 estrellas)</p>
          <p style="margin: 12px 0 0 0; font-size: 14px; color: #27272a; line-height: 1.6; font-style: italic;">"${testimonial.comment}"</p>
        </div>
        
        <p style="color: #71717a; font-size: 14px; line-height: 1.5;">Puedes revisar, aprobar o desestimar este comentario en la sección de **Testimonios** del Panel de Administración.</p>
        <div style="margin: 24px 0; text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/testimonials" style="background-color: #09090b; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 500; display: inline-block;">Ver en el Panel Administrativo</a>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error('Error sending testimonial notification email: ', error);
    throw error;
  }
};
