import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

export const useSettingsPage = () => {
  const queryClient = useQueryClient();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Perfil Admin
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Variables Globales
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [officeAddress, setOfficeAddress] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [facebookUrl, setFacebookUrl] = useState('');

  const { isLoading: loading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      const response = await fetch('/api/admin/settings');
      const data = await response.json();
      if (!response.ok) throw new Error('Settings load failed');
      
      setAdminName(data.user.name || '');
      setAdminEmail(data.user.email || '');
      
      setContactEmail(data.settings.contact_email || '');
      setContactPhone(data.settings.contact_phone || '');
      setOfficeAddress(data.settings.contact_address || '');
      setInstagramUrl(data.settings.social_instagram || '');
      setFacebookUrl(data.settings.social_facebook || '');
      return data;
    },
  });

  const { mutate: saveSettings, isPending: saving } = useMutation({
    mutationFn: async () => {
      setError('');
      setSuccess('');

      if (newPassword && newPassword !== confirmNewPassword) {
        throw new Error('Las nuevas contraseñas no coinciden');
      }

      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: adminName,
          currentPassword,
          newPassword,
          contactEmail,
          contactPhone,
          officeAddress,
          instagramUrl,
          facebookUrl
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ocurrió un error al guardar las configuraciones.');
      }
      return data;
    },
    onSuccess: () => {
      setSuccess('¡Configuraciones guardadas y actualizadas con éxito!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
    },
    onError: (err: any) => {
      setError(err.message || 'Error al guardar');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings();
  };

  return {
    loading,
    saving,
    error,
    success,
    adminName,
    setAdminName,
    adminEmail,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmNewPassword,
    setConfirmNewPassword,
    contactEmail,
    setContactEmail,
    contactPhone,
    setContactPhone,
    officeAddress,
    setOfficeAddress,
    instagramUrl,
    setInstagramUrl,
    facebookUrl,
    setFacebookUrl,
    handleSubmit,
  };
};
