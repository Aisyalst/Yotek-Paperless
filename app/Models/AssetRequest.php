<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AssetRequest extends Model
{
    protected $fillable = [
        'request_number', 'employee_nik', 'company_id', 'department',
        'request_date', 'needed_date', 'purpose', 'priority', 'status', 'notes',
    ];

    protected $casts = [
        'request_date' => 'date',
        'needed_date' => 'date',
    ];

    protected $appends = ['employee_name'];

    public function items()
    {
        return $this->hasMany(AssetRequestItem::class);
    }

    public function approvals()
    {
        return $this->hasMany(AssetRequestApproval::class)->orderBy('approver_level');
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function employee()
    {
        return $this->belongsTo(EmployeeInformation::class, 'employee_nik', 'nik');
    }

    public function getEmployeeNameAttribute(): ?string
    {
        return $this->employee?->employee_name;
    }
}
