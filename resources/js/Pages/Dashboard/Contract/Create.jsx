import React, { useEffect } from 'react';
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

    useEffect(() => {
        if (data.contract_start_date && data.contract_end_date) {
            const start = new Date(data.contract_start_date);
            const end = new Date(data.contract_end_date);
            if (end >= start) {
                const diffTime = Math.abs(end - start);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                const totalMonths = Math.round(diffDays / 30.436875);
                
                const years = Math.floor(totalMonths / 12);
                const months = totalMonths % 12;
                
                let durationStr = '';
                if (years > 0) durationStr += `${years} Tahun `;
                if (months > 0 || years === 0) durationStr += `${months} Bulan`;
                
                if (data.contract_duration !== durationStr.trim()) {
                    setData('contract_duration', durationStr.trim());
                }
            } else {
                if (data.contract_duration !== 'Tanggal tidak valid') {
                    setData('contract_duration', 'Tanggal tidak valid');
                }
            }
        }
    }, [data.contract_start_date, data.contract_end_date]);

    useEffect(() => {
        if (data.nik) {
            const selectedUser = users.find(u => String(u.nik) === String(data.nik));
            if (selectedUser && selectedUser.contract_information) {
                const count = selectedUser.contract_information.length;
                const newSequence = count + 1;
                const prevContract = count > 0 ? selectedUser.contract_information[count - 1].contract_number : '-';
                
                if (data.contract_sequence !== newSequence || data.previous_contract !== prevContract) {
                    setData({
                        ...data,
                        contract_sequence: newSequence,
                        previous_contract: prevContract
                    });
                }
            }
        }
    }, [data.nik]);

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
            type: 'select',
            options: [
                { value: 'PKWT', label: 'PKWT' },
                { value: 'PKWTT', label: 'PKWTT' },
                { value: 'Magang', label: 'Magang' },
                { value: 'Freelance', label: 'Freelance' },
                { value: 'Probation', label: 'Probation' },
            ],
            placeholder: 'Pilih Tipe Kontrak',
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
            placeholder: 'Dihitung otomatis',
            readOnly: true,
        },
        {
            name: 'contract_sequence',
            label: 'Kontrak Ke-',
            type: 'number',
            placeholder: 'Dihitung otomatis',
            readOnly: true,
        },
        {
            name: 'contract_status',
            label: 'Status Kontrak',
            type: 'select',
            options: [
                { value: 'Aktif', label: 'Aktif' },
                { value: 'Selesai', label: 'Selesai' },
            ],
            placeholder: 'Pilih Status',
        },
        {
            name: 'previous_contract',
            label: 'Kontrak Sebelumnya',
            type: 'text',
            placeholder: 'Dihitung otomatis',
            readOnly: true,
        },
        {
            name: 'next_action',
            label: 'Tindakan Selanjutnya',
            type: 'select',
            options: [
                { value: 'Diperpanjang', label: 'Diperpanjang' },
                { value: 'Tidak diperpanjang', label: 'Tidak diperpanjang' },
            ],
            placeholder: 'Pilih Tindakan',
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
