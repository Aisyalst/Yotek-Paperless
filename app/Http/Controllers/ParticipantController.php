<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class ParticipantController extends Controller
{
    protected $apiUrl;
    protected $apiToken;

    public function __construct()
    {
        $this->apiUrl = env('PSIKOTEST_API_URL');
        $this->apiToken = env('PSIKOTEST_API_TOKEN');
    }

    protected function client()
    {
        return Http::withHeaders([
            'X-API-TOKEN' => $this->apiToken,
        ])->baseUrl($this->apiUrl);
    }

    public function index()
    {
        $response = $this->client()->get('/participants');
        
        $participants = [];
        if ($response->successful()) {
            $participants = $response->json('data') ?? [];
        }

        return Inertia::render('Dashboard/Participants/Index', [
            'participants' => $participants
        ]);
    }

    public function show($id)
    {
        $participantResponse = $this->client()->get('/participants/' . $id);
        $resultsResponse = $this->client()->get("/participants/{$id}/results");

        if ($participantResponse->successful()) {
            $participant = $participantResponse->json('data');
            $results = $resultsResponse->successful() ? $resultsResponse->json('data') : null;

            return Inertia::render('Dashboard/Participants/Show', [
                'participant' => $participant,
                'results' => $results
            ]);
        }

        return redirect()->route('participants.index')->withErrors(['api' => 'Participant not found.']);
    }

    public function destroy($id)
    {
        $response = $this->client()->delete('/participants/' . $id);

        if ($response->successful()) {
            return redirect()->route('participants.index')->with('success', 'Participant deleted successfully.');
        }

        return back()->withErrors(['api' => 'Failed to delete participant.']);
    }
}
