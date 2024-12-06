import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { Button } from '../components/ui/button';
import { Mail, Lock, Phone, Github } from 'lucide-react';

export function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup, loginWithGoogle, loginWithGithub, loginWithPhone } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return toast.error('As senhas não coincidem');
    }

    try {
      setLoading(true);
      await signup(email, password);
      toast.success('Conta criada com sucesso!');
      navigate('/select-type');
    } catch (error) {
      toast.error('Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignup = async (provider: 'google' | 'github' | 'phone') => {
    try {
      setLoading(true);
      let result;

      switch (provider) {
        case 'google':
          result = await loginWithGoogle();
          break;
        case 'github':
          result = await loginWithGithub();
          break;
        case 'phone':
          result = await loginWithPhone();
          break;
      }

      if (result?.user) {
        navigate('/select-type');
        toast.success('Conta criada com sucesso!');
      }
    } catch (error) {
      toast.error('Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-sm">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Crie sua conta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ou{' '}
            <Link to="/login" className="font-medium text-primary hover:text-primary/90">
              entre em sua conta existente
            </Link>
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Button
            variant="social"
            className="w-full"
            onClick={() => handleSocialSignup('google')}
            disabled={loading}
          >
            <img src="/assets/google.svg" alt="Google" className="w-5 h-5 mr-2" />
            Google
          </Button>
          
          <Button
            variant="social"
            className="w-full"
            onClick={() => handleSocialSignup('github')}
            disabled={loading}
          >
            <Github className="w-5 h-5 mr-2" />
            GitHub
          </Button>
          
          <Button
            variant="social"
            className="w-full"
            onClick={() => handleSocialSignup('phone')}
            disabled={loading}
          >
            <Phone className="w-5 h-5 mr-2" />
            Telefone
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Ou continue com</span>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-t-md relative block w-full px-12 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Email"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-12 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Senha"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="appearance-none rounded-b-md relative block w-full px-12 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Confirme a senha"
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Criando conta...' : 'Criar conta'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}