/**
 * Fisher-Yates shuffle algorithm
 * @param {Array} array - Array to shuffle
 * @returns {Array} Shuffled array
 */
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Validate if extraction is possible
 * @param {Array} participants - List of participants
 * @returns {Object} { valid: boolean, error: string }
 */
export const validateExtraction = (participants) => {
  if (!participants || participants.length < 3) {
    return {
      valid: false,
      error: 'Servono almeno 3 partecipanti per l\'estrazione'
    };
  }
  
  return { valid: true, error: null };
};

/**
 * Create Secret Santa assignments
 * Each participant gives a gift to another participant (circular assignment)
 * No one gives a gift to themselves
 * 
 * @param {Array} participants - Array of participant objects with { id, nome, cognome }
 * @param {Array} exclusions - Optional: array of exclusion pairs (future feature)
 * @returns {Array} Array of assignments { giver_id, receiver_id, giver_name, receiver_name }
 */
export const createAssignments = (participants, exclusions = []) => {
  const validation = validateExtraction(participants);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // Create a copy of participants for receivers
  let receivers = [...participants];
  const assignments = [];
  
  // Try to create valid assignments (max 100 attempts to avoid infinite loop)
  let attempts = 0;
  const maxAttempts = 100;
  
  while (attempts < maxAttempts) {
    assignments.length = 0; // Reset assignments
    receivers = shuffleArray([...participants]);
    
    let valid = true;
    
    // Check if anyone would gift themselves
    for (let i = 0; i < participants.length; i++) {
      const giver = participants[i];
      const receiver = receivers[i];
      
      if (giver.id === receiver.id) {
        valid = false;
        break;
      }
      
      // Check exclusions (future feature)
      const isExcluded = exclusions.some(
        exclusion => 
          (exclusion.person1 === giver.id && exclusion.person2 === receiver.id) ||
          (exclusion.person2 === giver.id && exclusion.person1 === receiver.id)
      );
      
      if (isExcluded) {
        valid = false;
        break;
      }
    }
    
    if (valid) {
      // Create assignments array
      for (let i = 0; i < participants.length; i++) {
        const giver = participants[i];
        const receiver = receivers[i];
        
        assignments.push({
          giver_id: giver.id,
          receiver_id: receiver.id,
          giver_name: `${giver.nome} ${giver.cognome}`,
          receiver_name: `${receiver.nome} ${receiver.cognome}`
        });
      }
      
      return assignments;
    }
    
    attempts++;
  }
  
  // Fallback: create simple circular assignment if random fails
  // A -> B -> C -> ... -> A
  for (let i = 0; i < participants.length; i++) {
    const giver = participants[i];
    const receiver = participants[(i + 1) % participants.length];
    
    assignments.push({
      giver_id: giver.id,
      receiver_id: receiver.id,
      giver_name: `${giver.nome} ${giver.cognome}`,
      receiver_name: `${receiver.nome} ${receiver.cognome}`
    });
  }
  
  return assignments;
};

/**
 * Check if extraction has already been done for an event
 * @param {string} eventId - Event ID
 * @param {Object} supabase - Supabase client
 * @returns {Promise<boolean>} True if extraction already done
 */
export const isExtractionDone = async (eventId, supabase) => {
  const { data, error } = await supabase
    .from('assignments')
    .select('id')
    .eq('event_id', eventId)
    .limit(1);
  
  if (error) {
    console.error('Error checking extraction:', error);
    return false;
  }
  
  return data && data.length > 0;
};
