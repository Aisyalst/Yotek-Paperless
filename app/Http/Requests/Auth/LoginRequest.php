<?php

namespace App\Http\Requests\Auth;

use Illuminate\Auth\Events\Lockout;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use App\Models\User;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // Menerima Email ATAU NIK dalam satu field.
            'email' => ['required', 'string'],
            'password' => ['required', 'string'],
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'email.required' => 'Email atau NIK wajib diisi.',
            'email.string' => 'Email atau NIK harus berupa teks.',
            'password.required' => 'Kata sandi wajib diisi.',
            'password.string' => 'Kata sandi harus berupa teks.',
        ];
    }

    /**
     * Attempt to authenticate the request's credentials.
     *
     * Field "email" menerima Email ATAU NIK:
     * - mengandung "@"  -> dianggap email
     * - selain itu      -> dicari sebagai NIK di tabel users
     *
     * @throws ValidationException
     */
    public function authenticate(): void
    {
        $this->ensureIsNotRateLimited();

        $login = trim((string) $this->input('email'));
        $credentials = $this->credentials($login);

        if (! $credentials || ! Auth::attempt($credentials, $this->boolean('remember'))) {
            RateLimiter::hit($this->throttleKey());

            throw ValidationException::withMessages([
                'email' => 'Email/NIK atau kata sandi yang Anda masukkan salah.',
            ]);
        }

        RateLimiter::clear($this->throttleKey());
    }

    /**
     * Tentukan kredensial dari input login (email atau NIK).
     *
     * @return array{email: string, password: string}|null
     */
    protected function credentials(string $login): ?array
    {
        $password = (string) $this->input('password');

        // 1. Input mengandung "@" -> login pakai email.
        if (str_contains($login, '@')) {
            return ['email' => $login, 'password' => $password];
        }

        // 2. Input numerik -> login pakai NIK.
        if (ctype_digit($login)) {
            $user = User::where('nik', $login)->first();

            if ($user && $user->email) {
                return ['email' => $user->email, 'password' => $password];
            }

            return null;
        }

        // 3. Fallback: coba sebagai email apa adanya (biar tetap fleksibel).
        return ['email' => $login, 'password' => $password];
    }

    /**
     * Ensure the login request is not rate limited.
     *
     * @throws ValidationException
     */
    public function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'email' => "Terlalu banyak upaya masuk. Silakan coba lagi dalam {$seconds} detik.",
        ]);
    }

    /**
     * Get the rate limiting throttle key for the request.
     */
    public function throttleKey(): string
    {
        return Str::transliterate(Str::lower($this->string('email')).'|'.$this->ip());
    }
}
