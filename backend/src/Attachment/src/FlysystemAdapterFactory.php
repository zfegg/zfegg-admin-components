<?php

namespace Zfegg\AdminAttachment;

use Iidestiny\Flysystem\Oss\OssAdapter;
use League\Flysystem\Adapter\Ftp;
use League\Flysystem\Adapter\Ftpd;
use League\Flysystem\Adapter\Local;
use League\Flysystem\Adapter\NullAdapter;
use League\Flysystem\AdapterInterface;

class FlysystemAdapterFactory
{
    /**
     * @var callable[]
     */
    private static array $factories = [];

    public static function registerFactory(string $schema, callable $factory): void
    {
        self::$factories[$schema] = $factory;
    }

    public static function createFromUri(string $uri): AdapterInterface
    {
        $info = parse_url($uri);
        $query = [];
        parse_str($info['query'] ?? '', $query);
        $schema = $info['scheme'] ?? '';

        switch ($schema) {
            case 'oss':
            case 'osss':
                $prefix = $info['path'] ?? '';
                $host = $info['host'];

                if (str_ends_with($host, '.aliyuncs.com') && ($names = explode('.', $host)) && count($names) === 4) {
                    $bucket = $names[0];
                } elseif (isset($query['bucket'])) {
                    $bucket = $query['bucket'];
                    unset($query['bucket']);
                } else {
                    throw new \InvalidArgumentException('"bucket" not found.');
                }

                $endpoint = ($schema === 'osss' || !empty($query['ssl']) ? 'https://' : 'http://') . $host;
                $isCName = $query['isCName'] ?? false;
                unset($query['isCName']);

                return new OssAdapter(
                    $info['user'],
                    $info['pass'],
                    $endpoint,
                    $bucket,
                    $isCName,
                    $prefix,
                    [],
                    ...$query
                );
            case 'ftp':
            case 'ftpd':
            case "sftp":
                if (isset($info['user'])) {
                    $info['username'] = $info['user'];
                    unset($info['user']);
                }
                if (isset($info['pass'])) {
                    $info['password'] = $info['pass'];
                    unset($info['pass']);
                }
                $config = $info + $query;

                $adapterClasses = [
                    'ftp' => Ftp::class,
                    'ftpd' => Ftpd::class,
                    'sftp' => \League\Flysystem\Sftp\SftpAdapter::class,
                ];
                $className = $adapterClasses[$schema];

                return new $className($config);
            case "file":
                return new Local($info['path'], ...$query);
            case "null":
                return new NullAdapter();
            case "memory":
                return new \League\Flysystem\Memory\MemoryAdapter();
            case "zip":
                return new \League\Flysystem\ZipArchive\ZipArchiveAdapter(
                    $info['path'],
                    null,
                    $query['prefix'] ?? null
                );
            default:
                if (isset(self::$factories[$schema])) {
                    return (self::$factories[$schema])($info + $query, $uri);
                }

                throw new \InvalidArgumentException("Invalid uri argument \"$uri\"");
        }
    }
}