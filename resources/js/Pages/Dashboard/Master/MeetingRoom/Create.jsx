import React from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import DynamicForm from '@/Components/DynamicForm';
import { Head, useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        location: '',
        capacity: '',
        is_active: true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/meeting-rooms');
    };

    const formFields = [
        { name: 'name', label: 'Nama Ruangan', type: 'text', placeholder: 'Contoh: Ruang Rapat Utama', required: true },
        { name: 'location', label: 'Lokasi', type: 'text', placeholder: 'Contoh: Lantai 2, Gedung A', required: true },
        { name: 'capacity', label: 'Kapasitas', type: 'number', placeholder: 'Kapasitas dalam angka', required: true },
        { 
            name: 'is_active', 
            label: 'Status Aktif', 
            type: 'select', 
            options: [
                { value: true, label: 'Aktif' },
                { value: false, label: 'Tidak Aktif' }
            ],
            required: true 
        },
    ];

    return (
        <DashboardLayout judulHalaman="Tambah Data Ruangan Rapat">
            <Head title="Tambah Ruangan Rapat" />
            <DynamicForm
                title="Tambah Ruangan Rapat Baru"
                description="Buat data ruangan rapat baru."
                fields={formFields}
                data={data}
                setData={setData}
                errors={errors}
                onSubmit={handleSubmit}
                processing={processing}
                submitText="Simpan"
                cancelHref="/meeting-rooms"
            />
        </DashboardLayout>
    );
}
