<?php


namespace Zfegg\Admin\Admin\Controller;

use Doctrine\ORM\EntityManagerInterface;
use Zfegg\Admin\Admin\Entity\Role;
use Zfegg\Admin\Admin\Entity\RoleMenu;
use Zfegg\ApiRestfulHandler\ResourceInterface;
use Zfegg\ApiRestfulHandler\ResourceNotAllowedTrait;

class RoleResource implements ResourceInterface
{
    use ResourceNotAllowedTrait;

    private ResourceInterface $resource;
    private EntityManagerInterface $em;

    public function __construct(
        ResourceInterface $resource,
        EntityManagerInterface $em
    ) {
        $this->resource = $resource;
        $this->em = $em;
    }

    /** @inheritdoc  */
    public function getList(array $context = []): iterable
    {
        /** @var Role[] $result */
        $result = $this->resource->getList($context);
        foreach ($result as $role) {
            yield $this->resetRow($role);
        }
    }

    /** @inheritdoc  */
    public function create(object|array $data, array $context = []): object|array
    {
        $menus = $data['menus'] ?? [];
        unset($data['menus']);

        /** @var Role $role */
        $role = $this->resource->create($data, $context);

        $this->resetMenus($role, $menus);

        return $this->resetRow($role);
    }

    /** @inheritdoc  */
    public function update(int|string $id, object|array $data, array $context = []): object|array
    {
        return $this->patch($id, $data, $context);
    }

    /** @inheritdoc  */
    public function patch(int|string $id, object|array $data, array $context = []): object|array
    {
        if (isset($data['menus'])) {
            $menus = $data['menus'];
            unset($data['menus']);
        }


        /** @var Role $role */
        $role = $this->resource->patch($id, $data, $context);

        if (isset($menus)) {
            $this->resetMenus($role, $menus);
        }

        return $this->resetRow($role);
    }

    public function resetMenus(Role $role, array $menus): void
    {
        $newMenus = $role->getMenus();
        $newMenus->clear();
        $this->em->flush();
        foreach ($menus as $menu) {
            $newMenus->add(new RoleMenu($role, $menu));
        }
        $this->em->flush();
    }

    /** @inheritdoc  */
    public function get(int|string $id, array $context = []): array|object|null
    {
        $result = $this->resource->get($id, $context);

        return $this->resetRow($result);
    }

    private function resetRow(Role $role): object
    {
        $menus = $role->getMenus()->map(fn(RoleMenu $menu) => $menu->getMenu());

        return (object) [
            'id' => $role->getId(),
            'name' => $role->getName(),
            'description' => $role->getDescription(),
            'users' => $role->getUsers(),
            'menus' => $menus,
        ];
    }

    /** @inheritdoc  */
    public function delete(int|string $id, array $context = []): void
    {
        $this->resource->delete($id, $context);
    }
}
