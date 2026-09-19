<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmployeeInformation extends Model
{
    protected $fillable = [
        'nik', 'company', 'branch', 'department', 'employee_position_id', 'employee_rank_id', 
        'direct_supervisor', 'employment_status', 'join_date'
    ];

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
}
