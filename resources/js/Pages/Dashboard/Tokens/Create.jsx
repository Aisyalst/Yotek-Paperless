import React from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import DynamicForm from '@/Components/DynamicForm';
import { Head, useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors, transform } = useForm({
        test_type: 'papi',
        quantity: 1,
        intended_for_name: '',
        intended_for_email: '',
        expires_at: '',
    });

    transform((data) => ({
        ...data,
        test_type: [data.test_type], // API expects array
    }));

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/tokens');
    };

    const formFields = [
        { 
            name: 'test_type', 
            label: 'Test Type', 
            type: 'select', 
            options: [
                { value: 'papi', label: 'PAPI' }, 
                { value: 'kraepelin', label: 'Kraepelin' }
            ], 
            required: true 
        },
        { name: 'quantity', label: 'Quantity', type: 'number', placeholder: 'Number of tokens (e.g. 1)', required: true },
        { name: 'intended_for_name', label: 'Intended For Name (Optional)', type: 'text', placeholder: 'Name', required: false },
        { name: 'intended_for_email', label: 'Intended For Email (Optional)', type: 'email', placeholder: 'Email', required: false },
        { name: 'expires_at', label: 'Expires At', type: 'datetime-local', placeholder: 'Expiration date', required: true },
    ];

    return (
        <DashboardLayout judulHalaman="Generate Token">
            <Head title="Generate Token" />
            <DynamicForm
                title="Generate New Token"
                description="Create a new token for participants to take the test."
                fields={formFields}
                data={data}
                setData={setData}
                errors={errors}
                onSubmit={handleSubmit}
                processing={processing}
                submitText="Generate"
                cancelHref="/tokens"
            />
        </DashboardLayout>
    );
}
