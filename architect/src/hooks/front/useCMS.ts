import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

export function useCMS(pageName: string) {
  const queryClient = useQueryClient();

  const { data = {}, isLoading } = useQuery<Record<string, string>>({
    queryKey: ['cms', pageName],
    queryFn: async () => {
      const res = await fetch(`/api/cms?page=${pageName}`);
      const json = await res.json();
      if (!json.success) throw new Error('CMS load failed');
      return json.formatted || {};
    },
  });

  useEffect(() => {
    // Establish Server-Sent Events real-time listener
    const eventSource = new EventSource(`/api/cms/events?page=${pageName}`);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'update') {
          console.log(`[Realtime CMS] Update event received for page: ${data.page}`);
          queryClient.invalidateQueries({ queryKey: ['cms', pageName] });
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
  }, [pageName, queryClient]);

  return { content: data, isLoading };
}
