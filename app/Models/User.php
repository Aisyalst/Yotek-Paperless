<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable(['nik', 'name', 'email', 'password', 'is_reall_pass', 'phone', 'is_active'])]
#[Hidden(['password', 'remember_token', 'is_reall_pass'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Role UTAMA (non-breaking): diambil dari pivot user_roles is_primary.
     * Tetap dipertahankan agar kode & view lama yang memakai ->role tetap jalan.
     */
    public function role()
    {
        return $this->hasOneThrough(
            Role::class,
            UserRole::class,
            'user_id',      // FK di user_roles -> users.id
            'id',           // FK di roles -> user_roles.role_id
            'id',           // local key di users
            'role_id'       // local key di user_roles
        )->where('user_roles.is_primary', true);
    }

    /**
     * SEMUA role user (multi-role). Sumber kebenaran permission.
     */
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'user_roles')
            ->withPivot('is_primary')
            ->withTimestamps();
    }

    /**
     * Role yang ditandai primary pada pivot.
     */
    public function primaryRole()
    {
        return $this->roles()->wherePivot('is_primary', true);
    }

    /**
     * Union semua permission (route_name) dari seluruh role user.
     * Dipakai middleware & Inertia share agar multi-role aman.
     *
     * @return array<int, string>
     */
    public function allPermissions(): array
    {
        $roleIds = $this->roles()->pluck('roles.id');

        if ($roleIds->isEmpty()) {
            return [];
        }

        return RolePermission::whereIn('role_id', $roleIds)
            ->with('route:id,route_name')
            ->get()
            ->pluck('route.route_name')
            ->filter()
            ->unique()
            ->values()
            ->toArray();
    }

    /**
     * Cek apakah user (via salah satu role-nya) punya akses ke route name.
     */
    public function hasPermissionTo(?string $routeName): bool
    {
        if (empty($routeName)) {
            return false;
        }

        $roleIds = $this->roles()->pluck('roles.id');

        if ($roleIds->isEmpty()) {
            return false;
        }

        return RolePermission::whereIn('role_id', $roleIds)
            ->whereHas('route', function ($query) use ($routeName) {
                $query->where('route_name', $routeName);
            })
            ->exists();
    }

    public function personalInformation()
    {
        return $this->hasOne(PersonalInformation::class, 'nik', 'nik');
    }

    public function employeeInformation()
    {
        return $this->hasOne(EmployeeInformation::class, 'nik', 'nik');
    }

    /**
     * Semua penempatan kerja karyawan (multi-perusahaan / multi-jabatan).
     * employeeInformation() di atas tetap penempatan UTAMA (is_primary).
     */
    public function employments()
    {
        return $this->hasMany(EmployeeEmployment::class, 'nik', 'nik');
    }

    public function primaryEmployment()
    {
        return $this->hasOne(EmployeeEmployment::class, 'nik', 'nik')->where('is_primary', true);
    }

    public function contractInformation()
    {
        return $this->hasMany(ContractInformation::class, 'nik', 'nik');
    }

    public function notifications()
    {
        return $this->hasMany(NotificationRecipient::class);
    }

    public function unreadNotifications()
    {
        return $this->hasMany(NotificationRecipient::class)->where('is_read', false);
    }
}
