<?php

namespace Zfegg\Admin\Admin\Controller;

use Doctrine\ORM\EntityManagerInterface;
use Firebase\JWT\Key;
use Mezzio\Authentication\AuthenticationMiddleware;
use Mezzio\Authentication\UserInterface;
use Mezzio\Session\SessionInterface;
use Mezzio\Session\SessionMiddleware;
use Zfegg\Admin\Admin\Entity\User;
use Zfegg\Admin\Admin\Utils\RememberingJwt;
use Zfegg\PsrMvc\Attribute\FromBody;
use Zfegg\PsrMvc\Attribute\HttpGet;
use Zfegg\PsrMvc\Attribute\HttpPost;
use Zfegg\PsrMvc\Attribute\Route;
use Zfegg\PsrMvc\Exception\AccessDeniedHttpException;

#[Route('/api/[controller]/[action]', [SessionMiddleware::class])]
class RememberingController
{

    public function __construct(
        private EntityManagerInterface $em,
        private string                 $rememberSecret,
    )
    {
    }

    #[HttpGet(middlewares: [AuthenticationMiddleware::class])]
    public function token(UserInterface $user): array
    {
        $payload = [
            'uid' => $user->getIdentity(),
            'username' => $user->getDetail("username"),
            'iat' => time(),
            'exp' => time() + RememberingJwt::$leeway,
        ];

        return [
            'token' => RememberingJwt::encode(
                $payload,
                $this->rememberSecret,
                'HS256'
            ),
        ];
    }

    #[HttpPost]
    public function login(
        #[FromBody]
        string           $jwt,
        SessionInterface $session,
    ): void {
        try {
            $result = (array)RememberingJwt::decode($jwt, new Key($this->rememberSecret, 'HS256'));
            $user = $this->em->find(User::class, $result['uid']);

            AuthController::writeSession($session, $user);
        } catch (\Exception $e) {
            throw new AccessDeniedHttpException("授权无效!");
        }
    }

}