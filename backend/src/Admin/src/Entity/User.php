<?php

namespace Zfegg\Admin\Admin\Entity;

use DateTime;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Zfegg\Admin\Admin\Repository\Users;

/**
 * AdminUsers
 *
 * @ORM\Table(
 *     name="admin_users",
 *     uniqueConstraints={@ORM\UniqueConstraint(name="email", columns={"email"})}
 * )
 * @ORM\Entity(
 *     repositoryClass="zfegg\Admin\Admin\Repository\Users"
 * )
 */
#[ORM\Table('admin_users')]
#[ORM\UniqueConstraint('email', ['email'])]
#[ORM\Entity(Users::class)]
class User implements UserInterface
{
    /**
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    #[ORM\Column("id", "integer", options: ["unsigned" => true])]
    #[ORM\Id]
    #[ORM\GeneratedValue("IDENTITY")]
    private int $id;

    /**
     *
     * @ORM\Column(name="email", type="string", length=255, nullable=true)
     */
    #[ORM\Column("email", "string", 255, nullable: true)]
    private ?string $email = null;

    /**
     *
     * @ORM\Column(name="password", type="string", length=255, nullable=true)
     */
    #[ORM\Column("password", "string", 255, nullable: true)]
    private ?string $password = null;

    /**
     *
     * @ORM\Column(name="real_name", type="string", length=255, nullable=false)
     */
    #[ORM\Column("real_name", "string", 255)]
    private string $realName;

    /**
     *
     * @ORM\Column(name="created_at", type="datetime", nullable=false, options={"default"="CURRENT_TIMESTAMP"})
     */
    #[ORM\Column("created_at", "datetime")]
    private DateTime $createdAt;

    /**
     *
     * @ORM\Column(name="updated_at", type="datetime", nullable=true, options={"default"="CURRENT_TIMESTAMP"})
     */
    #[ORM\Column("updated_at", "datetime", nullable: true)]
    private ?DateTime $updatedAt;

    /**
     *
     * @ORM\Column(name="status", type="smallint", nullable=false, options={"default"="1","comment"="1已删除; 0未删除"})
     */
    #[ORM\Column("status", "smallint", options: ["default" => 1, "comment" => "1已删除; 0未删除"])]
    private int $status = self::STATUS_ENABLED;

    /**
     *
     * @ORM\Column(name="admin", type="boolean", nullable=false, options={"default"=0})
     */
    #[ORM\Column("admin", "boolean", options: ["default" => 0])]
    private bool $admin = false;

    /**
     * @ORM\Column(name="avatar", type="string", length=255, nullable=true)
     */
    #[ORM\Column("avatar", "string", length: 255, nullable: true)]
    private ?string $avatar = null;

    /**
     * @ORM\Column(name="config", type="json", nullable=true)
     */
    #[ORM\Column("config", "json", nullable: true)]
    private ?array $config = null;

    /**
     * @ORM\OneToMany(targetEntity="zfegg\Admin\Admin\Entity\UserAuthBinding", mappedBy="user")
     */
    #[ORM\OneToMany("user", UserAuthBinding::class, cascade: ["persist", "remove"], orphanRemoval: true)]
    private Collection $bindings;


    /**
     * @ORM\ManyToMany(targetEntity="Role", inversedBy="users")
     * @ORM\JoinTable(
     *     name="admin_users_roles",
     *     joinColumns={@ORM\JoinColumn(name="user_id", referencedColumnName="id")},
     *     inverseJoinColumns={@ORM\JoinColumn(name="role_id", referencedColumnName="id")}
     * )
     * @var Collection<Role>
     */
    #[ORM\ManyToMany(targetEntity: Role::class, inversedBy: "users")]
    #[ORM\JoinTable('admin_users_roles')]
    #[ORM\JoinColumn('user_id', referencedColumnName: "id")]
    #[ORM\InverseJoinColumn('role_id', referencedColumnName: "id")]
    private Collection $roles;

    public function __construct()
    {
        $this->createdAt = new \DateTime();
        $this->bindings = new ArrayCollection();
        $this->roles = new ArrayCollection();
    }

    /**
     * @return Collection<Role>
     */
    public function getRoles(): Collection
    {
        return $this->roles;
    }

    /**
     * @param Collection<Role> $roles
     */
    public function setRoles(Collection $roles): void
    {
        $this->roles = $roles;
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function setId(int $id): void
    {
        $this->id = $id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(?string $email): void
    {
        $this->email = $email;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(?string $password): void
    {
        $this->password = $password;
    }

    public function getRealName(): ?string
    {
        return $this->realName;
    }

    public function setRealName(string $realName): void
    {
        $this->realName = $realName;
    }

    public function getCreatedAt(): \DateTime
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTime $createdAt): void
    {
        $this->createdAt = $createdAt;
    }

    public function getUpdatedAt(): ?\DateTime
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(?\DateTime $updatedAt): void
    {
        $this->updatedAt = $updatedAt;
    }

    public function getStatus(): int
    {
        return $this->status;
    }

    public function setStatus(int $status): void
    {
        $this->status = $status;
    }

    public function isAdmin(): bool
    {
        return $this->admin;
    }

    public function setAdmin(bool $admin): void
    {
        $this->admin = $admin;
    }

    public function setRawPassword(string $password): void
    {
        $this->setPassword(password_hash($password, PASSWORD_DEFAULT));
    }

    public function isValidPassword(string $password): bool
    {
        return password_verify($password, $this->password);
    }

    /**
     */
    public function getAvatar(): ?string
    {
        return $this->avatar;
    }

    /**
     */
    public function setAvatar(?string $avatar): void
    {
        $this->avatar = $avatar;
    }

    /**
     */
    public function getBindings(): Collection
    {
        return $this->bindings;
    }

    /**
     */
    public function setBindings(Collection $bindings): void
    {
        $this->bindings = $bindings;
    }

    public function getIdentity(): string
    {
        return $this->id;
    }

    /**
     * @inheritdoc
     */
    public function getDetail(string $name, $default = null)
    {
        return get_object_vars($this)[$name] ?? $default;
    }

    public function getDetails(): array
    {
        return get_object_vars($this);
    }

    public function addRole(Role $role): void
    {
        $this->roles->add($role);
        $role->getUsers()->add($this);
    }

    public function removeRole(Role $role): void
    {
        $this->roles->removeElement($role);
        $role->getUsers()->removeElement($this);
    }


    public function addBinding(UserAuthBinding $binding): void
    {
        $this->bindings->add($binding);
        $binding->setUser($this);
    }

    public function removeBinding(UserAuthBinding $binding): void
    {
        $this->bindings->removeElement($binding);
    }

    public function isDisabled(): bool
    {
        return $this->status == self::STATUS_DISABLED;
    }

    public function isEnabled(): bool
    {
        return $this->status == self::STATUS_ENABLED;
    }

    public function isReview(): bool
    {
        return $this->status == self::STATUS_REVIEW;
    }

    public function getConfig(): ?array
    {
        return $this->config;
    }

    public function setConfig(?array $config): void
    {
        $this->config = $config;
    }
}
