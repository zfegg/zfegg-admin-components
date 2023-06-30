<?php

namespace Book\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 *
 * @ORM\Table(
 *     name="books",
 *     uniqueConstraints={@ORM\UniqueConstraint(name="books_un_name", columns={"name"})},
 * )
 * @ORM\Entity
 */
#[ORM\Table('books')]
#[ORM\UniqueConstraint('books_un_name', ['name'])]
#[ORM\Entity]
class Book
{
    const STATUS_SOLD_OUT = 2;
    const STATUS_SOLD = 1;

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
     * @ORM\Column(name="name", type="string", length=32, nullable=false)
     */
    #[ORM\Column("name", "string")]
    private string $name;

    /**
     *
     * @ORM\Column(name="barcode", type="integer", length=20, nullable=false)
     */
    #[ORM\Column("barcode", "integer")]
    private int $barcode;

    /**
     *
     * @ORM\Column(name="created_at", type="datetime")
     */
    #[ORM\Column("created_at", "datetime")]
    private \DateTime $createdAt;

    /**
     *
     * @ORM\Column(name="status", type="integer")
     */
    #[ORM\Column("status", "integer")]
    private int $status = 1;

    /**
     *
     * @ORM\ManyToOne(targetEntity="Group")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="group_id", referencedColumnName="id")
     * })
     */
    #[ORM\ManyToOne(targetEntity: Group::class)]
    #[ORM\JoinColumn(name: "group_id", referencedColumnName: "id")]
    private Group $group;

    public function __construct()
    {
        $this->createdAt = new \DateTime();
    }

    /**
     */
    public function getId(): int
    {
        return $this->id;
    }

    /**
     */
    public function setId(int $id): void
    {
        $this->id = $id;
    }

    /**
     */
    public function getName(): string
    {
        return $this->name;
    }

    /**
     */
    public function setName(string $name): void
    {
        $this->name = $name;
    }

    /**
     */
    public function getBarcode(): int
    {
        return $this->barcode;
    }

    /**
     */
    public function setBarcode(int $barcode): void
    {
        $this->barcode = $barcode;
    }

    /**
     */
    public function getCreatedAt(): \DateTime
    {
        return $this->createdAt;
    }

    /**
     */
    public function setCreatedAt(\DateTime $createdAt): void
    {
        $this->createdAt = $createdAt;
    }

    /**
     */
    public function getGroup(): Group
    {
        return $this->group;
    }

    /**
     */
    public function setGroup(Group $group): void
    {
        $this->group = $group;
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
