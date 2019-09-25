<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class HomeController extends AbstractController
{
    /**
     * @Route({
     *     "fr": "/",
     *     "en": "/en"
     * }, name="home")
     */
    public function index(): Response
    {
        return $this->render('home/index.html.twig', [
            'controller_name' => 'HomeController',
        ]);
    }

    /**
     * @Route({
     *     "fr": "/a-propos",
     *     "en": "/en/about"
     * }, name="about")
     */
    public function about(): Response
    {
        return $this->render('home/about.html.twig');
    }

    /**
     * @Route({
     *     "fr": "/dernieres-recherches",
     *     "en": "/en/last-search"
     * }, name="search")
     */
    public function search(): Response
    {
        return $this->render('home/search.html.twig');
    }

    /**
     * @Route({
     *     "fr": "/qu-est-ce-que-ecoindex",
     *     "en": "/en/what-is-ecoindex"
     * }, name="what_is_it")
     */
    public function whatIsIt(): Response
    {
        return $this->render('home/what_is_it.html.twig');
    }
}
