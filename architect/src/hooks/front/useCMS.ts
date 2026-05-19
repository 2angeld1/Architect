import { useQuery } from '@tanstack/react-query';

export function useCMS(pageName: string) {
  const { data = {}, isLoading } = useQuery<Record<string, string>>({
    queryKey: ['cms', pageName],
    queryFn: async () => {
      const res = await fetch(`/api/cms?page=${pageName}`);
      const json = await res.json();
      if (!json.success) throw new Error('CMS load failed');
      return json.formatted || {};
    },
  });

  return { content: data, isLoading };
}
