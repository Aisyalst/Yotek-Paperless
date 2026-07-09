<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RolePermission extends Model
{
    protected $fillable = ['role_id', 'route_id'];

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function route()
    {
        return $this->belongsTo(Route::class);
    }
}
