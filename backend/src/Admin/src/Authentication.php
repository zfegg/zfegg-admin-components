<?php


namespace Zfegg\Admin\Admin;

use Doctrine\ORM\EntityManagerInterface;
use Laminas\Diactoros\Response\JsonResponse;
use Laminas\Diactoros\Response\RedirectResponse;
use Mezzio\Authentication\AuthenticationInterface;
use Mezzio\Authentication\UserInterface;
use Mezzio\Session\SessionMiddleware;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Zfegg\Admin\Admin\Entity\User;

class Authentication implements AuthenticationInterface
{
    private EntityManagerInterface $em;
    private string $loginUrl;

    public function __construct(EntityManagerInterface $em, string $loginUrl)
    {
        $this->loginUrl = $loginUrl;
        $this->em = $em;
    }

    public function authenticate(ServerRequestInterface $request): ?UserInterface
    {
        /** @var \Mezzio\Session\SessionInterface $session */
        $session = $request->getAttribute(SessionMiddleware::SESSION_ATTRIBUTE);

        if (! $session) {
            return null;
        }

        $identifier = $session->get(UserInterface::class)['identifier'] ?? null;
        if (! $identifier) {
            return null;
        }

        $user = $this->em->find(User::class, $identifier);

        if (! $user || ! $user->isEnabled()) {
            return null;
        }

        return $user;
    }

    public function unauthorizedResponse(ServerRequestInterface $request): ResponseInterface
    {
        if ($request->getHeaderLine('X-Requested-With') == 'XMLHttpRequest') {
            return new JsonResponse(
                [
                    'message'   => '认证失败',
                    'login_url' => $this->loginUrl
                ],
                401
            );
        } else {
            $query = ['redirect_uri' => (string)$request->getUri()];
            $url = $this->loginUrl
                . (str_contains($this->loginUrl, '?') ? '&' : '?')
                . http_build_query($query);
            return new RedirectResponse($url);
        }
    }
}
