<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    //
    protected $fillable = [
        'title',
        'body',
        'type',
        'url',
        'target_type',
        'target_value',
        'created_by',
    ];

    public function recipients()
    {
        return $this->hasMany(NotificationRecipient::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
