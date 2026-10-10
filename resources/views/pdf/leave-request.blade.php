<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Form Pengajuan Izin/Sakit/Cuti</title>
    <style>
        @page {
            margin: 20px;
        }
        body {
            font-family: Arial, sans-serif;
            font-size: 11px;
            color: #000;
        }
        .header-image {
            width: 100%;
            height: auto;
            margin-bottom: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }
        th, td {
            border: 1px solid #ccc;
            padding: 5px;
            text-align: left;
            vertical-align: top;
        }
        .bg-gray {
            background-color: #e5e5e5;
        }
        .bg-light {
            background-color: #f2f2f2;
        }
        .bg-brown {
            background-color: #b59b74;
            color: white;
            font-weight: bold;
        }
        .text-center {
            text-align: center;
        }
        .check-box {
            display: inline-block;
            width: 12px;
            height: 12px;
            border: 1px solid #000;
            margin-right: 5px;
            text-align: center;
            line-height: 12px;
            font-size: 10px;
        }
        .check-box.checked:before {
            content: "\2713"; /* Checkmark */
        }
        .signature-container {
            width: 100%;
            margin-top: 20px;
        }
        .signature-box {
            width: 32%;
            display: inline-block;
            text-align: center;
            vertical-align: top;
        }
        .signature-img {
            max-width: 120px;
            max-height: 60px;
            margin: 10px auto;
            display: block;
        }
    </style>
