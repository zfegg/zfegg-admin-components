<?php

namespace Zfegg\Admin\Admin\Entity;

use DateTime;
use Doctrine\ORM\Mapping as ORM;

/**
 * AdminUserAuthBindings
 *
 * @ORM\Table(
 *     name="admin_user_auth_bindings",
 *     uniqueConstraints={
 *        @ORM\UniqueConstraint(name="openid", columns={"openid"})
 *     },
 *     indexes={@ORM\Index(name="user_id", columns={"user_id"})}
 * )
 * @ORM\Entity
 */
#[ORM\Table('admin_user_auth_bindings')]
#[ORM\UniqueConstraint('openid', ['openid'])]
#[ORM\Entity()]
#[ORM\Index(['user_id'], name: 'user_id')]
class UserAuthBinding
{
    use UserAwareTrait;

    /**
     *
     * @ORM\Column(name="id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    #[ORM\Column("id", "integer", options: ["unsigned" => true])]
    #[ORM\Id]
    #[ORM\GeneratedValue("IDENTITY")]
    private int $id;

    /**
     *
     * @ORM\Column(name="provider", type="string", length=255, nullable=false)
     */
    #[ORM\Column("provider", "string", 255)]
    private string $provider;

    /**
     *
     * @ORM\Column(name="openid", type="string", length=255, nullable=false)
     */
    #[ORM\Column("openid", "string", 255)]
    private string $openid;

    /**
     * @var array|null
     *
     * @ORM\Column(name="info", type="json", nullable=true)
     */
    #[ORM\Column("info", "json", nullable: true)]
    private ?array $info;

    /**
     * @ORM\Column(name="created_at", type="datetime", nullable=false, options={"default"="CURRENT_TIMESTAMP"})
     */
    #[ORM\Column("created_at", "datetime")]
    private DateTime $createdAt;


    public function __construct()
    {
        $this->createdAt = new DateTime();
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function setId(int $id): void
    {
        $this->id = $id;
    }

    public function getProvider(): string
    {
        return $this->provider;
    }

    public function setProvider(string $provider): void
    {
        $this->provider = $provider;
    }

    public function getOpenid(): string
    {
        return $this->openid;
    }

    public function setOpenid(string $openid): void
    {
        $this->openid = $openid;
    }

    public function getInfo(): ?array
    {
        return $this->info;
    }

    public function setInfo(?array $info): void
    {
        $this->info = $info;
    }

    public function getCreatedAt(): DateTime
    {
        return $this->createdAt;
    }

    public function setCreatedAt(DateTime $createdAt): void
    {
        $this->createdAt = $createdAt;
    }
}
