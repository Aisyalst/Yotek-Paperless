<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Devision extends Model
{
    protected $fillable = ['name', 'head'];

    public function headEmployee()
    {
        return $this->belongsTo(EmployeeInformation::class, 'head', 'nik');
    }
}
