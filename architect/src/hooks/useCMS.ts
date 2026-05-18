import { useState, useEffect } from 'react';

export function useCMS(pageName: string) {
  const [content, setContent] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(`/api/cms?page=${pageName}`);
        const json = await res.json();
        if (json.success) {
          setContent(json.formatted);
        }
      } catch (error) {
        console.error('Error fetching CMS:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();

    // Establish Server-Sent Events real-time listener
    const eventSource = new EventSource(`/api/cms/events?page=${pageName}`);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'update') {
          console.log(`[Realtime CMS] Update event received for page: ${data.page}`);
          fetchContent();
        }
      } catch (err) {
        console.error('Failed to parse SSE data', err);
      }
    };

    eventSource.onerror = () => {
      console.log('[Realtime CMS] Connection closed/lost. Automatic reconnection active.');
    };

    return () => {
      eventSource.close();
    };
  }, [pageName]);

  return { content, isLoading };
}
