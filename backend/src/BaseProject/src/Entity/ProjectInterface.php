<?php

namespace Zfegg\Admin\BaseProject\Entity;

interface ProjectInterface
{
    public function getId(): int;

    public function setId(int $id): void;

    public function getCode(): string;

    public function setCode(string $code): void;

    public function getName(): string;

    public function setName(string $name): void;

    public function getDescription(): ?string;

    public function setDescription(?string $description): void;

    public function getConfig(): ?array;

    public function setConfig(?array $config): void;

    public function getAvatar(): ?string;

    public function setAvatar(?string $avatar): void;

    public function getStatus(): int;

    public function getSecret(): string;
}
