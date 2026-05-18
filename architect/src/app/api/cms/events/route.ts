import { cmsEvents } from '@/lib/cmsEvents';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || 'global';
  const clientId = Math.random().toString(36).substring(2, 9);

  let responseStream = new ReadableStream({
    start(controller) {
      cmsEvents.addClient(clientId, page, controller);

      // Send initial connection heartbeat
      const encoder = new TextEncoder();
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'connected', clientId })}\n\n`));

      // Keep connection alive with simple comments
      const keepAliveInterval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(': keepalive\n\n'));
        } catch (err) {
          clearInterval(keepAliveInterval);
        }
      }, 30000);

      // Clean up when connection closes
      request.signal.addEventListener('abort', () => {
        clearInterval(keepAliveInterval);
        cmsEvents.removeClient(clientId);
        try {
          controller.close();
        } catch (e) {}
      });
    },
    cancel() {
      cmsEvents.removeClient(clientId);
    }
  });

  return new Response(responseStream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
}
