<?php


namespace Zfegg\Admin\BaseProject\Entity;

use Zfegg\Admin\BaseProject\Repository\MemberRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Table("project_member_roles")]
#[ORM\Entity(MemberRepository::class)]
#[ORM\UniqueConstraint("project_member_roles_un", columns: ["project_id", "member_id", "role_id"])]
class Member implements MemberInterface
{
    use MemberEntityTrait;
}
