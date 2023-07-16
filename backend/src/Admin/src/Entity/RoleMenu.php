<?php


namespace Zfegg\Admin\Admin\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Normalizer\DenormalizableInterface;
use Symfony\Component\Serializer\Normalizer\DenormalizerInterface;
use Symfony\Component\Serializer\Normalizer\NormalizableInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

/**
 * RoleMenu
 *
 * @ORM\Table(
 *     name="admin_roles_menus",
 *     uniqueConstraints={@ORM\UniqueConstraint(
 *         name="admin_role_menus_name_un",
 *         columns={"role_id", "menu"})
 *     }
 * )
 * @ORM\Entity
 */
#[ORM\Table('admin_roles_menus')]
#[ORM\UniqueConstraint('admin_role_menus_name_un', ['role_id', 'menu'])]
#[ORM\Entity]
class RoleMenu implements NormalizableInterface, DenormalizableInterface
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
     * @ORM\ManyToOne(targetEntity="Role",inversedBy="menus")
     * @ORM\JoinColumn(name="role_id", referencedColumnName="id")
     */
    #[ORM\ManyToOne(Role::class, inversedBy: "menus")]
    #[ORM\JoinColumn('role_id', referencedColumnName: "id")]
    private Role $role;

    /**
     * @ORM\Column()
     */
    #[ORM\Column]
    private string $menu;

    public function __construct(?Role $role = null, ?string $menu = null)
    {
        $role && $this->setRole($role);
        $menu && $this->setMenu($menu);
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function setId(int $id): void
    {
        $this->id = $id;
    }

    public function getRole(): Role
    {
        return $this->role;
    }

    public function setRole(Role $role): void
    {
        $this->role = $role;
    }

    public function getMenu(): string
    {
        return $this->menu;
    }

    public function setMenu(string $menu): void
    {
        $this->menu = $menu;
    }

    public function __toString(): string
    {
        return $this->menu;
    }

    public function normalize(
        NormalizerInterface $normalizer,
        string $format = null,
        array $context = []
    ): array|string|int|float|bool {
        return $this->__toString();
    }

    public function denormalize(
        DenormalizerInterface $denormalizer,
        array|string|int|float|bool $data,
        string $format = null,
        array $context = []
    ): void {
    }
}
