import puppeteer from 'puppeteer';
import type { ChatMessage } from '../../../shared/constants';
import { error, json } from '@sveltejs/kit';

// Store previously processed message IDs
const previousMessages = new Set<string>();

// Define the error response type
interface ErrorResponse {
    error: string;
}

/** 
 * GET Request Handler for /live-chat 
 * @type {import('./$types').RequestHandler}
 */
export async function GET({ url }): Promise<Response> {
    const videoId = url.searchParams.get('videoId');

    // Validate the videoId query parameter
    if (!videoId) {
        const errorResponse: ErrorResponse = { error: 'videoId is required' };
        return new Response(JSON.stringify(errorResponse), { status: 400 });
    }

    const liveChatUrl = `https://www.youtube.com/live_chat?v=${videoId}&is_popout=1`;

    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-blink-features=AutomationControlled'
            ]
        });

        const page = await browser.newPage();

        // Stealth Measures
        await page.evaluateOnNewDocument(() => {
            Object.defineProperty(navigator, 'webdriver', { get: () => false });
        });

        await page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
        );
        await page.setViewport({ width: 1280, height: 800 });

        // Navigate to live chat
        await page.goto(liveChatUrl, { waitUntil: 'networkidle2' });
        await page.waitForSelector('#contents yt-live-chat-text-message-renderer', { timeout: 60000 });

        // Fetch messages once
        const messages = await page.evaluate((): ChatMessage[] => {
            const chatElements = Array.from(
                document.querySelectorAll('#contents yt-live-chat-text-message-renderer')
            );
            return chatElements.map((el) => ({
                author: el.querySelector('#author-name')?.textContent?.trim() || 'Unknown',
                message: el.querySelector('#message')?.innerHTML || '', // Include emojis as HTML
                messageId: el.getAttribute('id') || '' // Extract the message ID
            }));
        });

        // Deduplicate messages by messageId
        const filteredMessages = messages.filter(
            (msg) => msg.messageId && !previousMessages.has(msg.messageId)
        );

        // Add new message IDs to the set
        filteredMessages.forEach((msg) => previousMessages.add(msg.messageId));

        await browser.close();

        // Return the filtered messages
        return json(filteredMessages);
    } catch (err: unknown) {
        console.error(err);
        const errorMessage = (err instanceof Error) ? err.message : 'Unknown error occurred';
        // const errorResponse: ErrorResponse = { error: errorMessage };
        error(500, { message: errorMessage})
        // return new Response(JSON.stringify(errorResponse), { status: 500 });
    }
}

// export const prerender = true