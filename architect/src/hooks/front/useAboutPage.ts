import { useQuery } from '@tanstack/react-query';
import { searchPhotos } from '../../services/unsplash';
import { aboutTeam } from '../../data/about';

export const useAboutPage = () => {
  const { data = { heroImage: '', officeImage: '', teamImages: {} as Record<string, string> }, isLoading } = useQuery({
    queryKey: ['about-page-images'],
    queryFn: async () => {
      const [heroPhotos, officePhotos] = await Promise.all([
        searchPhotos('architecture office team modern', 1),
        searchPhotos('modern architecture office interior', 1),
      ]);

      const heroImage = heroPhotos.length > 0 
        ? `${heroPhotos[0].urls.raw}&w=1920&q=85&fit=crop` 
        : 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80';

      const officeImage = officePhotos.length > 0 
        ? `${officePhotos[0].urls.raw}&w=800&q=85&fit=crop` 
        : 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80';

      const teamImages: Record<string, string> = {};
      await Promise.all(
        aboutTeam.map(async (member) => {
          const photos = await searchPhotos(member.query, 1);
          if (photos.length > 0) {
            teamImages[member.name] = `${photos[0].urls.raw}&w=400&q=85&fit=crop&crop=faces`;
          }
        })
      );

      return { heroImage, officeImage, teamImages };
    },
  });

  return {
    heroImage: data.heroImage,
    teamImages: data.teamImages,
    officeImage: data.officeImage,
    isLoading
  };
};
