'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Image from 'next/image';

export default function Dashboard() {
    const router = useRouter();
    // const { user, isAuthenticated, isLoading, logout, fetchUser } = useAuthStore();
    const { user, isAuthenticated, isLoading, logout, } = useAuthStore();

    useEffect(() => {
        // Fetch user data if authenticated but no user data
        // if (isAuthenticated && !user) {
        //     fetchUser();
        // }

        // Redirect to login if not authenticated and not loading
        if (!isAuthenticated && !isLoading) {
            router.push('/login');
        }
    }, [isAuthenticated, isLoading, user, router]);

    if (isLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <button
                        onClick={logout}
                        className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                    >
                        Sign out
                    </button>
                </div>
            </header>

            <main>
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">
                        <div className="border-4 border-dashed border-gray-200 rounded-lg p-6 bg-white">
                            <div className="flex items-center space-x-4">
                                {user.picture && (
                                    <div className="flex-shrink-0">
                                        <Image
                                            src={user.picture}
                                            alt={user.name || 'User'}
                                            width={64}
                                            height={64}
                                            className="rounded-full"
                                        />
                                    </div>
                                )}

                                <div>
                                    <h2 className="text-lg font-medium text-gray-900">Welcome, {user.name || user.email}!</h2>
                                    <p className="mt-1 text-sm text-gray-500">Email: {user.email}</p>
                                    <p className="mt-1 text-sm text-gray-500">User ID: {user.id}</p>
                                </div>
                            </div>

                            <div className="mt-6">
                                <h3 className="text-lg font-medium text-gray-900">User Details</h3>
                                <pre className="mt-2 p-4 bg-gray-50 rounded-md overflow-auto">
                                    {JSON.stringify(user, null, 2)}
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}