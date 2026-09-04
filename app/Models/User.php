<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable(['nik', 'name', 'email', 'role_id', 'password', 'is_reall_pass', 'phone', 'is_active'])]
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

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function personalInformation()
    {
        return $this->hasOne(PersonalInformation::class, 'nik', 'nik');
    }

    public function employeeInformation()
    {
        return $this->hasOne(EmployeeInformation::class, 'nik', 'nik');
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
