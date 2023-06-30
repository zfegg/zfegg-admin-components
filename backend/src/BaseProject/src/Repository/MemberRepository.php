<?php

namespace Zfegg\Admin\BaseProject\Repository;

use Doctrine\ORM\EntityRepository;
use Zfegg\Admin\BaseProject\Entity\Member;
use Zfegg\Admin\BaseProject\Entity\ProjectInterface;

class MemberRepository extends EntityRepository
{

    /**
     *
     * @return list<array{id: string, code: string, name: string, avatar: string}>
     */
    public function fetchProjectsByMember(
        int $memberId,
        array $columns = ['p.id', 'p.code', 'p.name', 'p.avatar']
    ): array {
        $query = $this->_em->createQuery(
            sprintf('SELECT ' . implode(',', $columns) . '
from %s p
WHERE p.status=1 
and p.id in (SELECT identity(mr.project) FROM %s mr WHERE mr.member=?0 and (mr.expired is null or mr.expired >=?1)) 
',
                ProjectInterface::class,
                Member::class,
            )
        );
        $query->setParameter(0, $memberId);
        $query->setParameter(1, time());

        return $query->getResult();
    }

    public function fetchByProject(int $projectId): array
    {
        $query = $this->_em->createQuery(
            sprintf(
                'SELECT mr,u from %s mr JOIN mr.member u  
                WHERE mr.project=?0 and u.status=1 and (mr.expired is null or mr.expired >=?1)',
                Member::class
            )
        );
        $query->setParameter(0, $projectId);
        $query->setParameter(1, time());

        return $query->getResult();
    }


    /**
     * @return string[]
     */
    public function fetchMemberMenus(int $projectId, int $memberId): array
    {
        $query = $this->_em->createQuery(
            sprintf(
                <<<DQL
                SELECT ms.menu from %s mr 
                JOIN mr.role r
                JOIN r.menus ms
                WHERE mr.project=:project 
                    AND mr.member=:member 
                    AND (mr.expired is null or mr.expired >=:time)
                DQL,
                Member::class
            )
        );
        $query->setParameter('project', $projectId);
        $query->setParameter('member', $memberId);
        $query->setParameter('time', time());

        return $query->getSingleColumnResult();
    }
}
