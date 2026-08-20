import React from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import DynamicForm from '@/Components/DynamicForm';
import { Head, useForm } from '@inertiajs/react';

export default function Edit({ status }) {
    const { data, setData, put, processing, errors } = useForm({
        title: status.title || '',
        type: status.type || 'Form',
        color: status.color || '#0000ff',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/statuses/${status.id}`);
    };

    const formFields = [
        { name: 'title', label: 'Judul Status', type: 'text', placeholder: 'Judul (contoh: Aktif)', required: true },
        { name: 'type', label: 'Tipe', type: 'select', options: [{value: 'Form', label: 'Form'}, {value: 'Kontrak', label: 'Kontrak'}], required: true },
        { name: 'color', label: 'Warna', type: 'color', placeholder: 'Warna (kode hex)', required: false },
    ];

    return (
        <DashboardLayout judulHalaman="Edit Data Status">
            <Head title="Edit Status" />
            <DynamicForm
                title="Edit Status"
                description="Perbarui data status."
                fields={formFields}
                data={data}
                setData={setData}
                errors={errors}
                onSubmit={handleSubmit}
                processing={processing}
                submitText="Simpan Perubahan"
                cancelHref="/statuses"
            />
        </DashboardLayout>
    );
}
