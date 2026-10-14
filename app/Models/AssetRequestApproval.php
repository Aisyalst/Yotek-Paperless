<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AssetRequestApproval extends Model
{
    protected $fillable = [
        'asset_request_id', 'approver_level', 'approver_nik', 'approver_role',
        'status', 'notes', 'signature', 'acted_at',
    ];

    protected $casts = [
        'acted_at' => 'datetime',
    ];

    protected $appends = ['approver_name'];

    public function request()
    {
        return $this->belongsTo(AssetRequest::class, 'asset_request_id');
    }

    public function approver()
    {
        return $this->belongsTo(EmployeeInformation::class, 'approver_nik', 'nik');
    }

    public function getApproverNameAttribute(): ?string
    {
        return $this->approver?->employee_name;
    }
}
