import { useState, useEffect } from 'react';
import { searchPhotos } from '../services/unsplash';
import { aboutTeam } from '../data/about';

export const useAboutPage = () => {
  const [heroImage, setHeroImage] = useState('');
  const [teamImages, setTeamImages] = useState<Record<string, string>>({});
  const [officeImage, setOfficeImage] = useState('');

  useEffect(() => {
    const fetchImages = async () => {
      // Hero image
      const heroPhotos = await searchPhotos('architecture office team modern', 1);
      if (heroPhotos.length > 0) {
        setHeroImage(`${heroPhotos[0].urls.raw}&w=1920&q=85&fit=crop`);
      }

      // Office image
      const officePhotos = await searchPhotos('modern architecture office interior', 1);
      if (officePhotos.length > 0) {
        setOfficeImage(`${officePhotos[0].urls.raw}&w=800&q=85&fit=crop`);
      }

      // Team images
      for (const member of aboutTeam) {
        const photos = await searchPhotos(member.query, 1);
        if (photos.length > 0) {
          setTeamImages(prev => ({
            ...prev,
            [member.name]: `${photos[0].urls.raw}&w=400&q=85&fit=crop&crop=faces`,
          }));
        }
      }
    };
    fetchImages();
  }, []);

  return {
    heroImage,
    teamImages,
    officeImage
  };
};
