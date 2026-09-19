<?php

namespace App\Http\Controllers;

use App\Models\Meeting;
use App\Models\MeetingParticipant;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class MyMeetingController extends Controller
{
    public function index()
    {
        $nik = Auth::user()->nik;

        // Ambil semua meeting di mana user login adalah partisipan
        $meetings = Meeting::with(['room', 'organizer', 'participants' => function($q) use ($nik) {
            $q->where('employee_nik', $nik);
        }])
        ->whereHas('participants', function($q) use ($nik) {
            $q->where('employee_nik', $nik);
        })
        ->orderBy('date', 'desc')
        ->orderBy('start_time', 'desc')
        ->get();

        return Inertia::render('Dashboard/MyMeeting/Index', [
            'meetings' => $meetings
        ]);
    }

    public function respond(Request $request, Meeting $meeting)
    {
        $request->validate([
            'status' => 'required|in:accepted,declined'
        ]);

        $nik = Auth::user()->nik;

        $participant = MeetingParticipant::where('meeting_id', $meeting->id)
            ->where('employee_nik', $nik)
            ->firstOrFail();

        $participant->update([
            'status' => $request->status,
            'responded_at' => now(),
        ]);

        $message = $request->status === 'accepted' 
            ? 'Anda telah menerima undangan meeting.' 
            : 'Anda menolak undangan meeting.';

        return redirect()->back()->with('success', $message);
    }
}
