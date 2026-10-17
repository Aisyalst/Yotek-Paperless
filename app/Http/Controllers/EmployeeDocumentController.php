<?php

namespace App\Http\Controllers;

use App\Models\EmployeeDocument;
use App\Models\EmployeeInformation as Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class EmployeeDocumentController extends Controller
{
    /**
     * Display documents for an employee.
     */
    public function index($nik)
    {
        $user = Auth::user();
        
        // Permission check
        if (!$user->hasPermissionTo('employee-documents.index')) {
            abort(403, 'Anda tidak memiliki akses ke dokumen karyawan.');
        }

        $employee = Employee::where('nik', $nik)
            ->with(['user', 'personalInformation', 'employeeRank', 'employeePosition', 'supervisor', 'employments'])
            ->firstOrFail();

        $documents = EmployeeDocument::where('employee_nik', $nik)
            ->with('uploader')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Dashboard/Employee/Detail', [
            'employee' => $employee,
            'documents' => $documents,
        ]);
    }

    /**
     * Store a newly uploaded document.
     */
    public function store(Request $request, $nik)
    {
        $user = Auth::user();
        
        // Permission check
        if (!$user->hasPermissionTo('employee-documents.store')) {
            abort(403, 'Anda tidak memiliki akses untuk mengunggah dokumen.');
        }

        $request->validate([
            'file' => 'required|file|max:10240', // Max 10MB
        ], [
            'file.required' => 'File wajib dipilih.',
            'file.max' => 'Ukuran file maksimal 10MB.',
        ]);

        $employee = Employee::where('nik', $nik)->firstOrFail();
        $file = $request->file('file');

        // Generate unique filename
        $filename = uniqid() . '_' . time() . '.' . $file->getClientOriginalExtension();
        
        // Store in private storage
        $path = $file->storeAs("employee_documents/{$nik}", $filename, 'local');

        EmployeeDocument::create([
            'employee_nik' => $nik,
            'filename' => $filename,
            'original_name' => $file->getClientOriginalName(),
            'path' => $path,
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
            'uploaded_by' => $user->nik,
        ]);

        return redirect()->back()->with('success', 'Dokumen berhasil diunggah.');
    }

    /**
     * Download/view a document.
     */
    public function show($id)
    {
        $user = Auth::user();
        
        // Permission check
        if (!$user->hasPermissionTo('employee-documents.show')) {
            abort(403, 'Anda tidak memiliki akses untuk melihat dokumen.');
        }

        $document = EmployeeDocument::findOrFail($id);

        // Check if file exists
        if (!Storage::disk('local')->exists($document->path)) {
            abort(404, 'File tidak ditemukan.');
        }

        // Return file for download/view
        $headers = [
            'Content-Type' => $document->mime_type,
            'Content-Disposition' => 'inline; filename="' . $document->original_name . '"',
        ];

        return Storage::disk('local')->download($document->path, $document->original_name, $headers);
    }

    /**
     * Remove a document.
     */
    public function destroy($id)
    {
        $user = Auth::user();
        
        // Permission check
        if (!$user->hasPermissionTo('employee-documents.destroy')) {
            abort(403, 'Anda tidak memiliki akses untuk menghapus dokumen.');
        }

        $document = EmployeeDocument::findOrFail($id);

        // Delete file from storage
        if (Storage::disk('local')->exists($document->path)) {
            Storage::disk('local')->delete($document->path);
        }

        $document->delete();

        return redirect()->back()->with('success', 'Dokumen berhasil dihapus.');
    }
}