</head>
<body>

    @php
        // Read header image
        $imagePath = public_path('form_header.png');
        if (file_exists($imagePath)) {
            $imageData = base64_encode(file_get_contents($imagePath));
            $src = 'data:image/png;base64,'.$imageData;
        } else {
            $src = '';
        }
    @endphp

    @if($src)
        <img src="{{ $src }}" class="header-image" alt="Header">
    @else
        <h2 class="text-center">FORM PENGAJUAN IZIN, SAKIT, & CUTI</h2>
    @endif

    <table>
        <tr>
            <td class="bg-gray" style="width: 20%;"><strong>Tanggal Pengajuan</strong></td>
            <td colspan="4">{{ \Carbon\Carbon::parse($leaveRequest->request_date)->translatedFormat('d F Y') }}</td>
        </tr>
        <tr class="bg-gray text-center font-bold">
            <td style="width: 20%;">Nomor Induk Karyawan</td>
            <td style="width: 25%;">Nama Karyawan</td>
            <td style="width: 20%;">Posisi</td>
            <td style="width: 20%;">Divisi / Department</td>
            <td style="width: 15%;">Sisa Cuti</td>
        </tr>
        <tr class="text-center">
            <td>{{ $leaveRequest->employee->nik ?? '-' }}</td>
            <td>{{ $leaveRequest->employee->user->name ?? '-' }}</td>
            <td>{{ $leaveRequest->employee->user->role?->name ?? '-' }}</td>
            <td>{{ $leaveRequest->employee->user->role?->devision?->name ?? '-' }}</td>
            <td>
                @php
                    $sisaCuti = \App\Models\LeaveEntitlement::where('nik', $leaveRequest->employee_nik)
                        ->where('status', 'Aktif')->sum('total');
                @endphp
                {{ $sisaCuti }} Hari
            </td>
        </tr>
    </table>

    <table>
        <tr>
            <td class="bg-gray" style="width: 15%;"><strong>Tanggal Izin</strong></td>
            <td>
                {{ \Carbon\Carbon::parse($leaveRequest->start_date)->format('d/m/Y') }} 
                s.d. 
                {{ $leaveRequest->end_date ? \Carbon\Carbon::parse($leaveRequest->end_date)->format('d/m/Y') : \Carbon\Carbon::parse($leaveRequest->start_date)->format('d/m/Y') }}
            </td>
        </tr>
    </table>

    <table>
        <tr>
            <td colspan="2" class="bg-brown" style="font-size: 14px;">Jenis Pengajuan</td>
        </tr>
        <tr>
            <td style="width: 25%;" class="bg-light">
                <span class="check-box {{ $leaveRequest->request_type === 'Sakit' ? 'checked' : '' }}"></span> <strong>SAKIT</strong>
            </td>
            <td>
                Lama: {{ $leaveRequest->request_type === 'Sakit' ? $leaveRequest->duration_days : '...' }} Hari &nbsp;&nbsp;&nbsp;
                Surat Dokter: 
                <span class="check-box {{ $leaveRequest->request_type === 'Sakit' && $leaveRequest->has_doctor_note ? 'checked' : '' }}"></span> Ada &nbsp;
                <span class="check-box {{ $leaveRequest->request_type === 'Sakit' && !$leaveRequest->has_doctor_note ? 'checked' : '' }}"></span> Tidak Ada
            </td>
        </tr>
        <tr>
            <td class="bg-light">
                <span class="check-box {{ $leaveRequest->request_type === 'Izin' ? 'checked' : '' }}"></span> <strong>IZIN</strong>
            </td>
            <td>
                <span class="check-box {{ $leaveRequest->permission_type === 'Datang Terlambat' ? 'checked' : '' }}"></span> Datang Terlambat &nbsp;
                <span class="check-box {{ $leaveRequest->permission_type === 'Pulang Cepat' ? 'checked' : '' }}"></span> Pulang Cepat &nbsp;
                Jam: {{ $leaveRequest->permission_type ? ($leaveRequest->permission_start_time ? substr($leaveRequest->permission_start_time, 0, 5) : '...') : '...' }} <br><br>
                
                <span class="check-box {{ $leaveRequest->permission_type === 'Meninggalkan Pekerjaan' ? 'checked' : '' }}"></span> Meninggalkan Pekerjaan Dari Jam: {{ $leaveRequest->permission_start_time ? substr($leaveRequest->permission_start_time, 0, 5) : '...' }} s.d. {{ $leaveRequest->permission_end_time ? substr($leaveRequest->permission_end_time, 0, 5) : '...' }}<br><br>
                
                <span class="check-box {{ $leaveRequest->permission_type === 'Tidak Masuk Kerja' ? 'checked' : '' }}"></span> Tidak Masuk Kerja: {{ $leaveRequest->permission_type === 'Tidak Masuk Kerja' ? $leaveRequest->duration_days : '...' }} Hari, &nbsp;
                <span class="check-box {{ $leaveRequest->deduction_type === 'Potong Gaji' ? 'checked' : '' }}"></span> Potong Gaji &nbsp;
                <span class="check-box {{ $leaveRequest->deduction_type === 'Potong Cuti' ? 'checked' : '' }}"></span> Potong Cuti <br><br>

                <span class="check-box {{ $leaveRequest->permission_type === 'Tugas Kantor' ? 'checked' : '' }}"></span> Tugas Kantor
            </td>
        </tr>
        <tr>
            <td class="bg-light">
                <span class="check-box {{ $leaveRequest->request_type === 'Cuti' ? 'checked' : '' }}"></span> <strong>CUTI</strong>
            </td>
            <td>
                Lama: {{ $leaveRequest->request_type === 'Cuti' ? $leaveRequest->duration_days : '...' }} Hari
            </td>
        </tr>
        <tr>
            <td class="bg-light">
                <span class="check-box {{ $leaveRequest->request_type === 'Cuti Khusus' ? 'checked' : '' }}"></span> <strong>CUTI KHUSUS</strong>
            </td>
            <td>
                Jenis: {{ $leaveRequest->special_leave_type ?? '....................................' }}<br><br>
                Lama: {{ $leaveRequest->request_type === 'Cuti Khusus' ? $leaveRequest->duration_days : '...' }} Hari
            </td>
        </tr>
    </table>

    <table style="table-layout: fixed;">
        <tr>
            <td style="width: 50%;" class="bg-light">
                <strong>Alasan/Keterangan:</strong><br>
                {{ $leaveRequest->reason ?? '-' }}
            </td>
            <td style="width: 50%;" class="bg-light">
                <strong>Pekerjaan yang ditinggalkan diserahkan ke:</strong><br>
                {{ $leaveRequest->work_delegation ?? '-' }}
            </td>
        </tr>
    </table>

    <div class="signature-container">
        @php
            $creator = $leaveRequest->approvals->where('approver_role', 'Pembuat Pengajuan (Self)')->first();
            $manager = $leaveRequest->approvals->where('approver_level', 2)->first(); // Assuming Level 2 is Dept Head
            $hrd = $leaveRequest->approvals->where('approver_level', 3)->first(); // Assuming Level 3 is HRD
        @endphp
        
        <table style="border: none;">
            <tr class="bg-brown text-center">
                <td style="width: 33%; border-color: #fff;">Diajukan</td>
                <td style="width: 33%; border-color: #fff;">Disetujui</td>
                <td style="width: 33%; border-color: #fff;">Diketahui</td>
            </tr>
            <tr class="text-center" style="height: 100px; vertical-align: bottom;">
                <td>
                    @if($creator && $creator->signature)
                        <img src="{{ public_path(str_replace('/storage', 'storage', $creator->signature)) }}" class="signature-img">
                    @endif
                    <br>( {{ $creator->approver->name ?? $leaveRequest->employee->user->name ?? '.......................' }} )<br>Karyawan
                </td>
                <td>
                    @if($manager && $manager->signature)
                        <img src="{{ public_path(str_replace('/storage', 'storage', $manager->signature)) }}" class="signature-img">
                    @endif
                    <br>( {{ $manager->approver->name ?? '.......................' }} )<br>Department Head
                </td>
                <td>
                    @if($hrd && $hrd->signature)
                        <img src="{{ public_path(str_replace('/storage', 'storage', $hrd->signature)) }}" class="signature-img">
                    @endif
                    <br>( {{ $hrd->approver->name ?? '.......................' }} )<br>HRD
                </td>
            </tr>
        </table>
    </div>

</body>
</html>
