'use client';

import { useState } from 'react';
import { authService } from '@/lib/auth';

export default function SignupForm({ onSuccess }: { onSuccess: () => void }) {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Password validation
    const hasUppercase = /[A-Z]/.test(formData.password);
    const hasLowercase = /[a-z]/.test(formData.password);
    const hasNumber = /[0-9]/.test(formData.password);
    const hasSpecial = /[@$!%*?&]/.test(formData.password);
    const isValidPassword = hasUppercase && hasLowercase && hasNumber && hasSpecial;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!isValidPassword) {
            setError('Password must meet all requirements');
            return;
        }

        setLoading(true);

        try {
            await authService.signup(formData);
            onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-bold">Sign Up</h2>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
                    {error}
                </div>
            )}

            <div>
                <label className="block mb-1">First Name</label>
                <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full border border-gray-300 px-3 py-2 rounded"
                    required
                />
            </div>

            <div>
                <label className="block mb-1">Last Name</label>
                <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full border border-gray-300 px-3 py-2 rounded"
                    required
                />
            </div>

            <div>
                <label className="block mb-1">Email</label>
                <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full border border-gray-300 px-3 py-2 rounded"
                    required
                />
            </div>

            <div>
                <label className="block mb-1">Password</label>
                <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full border border-gray-300 px-3 py-2 rounded"
                    required
                />

                {formData.password && (
                    <div className="mt-2 text-xs space-y-1">
                        <p className={hasUppercase ? 'text-green-600' : 'text-red-600'}>
                            {hasUppercase ? '✓' : '✗'} At least one uppercase letter
                        </p>
                        <p className={hasLowercase ? 'text-green-600' : 'text-red-600'}>
                            {hasLowercase ? '✓' : '✗'} At least one lowercase letter
                        </p>
                        <p className={hasNumber ? 'text-green-600' : 'text-red-600'}>
                            {hasNumber ? '✓' : '✗'} At least one number
                        </p>
                        <p className={hasSpecial ? 'text-green-600' : 'text-red-600'}>
                            {hasSpecial ? '✓' : '✗'} At least one special character (@$!%*?&)
                        </p>
                    </div>
                )}
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
                {loading ? 'Loading...' : 'Sign Up'}
            </button>
        </form>
    );
}
