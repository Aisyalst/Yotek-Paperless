<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LeaveEntitlementUsage extends Model
{
    use HasFactory;

    protected $fillable = [
        'leave_entitlement_id',
        'leave_request_id',
        'deducted_days',
        'reason',
    ];

    public function leaveEntitlement()
    {
        return $this->belongsTo(LeaveEntitlement::class);
    }

    public function leaveRequest()
    {
        return $this->belongsTo(LeaveRequest::class);
    }
}
