import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth as firebaseAuth } from '../lib/firebase';
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleEmailPasswordAuth = async (e) => {
        e.preventDefault();
        setError(''); 
        setMessage('');
        setLoading(true);

        try {
            if (isLogin) {
                await signInWithEmailAndPassword(firebaseAuth, email, password);
            } else {
                await createUserWithEmailAndPassword(firebaseAuth, email, password);
            }
            navigate('/dashboard');
        } catch (err) { 
            setError(err.message.replace('Firebase: ', '')); 
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setError(''); 
        setMessage('');
        setLoading(true);
        
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(firebaseAuth, provider);
            navigate('/dashboard');
        } catch (err) { 
            setError(err.message.replace('Firebase: ', '')); 
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordReset = async () => {
        if (!email) {
            setError('Please enter your email address first');
            return;
        }
        
        setError('');
        setMessage('');
        setLoading(true);
        
        try {
            await sendPasswordResetEmail(firebaseAuth, email);
            setMessage('Password reset email sent! Check your inbox.');
        } catch (err) {
            setError(err.message.replace('Firebase: ', ''));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center pt-20">
            <motion.div 
                initial={{ y: 20, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }}
                className="w-full max-w-md p-8"
            >
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <span className="text-white font-bold text-2xl">M</span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                            {isLogin ? 'Welcome Back' : 'Create Your Account'}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            {isLogin ? 'Sign in to continue your journey' : 'Start documenting your adventures'}
                        </p>
                    </div>

                    {message && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-center space-x-3"
                        >
                            <CheckCircle className="text-green-500" size={20} />
                            <span className="text-green-700 dark:text-green-300 text-sm">{message}</span>
                        </motion.div>
                    )}

                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center space-x-3"
                        >
                            <AlertCircle className="text-red-500" size={20} />
                            <span className="text-red-700 dark:text-red-300 text-sm">{error}</span>
                        </motion.div>
                    )}

                    <button 
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        className="w-full py-3 font-semibold text-gray-700 dark:text-white bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center space-x-3 disabled:opacity-50 mb-6"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 48 48">
                            <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path>
                            <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path>
                            <path fill="#4CAF50" d="M24 44c5.166 0 9.599-1.521 12.455-4.087l-5.657-5.657c-1.835 1.564-4.209 2.541-6.798 2.541-5.223 0-9.655-3.449-11.303-8l-6.571 4.819C9.656 40.945 16.318 44 24 44z"></path>
                            <path fill="#1976D2" d="M43.611 20.083H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l5.657 5.657C40.455 34.191 44 28.291 44 24c0-1.341-.138-2.65-.389-3.917z"></path>
                        </svg>
                        <span>Continue with Google</span>
                    </button>


                    <div className="flex items-center mb-6">
                        <div className="flex-grow bg-gray-300 dark:bg-gray-600 h-px"></div>
                        <span className="flex-shrink text-sm text-gray-400 dark:text-gray-500 px-4">OR</span>
                        <div className="flex-grow bg-gray-300 dark:bg-gray-600 h-px"></div>
                    </div>

                    <form onSubmit={handleEmailPasswordAuth} className="space-y-4">
                        <div>
                            <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 block mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input 
                                    type="email" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    className="w-full pl-10 pr-4 py-3 text-gray-800 dark:text-white bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                                    placeholder="Enter your email"
                                    required 
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 block mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    className="w-full pl-10 pr-12 py-3 text-gray-800 dark:text-white bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                                    placeholder="Enter your password"
                                    required 
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {isLogin && (
                            <div className="text-right">
                                <button
                                    type="button"
                                    onClick={handlePasswordReset}
                                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                    Forgot password?
                                </button>
                            </div>
                        )}

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full py-3 font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-200"
                        >
                            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
                        </button>
                    </form>

                    <div className="text-center mt-6">
                        <button 
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError('');
                                setMessage('');
                            }} 
                            className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                            {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
                        </button>
                    </div>
                </div>

                <div className="text-center mt-6">
                    <Link 
                        to="/" 
                        className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                        ← Back to Home
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}