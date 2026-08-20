import React from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import DynamicForm from '@/Components/DynamicForm';
import { Head, useForm } from '@inertiajs/react';

export default function Edit({ urgency }) {
    const { data, setData, put, processing, errors } = useForm({
        title: urgency.title || '',
        level: urgency.level || '1',
        color: urgency.color || '#ff0000',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/urgencies/${urgency.id}`);
    };

    const formFields = [
        { name: 'title', label: 'Judul Urgensi', type: 'text', placeholder: 'Judul (contoh: Tinggi)', required: true },
        { name: 'level', label: 'Level', type: 'number', placeholder: 'Level (contoh: 1, 2, 3)', required: true },
        { name: 'color', label: 'Warna', type: 'color', placeholder: 'Warna (kode hex)', required: false },
    ];

    return (
        <DashboardLayout judulHalaman="Edit Data Urgensi">
            <Head title="Edit Urgensi" />
            <DynamicForm
                title="Edit Urgensi"
                description="Perbarui data urgensi."
                fields={formFields}
                data={data}
                setData={setData}
                errors={errors}
                onSubmit={handleSubmit}
                processing={processing}
                submitText="Simpan Perubahan"
                cancelHref="/urgencies"
            />
        </DashboardLayout>
    );
}
