<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LeaveRequest extends Model
{
    protected $fillable = [
        'user_id', 'request_date', 'request_type', 'start_date', 'end_date',
        'duration_days', 'has_doctor_note', 'permission_type', 'permission_start_time',
        'permission_end_time', 'deduction_type', 'special_leave_type', 'reason',
        'work_delegation', 'status'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
