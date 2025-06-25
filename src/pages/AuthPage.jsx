import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth as firebaseAuth } from '../lib/firebase';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleEmailPasswordAuth = async (e) => {
        e.preventDefault();
        setError(''); setMessage('');
        try {
            if (isLogin) {
                await signInWithEmailAndPassword(firebaseAuth, email, password);
            } else {
                await createUserWithEmailAndPassword(firebaseAuth, email, password);
            }
            navigate('/dashboard');
        } catch (err) { setError(err.message.replace('Firebase: ', '')); }
    };

    const handleGoogleSignIn = async () => {
        setError(''); setMessage('');
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(firebaseAuth, provider);
            navigate('/dashboard');
        } catch (err) { setError(err.message.replace('Firebase: ', '')); }
    };

    

    return (
        <div className="flex items-center justify-center min-h-screen pt-20">
            <motion.div initial={{ y:20, opacity: 0 }} animate={{ y:0, opacity: 1}} className="w-full max-w-md p-8 space-y-4 bg-white dark:bg-[#2a2a2a] rounded-2xl shadow-2xl">
                <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-[#e0e0e0]">{isLogin ? 'Welcome Back' : 'Create Your Account'}</h1>
                <button onClick={handleGoogleSignIn} className="w-full py-3 font-semibold text-gray-700 dark:text-white bg-gray-100 dark:bg-[#1a1a1a] rounded-lg hover:bg-gray-200 dark:hover:bg-black/20 transition-colors flex items-center justify-center space-x-2"><svg className="w-5 h-5" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path><path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path><path fill="#4CAF50" d="M24 44c5.166 0 9.599-1.521 12.455-4.087l-5.657-5.657c-1.835 1.564-4.209 2.541-6.798 2.541-5.223 0-9.655-3.449-11.303-8l-6.571 4.819C9.656 40.945 16.318 44 24 44z"></path><path fill="#1976D2" d="M43.611 20.083H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l5.657 5.657C40.455 34.191 44 28.291 44 24c0-1.341-.138-2.65-.389-3.917z"></path></svg><span>Sign in with Google</span></button>
                <div className="flex items-center"><div className="flex-grow bg-gray-300 dark:bg-gray-600 h-px"></div><span className="flex-shrink text-sm text-gray-400 dark:text-gray-500 px-4">OR</span><div className="flex-grow bg-gray-300 dark:bg-gray-600 h-px"></div></div>
                {message && <p className="text-green-500 text-sm text-center">{message}</p>}
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <form onSubmit={handleEmailPasswordAuth} className="space-y-4"><div><label className="text-sm font-bold text-gray-600 dark:text-[#a0a0a0] block">Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 mt-1 text-gray-800 dark:text-white bg-gray-100 dark:bg-[#1a1a1a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00aaff]" required /></div><div><label className="text-sm font-bold text-gray-600 dark:text-[#a0a0a0] block">Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 mt-1 text-gray-800 dark:text-white bg-gray-100 dark:bg-[#1a1a1a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00aaff]" required /></div><button type="submit" className="w-full py-3 font-bold text-white bg-[#00aaff] rounded-lg hover:bg-blue-500 transition-colors">{isLogin ? 'Sign In' : 'Create Account'}</button></form>
                <div className="text-center"><button onClick={() => setIsLogin(!isLogin)} className="text-sm text-gray-500 dark:text-[#a0a0a0] hover:underline">{isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}</button></div>
            </motion.div>
        </div>
    );
}