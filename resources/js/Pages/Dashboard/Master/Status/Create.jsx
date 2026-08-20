import React from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import DynamicForm from '@/Components/DynamicForm';
import { Head, useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        type: 'Form',
        color: '#0000ff',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/statuses');
    };

    const formFields = [
        { name: 'title', label: 'Judul Status', type: 'text', placeholder: 'Judul (contoh: Aktif)', required: true },
        { name: 'type', label: 'Tipe', type: 'select', options: [{value: 'Form', label: 'Form'}, {value: 'Kontrak', label: 'Kontrak'}], required: true },
        { name: 'color', label: 'Warna', type: 'color', placeholder: 'Warna (kode hex)', required: false },
    ];

    return (
        <DashboardLayout judulHalaman="Tambah Data Status">
            <Head title="Tambah Status" />
            <DynamicForm
                title="Tambah Status Baru"
                description="Buat data status baru."
                fields={formFields}
                data={data}
                setData={setData}
                errors={errors}
                onSubmit={handleSubmit}
                processing={processing}
                submitText="Simpan"
                cancelHref="/statuses"
            />
        </DashboardLayout>
    );
}
