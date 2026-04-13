export function generateTempPassword(length = 8) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

export function formatDate(date) {
  return new Date(date).toISOString().split('T')[0];
}

export function formatTime(time) {
  return time.toString().split('T')[1].slice(0, 5);
}

export function paginate(limit = 20, offset = 0) {
  return {
    limit: Math.min(limit, 100),
    offset
  };
}

export function parseUUID(id) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id) ? id : null;
}

export function calculateDaysSince(date) {
  if (!date) return null;
  const now = new Date();
  const diff = now - new Date(date);
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function isValidPhone(phone) {
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  return phoneRegex.test(phone);
}

export function cleanPhone(phone) {
  return phone.replace(/[^\+0-9]/g, '');
}

export function generateQRData(namespace, id) {
  return `${namespace}:${id}`;
}

export function extractVariables(content) {
  const regex = /\[([^\]]+)\]/g;
  const variables = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    variables.push(match[0]);
  }
  return [...new Set(variables)];
}

export function replaceVariables(content, replacements) {
  let result = content;
  for (const [key, value] of Object.entries(replacements)) {
    result = result.replace(new RegExp(`\\[${key}\\]`, 'g'), value);
  }
  return result;
}
