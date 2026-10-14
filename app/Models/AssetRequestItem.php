<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AssetRequestItem extends Model
{
    protected $fillable = [
        'asset_request_id', 'asset_category_id', 'item_name', 'qty',
        'unit', 'estimated_price', 'notes',
    ];

    protected $casts = [
        'estimated_price' => 'decimal:2',
    ];

    public function request()
    {
        return $this->belongsTo(AssetRequest::class, 'asset_request_id');
    }

    public function category()
    {
        return $this->belongsTo(AssetCategory::class, 'asset_category_id');
    }
}
