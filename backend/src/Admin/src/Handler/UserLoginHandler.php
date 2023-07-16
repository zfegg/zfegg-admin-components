<?php

namespace Zfegg\Admin\Admin\Handler;

use Laminas\Diactoros\Response\EmptyResponse;
use Mezzio\Authentication\UserInterface;
use Mezzio\Session\SessionInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Zfegg\Admin\Admin\Entity\User;
use Zfegg\Admin\Admin\Repository\Users;
use Zfegg\Admin\Admin\Response\ProblemResponseFactoryInterface;

class UserLoginHandler implements RequestHandlerInterface
{

    private Users $users;
    private ProblemResponseFactoryInterface $responseFactory;

    public function __construct(Users $users, ProblemResponseFactoryInterface $responseFactory)
    {
        $this->users = $users;
        $this->responseFactory = $responseFactory;
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $data = $request->getParsedBody();

        /** @var User $user */
        if (! $user = $this->users->validate($data['email'], $data['password'])) {
            return $this->responseFactory->create('账号或密码错误');
        }

        $session = $request->getAttribute(SessionInterface::class);
        $session->set(UserInterface::class, [
            'identifier' => $user->getId(),
            'user'    => [
                'real_name' => $user->getRealName(),
                'email' => $user->getEmail(),
                'admin' => $user->isAdmin(),
            ],
        ]);
        $session->regenerate();

        return new EmptyResponse();
    }
}
