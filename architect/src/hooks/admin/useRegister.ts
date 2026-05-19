import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

export const useRegister = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { mutate: register, isPending: loading } = useMutation({
    mutationFn: async () => {
      setError('');
      setSuccess('');

      if (password !== confirmPassword) {
        throw new Error('Las contraseñas no coinciden');
      }

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al registrar administrador.');
      }
      return data;
    },
    onSuccess: () => {
      setSuccess('¡Registro exitoso! Redirigiendo al inicio de sesión...');
      setTimeout(() => {
        window.location.href = '/admin/login';
      }, 1500);
    },
    onError: (err: any) => {
      setError(err.message || 'Error de registro');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register();
  };

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    error,
    success,
    handleSubmit,
  };
};
