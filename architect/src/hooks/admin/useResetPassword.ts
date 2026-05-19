import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

export const useResetPassword = (token: string) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { mutate: reset, isPending: loading } = useMutation({
    mutationFn: async () => {
      setError('');
      setSuccess('');

      if (!token) {
        throw new Error('El token de restablecimiento falta o no es válido.');
      }

      if (password !== confirmPassword) {
        throw new Error('Las contraseñas no coinciden');
      }

      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Hubo un error al restablecer la contraseña.');
      }
      return data;
    },
    onSuccess: () => {
      setSuccess('¡Contraseña restablecida con éxito!');
    },
    onError: (err: any) => {
      setError(err.message || 'Error de procesamiento');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reset();
  };

  return {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    loading,
    error,
    success,
    handleSubmit,
  };
};
