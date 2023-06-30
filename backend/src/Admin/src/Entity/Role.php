<?php

namespace Zfegg\Admin\Admin\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * AdminRoles
 *
 * @ORM\Table(
 *     name="admin_roles",
 *     uniqueConstraints={@ORM\UniqueConstraint(name="admin_roles_name_un", columns={"name"})}
 * )
 * @ORM\Entity
 */
#[ORM\Table('admin_roles')]
#[ORM\UniqueConstraint('admin_roles_name_un', ['name'])]
#[ORM\Entity]
class Role
{
    /**
     *
     * @ORM\Column(name="id", type="integer", nullable=false, options={"unsigned"=true})
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    #[ORM\Column("id", "integer", options: ["unsigned" => true])]
    #[ORM\Id]
    #[ORM\GeneratedValue("IDENTITY")]
    private int $id;

    /**
     *
     * @ORM\Column(name="name", type="string", length=100, nullable=false, options={"comment"="角色名称"})
     */
    #[ORM\Column("name", "string", 255, options: ["comment" => "角色名称"])]
    private string $name;

    /**
     *
     * @ORM\Column(name="description", type="string", length=255, nullable=true, options={"comment"="角色描述"})
     */
    #[ORM\Column("description", "string", 255, nullable: true, options: ["comment" => "角色描述"])]
    private ?string $description = null;

    /**
     * @ORM\OneToMany(targetEntity="RoleMenu", mappedBy="role",cascade={"persist", "remove"}, orphanRemoval=true)
     * @var Collection<string>
     */
    #[ORM\OneToMany("role", RoleMenu::class, ["persist", "remove"], orphanRemoval: true)]
    private Collection $menus;

    /**
     *
     * @ORM\ManyToMany(targetEntity="User", mappedBy="roles")
     * @var Collection<User>
     */
    #[ORM\ManyToMany(User::class, "roles")]
    private Collection $users;

    public function __construct(?string $name = null)
    {
        if (is_string($name)) {
            $this->setName($name);
        }
        $this->menus = new ArrayCollection();
        $this->users = new ArrayCollection();
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

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): void
    {
        $this->description = $description;
    }

    public function getMenus(): Collection
    {
        return $this->menus;
    }

    public function setMenus(Collection $menus): void
    {
        $this->menus = $menus;
    }

    public function hasMenu(string $menu): bool
    {
        return $this->menus->exists(function ($idx, RoleMenu $rp) use ($menu) {
            return $rp->getMenu() == $menu;
        });
    }

    /**
     * @return Collection<User>
     */
    public function getUsers(): Collection
    {
        return $this->users;
    }

    /**
     * @param Collection<User> $users
     */
    public function setUsers(Collection $users): void
    {
        $this->users = $users;
    }

    public function addUser(User $user): void
    {
        $this->users->add($user);
        $user->getRoles()->add($this);
    }

    public function removeUser(User $user): void
    {
        $this->users->removeElement($user);
        $user->getRoles()->removeElement($this);
    }

    public function __toString(): string
    {
        return $this->name;
    }
}
