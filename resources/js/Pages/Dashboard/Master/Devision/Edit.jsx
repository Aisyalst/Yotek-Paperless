import React from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import DynamicForm from '@/Components/DynamicForm';
import { Head, useForm } from '@inertiajs/react';

export default function Edit({ devision, employees = [] }) {
    const { data, setData, put, processing, errors } = useForm({
        name: devision.name || '',
        head: devision.head || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/devisions/${devision.id}`);
    };

    const formFields = [
        { name: 'name', label: 'Nama Divisi', type: 'text', placeholder: 'Judul (contoh: IT)', required: true },
        { 
            name: 'head', 
            label: 'Ketua Divisi', 
            type: 'select', 
            options: [
                { value: '', label: 'Pilih Ketua Divisi (Opsional)' },
                ...employees.map(e => ({ value: e.nik, label: `${e.user?.name || '-'} (${e.nik})` }))
            ],
            placeholder: 'Pilih Ketua Divisi' 
        },
    ];

    return (
        <DashboardLayout judulHalaman="Edit Data Divisi">
            <Head title="Edit Divisi" />
            <DynamicForm
                title="Edit Divisi"
                description="Perbarui data divisi."
                fields={formFields}
                data={data}
                setData={setData}
                errors={errors}
                onSubmit={handleSubmit}
                processing={processing}
                submitText="Simpan Perubahan"
                cancelHref="/devisions"
            />
        </DashboardLayout>
    );
}
