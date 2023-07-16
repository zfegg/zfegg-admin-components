<?php

namespace Zfegg\Admin\BaseProject\Entity;

use Doctrine\ORM\Mapping as ORM;
use Zfegg\Admin\Admin\Entity\Role;
use Zfegg\Admin\Admin\Entity\User;

trait MemberEntityTrait
{

    /**
     *
     * @ORM\Column(name="id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    #[ORM\Column(type: "integer")]
    #[ORM\Id]
    #[ORM\GeneratedValue("IDENTITY")]
    private int $id;

    /**
     *
     * @ORM\ManyToOne(targetEntity="ProjectInterface")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="project_id", referencedColumnName="id", nullable=false)
     * })
     */
    #[ORM\ManyToOne(ProjectInterface::class)]
    #[ORM\JoinColumn(name: "project_id", referencedColumnName: "id", nullable: false)]
    private ProjectInterface $project;

    /**
     *
     * @ORM\ManyToOne(targetEntity="zfegg\Admin\Admin\Entity\User")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="member_id", referencedColumnName="id", nullable=false)
     * })
     */
    #[ORM\ManyToOne(User::class)]
    #[ORM\JoinColumn(name: "member_id", referencedColumnName: "id", nullable: false)]
    private User $member;

    /**
     *
     * @ORM\ManyToOne(targetEntity="zfegg\Admin\Admin\Entity\Role")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="role_id", referencedColumnName="id", nullable=false)
     * })
     */
    #[ORM\ManyToOne(Role::class)]
    #[ORM\JoinColumn(name: "role_id", referencedColumnName: "id", nullable: false)]
    private Role $role;

    /**
     * @ORM\Column(nullable=true)
     */
    #[ORM\Column(nullable: true)]
    private ?\DateTime $expired = null;

    public function getId(): int
    {
        return $this->id;
    }

    public function setId(int $id): void
    {
        $this->id = $id;
    }

    public function getProject(): ProjectInterface
    {
        return $this->project;
    }

    public function setProject(ProjectInterface $project): void
    {
        $this->project = $project;
    }

    public function getMember(): User
    {
        return $this->member;
    }

    public function setMember(User $member): void
    {
        $this->member = $member;
    }

    public function getRole(): Role
    {
        return $this->role;
    }

    public function setRole(Role $role): void
    {
        $this->role = $role;
    }
}
