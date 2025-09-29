const generateTicketId = (userId, eventId) => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `TKT-${userId}-${eventId}-${timestamp}-${random}`.toUpperCase();
};

module.exports = generateTicketId;