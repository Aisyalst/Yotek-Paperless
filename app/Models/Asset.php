<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Asset extends Model
{
    protected $fillable = [
        'asset_code', 'qr_token', 'name', 'asset_category_id', 'company_id',
        'brand', 'model', 'serial_number', 'purchase_date', 'purchase_price',
        'supplier', 'condition', 'status', 'location', 'photo', 'notes',
    ];

    protected $casts = [
        'purchase_date' => 'date:Y-m-d',
        'purchase_price' => 'decimal:2',
    ];

    public function category()
    {
        return $this->belongsTo(AssetCategory::class, 'asset_category_id');
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    /** Semua riwayat serah-terima barang. */
    public function assignments()
    {
        return $this->hasMany(AssetAssignment::class)->orderBy('assigned_date', 'desc');
    }

    /** Pemegang SAAT INI (status Aktif). */
    public function currentAssignment()
    {
        return $this->hasOne(AssetAssignment::class)->where('status', 'Aktif')->latestOfMany();
    }

    /** Nama pemegang saat ini (untuk ditampilkan di tabel). */
    public function getHolderNameAttribute(): ?string
    {
        return $this->currentAssignment?->employee_name;
    }

    public function services()
    {
        return $this->hasMany(AssetService::class)->orderBy('service_date', 'desc');
    }
}
