import React from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import DynamicForm from '@/Components/DynamicForm';
import { Head, useForm } from '@inertiajs/react';

export default function Edit({ dashboardMenuSection }) {
    const { data, setData, put, processing, errors } = useForm({
        name: dashboardMenuSection.name || '',
        order: dashboardMenuSection.order || '1',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/dashboard-menu-sections/${dashboardMenuSection.id}`);
    };

    const formFields = [
        { name: 'name', label: 'Name', type: 'text', placeholder: 'Section Name (e.g. Master Data)', required: true },
        { name: 'order', label: 'Order', type: 'number', placeholder: 'Order position (e.g. 1, 2, 3)', required: true },
    ];

    return (
        <DashboardLayout judulHalaman="Edit Dashboard Menu Section">
            <Head title="Edit Dashboard Menu Section" />
            <DynamicForm
                title="Edit Section"
                description="Update the dashboard menu section details."
                fields={formFields}
                data={data}
                setData={setData}
                errors={errors}
                onSubmit={handleSubmit}
                processing={processing}
                submitText="Update"
                cancelHref="/dashboard-menu-sections"
            />
        </DashboardLayout>
    );
}
