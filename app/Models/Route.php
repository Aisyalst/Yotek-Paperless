<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Route extends Model
{
    protected $fillable = ['name', 'route_name'];

    public function permissions()
    {
        return $this->hasMany(RolePermission::class);
    }
}
