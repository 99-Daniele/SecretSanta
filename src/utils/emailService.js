/**
 * Send reset request email to admin
 * Uses Resend API to send email notifications
 * 
 * @param {Object} params - Email parameters
 * @param {string} params.participantName - Name of participant requesting reset
 * @param {string} params.eventName - Name of the event
 * @param {string} params.participantEmail - Email of participant (optional)
 * @returns {Promise<Object>} Result of email send
 */
export const sendResetRequestEmail = async ({ participantName, eventName, participantEmail }) => {
  const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY;
  const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;
  
  if (!RESEND_API_KEY || !ADMIN_EMAIL) {
    console.error('Missing email configuration');
    return {
      success: false,
      error: 'Email configuration missing'
    };
  }
  
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'Secret Santa <noreply@yourdomain.com>',
        to: [ADMIN_EMAIL],
        subject: `🎅 Richiesta Ripristino Visualizzazione - ${eventName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #c41e3a;">🎅 Secret Santa - Richiesta Ripristino</h2>
            <p>Un partecipante ha richiesto il ripristino della visualizzazione del proprio abbinamento.</p>
            
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Evento:</strong> ${eventName}</p>
              <p><strong>Partecipante:</strong> ${participantName}</p>
              ${participantEmail ? `<p><strong>Email:</strong> ${participantEmail}</p>` : ''}
            </div>
            
            <p>Accedi al pannello admin per ripristinare la visualizzazione.</p>
            
            <p style="color: #666; font-size: 12px; margin-top: 30px;">
              Questa è una notifica automatica dal sistema Secret Santa.
            </p>
          </div>
        `
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to send email');
    }
    
    const data = await response.json();
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Email send error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
