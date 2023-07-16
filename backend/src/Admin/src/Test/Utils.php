<?php


namespace Zfegg\Admin\Admin\Test;

use Mezzio\Authentication\UserInterface;

class Utils
{

    public static function initSession(
        int $id = 1,
        array $user = [
            'email' => 'test@test.com',
            'real_name' => '测试',
            'admin' => false,
        ]
    ): array {
        return $_SESSION[UserInterface::class] = [
            'identifier' => $id,
            'user' => $user,
        ];
    }
}
