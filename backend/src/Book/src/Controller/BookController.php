<?php


namespace Book\Controller;

use Book\Entity\Book;
use Doctrine\ORM\EntityManagerInterface;
use Laminas\Diactoros\Response\EmptyResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Log\LoggerAwareTrait;
use Psr\Log\LoggerInterface;

class BookController
{
    use LoggerAwareTrait;

    private EntityManagerInterface $em;

    public function __construct(EntityManagerInterface $em, LoggerInterface $logger)
    {
        $this->setLogger($logger);
        $this->em = $em;
    }

    public function soldOut(int $id): ResponseInterface
    {
        /** @var Book $book */
        $book = $this->em->find(Book::class, $id);
        $book->setStatus(Book::STATUS_SOLD_OUT);

        return new EmptyResponse();
    }
}
