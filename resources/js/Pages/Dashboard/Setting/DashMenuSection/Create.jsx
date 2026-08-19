import React from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import DynamicForm from '@/Components/DynamicForm';
import { Head, useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        order: '1',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/dashboard-menu-sections');
    };

    const formFields = [
        { name: 'name', label: 'Name', type: 'text', placeholder: 'Section Name (e.g. Master Data)', required: true },
        { name: 'order', label: 'Order', type: 'number', placeholder: 'Order position (e.g. 1, 2, 3)', required: true },
    ];

    return (
        <DashboardLayout judulHalaman="Add Dashboard Menu Section">
            <Head title="Add Dashboard Menu Section" />
            <DynamicForm
                title="Add New Section"
                description="Create a new dashboard menu section."
                fields={formFields}
                data={data}
                setData={setData}
                errors={errors}
                onSubmit={handleSubmit}
                processing={processing}
                submitText="Create"
                cancelHref="/dashboard-menu-sections"
            />
        </DashboardLayout>
    );
}
