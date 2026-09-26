<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Reservation extends Model
{
    use HasFactory, SoftDeletes;

    public const STATUS_PENDING = 'pendiente';

    public const STATUS_CONFIRMED = 'confirmada';

    public const STATUS_CHECK_IN = 'check-in';

    public const STATUS_IN_HOUSE = 'en hospedaje';

    public const STATUS_COMPLETED = 'finalizada';

    public const STATUS_CANCELLED = 'cancelada';

    public const STATUSES = [
        self::STATUS_PENDING,
        self::STATUS_CONFIRMED,
        self::STATUS_CHECK_IN,
        self::STATUS_IN_HOUSE,
        self::STATUS_COMPLETED,
        self::STATUS_CANCELLED,
    ];

    public const CANCELLABLE_STATUSES = [
        self::STATUS_PENDING,
        self::STATUS_CONFIRMED,
    ];

    protected $fillable = [
        'guest_id',
        'room_id',
        'check_in_date',
        'check_out_date',
        'number_of_people',
        'price_per_person',
        'number_of_nights',
        'total',
        'status',
        'observations',
    ];

    protected $casts = [
        'check_in_date' => 'date',
        'check_out_date' => 'date',
        'number_of_people' => 'integer',
        'price_per_person' => 'decimal:2',
        'number_of_nights' => 'integer',
        'total' => 'decimal:2',
    ];

    public function guest(): BelongsTo
    {
        return $this->belongsTo(Guest::class);
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }

    public function stay(): HasOne
    {
        return $this->hasOne(Stay::class);
    }

    public function isCancellable(): bool
    {
        return in_array($this->status, self::CANCELLABLE_STATUSES, true);
    }
}
