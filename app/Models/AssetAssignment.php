<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AssetAssignment extends Model
{
    protected $fillable = [
        'asset_id', 'employee_nik', 'assigned_date', 'returned_date',
        'condition_on_assign', 'condition_on_return', 'status',
        'assigned_by_nik', 'notes',
    ];

    protected $casts = [
        'assigned_date' => 'date:Y-m-d',
        'returned_date' => 'date:Y-m-d',
    ];

    protected $appends = ['employee_name'];

    public function asset()
    {
        return $this->belongsTo(Asset::class);
    }

    /** Karyawan pemegang (via NIK) — memakai EmployeeInformation untuk nama. */
    public function employee()
    {
        return $this->belongsTo(EmployeeInformation::class, 'employee_nik', 'nik');
    }

    public function assignedBy()
    {
        return $this->belongsTo(EmployeeInformation::class, 'assigned_by_nik', 'nik');
    }

    public function getEmployeeNameAttribute(): ?string
    {
        return $this->employee?->employee_name;
    }
}
