<?php

namespace Zfegg\Admin\Admin\Controller;

use Doctrine\ORM\EntityManagerInterface;
use Laminas\Diactoros\Response\EmptyResponse;
use Mezzio\Authentication\UserInterface;
use Mezzio\Session\SessionInterface;
use Mezzio\Session\SessionMiddleware;
use Psr\Http\Message\ResponseInterface;
use Zfegg\Admin\Admin\Entity\User;
use Zfegg\ContentValidation\ContentValidationMiddleware;
use Zfegg\PsrMvc\Attribute\FromBody;
use Zfegg\PsrMvc\Attribute\HttpGet;
use Zfegg\PsrMvc\Attribute\HttpPost;
use Zfegg\PsrMvc\Attribute\Route;
use Zfegg\PsrMvc\Exception\AccessDeniedHttpException;

#[Route('/api/[controller]/[action]', [SessionMiddleware::class])]
class AuthController
{

    public function __construct(
        private EntityManagerInterface $em,
    ) {
    }

    #[HttpPost(
        middlewares: [ContentValidationMiddleware::class],
        options: ['schema' => 'zfegg-admin-admin:///auth.login.json'])
    ]
    public function login(
        #[FromBody(root: true)]
        array            $data,
        SessionInterface $session,
    ): ResponseInterface
    {
        /** @var User $user */
        if (!$user = $this->em->getRepository(User::class)->validate($data['email'], $data['password'])) {
            throw new AccessDeniedHttpException('账号或密码错误');
        }

        $this->writeSession($session, $user);

        return new EmptyResponse();
    }

    #[HttpGet]
    public function logout(
        SessionInterface $session,
    ): void
    {
        $session->clear();
    }

    public static function writeSession(SessionInterface $session, User $user): void
    {
        $session->set(UserInterface::class, [
            'identifier' => $user->getId(),
            'user' => [
                'real_name' => $user->getRealName(),
                'email' => $user->getEmail(),
                'admin' => $user->isAdmin(),
            ],
        ]);
        $session->regenerate();
    }
}
