<?php

namespace Zfegg\Admin\Admin\Entity;

use Doctrine\ORM\Mapping as ORM;

trait UserAwareTrait
{
    /**
     *
     * @ORM\ManyToOne(targetEntity="User")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="user_id", referencedColumnName="id")
     * })
     */
    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn('user_id', referencedColumnName: "id")]
    private User $user;

    public function getUser(): User
    {
        return $this->user;
    }

    public function setUser(User $user): void
    {
        $this->user = $user;
    }
}
