import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

export const useForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { mutate: requestReset, isPending: loading } = useMutation({
    mutationFn: async () => {
      setError('');
      setSuccess('');

      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Algo salió mal al enviar el correo.');
      }
      return data;
    },
    onSuccess: () => {
      setSuccess('¡Correo enviado! Revisa tu bandeja de entrada para continuar.');
      setEmail('');
    },
    onError: (err: any) => {
      setError(err.message || 'Error al solicitar recuperación');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    requestReset();
  };

  return {
    email,
    setEmail,
    loading,
    error,
    success,
    handleSubmit,
  };
};
