<?php

namespace App\Models\Cart;

use Illuminate\Database\Eloquent\Model;

class CartModel extends Model
{
    protected $table = 'cart';

    protected $fillable = [
        'cart_number', 
        'cart_items',
        'status',
    ];

    protected $casts = [
        'cart_items' => 'array',
    ];
}
