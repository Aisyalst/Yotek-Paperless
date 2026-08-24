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
            'nik' => 'nullable|string|max:255',
            'full_name' => 'required|string|max:255',
            'nickname' => 'nullable|string|max:255',
            'nik_ktp' => 'nullable|string|max:255',
            'birth_place' => 'nullable|string|max:255',
            'birth_date' => 'nullable|date',
            'gender' => 'nullable|string|max:255',
            'marital_status' => 'nullable|string|max:255',
            'ktp_address' => 'nullable|string',
            'residential_address' => 'nullable|string',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:255',
            'emergency_contact' => 'nullable|string|max:255',
        ], [
            'full_name.required' => 'Nama lengkap wajib diisi.',
            'full_name.string' => 'Nama lengkap harus berupa teks.',
            'full_name.max' => 'Nama lengkap maksimal 255 karakter.',
            'email.email' => 'Format email tidak valid.',
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
