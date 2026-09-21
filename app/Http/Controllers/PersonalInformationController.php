<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;

class PersonalInformationController extends Controller
{
    public function edit(Request $request)
    {
        $user = $request->user()->load(['personalInformation', 'employeeInformation']);

        $personalInformation = $user->personalInformation;
        $employeeInformation = $user->employeeInformation;

        return Inertia::render('Profile/Personal/Edit', [
            'personalInformation' => $personalInformation,
            'employeeInformation' => $employeeInformation,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'nik' => 'required|string|max:255',
            'full_name' => 'required|string|max:255',
            'nickname' => 'nullable|string|max:255',
            'nik_ktp' => 'required|string|max:255',
            'birth_place' => 'required|string|max:255',
            'birth_date' => 'required|date',
            'gender' => 'required|string|max:255',
            'marital_status' => 'required|string|max:255',
            'ktp_address' => 'required|string',
            'residential_address' => 'required|string',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:255',
            'emergency_contact' => 'required|string|max:255',
        ], [
            'nik.required' => 'NIK wajib diisi.',
            'full_name.required' => 'Nama lengkap wajib diisi.',
            'full_name.string' => 'Nama lengkap harus berupa teks.',
            'full_name.max' => 'Nama lengkap maksimal 255 karakter.',
            'nik_ktp.required' => 'NIK KTP wajib diisi.',
            'birth_place.required' => 'Tempat lahir wajib diisi.',
            'birth_date.required' => 'Tanggal lahir wajib diisi.',
            'gender.required' => 'Jenis kelamin wajib diisi.',
            'marital_status.required' => 'Status pernikahan wajib diisi.',
            'ktp_address.required' => 'Alamat KTP wajib diisi.',
            'residential_address.required' => 'Alamat domisili wajib diisi.',
            'email.required' => 'Email pribadi wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'phone.required' => 'No. Telepon / HP wajib diisi.',
            'emergency_contact.required' => 'Kontak darurat wajib diisi.',
        ]);

        $user = $request->user();

        if ($user->personalInformation) {
            $user->personalInformation->update($validated);
        } else {
            $user->personalInformation()->create($validated);
        }

        return Redirect::route('profile.personal.edit')->with('success', 'Data personal berhasil diperbarui.');
    }
}
