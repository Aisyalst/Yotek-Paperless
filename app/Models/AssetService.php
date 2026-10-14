<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AssetService extends Model
{
    protected $fillable = [
        'asset_id', 'service_number', 'service_type', 'service_date', 'vendor',
        'complaint', 'action_taken', 'cost', 'start_date', 'completed_date',
        'status', 'result', 'attachment', 'created_by_nik',
    ];

    protected $casts = [
        'service_date' => 'date',
        'start_date' => 'date',
        'completed_date' => 'date',
        'cost' => 'decimal:2',
    ];

    public function asset()
    {
        return $this->belongsTo(Asset::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(EmployeeInformation::class, 'created_by_nik', 'nik');
    }
}
