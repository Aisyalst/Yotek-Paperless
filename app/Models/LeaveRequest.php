<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LeaveRequest extends Model
{
    protected $fillable = [
        'employee_nik', 'request_date', 'request_type', 'start_date', 'end_date',
        'duration_days', 'has_doctor_note', 'permission_type', 'permission_start_time',
        'permission_end_time', 'deduction_type', 'special_leave_type', 'reason',
        'work_delegation', 'status'
    ];

    public function employee()
    {
        return $this->belongsTo(EmployeeInformation::class, 'employee_nik', 'nik');
    }
}
