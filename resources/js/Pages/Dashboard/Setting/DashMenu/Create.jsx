import React from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import DynamicForm from '@/Components/DynamicForm';
import { Head, useForm } from '@inertiajs/react';

export default function Create({ routes = [], parentMenus = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        icon: '',
        type: 'Single',
        section: 'Tables',
        parent_id: '',
        route_id: '',
        position: '1',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/dashboard-menus');
    };

    const formFields = [
        { name: 'name', label: 'Name', type: 'text', placeholder: 'Name', required: true },
        { name: 'icon', label: 'Icon (Optional)', type: 'text', placeholder: 'Icon name (e.g. HiCog, HiUser)', required: false },
        { name: 'type', label: 'Type', type: 'select', options: [{value: 'Single', label: 'Single Link'}, {value: 'Dropdown', label: 'Collapsible Dropdown Parent'}], required: true },
        { name: 'section', label: 'Section', type: 'select', options: [{value: 'Tables', label: 'Tables'}, {value: 'Settings', label: 'Settings'}], required: true },
        ...(data.type === 'Single' ? [
            { name: 'route_id', label: 'Route', type: 'select', options: routes.map(route => ({value: route.id, label: `${route.name} (${route.route_name})`})), placeholder: 'Select Route', required: true },
            { name: 'parent_id', label: 'Parent Menu (Optional)', type: 'select', options: parentMenus.map(parent => ({value: parent.id, label: parent.name})), placeholder: 'No Parent (Top Level)', required: false },
        ] : []),
        { name: 'position', label: 'Position', type: 'number', placeholder: 'Menu order position (e.g. 1, 2, 3)', required: true },
    ];

    return (
        <DashboardLayout judulHalaman="Add Dashboard Menu">
            <Head title="Add Dashboard Menu" />
            <DynamicForm
                title="Add New Dashboard Menu"
                description="Create a new dashboard menu."
                fields={formFields}
                data={data}
                setData={setData}
                errors={errors}
                onSubmit={handleSubmit}
                processing={processing}
                submitText="Create"
                cancelHref="/dashboard-menus"
            />
        </DashboardLayout>
    );
}