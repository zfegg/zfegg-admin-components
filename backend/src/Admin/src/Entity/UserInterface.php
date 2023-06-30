<?php

namespace Zfegg\Admin\Admin\Entity;

interface UserInterface extends \Mezzio\Authentication\UserInterface
{
    const STATUS_DISABLED = 0;
    const STATUS_ENABLED = 1;
    const STATUS_REVIEW = 2;
}
