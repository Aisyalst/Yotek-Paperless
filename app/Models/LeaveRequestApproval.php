<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LeaveRequestApproval extends Model
{
    protected $fillable = [
        'leave_request_id',
        'approver_level',
        'approver_nik',
        'approver_role',
        'status',
        'signature',
    ];

    public function leaveRequest()
    {
        return $this->belongsTo(LeaveRequest::class);
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approver_nik', 'nik');
    }
}
