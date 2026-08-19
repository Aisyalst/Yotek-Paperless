<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DashboardMenuSection extends Model
{
    protected $fillable = ['name', 'order'];

    public function menus()
    {
        return $this->hasMany(DashboardMenu::class, 'section_id')->orderBy('position');
    }
}
