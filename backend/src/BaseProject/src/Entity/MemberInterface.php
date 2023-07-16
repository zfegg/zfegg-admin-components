<?php

namespace Zfegg\Admin\BaseProject\Entity;

use Zfegg\Admin\Admin\Entity\Role;
use Zfegg\Admin\Admin\Entity\User;

interface MemberInterface
{

    public function getId(): int;

    public function setId(int $id): void;

    public function getProject(): ProjectInterface;

    public function setProject(ProjectInterface $project): void;

    public function getMember(): User;

    public function setMember(User $member): void;

    public function getRole(): Role;

    public function setRole(Role $role): void;
}
