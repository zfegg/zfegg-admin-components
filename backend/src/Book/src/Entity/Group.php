<?php


namespace Book\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 *
 * @ORM\Table(
 *     name="book_groups",
 *     uniqueConstraints={@ORM\UniqueConstraint(name="book_groups_un_name", columns={"name"})},
 * )
 * @ORM\Entity
 */
#[ORM\Table('book_groups')]
#[ORM\UniqueConstraint('book_groups_un_name', ['name'])]
#[ORM\Entity]
class Group
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
     * @ORM\Column(name="name", type="string", length=32)
     */
    #[ORM\Column("name", "string")]
    private string $name;

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
}
