<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PersonalInformation extends Model
{
    protected $fillable = [
        'nik', 'full_name', 'nickname', 'nik_ktp', 'birth_place', 
        'birth_date', 'gender', 'marital_status', 'ktp_address', 
        'residential_address', 'email', 'phone', 'emergency_contact'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'nik', 'nik');
    }
}
