<?php

namespace Zfegg\Admin\BaseProject\Entity;

use Doctrine\ORM\Mapping as ORM;
use Gedmo\SoftDeleteable\Traits\SoftDeleteableEntity;
use Gedmo\Timestampable\Traits\TimestampableEntity;

trait BaseProjectEntityTrait
{
    use TimestampableEntity;
    use SoftDeleteableEntity;

    #[ORM\Column(type: "integer")]
    #[ORM\Id]
    #[ORM\GeneratedValue("IDENTITY")]
    private int $id;

    #[ORM\Column(type: "string", length: 100)]
    private string $code;

    #[ORM\Column(type: "string", length: 100)]
    private string $name;

    #[ORM\Column(type: "string", length: 255, nullable: true)]
    private ?string $description;

    #[ORM\Column(type: "json", nullable: true)]
    private ?array $config = null;

    #[ORM\Column(type: "string", length: 1000, nullable: true)]
    private ?string $avatar;

    #[ORM\Column("status", "smallint")]
    private int $status = 0;

    #[ORM\Column("secret", "string", length: 32)]
    private string $secret;

    public function __construct()
    {
        $this->createdAt = new \DateTime();
        $this->updatedAt = new \DateTime();
        $this->secret = Project::genSecret();
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function setId(int $id): void
    {
        $this->id = $id;
    }

    public function getCode(): string
    {
        return $this->code;
    }

    public function setCode(string $code): void
    {
        $this->code = $code;
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

    /**
     * @return array|null
     */
    public function getConfig(): ?array
    {
        return $this->config;
    }

    /**
     * @param array|null $config
     */
    public function setConfig(?array $config): void
    {
        $this->config = $config;
    }

    public function getAvatar(): ?string
    {
        return $this->avatar;
    }

    public function setAvatar(?string $avatar): void
    {
        $this->avatar = $avatar;
    }

    /**
     */
    public function getSecret(): string
    {
        return $this->secret;
    }

    /**
     */
    public function setSecret(string $secret): void
    {
        $this->secret = $secret;
    }

    /**
     */
    public function getStatus(): int
    {
        return $this->status;
    }

    /**
     */
    public function setStatus(int $status): void
    {
        $this->status = $status;
    }
}
