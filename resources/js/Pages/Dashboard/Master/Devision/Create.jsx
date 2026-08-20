import React from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import DynamicForm from '@/Components/DynamicForm';
import { Head, useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/devisions');
    };

    const formFields = [
        { name: 'name', label: 'Nama Divisi', type: 'text', placeholder: 'Judul (contoh: IT)', required: true },
    ];

    return (
        <DashboardLayout judulHalaman="Tambah Data Divisi">
            <Head title="Tambah Divisi" />
            <DynamicForm
                title="Tambah Divisi Baru"
                description="Buat data divisi baru."
                fields={formFields}
                data={data}
                setData={setData}
                errors={errors}
                onSubmit={handleSubmit}
                processing={processing}
                submitText="Simpan"
                cancelHref="/devisions"
            />
        </DashboardLayout>
    );
}
