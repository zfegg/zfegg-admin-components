<?php

namespace Zfegg\Admin\Admin\Controller;

use Doctrine\ORM\EntityManagerInterface;
use Zfegg\Admin\Admin\Entity\Role;
use Zfegg\Admin\Admin\Entity\User;
use Zfegg\ApiRestfulHandler\ResourceInterface;
use Zfegg\ApiRestfulHandler\ResourceNotAllowedTrait;

class RoleUsersResource implements ResourceInterface
{
    use ResourceNotAllowedTrait;

    private EntityManagerInterface $em;
    private ResourceInterface $parent;

    public function __construct(EntityManagerInterface $em, ResourceInterface $parent)
    {
        $this->em = $em;
        $this->parent = $parent;
    }

    /** @inheritdoc  */
    public function create(object|array $data, array $context = []): object|array
    {
        $user = $this->em->find(User::class, $data['id']);
        $user->addRole($this->em->getReference(Role::class, $context['role_id']));
        $this->em->flush();

        return $user;
    }

    /** @inheritdoc  */
    public function delete(int|string $id, array $context = []): void
    {
        $role = $this->em->getReference(Role::class, $context['role_id']);
        $role->removeUser($this->em->getReference(User::class, $id));
        $this->em->flush();
    }

    /** @inheritdoc  */
    public function get(int|string $id, array $context = []): array|object|null
    {
        $query = $this->em->createQuery('SELECT u from YcAdmin:User u JOIN u.roles r WHERE r = ?0 and u= ?1');
        $query->setParameters([$context['role_id'], $id]);
        return $query->getOneOrNullResult();
    }

    public function getParent(): ResourceInterface
    {
        return $this->parent;
    }

    public function getParentContextKey(): ?string
    {
        return 'role_id';
    }
}
