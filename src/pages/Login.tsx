import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { ROUTES } from '../routes/paths';
import { Button } from '../ui/primitives/Button';
import { Input } from '../ui/primitives/Input';
import { Lock, Mail } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('admin@internal.system');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || ROUTES.dashboard;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      login({
        id: 'usr_internal_admin',
        email,
        name: 'Internal System Admin',
        role: 'admin',
      });
      setIsLoading(false);
      navigate(from, { replace: true });
    }, 400);
  };

  return (
    <div className="space-y-5">
      <div className="text-center">
        <h2 className="text-lg font-bold text-white tracking-tight">Internal Platform Access</h2>
        <p className="text-xs text-[#908fa0] mt-1">Sign in with your internal organization credentials</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Corporate Email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail className="w-4 h-4" />}
        />

        <Input
          label="Password / SSO Token"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<Lock className="w-4 h-4" />}
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-2"
          size="lg"
          isLoading={isLoading}
        >
          Authenticate & Access Dashboard
        </Button>
      </form>
    </div>
  );
};
export default Login;
