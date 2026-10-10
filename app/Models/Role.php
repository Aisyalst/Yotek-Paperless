<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    protected $fillable = ['name', 'devision_id'];

    public function users()
    {
        return $this->belongsToMany(User::class, 'user_roles')
            ->withPivot('is_primary')
            ->withTimestamps();
    }

    public function permissions()
    {
        return $this->hasMany(RolePermission::class);
    }

    public function devision()
    {
        return $this->belongsTo(Devision::class);
    }
}
