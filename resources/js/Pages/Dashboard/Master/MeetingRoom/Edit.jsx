import React from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import DynamicForm from '@/Components/DynamicForm';
import { Head, useForm } from '@inertiajs/react';

export default function Edit({ meetingRoom }) {
    const { data, setData, put, processing, errors } = useForm({
        name: meetingRoom.name,
        location: meetingRoom.location,
        capacity: meetingRoom.capacity,
        is_active: Boolean(meetingRoom.is_active),
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/meeting-rooms/${meetingRoom.id}`);
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
        <DashboardLayout judulHalaman="Edit Data Ruangan Rapat">
            <Head title="Edit Ruangan Rapat" />
            <DynamicForm
                title="Edit Ruangan Rapat"
                description="Ubah data ruangan rapat."
                fields={formFields}
                data={data}
                setData={setData}
                errors={errors}
                onSubmit={handleSubmit}
                processing={processing}
                submitText="Perbarui"
                cancelHref="/meeting-rooms"
            />
        </DashboardLayout>
    );
}
