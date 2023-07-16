<?php

namespace Zfegg\Admin\Admin\Serializer;

use Mezzio\Authentication\UserInterface;
use Symfony\Component\Serializer\Normalizer\ContextAwareDenormalizerInterface;
use Symfony\Component\Serializer\Normalizer\DenormalizerAwareInterface;
use Symfony\Component\Serializer\Normalizer\DenormalizerAwareTrait;

class UserIdentityDenormalizer implements ContextAwareDenormalizerInterface, DenormalizerAwareInterface
{
    use DenormalizerAwareTrait;

    public const USER_IDENTITY = 'user_identity_field';

    /**
     * @inheritdoc
     */
    public function supportsDenormalization(mixed $data, string $type, string $format = null, array $context = []): bool
    {
        return isset($context[self::USER_IDENTITY])
            && isset($context[UserInterface::class])
            ;
    }

    /**
     * @inheritdoc
     */
    public function denormalize(mixed $data, string $type, string $format = null, array $context = [])
    {
        $data[$context[self::USER_IDENTITY]] = $context[UserInterface::class]->getIdentity();
        unset($context[self::USER_IDENTITY]);

        return $this->denormalizer->denormalize($data, $type, $format, $context);
    }
}
