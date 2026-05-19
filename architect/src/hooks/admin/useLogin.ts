import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

export const useLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { mutate: login, isPending: loading } = useMutation({
    mutationFn: async () => {
      setError('');
      setSuccess('');

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Algo salió mal. Por favor intenta de nuevo.');
      }
      return data;
    },
    onSuccess: () => {
      setSuccess('¡Inicio de sesión exitoso! Redirigiendo...');
      setTimeout(() => {
        window.location.href = '/admin';
      }, 1000);
    },
    onError: (err: any) => {
      setError(err.message || 'Error al iniciar sesión');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login();
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    loading,
    error,
    success,
    handleSubmit,
  };
};
