<?php

namespace Zfegg\Admin\BaseProject\Entity;

use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;

/**
 * Project
 *
 * @ORM\Table(
 *     name="project_projects",
 *     uniqueConstraints={
 *       @ORM\UniqueConstraint(name="project_projects_code_UN", columns={"code"})
 *     }
 * )
 * @ORM\Entity
 * @Gedmo\SoftDeleteable()
 */
#[ORM\Table("project_projects")]
#[ORM\Entity]
#[ORM\UniqueConstraint("project_projects_code_UN", columns: ["code"])]
#[Gedmo\SoftDeleteable]
class Project implements ProjectInterface
{
    use BaseProjectEntityTrait;

    public static function genSecret(): string
    {
        return md5(uniqid());
    }
}
