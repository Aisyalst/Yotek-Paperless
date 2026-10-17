<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmployeeDocument extends Model
{
    protected $fillable = [
        'employee_nik',
        'filename',
        'original_name',
        'path',
        'mime_type',
        'size',
        'uploaded_by',
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class, 'employee_nik', 'nik');
    }

    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by', 'nik');
    }
}
