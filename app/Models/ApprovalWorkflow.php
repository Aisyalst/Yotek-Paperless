<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ApprovalWorkflow extends Model
{
    use HasFactory;

    protected $fillable = ['workflow_type', 'title', 'role_id'];

    protected $casts = [
        'role_id' => 'array',
    ];

    public function steps()
    {
        return $this->hasMany(ApprovalWorkflowStep::class);
    }
}
