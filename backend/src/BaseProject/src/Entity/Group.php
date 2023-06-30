<?php


namespace Zfegg\Admin\BaseProject\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Zfegg\Admin\Admin\Entity\User;

#[ORM\Table("project_groups")]
#[ORM\Entity()]
#[ORM\UniqueConstraint("project_groups_un", columns: ["project_id", "name"])]
class Group
{
    use ProjectAwareTrait;

    #[ORM\Column(type: "integer")]
    #[ORM\Id]
    #[ORM\GeneratedValue("IDENTITY")]
    private int $id;

    #[ORM\Column(type: "string", length: 100)]
    private string $name;

    #[ORM\ManyToMany(User::class)]
    #[ORM\JoinTable("project_users_groups")]
    #[ORM\JoinColumn('group_id', 'id')]
    #[ORM\InverseJoinColumn('user_id', 'id')]
    private Collection $members;

    public function __construct()
    {
        $this->members = new ArrayCollection();
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function setId(int $id): void
    {
        $this->id = $id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): void
    {
        $this->name = $name;
    }

    /**
     * @return Collection<User>|User[]
     */
    public function getMembers(): Collection
    {
        return $this->members;
    }

    public function setMembers(Collection $members): void
    {
        $this->members = $members;
    }
}
