import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function SlidingAuth({ status, canResetPassword, defaultMode = 'login' }) {
    const [isRightPanelActive, setIsRightPanelActive] = useState(defaultMode === 'register');

    const loginForm = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const registerForm = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        setIsRightPanelActive(defaultMode === 'register');
    }, [defaultMode]);

    const submitLogin = (e) => {
        e.preventDefault();
        loginForm.post(route('login'), {
            onFinish: () => loginForm.reset('password'),
        });
    };

    const submitRegister = (e) => {
        e.preventDefault();
        registerForm.post(route('register'), {
            onFinish: () => registerForm.reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8f8f8] bg-dot-pattern p-4">
            <Head title={isRightPanelActive ? 'Daftar' : 'Masuk'} />
            
            <div className={`auth-container ${isRightPanelActive ? 'right-panel-active' : ''}`}>
                {/* Register Form Panel */}
                <div className={`form-container sign-up-container bg-white text-[#1a1a1a] ${isRightPanelActive ? 'block' : 'hidden'} md:block`}>
                    <form onSubmit={submitRegister} className="flex flex-col justify-center h-full px-10 py-12">
                        <h1 className="text-3xl font-bold text-[#1a1a1a] mb-6 text-center">Buat Akun</h1>
                        
                        <div>
                            <InputLabel htmlFor="reg_name" value="Nama Lengkap" className="text-gray-700" />
                            <TextInput
                                id="reg_name"
                                name="name"
                                value={registerForm.data.name}
                                className="mt-1 block w-full bg-white border-gray-300 text-[#1a1a1a] focus:border-[#eaae36] focus:ring-[#eaae36] rounded-md shadow-sm"
                                autoComplete="name"
                                isFocused={isRightPanelActive}
                                onChange={(e) => registerForm.setData('name', e.target.value)}
                                required
                            />
                            <InputError message={registerForm.errors.name} className="mt-2" />
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="reg_email" value="Email" className="text-gray-700" />
                            <TextInput
                                id="reg_email"
                                type="email"
                                name="email"
                                value={registerForm.data.email}
                                className="mt-1 block w-full bg-white border-gray-300 text-[#1a1a1a] focus:border-[#eaae36] focus:ring-[#eaae36] rounded-md shadow-sm"
                                autoComplete="username"
                                onChange={(e) => registerForm.setData('email', e.target.value)}
                                required
                            />
                            <InputError message={registerForm.errors.email} className="mt-2" />
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="reg_phone" value="Nomor Telepon" className="text-gray-700" />
                            <TextInput
                                id="reg_phone"
                                type="text"
                                name="phone"
                                value={registerForm.data.phone}
                                className="mt-1 block w-full bg-white border-gray-300 text-[#1a1a1a] focus:border-[#eaae36] focus:ring-[#eaae36] rounded-md shadow-sm"
                                autoComplete="tel"
                                onChange={(e) => registerForm.setData('phone', e.target.value)}
                                required
                            />
                            <InputError message={registerForm.errors.phone} className="mt-2" />
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="reg_password" value="Kata Sandi" className="text-gray-700" />
                            <TextInput
                                id="reg_password"
                                type="password"
                                name="password"
                                value={registerForm.data.password}
                                className="mt-1 block w-full bg-white border-gray-300 text-[#1a1a1a] focus:border-[#eaae36] focus:ring-[#eaae36] rounded-md shadow-sm"
                                autoComplete="new-password"
                                onChange={(e) => registerForm.setData('password', e.target.value)}
                                required
                            />
                            <InputError message={registerForm.errors.password} className="mt-2" />
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="reg_password_confirmation" value="Konfirmasi Kata Sandi" className="text-gray-700" />
                            <TextInput
                                id="reg_password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={registerForm.data.password_confirmation}
                                className="mt-1 block w-full bg-white border-gray-300 text-[#1a1a1a] focus:border-[#eaae36] focus:ring-[#eaae36] rounded-md shadow-sm"
                                autoComplete="new-password"
                                onChange={(e) => registerForm.setData('password_confirmation', e.target.value)}
                                required
                            />
                            <InputError message={registerForm.errors.password_confirmation} className="mt-2" />
                        </div>

                        <div className="mt-6">
                            <PrimaryButton className="w-full justify-center bg-[#1a1a1a] hover:bg-[#eaae36] py-3" disabled={registerForm.processing}>
                                Daftar
                            </PrimaryButton>
                        </div>
                        
                        <div className="mt-6 text-center md:hidden">
                            <Link href={route('login')} className="text-sm text-gray-600 underline hover:text-gray-200">
                                Sudah punya akun? Masuk
                            </Link>
                        </div>
                    </form>
                </div>

                {/* Login Form Panel */}
                <div className={`form-container sign-in-container bg-white text-[#1a1a1a] ${!isRightPanelActive ? 'block' : 'hidden'} md:block`}>
                    <form onSubmit={submitLogin} className="flex flex-col justify-center h-full px-10 py-12">
                        <h1 className="text-3xl font-bold text-[#1a1a1a] mb-6 text-center">Masuk</h1>
                        
                        {status && <div className="mb-4 text-sm font-medium text-green-500 text-center">{status}</div>}

                        <div>
                            <InputLabel htmlFor="login_email" value="Email" className="text-gray-700" />
                            <TextInput
                                id="login_email"
                                type="email"
                                name="email"
                                value={loginForm.data.email}
                                className="mt-1 block w-full bg-white border-gray-300 text-[#1a1a1a] focus:border-[#eaae36] focus:ring-[#eaae36] rounded-md shadow-sm"
                                autoComplete="username"
                                isFocused={!isRightPanelActive}
                                onChange={(e) => loginForm.setData('email', e.target.value)}
                            />
                            <InputError message={loginForm.errors.email} className="mt-2" />
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="login_password" value="Kata Sandi" className="text-gray-700" />
                            <TextInput
                                id="login_password"
                                type="password"
                                name="password"
                                value={loginForm.data.password}
                                className="mt-1 block w-full bg-white border-gray-300 text-[#1a1a1a] focus:border-[#eaae36] focus:ring-[#eaae36] rounded-md shadow-sm"
                                autoComplete="current-password"
                                onChange={(e) => loginForm.setData('password', e.target.value)}
                            />
                            <InputError message={loginForm.errors.password} className="mt-2" />
                        </div>

                        <div className="mt-4 block">
                            <label className="flex items-center">
                                <Checkbox
                                    name="remember"
                                    checked={loginForm.data.remember}
                                    onChange={(e) => loginForm.setData('remember', e.target.checked)}
                                />
                                <span className="ms-2 text-sm text-gray-600">Ingat saya</span>
                            </label>
                        </div>

                        <div className="mt-6 flex flex-col items-center">
                            <PrimaryButton className="w-full justify-center bg-[#1a1a1a] hover:bg-yellow-500 py-3 mb-4" disabled={loginForm.processing}>
                                Masuk
                            </PrimaryButton>
                            
                            {/* {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-sm text-gray-600 underline hover:text-gray-200"
                                >
                                    Forgot your password?
                                </Link>
                            )} */}
                        </div>

                        <div className="mt-2 text-center md:hidden">
                            <Link href={route('register')} className="text-sm text-gray-600 underline hover:text-gray-200">
                                Belum punya akun? Daftar
                            </Link>
                        </div>
                    </form>
                </div>

                {/* Overlay Panel */}
                <div className="overlay-container hidden md:block">
                    <div className="overlay">
                        <div className="overlay-panel overlay-left bg-[#1a1a1a]">
                            <ApplicationLogo 
                                className="w-200 h-200 object-contain mx-auto fill-current text-white mb-6" 
                                style={{ maxWidth: '150px', maxHeight: '150px' }}
                            />
                            <h1 className="text-3xl font-bold mb-4">Hello Guys!</h1>
                            <p className="text-gray-100 mb-8 text-sm px-4">
                                Masukkan data diri Anda dan mulai perjalanan kedunia yang baru!!
                            </p>
                            <button
                                className="border-2 border-white rounded-full px-12 py-3 text-white font-bold uppercase tracking-widest hover:bg-white hover:text-gray-600 transition-colors duration-300"
                                onClick={() => setIsRightPanelActive(false)}
                            >
                                Masuk
                            </button>
                        </div>
                        <div className="overlay-panel overlay-right bg-[#1a1a1a]">
                            <ApplicationLogo 
                                className="w-200 h-200 object-contain mx-auto fill-current text-white mb-6" 
                                style={{ maxWidth: '200px', maxHeight: '200px' }}
                            />
                            <h1 className="text-3xl font-bold mb-4">Selamat Datang Kembali!</h1>
                            <p className="text-gray-100 mb-8 text-sm px-4">
                                Untuk tetap terhubung dengan kami, silakan masuk dengan informasi pribadi Anda
                            </p>
                            <button
                                className="border-2 border-white rounded-full px-12 py-3 text-white font-bold uppercase tracking-widest hover:bg-white hover:text-gray-600 transition-colors duration-300"
                                onClick={() => setIsRightPanelActive(true)}
                            >
                                Daftar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
