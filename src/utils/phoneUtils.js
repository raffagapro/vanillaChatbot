const normalizePhoneNumber = (from) => {
  if (from.startsWith('521') && from.length === 13) {
    return '52' + from.slice(3); // Remove the '1' after '52'
  }
  return from;
}

module.exports = {
  normalizePhoneNumber
};