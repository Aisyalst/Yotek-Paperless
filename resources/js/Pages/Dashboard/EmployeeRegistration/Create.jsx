import React from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import DynamicForm from '@/Components/DynamicForm';
import { Head, useForm } from '@inertiajs/react';

export default function Create({ users, allUsers, companies }) {
    const { data, setData, post, processing, errors } = useForm({
        user_id: '',
        nik: '',
        company: '',
        branch: '',
        department: '',
        level: '',
        direct_supervisor: '',
        employment_status: '',
        join_date: '',
        effective_date: ''
    });

    React.useEffect(() => {
        if (data.user_id) {
            const selectedUser = users.find(u => String(u.id) === String(data.user_id));
            if (selectedUser?.role?.devision?.name) {
                setData('department', selectedUser.role.devision.name);
            }
        }
    }, [data.user_id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/employee-registrations');
    };

    const formFields = [
        {
            name: 'user_id',
            label: 'Pengguna',
            type: 'select',
            options: users.map(user => ({ value: user.id, label: user.name })),
            placeholder: 'Pilih Pengguna',
            required: true,
        },
        {
            name: 'nik',
            label: 'NIK',
            type: 'text',
            placeholder: 'Masukkan NIK Karyawan',
            required: true,
        },
        {
            name: 'company',
            label: 'Perusahaan',
            type: 'select',
            options: (companies || []).map(c => ({ value: c.name, label: c.name })),
            placeholder: 'Pilih Perusahaan',
        },
        {
            name: 'branch',
            label: 'Cabang',
            type: 'select',
            options: (() => {
                if (!data.company || !companies) return [];
                const selectedCompany = companies.find(c => c.name === data.company);
                if (!selectedCompany || !Array.isArray(selectedCompany.branch)) return [];
                return selectedCompany.branch.map(b => {
                    const label = `${b.region}, ${b.province}, ${b.city}`;
                    return { value: label, label: label };
                });
            })(),
            placeholder: 'Pilih Cabang',
        },
        {
            name: 'department',
            label: 'Departemen',
            type: 'text',
            placeholder: 'Departemen',
        },
        {
            name: 'level',
            label: 'Jabatan / Level',
            type: 'text',
            placeholder: 'Jabatan / Level',
        },
        {
            name: 'direct_supervisor',
            label: 'Atasan Langsung',
            type: 'select',
            options: [{ value: '', label: 'Pilih Atasan Langsung' }, ...allUsers.map(u => ({ value: u.nik, label: `${u.name} (${u.nik})` }))],
            placeholder: 'Pilih Atasan Langsung (Opsional)',
        },
        {
            name: 'employment_status',
            label: 'Status Kepegawaian',
            type: 'select',
            options: [
                { value: '', label: 'Pilih Status Kepegawaian' },
                { value: 'Active', label: 'Active' },
                { value: 'Inactive', label: 'Inactive' },
                { value: 'Resigned', label: 'Resigned' },
                { value: 'Terminated', label: 'Terminated' }
            ],
            placeholder: 'Pilih Status',
        },
        {
            name: 'join_date',
            label: 'Tanggal Bergabung',
            type: 'date',
        },
        {
            name: 'effective_date',
            label: 'Tanggal Efektif',
            type: 'date',
        }
    ];

    return (
        <DashboardLayout judulHalaman="Tambah Karyawan">
            <Head title="Tambah Karyawan" />
            <DynamicForm
                title="Tambah Registrasi Karyawan"
                description="Daftarkan informasi karyawan untuk pengguna yang sudah ada."
                fields={formFields}
                data={data}
                setData={setData}
                errors={errors}
                onSubmit={handleSubmit}
                processing={processing}
                submitText="Simpan"
                cancelHref="/employee-registrations"
            />
        </DashboardLayout>
    );
}
