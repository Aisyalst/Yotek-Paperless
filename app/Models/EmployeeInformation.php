<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmployeeInformation extends Model
{
    protected $fillable = [
        'nik', 'company', 'branch', 'department', 'employee_position_id', 'employee_rank_id', 
        'direct_supervisor', 'employment_status', 'join_date'
    ];

    /**
     * Selalu sertakan nama karyawan saat di-serialize ke frontend.
     */
    protected $appends = ['employee_name'];

    /**
     * Nama karyawan: ambil dari personal_information.full_name,
     * jika kosong fallback ke users.name.
     */
    public function getEmployeeNameAttribute(): ?string
    {
        return $this->personalInformation?->full_name ?: $this->user?->name;
    }

    public function personalInformation()
    {
        return $this->hasOne(PersonalInformation::class, 'nik', 'nik');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'nik', 'nik');
    }

    public function supervisor()
    {
        return $this->belongsTo(User::class, 'direct_supervisor', 'nik');
    }

    public function employeeRank()
    {
        return $this->belongsTo(EmployeeRank::class, 'employee_rank_id');
    }

    public function employeePosition()
    {
        return $this->belongsTo(EmployeePosition::class, 'employee_position_id');
    }

    /**
     * Semua penempatan perusahaan karyawan (multi-perusahaan).
     * Baris dengan is_primary = true adalah penempatan utama.
     */
    public function employments()
    {
        return $this->hasMany(EmployeeEmployment::class, 'nik', 'nik');
    }
}
