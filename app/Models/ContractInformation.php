<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContractInformation extends Model
{
    protected $fillable = [
        'nik', 'contract_type', 'contract_number', 'contract_start_date', 
        'contract_end_date', 'contract_duration', 'contract_sequence', 
        'contract_status', 'previous_contract', 'next_action'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'nik', 'nik');
    }
}
