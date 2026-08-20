import React from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import DynamicForm from '@/Components/DynamicForm';
import { Head, useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        level: '1',
        color: '#ff0000',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/urgencies');
    };

    const formFields = [
        { name: 'title', label: 'Judul Urgensi', type: 'text', placeholder: 'Judul (contoh: Tinggi)', required: true },
        { name: 'level', label: 'Level', type: 'number', placeholder: 'Level (contoh: 1, 2, 3)', required: true },
        { name: 'color', label: 'Warna', type: 'color', placeholder: 'Warna (kode hex)', required: false },
    ];

    return (
        <DashboardLayout judulHalaman="Tambah Data Urgensi">
            <Head title="Tambah Urgensi" />
            <DynamicForm
                title="Tambah Urgensi Baru"
                description="Buat data urgensi baru."
                fields={formFields}
                data={data}
                setData={setData}
                errors={errors}
                onSubmit={handleSubmit}
                processing={processing}
                submitText="Simpan"
                cancelHref="/urgencies"
            />
        </DashboardLayout>
    );
}
