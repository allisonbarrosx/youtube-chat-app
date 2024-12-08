import { env } from '$env/dynamic/private';
import { json } from '@sveltejs/kit';

// Replace with your YouTube API key
const API_KEY = env.API_KEY;

export async function GET() {
  // Use the private environment variable securely
  const apiKey = API_KEY;

  // Return data to the client
  return json({apiKey});
}