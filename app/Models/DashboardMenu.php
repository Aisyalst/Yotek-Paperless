<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DashboardMenu extends Model
{
    protected $fillable = ['name', 'icon', 'parent_id', 'section', 'type', 'route_id'];

    public function route()
    {
        return $this->belongsTo(Route::class);
    }

    public function parent()
    {
        return $this->belongsTo(DashboardMenu::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(DashboardMenu::class, 'parent_id');
    }
}
