import React from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import DynamicForm from '@/Components/DynamicForm';
import { Head, useForm } from '@inertiajs/react';

export default function Edit({ dashboardMenu, routes = [], parentMenus = [], sections = [] }) {
    const { data, setData, put, processing, errors } = useForm({
        name: dashboardMenu.name || '',
        icon: dashboardMenu.icon || '',
        type: dashboardMenu.type || 'Single',
        section_id: dashboardMenu.section_id || (sections.length > 0 ? sections[0].id : ''),
        parent_id: dashboardMenu.parent_id || '',
        route_id: dashboardMenu.route_id || '',
        position: dashboardMenu.position || '1',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/dashboard-menus/${dashboardMenu.id}`);
    };

    const formFields = [
        { name: 'name', label: 'Name', type: 'text', placeholder: 'Name', required: true },
        { name: 'icon', label: 'Icon (Optional)', type: 'text', placeholder: 'Icon name (e.g. HiCog, HiUser)', required: false },
        { name: 'type', label: 'Type', type: 'select', options: [{value: 'Single', label: 'Single Link'}, {value: 'Dropdown', label: 'Collapsible Dropdown Parent'}], required: true },
        { name: 'section_id', label: 'Section', type: 'select', options: sections.map(s => ({ value: s.id, label: s.name })), required: true },
        ...(data.type === 'Single' ? [
            { name: 'route_id', label: 'Route', type: 'select', options: routes.map(route => ({value: route.id, label: `${route.name} (${route.route_name})`})), placeholder: 'Select Route', required: true },
            { name: 'parent_id', label: 'Parent Menu (Optional)', type: 'select', options: parentMenus.map(parent => ({value: parent.id, label: parent.name})), placeholder: 'No Parent (Top Level)', required: false },
        ] : []),
        { name: 'position', label: 'Position', type: 'number', placeholder: 'Menu order position (e.g. 1, 2, 3)', required: true },
    ];

    return (
        <DashboardLayout judulHalaman="Edit Dashboard Menu">
            <Head title="Edit Dashboard Menu" />
            <DynamicForm
                title="Edit Dashboard Menu"
                description="Update dashboard menu information."
                fields={formFields}
                data={data}
                setData={setData}
                errors={errors}
                onSubmit={handleSubmit}
                processing={processing}
                submitText="Update"
                cancelHref="/dashboard-menus"
            />
        </DashboardLayout>
    );
}
