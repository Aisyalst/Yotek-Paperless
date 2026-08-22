import React from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import DynamicForm from '@/Components/DynamicForm';
import { Head, useForm } from '@inertiajs/react';

export default function Create({ users }) {
    const { data, setData, post, processing, errors } = useForm({
        nik: '',
        contract_type: '',
        contract_number: '',
        contract_start_date: '',
        contract_end_date: '',
        contract_duration: '',
        contract_sequence: '',
        contract_status: '',
        previous_contract: '',
        next_action: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/contracts');
    };

    const formFields = [
        {
            name: 'nik',
            label: 'Karyawan',
            type: 'select',
            options: users.map(user => ({ value: user.nik, label: `${user.name} (${user.nik})` })),
            placeholder: 'Pilih Karyawan',
            required: true,
        },
        {
            name: 'contract_number',
            label: 'Nomor Kontrak',
            type: 'text',
            placeholder: 'Nomor Kontrak',
        },
        {
            name: 'contract_type',
            label: 'Tipe Kontrak',
            type: 'text',
            placeholder: 'Contoh: PKWT, PKWTT',
        },
        {
            name: 'contract_start_date',
            label: 'Tanggal Mulai',
            type: 'date',
        },
        {
            name: 'contract_end_date',
            label: 'Tanggal Selesai',
            type: 'date',
        },
        {
            name: 'contract_duration',
            label: 'Durasi Kontrak',
            type: 'text',
            placeholder: 'Contoh: 1 Tahun, 6 Bulan',
        },
        {
            name: 'contract_sequence',
            label: 'Kontrak Ke-',
            type: 'number',
            placeholder: 'Contoh: 1',
        },
        {
            name: 'contract_status',
            label: 'Status Kontrak',
            type: 'text',
            placeholder: 'Contoh: Aktif, Selesai',
        },
        {
            name: 'previous_contract',
            label: 'Kontrak Sebelumnya',
            type: 'text',
            placeholder: 'Nomor Kontrak Sebelumnya',
        },
        {
            name: 'next_action',
            label: 'Tindakan Selanjutnya',
            type: 'text',
            placeholder: 'Contoh: Diperpanjang, Diputus',
        }
    ];

    return (
        <DashboardLayout judulHalaman="Tambah Kontrak">
            <Head title="Tambah Kontrak" />
            <DynamicForm
                title="Tambah Kontrak Baru"
                description="Masukkan informasi kontrak kerja untuk karyawan."
                fields={formFields}
                data={data}
                setData={setData}
                errors={errors}
                onSubmit={handleSubmit}
                processing={processing}
                submitText="Simpan"
                cancelHref="/contracts"
            />
        </DashboardLayout>
    );
}
