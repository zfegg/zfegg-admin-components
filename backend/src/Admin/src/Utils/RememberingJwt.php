<?php

namespace Zfegg\Admin\Admin\Utils;

use Firebase\JWT\JWT;

class RememberingJwt extends JWT
{

    public static $leeway = 7 * 86400;
}