<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class NotificationService
{
    /**
     * Send a notification
     *
     * @param array $data Expected keys: title, body, type, target_type, target_value, created_by
     * @return Notification
     */
    public function send(array $data): Notification
    {
        $notification = Notification::create([
            'title' => $data['title'],
            'body' => $data['body'],
            'type' => $data['type'] ?? null,
            'url' => $data['url'] ?? null,
            'target_type' => $data['target_type'],
            'target_value' => $data['target_value'] ?? null,
            'created_by' => $data['created_by'] ?? null,
        ]);

        $userIds = $this->resolveTargetUserIds($data['target_type'], $data['target_value'] ?? null);

        if (empty($userIds)) {
            return $notification;
        }

        $now = now();
        $inserts = collect($userIds)->map(function ($userId) use ($notification, $now) {
            return [
                'notification_id' => $notification->id,
                'user_id' => $userId,
                'is_read' => false,
                'read_at' => null,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        });

        // Chunk inserts to avoid query limits
        $inserts->chunk(500)->each(function ($chunk) {
            DB::table('notification_recipients')->insert($chunk->toArray());
        });

        return $notification;
    }

    private function resolveTargetUserIds(string $targetType, ?string $targetValue): array
    {
        if ($targetType === 'user') {
            return [$targetValue];
        }

        if ($targetType === 'role') {
            return User::whereHas('role', function ($query) use ($targetValue) {
                $query->where('name', $targetValue);
            })->pluck('id')->toArray();
        }

        if ($targetType === 'all') {
            return User::pluck('id')->toArray();
        }

        return [];
    }
}
