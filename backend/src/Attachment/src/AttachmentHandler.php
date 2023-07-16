<?php

namespace Zfegg\AdminAttachment;

use Laminas\Diactoros\Response\JsonResponse;
use League\Flysystem\FilesystemInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\UploadedFileInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Sirius\Validation\ValueValidator;

class AttachmentHandler implements RequestHandlerInterface
{

    private string $url;

    public function __construct(
        private ValueValidator $validator,
        private FilesystemInterface $filesystem,
        private string $path,
        string $url = '/',
    ) {
        $this->url = rtrim($url, '/');
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        /** @var UploadedFileInterface[] $files */
        $files = $request->getUploadedFiles();
        $file = $files['file'];
        $result = [
            'name'     => $file->getClientFilename(),
            'tmp_name' => $file->getStream()->getMetadata('uri'),
            'type'     => $file->getClientMediaType(),
            'error'    => $file->getError(),
            'size'     => $file->getSize()
        ];

//        var_dump($result);exit;
        if (! $this->validator->validate($result)) {
            return new JsonResponse(
                [
                    'status' => 422,
                    'detail' => '验证失败.',
                    'validation_messages' => $this->validator->getMessages()
                ],
                422
            );
        }

        $path = preg_replace_callback(
            '/{([a-z0-9:]+)}/i',
            function ($m) use ($result) {
                [$fn, $args] = explode(':', $m[1]) + [null, ''];
                switch ($m[1]) {
                    case 'date':
                        return date($args ?: 'Ym');
                    case 'hash':
                        return substr(hash_file('sha256', $result['tmp_name']), 0, $args ?: 32);
                    case 'ext':
                        $ext = strtolower(pathinfo($result['name'], PATHINFO_EXTENSION));
                        return $ext;
                    case 'name':
                        return basename($result['name']);
                    case 'uniqid':
                        return uniqid();
                    default:
                        return '';
                }
            },
            $this->path
        );
        $this->filesystem->writeStream($path, $file->getStream()->detach());

        return new JsonResponse([
            "status" => "success",
            'url' => $this->url . '/' . $path,
            'name' => basename($path),
        ]);
    }
}
