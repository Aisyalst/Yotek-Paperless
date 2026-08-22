<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmployeeInformation extends Model
{
    protected $fillable = [
        'nik', 'company', 'branch', 'department', 'level', 
        'direct_supervisor', 'employment_status', 'join_date', 'effective_date'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'nik', 'nik');
    }

    public function supervisor()
    {
        return $this->belongsTo(User::class, 'direct_supervisor', 'nik');
    }
}
