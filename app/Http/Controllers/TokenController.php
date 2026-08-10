<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class TokenController extends Controller
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
        $response = $this->client()->get('/tokens');
        
        $tokens = [];
        if ($response->successful()) {
            $tokens = $response->json('data') ?? [];
        }

        return Inertia::render('Dashboard/Tokens/Index', [
            'tokens' => $tokens
        ]);
    }

    public function create()
    {
        return Inertia::render('Dashboard/Tokens/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'test_type' => 'required|array',
            'quantity' => 'required|integer|min:1|max:100',
            'intended_for_name' => 'nullable|string',
            'intended_for_email' => 'nullable|email',
            'expires_at' => 'required|date',
        ]);

        $response = $this->client()->post('/tokens', $validated);

        if ($response->successful()) {
            return redirect()->route('tokens.index')->with('success', 'Tokens created successfully.');
        }

        return back()->withErrors(['api' => 'Failed to create tokens from the API.']);
    }

    public function destroy($id)
    {
        $response = $this->client()->delete('/tokens/' . $id);

        if ($response->successful()) {
            return redirect()->route('tokens.index')->with('success', 'Token deleted successfully.');
        }

        return back()->withErrors(['api' => 'Failed to delete token.']);
    }
}
