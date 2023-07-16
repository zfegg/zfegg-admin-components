<?php


namespace Zfegg\Admin\Admin\Controller;

use Doctrine\ORM\EntityManagerInterface;
use Laminas\Diactoros\Response\EmptyResponse;
use Laminas\Diactoros\Response\JsonResponse;
use Mezzio\Authentication\AuthenticationMiddleware;
use Mezzio\Authentication\UserInterface;
use Mezzio\Session\SessionMiddleware;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\SerializerInterface;
use Zfegg\Admin\Admin\Authorization\GateInterface;
use Zfegg\Admin\Admin\Entity\User;
use Zfegg\Admin\Admin\Response\ProblemResponseFactoryInterface;
use Zfegg\ContentValidation\ContentValidationMiddleware;
use Zfegg\PsrMvc\Attribute\FromBody;
use Zfegg\PsrMvc\Attribute\HttpGet;
use Zfegg\PsrMvc\Attribute\HttpPost;
use Zfegg\PsrMvc\Attribute\Route;

#[Route(
    '/api/user',
    [
        SessionMiddleware::class,
        AuthenticationMiddleware::class,
        ContentValidationMiddleware::class,
    ],
    'api.[action]'
)]
class UserController
{
    private EntityManagerInterface $em;
    private SerializerInterface $serializer;
    private ProblemResponseFactoryInterface $responseFactory;
    private GateInterface $gate;

    public function __construct(
        EntityManagerInterface $em,
        SerializerInterface $serializer,
        ProblemResponseFactoryInterface $responseFactory,
        GateInterface $gate
    ) {
        $this->em = $em;
        $this->serializer = $serializer;
        $this->responseFactory = $responseFactory;
        $this->gate = $gate;
    }

    #[HttpGet()]
    public function user(UserInterface $user): ResponseInterface
    {
        $menus = $this->gate->userMenus($user->getIdentity());

        return new JsonResponse([
            'real_name' => $user->getDetail('realName'),
            'avatar' => $user->getDetail('avatar'),
            'admin' => $user->getDetail('admin'),
            'menus' => $menus
        ]);
    }

    #[HttpGet('[action]')]
    public function profile(UserInterface $auth): ResponseInterface
    {
        /** @var User $user */
        $user = $this->em->find(User::class, $auth->getIdentity());

        return $this->normalizeUser($user);
    }

    private function normalizeUser(User $user): JsonResponse
    {
        $output = $this->serializer->normalize(
            $user,
            '',
            ['attributes' => [
                'realName',
                'email',
                'avatar',
                'admin',
                'config',
                'bindings' => ['provider', 'info', 'createdAt']
            ]]
        );
        return new JsonResponse($output);
    }

    #[HttpPost('profile', options: ['schema' => 'zfegg-admin-admin:///profile.json'])]
    public function postProfile(UserInterface $auth, #[FromBody(root: true)] array $data): ResponseInterface
    {
        /** @var User $user */
        $user = $this->em->find(User::class, $auth->getIdentity());

        $this->serializer->denormalize(
            $data,
            User::class,
            '',
            [AbstractNormalizer::OBJECT_TO_POPULATE => $user]
        );
        $this->em->persist($user);
        $this->em->flush();

        return $this->normalizeUser($user);
    }

    #[HttpPost('[action]', options: ['schema' => 'zfegg-admin-admin:///change-password.json'])]
    public function changePassword(ServerRequestInterface $request, UserInterface $user): ResponseInterface
    {
        $data = $request->getParsedBody();

        /** @var User $user */
        if (! $user->isValidPassword($data['old_password'])) {
            return $this->responseFactory->create('旧密码错误');
        }

        $user->setRawPassword($data['password']);

        $this->em->persist($user);
        $this->em->flush();

        return new EmptyResponse();
    }
}
