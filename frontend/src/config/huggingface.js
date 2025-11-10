// Hugging Face Configuration
// To use the FREE Virtual Try-On feature:
// 1. Go to https://huggingface.co/
// 2. Create a free account
// 3. Go to Settings > Access Tokens
// 4. Create a new token (read access is sufficient)
// 5. Replace 'your_free_token_here' with your actual token

export const HUGGING_FACE_CONFIG = {
  // Get token from environment variable
  API_TOKEN: process.env.REACT_APP_HUGGING_FACE_TOKEN,
  
  // Virtual Try-On model (free to use)
  MODEL_ID: 'stabilityai/stable-diffusion-2-1',
  
  // API endpoint
  API_URL: 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1',
  
  // Request timeout (in milliseconds)
  TIMEOUT: 30000,
  
  // Retry attempts if API is busy
  MAX_RETRIES: 3
}

// Instructions for users:
// The Hugging Face Inference API is completely FREE but has some limitations:
// - Rate limits: ~1000 requests per hour
// - Queue time: 10-30 seconds when busy
// - Model loading: First request may take longer
// 
// For unlimited usage, you can run the model locally or use paid services. 