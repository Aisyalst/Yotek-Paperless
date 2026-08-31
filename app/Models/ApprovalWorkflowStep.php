<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ApprovalWorkflowStep extends Model
{
    use HasFactory;

    protected $fillable = ['approval_workflow_id', 'approval_level', 'approver_type', 'approver_nik', 'employee_role'];

    public function workflow()
    {
        return $this->belongsTo(ApprovalWorkflow::class, 'approval_workflow_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'approver_nik', 'nik');
    }
}
