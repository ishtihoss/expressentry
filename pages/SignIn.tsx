// pages/SignIn.tsx

import GoogleAuth from '../components/GoogleAuth';

export default function SignIn() {
    return (
        <div className="flex items-center justify-center min-h-screen w-full fixed inset-0 bg-gradient-to-r from-blue-500 to-primary">
            <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md transform hover:scale-105 transition duration-300">
                <h1 className="text-3xl font-bold text-center mb-6 font-sans text-primary">
                    Welcome Back!
                </h1>
                <p className="text-center text-gray-600 mb-8 text-lg">
                    Sign in to your account to continue.
                </p>
                <div className="flex justify-center">
                    <GoogleAuth />
                </div>
            </div>
        </div>
    );
}