<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Meeting extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'type',
        'meeting_room_id',
        'online_platform',
        'online_link',
        'passcode',
        'date',
        'start_time',
        'end_time',
        'organizer_nik',
        'status',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function room()
    {
        return $this->belongsTo(MeetingRoom::class, 'meeting_room_id');
    }

    public function organizer()
    {
        return $this->belongsTo(User::class, 'organizer_nik', 'nik');
    }

    public function participants()
    {
        return $this->hasMany(MeetingParticipant::class, 'meeting_id');
    }
}
