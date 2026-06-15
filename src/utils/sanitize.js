import DOMPurify from 'dompurify';

export const sanitizeInput = (input) => {
  return DOMPurify.sanitize(input.trim(), {
    ALLOWED_TAGS: [], 
    ALLOWED_ATTR: []  
  });
};