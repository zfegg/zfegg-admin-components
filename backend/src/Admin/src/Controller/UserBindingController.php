<?php

namespace Zfegg\Admin\Admin\Controller;

use Doctrine\ORM\EntityManagerInterface;
use Laminas\Diactoros\Response\RedirectResponse;
use Mezzio\Authentication\AuthenticationMiddleware;
use Mezzio\Authentication\UserInterface;
use Mezzio\Helper\ServerUrlHelper;
use Mezzio\Helper\UrlHelper;
use Mezzio\Session\SessionMiddleware;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Zfegg\Admin\Admin\Entity\UserAuthBinding;
use Zfegg\AdminCenterOauthHandler\Model\UserAuthBindingsInterface;
use Zfegg\AdminCenterOauthHandler\Service\AdminCenterService;
use Zfegg\PsrMvc\Attribute\HttpGet;
use Zfegg\PsrMvc\Attribute\Route;
use Zfegg\PsrMvc\Exception\AccessDeniedHttpException;
use Zfegg\PsrMvc\Exception\NotFoundHttpException;
use Zfegg\PsrMvc\Exception\UnprocessableEntityHttpException;

#[Route(
    '/api/[controller]/[action]/{provider}',
    [
        SessionMiddleware::class,
        AuthenticationMiddleware::class,
    ],
    'api.[controller].[action]'
)]
class UserBindingController
{
    public function __construct(
        private AdminCenterService $service,
        private EntityManagerInterface $em,
        private ServerUrlHelper $serverUrlHelper,
        private UrlHelper $urlHelper,
    ) {
    }

    #[HttpGet]
    public function login(string $provider): RedirectResponse
    {
        $callbackUrl = $this->serverUrlHelper->generate(
            $this->urlHelper->generate('api.user-binding.bind', ['provider' => $provider])
        );
        switch ($provider) {
            case UserAuthBindingsInterface::PROVIDER_NAME:
                $url = $this->service->getAuthUrl($callbackUrl);
                break;
            default:
                throw new NotFoundHttpException('Invalid provider!');
        }

        return new RedirectResponse($url);
    }

    #[HttpGet]
    public function bind(UserInterface $user, string $provider, ServerRequestInterface $request): ResponseInterface
    {
        $params = $request->getQueryParams();
        switch ($provider) {
            case UserAuthBindingsInterface::PROVIDER_NAME:
                $code = $params['code'] ?? null;

                if (! $code) {
                    throw new UnprocessableEntityHttpException('"code" param required');
                }

                $uri = $request->getUri()->withPath(
                    $request->getAttribute('_base_url') . $request->getUri()->getPath()
                );
                $uri = rtrim(preg_replace('#code=\w+&?#', '', $uri), '?&');

                $auth = $this->service->user($code, $uri);
                $info = ['username' => $auth['real_name']];
                break;
            default:
                throw new NotFoundHttpException('Invalid provider!');
        }

        $userBinding = $this->em->getRepository(UserAuthBinding::class)->findOneBy([
            'provider' => $provider,
            'openid' => $auth['openid'],
        ]);
        if ($userBinding) {
            throw new AccessDeniedHttpException('已被系统的其它账号绑定');
        }

        $userBinding = new UserAuthBinding();
        $userBinding->setUser($user);
        $userBinding->setProvider($provider);
        $userBinding->setOpenid($auth['openid']);
        $userBinding->setInfo($info);

        $this->em->persist($userBinding);
        $this->em->flush();

        return new RedirectResponse(
            $this->urlHelper->getBasePath() . '#/profile/bindings'
        );
    }
}
