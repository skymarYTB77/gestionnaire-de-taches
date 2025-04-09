'use client';

import { useState } from 'react';
import { auth } from '../../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.push('/');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-neutral-800 rounded-lg px-8 py-6 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            {isSignUp ? 'Créer un compte' : 'Connexion'}
          </h2>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-200 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-200 mb-1">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-200"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-amber-200 text-neutral-900 py-2 px-4 rounded-md font-medium hover:bg-amber-300 transition-colors"
            >
              {isSignUp ? 'Créer un compte' : 'Se connecter'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-amber-200 hover:text-amber-300 text-sm"
            >
              {isSignUp ? 'Déjà un compte ? Se connecter' : 'Créer un compte'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}