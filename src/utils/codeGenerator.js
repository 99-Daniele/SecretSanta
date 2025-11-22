/**
 * Generate event code from event name
 * Example: "Secret Santa Famiglia 2025" => "FAMIGLIA2025"
 * @param {string} eventName - The event name
 * @returns {string} Event code (uppercase, no spaces)
 */
export const generateEventCode = (eventName) => {
  // Remove common words and keep meaningful parts
  const cleaned = eventName
    .toUpperCase()
    .replace(/SECRET\s*SANTA/gi, '')
    .replace(/[^A-Z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '');
  
  return cleaned || 'EVENT' + Date.now().toString().slice(-4);
};

/**
 * Generate participant access code from name and surname
 * Example: "Mario Rossi" => "MARIOROSSI"
 * @param {string} nome - First name
 * @param {string} cognome - Last name
 * @returns {string} Access code (uppercase, no spaces)
 */
export const generateParticipantCode = (nome, cognome) => {
  const code = `${nome}${cognome}`
    .toUpperCase()
    .replace(/[^A-Z]/g, '');
  
  return code || 'USER' + Date.now().toString().slice(-4);
};

/**
 * Validate event code format
 * @param {string} code - Event code to validate
 * @returns {boolean} True if valid
 */
export const isValidEventCode = (code) => {
  return /^[A-Z0-9]{3,20}$/.test(code);
};

/**
 * Validate participant code format
 * @param {string} code - Participant code to validate
 * @returns {boolean} True if valid
 */
export const isValidParticipantCode = (code) => {
  return /^[A-Z0-9]{3,30}$/.test(code);
};
