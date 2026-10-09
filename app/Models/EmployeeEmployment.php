<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * Penempatan kerja (employment) seorang karyawan.
 *
 * Satu User (via nik) boleh punya banyak EmployeeEmployment — untuk
 * menampung karyawan yang berada di 2+ perusahaan atau punya 2+ jabatan.
 * Baris dengan is_primary = true adalah penempatan utama.
 */
class EmployeeEmployment extends Model
{
    use HasFactory;

    protected $fillable = [
        'nik', 'company', 'branch', 'department', 'employee_position_id',
        'employee_rank_id', 'direct_supervisor', 'employment_status',
        'is_primary', 'join_date',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
        'join_date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'nik', 'nik');
    }

    public function supervisor()
    {
        return $this->belongsTo(User::class, 'direct_supervisor', 'nik');
    }

    public function employeePosition()
    {
        return $this->belongsTo(EmployeePosition::class, 'employee_position_id');
    }

    public function employeeRank()
    {
        return $this->belongsTo(EmployeeRank::class, 'employee_rank_id');
    }

    /**
     * Scope: hanya penempatan utama.
     */
    public function scopePrimary($query)
    {
        return $query->where('is_primary', true);
    }
}
