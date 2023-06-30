<?php

namespace Zfegg\Admin\BaseProject\Entity;

use Doctrine\ORM\Mapping as ORM;

trait ProjectAwareTrait
{
    #[ORM\ManyToOne(targetEntity: ProjectInterface::class)]
    #[ORM\JoinColumn(name: "project_id", referencedColumnName: "id")]
    private ProjectInterface $project;

    public function getProject(): ProjectInterface
    {
        return $this->project;
    }

    public function setProject(ProjectInterface $project): void
    {
        $this->project = $project;
    }
}
