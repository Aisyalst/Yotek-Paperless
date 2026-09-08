<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuickAccess extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'logo', 'url', 'sort_order'];
}
