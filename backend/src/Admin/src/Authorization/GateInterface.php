<?php

namespace Zfegg\Admin\Admin\Authorization;

use Mezzio\Authentication\UserInterface;

interface GateInterface
{
    public function isGranted(UserInterface $user, string $permission): bool;

    public function isGrantedByRole(string $role, string $permission): bool;

    public function userMenus(int $userId): array;
}
