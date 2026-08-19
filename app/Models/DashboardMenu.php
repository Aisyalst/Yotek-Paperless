<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DashboardMenu extends Model
{
    protected $fillable = ['name', 'icon', 'parent_id', 'section_id', 'type', 'route_id'];

    public function section()
    {
        return $this->belongsTo(DashboardMenuSection::class, 'section_id');
    }

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
