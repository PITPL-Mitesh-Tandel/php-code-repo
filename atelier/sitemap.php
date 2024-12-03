<?php

ini_set('error_reporting', E_ALL);
error_reporting(E_ALL);
ini_set('html_errors', false);
ini_set('display_errors', true);

//    header("Content-type: application/xml");

    $xml = '<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">';

    $params = $_GET;

    $content_type = 'p';

    _module('master');
    $master_obj = new master();
    $where = "enmStatus='1' and enmDeleted='0'";
    $categories = $master_obj->getMasters($where, 'category');
    
    $contents = $block_obj->getSitemapContentsByType(array('p', 'n', 'c')); //pr($contents);

    if ($contents == 404) {
        $xml .= '<status>false</status>
                <code>303</code>
                <error>No content available for provided content type</error>';
        die($xml);
    }


    if($categories != 404) 
    {
        foreach($categories as $category) {
            $xml .= '<url>';
            $xml .= '<loc>https://www.atelierdada.com/en/work/category/'.$category['strSlug'].'</loc>'; //The canicol URL to the item
            $xml .= '<lastmod>'.date('Y-m-d', strtotime($category['dtiModified'])).'</lastmod>';
            $xml .= '<changefreq>weekly</changefreq>';
            $xml .= '<priority>0.5</priority>';
            $xml .= '</url>';

            $xml .= '<url>';
            $xml .= '<loc>https://www.atelierdada.com/fr/work/category/'.$category['strSlug'].'</loc>'; //The canicol URL to the item
            $xml .= '<lastmod>'.date('Y-m-d', strtotime($category['dtiModified'])).'</lastmod>';
            $xml .= '<changefreq>weekly</changefreq>';
            $xml .= '<priority>0.5</priority>';
            $xml .= '</url>';
        }
    }


   //add alternate url for categories 
//first category page

//         $xml .= '<url>';
//         $xml .= '<loc>https://www.atelierdada.com/en/work</loc>'; //The canicol URL to the item   
//         $xml .= " <xhtml:link 
//         rel='alternate'
//         hreflang='fr'
//         href='https://www.atelierdada.com/fr/work'
//         />"; 
//         $xml .= '<lastmod>'.date('Y-m-d', strtotime($content['dtiModified'])).'</lastmod>';
//         $xml .= '<changefreq>weekly</changefreq>';
//         $xml .= '<priority>0.5</priority>';
//         $xml .= '</url>';

//             $xml .= '<url>';
//             $xml .= '<loc>https://www.atelierdada.com/fr/work</loc>'; //The canicol URL to the item
//             $xml .= " <xhtml:link 
//             rel='alternate'
//             hreflang='en'
//             href='https://www.atelierdada.com/en/work'
//             />";
//             $xml .= '<lastmod>'.date('Y-m-d', strtotime($content['dtiModified'])).'</lastmod>';
//             $xml .= '<changefreq>weekly</changefreq>';
//             $xml .= '<priority>0.5</priority>';
//             $xml .= '</url>';


// ////urban category page
//         $xml .= '<url>';
//         $xml .= '<loc>https://www.atelierdada.com/en/work/category/urban</loc>'; //The canicol URL to the item   
//         $xml .= " <xhtml:link 
//         rel='alternate'
//         hreflang='fr'
//         href='https://www.atelierdada.com/fr/work/category/urbain'
//         />"; 
//         $xml .= '<lastmod>'.date('Y-m-d', strtotime($content['dtiModified'])).'</lastmod>';
//         $xml .= '<changefreq>weekly</changefreq>';
//         $xml .= '<priority>0.5</priority>';
//         $xml .= '</url>';

//             $xml .= '<url>';
//             $xml .= '<loc>https://www.atelierdada.com/fr/work/category/urbain</loc>'; //The canicol URL to the item
//             $xml .= " <xhtml:link 
//             rel='alternate'
//             hreflang='en'
//             href='https://www.atelierdada.com/en/work/category/urban'
//             />";
//             $xml .= '<lastmod>'.date('Y-m-d', strtotime($content['dtiModified'])).'</lastmod>';
//             $xml .= '<changefreq>weekly</changefreq>';
//             $xml .= '<priority>0.5</priority>';
//             $xml .= '</url>';


// ////infra category page
//         $xml .= '<url>';
//         $xml .= '<loc>https://www.atelierdada.com/en/work/category/infrastructure</loc>'; //The canicol URL to the item   
//         $xml .= " <xhtml:link 
//         rel='alternate'
//         hreflang='fr'
//         href='https://www.atelierdada.com/fr/work/category/infrastructure'
//         />"; 
//         $xml .= '<lastmod>'.date('Y-m-d', strtotime($content['dtiModified'])).'</lastmod>';
//         $xml .= '<changefreq>weekly</changefreq>';
//         $xml .= '<priority>0.5</priority>';
//         $xml .= '</url>';

//             $xml .= '<url>';
//             $xml .= '<loc>https://www.atelierdada.com/fr/work/category/infrastructure</loc>'; //The canicol URL to the item
//             $xml .= " <xhtml:link 
//             rel='alternate'
//             hreflang='en'
//             href='https://www.atelierdada.com/en/work/category/infrastructure'
//             />";
//             $xml .= '<lastmod>'.date('Y-m-d', strtotime($content['dtiModified'])).'</lastmod>';
//             $xml .= '<changefreq>weekly</changefreq>';
//             $xml .= '<priority>0.5</priority>';
//             $xml .= '</url>';

// ////commercial category page
//         $xml .= '<url>';
//         $xml .= '<loc>https://www.atelierdada.com/en/work/category/commercial</loc>'; //The canicol URL to the item   
//         $xml .= " <xhtml:link 
//         rel='alternate'
//         hreflang='fr'
//         href='https://www.atelierdada.com/fr/work/category/commercial'
//         />"; 
//         $xml .= '<lastmod>'.date('Y-m-d', strtotime($content['dtiModified'])).'</lastmod>';
//         $xml .= '<changefreq>weekly</changefreq>';
//         $xml .= '<priority>0.5</priority>';
//         $xml .= '</url>';

//             $xml .= '<url>';
//             $xml .= '<loc>https://www.atelierdada.com/fr/work/category/commercial</loc>'; //The canicol URL to the item
//             $xml .= " <xhtml:link 
//             rel='alternate'
//             hreflang='en'
//             href='https://www.atelierdada.com/en/work/category/commercial'
//             />";
//             $xml .= '<lastmod>'.date('Y-m-d', strtotime($content['dtiModified'])).'</lastmod>';
//             $xml .= '<changefreq>weekly</changefreq>';
//             $xml .= '<priority>0.5</priority>';
//             $xml .= '</url>';

// ////institution category page
//         $xml .= '<url>';
//         $xml .= '<loc>https://www.atelierdada.com/en/work/category/institution</loc>'; //The canicol URL to the item   
//         $xml .= " <xhtml:link 
//         rel='alternate'
//         hreflang='fr'
//         href='https://www.atelierdada.com/fr/work/category/institutionnel'
//         />"; 
//         $xml .= '<lastmod>'.date('Y-m-d', strtotime($content['dtiModified'])).'</lastmod>';
//         $xml .= '<changefreq>weekly</changefreq>';
//         $xml .= '<priority>0.5</priority>';
//         $xml .= '</url>';

//             $xml .= '<url>';
//             $xml .= '<loc>https://www.atelierdada.com/fr/work/category/institutionnel</loc>'; //The canicol URL to the item
//             $xml .= " <xhtml:link 
//             rel='alternate'
//             hreflang='en'
//             href='https://www.atelierdada.com/en/work/category/institution'
//             />";
//             $xml .= '<lastmod>'.date('Y-m-d', strtotime($content['dtiModified'])).'</lastmod>';
//             $xml .= '<changefreq>weekly</changefreq>';
//             $xml .= '<priority>0.5</priority>';
//             $xml .= '</url>';

// ////hospitality category page
//         $xml .= '<url>';
//         $xml .= '<loc>https://www.atelierdada.com/en/work/category/hospitality</loc>'; //The canicol URL to the item   
//         $xml .= " <xhtml:link 
//         rel='alternate'
//         hreflang='fr'
//         href='https://www.atelierdada.com/fr/work/category/h%C3%B4telier'
//         />"; 
//         $xml .= '<lastmod>'.date('Y-m-d', strtotime($content['dtiModified'])).'</lastmod>';
//         $xml .= '<changefreq>weekly</changefreq>';
//         $xml .= '<priority>0.5</priority>';
//         $xml .= '</url>';

//             $xml .= '<url>';
//             $xml .= '<loc>https://www.atelierdada.com/fr/work/category/h%C3%B4telier</loc>'; //The canicol URL to the item
//             $xml .= " <xhtml:link 
//             rel='alternate'
//             hreflang='en'
//             href='https://www.atelierdada.com/en/work/category/hospitality'
//             />";
//             $xml .= '<lastmod>'.date('Y-m-d', strtotime($content['dtiModified'])).'</lastmod>';
//             $xml .= '<changefreq>weekly</changefreq>';
//             $xml .= '<priority>0.5</priority>';
//             $xml .= '</url>';

// ////residential category page
//         $xml .= '<url>';
//         $xml .= '<loc>https://www.atelierdada.com/en/work/category/residential</loc>'; //The canicol URL to the item   
//         $xml .= " <xhtml:link 
//         rel='alternate'
//         hreflang='fr'
//         href='https://www.atelierdada.com/fr/work/category/r%C3%A9sidentiel'
//         />"; 
//         $xml .= '<lastmod>'.date('Y-m-d', strtotime($content['dtiModified'])).'</lastmod>';
//         $xml .= '<changefreq>weekly</changefreq>';
//         $xml .= '<priority>0.5</priority>';
//         $xml .= '</url>';

//             $xml .= '<url>';
//             $xml .= '<loc>https://www.atelierdada.com/fr/work/category/r%C3%A9sidentiel</loc>'; //The canicol URL to the item
//             $xml .= " <xhtml:link 
//             rel='alternate'
//             hreflang='en'
//             href='https://www.atelierdada.com/en/work/category/residential'
//             />";
//             $xml .= '<lastmod>'.date('Y-m-d', strtotime($content['dtiModified'])).'</lastmod>';
//             $xml .= '<changefreq>weekly</changefreq>';
//             $xml .= '<priority>0.5</priority>';
//             $xml .= '</url>';


// ////residential category page
//         $xml .= '<url>';
//         $xml .= '<loc>https://www.atelierdada.com/en/work/category/residential</loc>'; //The canicol URL to the item   
//         $xml .= " <xhtml:link 
//         rel='alternate'
//         hreflang='fr'
//         href='https://www.atelierdada.com/fr/work/category/r%C3%A9sidentiel'
//         />"; 
//         $xml .= '<lastmod>'.date('Y-m-d', strtotime($content['dtiModified'])).'</lastmod>';
//         $xml .= '<changefreq>weekly</changefreq>';
//         $xml .= '<priority>0.5</priority>';
//         $xml .= '</url>';

//             $xml .= '<url>';
//             $xml .= '<loc>https://www.atelierdada.com/fr/work/category/r%C3%A9sidentiel</loc>'; //The canicol URL to the item
//             $xml .= " <xhtml:link 
//             rel='alternate'
//             hreflang='en'
//             href='https://www.atelierdada.com/en/work/category/residential'
//             />";
//             $xml .= '<lastmod>'.date('Y-m-d', strtotime($content['dtiModified'])).'</lastmod>';
//             $xml .= '<changefreq>weekly</changefreq>';
//             $xml .= '<priority>0.5</priority>';
//             $xml .= '</url>';


// //retail
//   $xml .= '<url>';
//         $xml .= '<loc>https://www.atelierdada.com/en/work/category/retail</loc>'; //The canicol URL to the item   
//         $xml .= " <xhtml:link 
//         rel='alternate'
//         hreflang='fr'
//         href='https://www.atelierdada.com/fr/work/category/retail'
//         />"; 
//         $xml .= '<lastmod>'.date('Y-m-d', strtotime($content['dtiModified'])).'</lastmod>';
//         $xml .= '<changefreq>weekly</changefreq>';
//         $xml .= '<priority>0.5</priority>';
//         $xml .= '</url>';

//             $xml .= '<url>';
//             $xml .= '<loc>https://www.atelierdada.com/fr/work/category/retail</loc>'; //The canicol URL to the item
//             $xml .= " <xhtml:link 
//             rel='alternate'
//             hreflang='en'
//             href='https://www.atelierdada.com/en/work/category/retail'
//             />";
//             $xml .= '<lastmod>'.date('Y-m-d', strtotime($content['dtiModified'])).'</lastmod>';
//             $xml .= '<changefreq>weekly</changefreq>';
//             $xml .= '<priority>0.5</priority>';
//             $xml .= '</url>';

// //event
//   $xml .= '<url>';
//         $xml .= '<loc>https://www.atelierdada.com/en/work/category/event</loc>'; //The canicol URL to the item   
//         $xml .= " <xhtml:link 
//         rel='alternate'
//         hreflang='fr'
//         href='https://www.atelierdada.com/fr/work/category/ev%C3%A8nementiel'
//         />"; 
//         $xml .= '<lastmod>'.date('Y-m-d', strtotime($content['dtiModified'])).'</lastmod>';
//         $xml .= '<changefreq>weekly</changefreq>';
//         $xml .= '<priority>0.5</priority>';
//         $xml .= '</url>';

//             $xml .= '<url>';
//             $xml .= '<loc>https://www.atelierdada.com/fr/work/category/ev%C3%A8nementiel</loc>'; //The canicol URL to the item
//             $xml .= " <xhtml:link 
//             rel='alternate'
//             hreflang='en'
//             href='https://www.atelierdada.com/en/work/category/event'
//             />";
//             $xml .= '<lastmod>'.date('Y-m-d', strtotime($content['dtiModified'])).'</lastmod>';
//             $xml .= '<changefreq>weekly</changefreq>';
//             $xml .= '<priority>0.5</priority>';
//             $xml .= '</url>';


// //product
//   $xml .= '<url>';
//         $xml .= '<loc>https://www.atelierdada.com/en/work/category/product</loc>'; //The canicol URL to the item   
//         $xml .= " <xhtml:link 
//         rel='alternate'
//         hreflang='fr'
//         href='https://www.atelierdada.com/fr/work/category/produit'
//         />"; 
//         $xml .= '<lastmod>'.date('Y-m-d', strtotime($content['dtiModified'])).'</lastmod>';
//         $xml .= '<changefreq>weekly</changefreq>';
//         $xml .= '<priority>0.5</priority>';
//         $xml .= '</url>';

//             $xml .= '<url>';
//             $xml .= '<loc>https://www.atelierdada.com/fr/work/category/produit</loc>'; //The canicol URL to the item
//             $xml .= " <xhtml:link 
//             rel='alternate'
//             hreflang='en'
//             href='https://www.atelierdada.com/en/work/category/product'
//             />";
//             $xml .= '<lastmod>'.date('Y-m-d', strtotime($content['dtiModified'])).'</lastmod>';
//             $xml .= '<changefreq>weekly</changefreq>';
//             $xml .= '<priority>0.5</priority>';
//             $xml .= '</url>';




//    //add alternate url for home 

//         $xml .= '<url>';
//         $xml .= '<loc>https://www.atelierdada.com/</loc>'; //The canicol URL to the item   
//         $xml .= " <xhtml:link 
//         rel='alternate'
//         hreflang='fr'
//         href='https://www.atelierdada.com/fr'
//         />"; 
//         $xml .= '<lastmod>'.date('Y-m-d', strtotime($content['dtiModified'])).'</lastmod>';
//         $xml .= '<changefreq>weekly</changefreq>';
//         $xml .= '<priority>0.5</priority>';
//         $xml .= '</url>';

//             $xml .= '<url>';
//             $xml .= '<loc>https://www.atelierdada.com/fr</loc>'; //The canicol URL to the item
//             $xml .= " <xhtml:link 
//             rel='alternate'
//             hreflang='en'
//             href='https://www.atelierdada.com'
//             />";
//             $xml .= '<lastmod>'.date('Y-m-d', strtotime($content['dtiModified'])).'</lastmod>';
//             $xml .= '<changefreq>weekly</changefreq>';
//             $xml .= '<priority>0.5</priority>';
//             $xml .= '</url>';


//          //add alternate url for contact 
//         $xml .= '<url>';
//         $xml .= '<loc>https://www.atelierdada.com/en/contact</loc>'; //The canicol URL to the item
//         $xml .= " <xhtml:link 
//         rel='alternate'
//         hreflang='fr'
//         href='https://www.atelierdada.com/fr/contact'
//         />";
//         $xml .= '<lastmod>'.date('Y-m-d', strtotime($content['dtiModified'])).'</lastmod>';
//         $xml .= '<changefreq>weekly</changefreq>';
//         $xml .= '<priority>0.5</priority>';
//         $xml .= '</url>';

//         $xml .= '<url>';
//         $xml .= '<loc>https://www.atelierdada.com/fr/contact</loc>'; //The canicol URL to the item
//         $xml .= " <xhtml:link 
//         rel='alternate'
//         hreflang='en'
//         href='https://www.atelierdada.com/en/contact'
//         />";
//         $xml .= '<lastmod>'.date('Y-m-d', strtotime($content['dtiModified'])).'</lastmod>';
//         $xml .= '<changefreq>weekly</changefreq>';
//         $xml .= '<priority>0.5</priority>';
//         $xml .= '</url>';

//          //add alternate url for about 
//         $xml .= '<url>';
//         $xml .= '<loc>https://www.atelierdada.com/en/about</loc>'; //The canicol URL to the item
//         $xml .= " <xhtml:link 
//         rel='alternate'
//         hreflang='fr'
//         href='https://www.atelierdada.com/fr/about'
//         />";
//          $xml .= '<lastmod>'.date('Y-m-d', strtotime($content['dtiModified'])).'</lastmod>';
//         $xml .= '<changefreq>weekly</changefreq>';
//         $xml .= '<priority>0.5</priority>';
//         $xml .= '</url>';

//         $xml .= '<url>';
//         $xml .= '<loc>https://www.atelierdada.com/fr/about</loc>'; //The canicol URL to the item
//         $xml .= " <xhtml:link 
//         rel='alternate'
//         hreflang='en'
//         href='https://www.atelierdada.com/en/about'
//         />"; 
//          $xml .= '<lastmod>'.date('Y-m-d', strtotime($content['dtiModified'])).'</lastmod>';
//         $xml .= '<changefreq>weekly</changefreq>';
//         $xml .= '<priority>0.5</priority>';
//         $xml .= '</url>';

//         //individual about pages

//         $xml .= '<url>';
//         $xml .= '<loc>https://www.atelierdada.com/en/about/marie-ikram-bouhlel-jhaveri</loc>'; //The canicol URL to the item
//         $xml .= " <xhtml:link 
//         rel='alternate'
//         hreflang='fr'
//         href='https://www.atelierdada.com/fr/about/marie-ikram-bouhlel-jhaveri'
//         />";
//          $xml .= '<lastmod>'.date('Y-m-d', strtotime($content['dtiModified'])).'</lastmod>';
//         $xml .= '<changefreq>weekly</changefreq>';
//         $xml .= '<priority>0.5</priority>';
//         $xml .= '</url>';

//         $xml .= '<url>';
//         $xml .= '<loc>https://www.atelierdada.com/fr/about/marie-ikram-bouhlel-jhaveri</loc>'; //The canicol URL to the item
//         $xml .= " <xhtml:link 
//         rel='alternate'
//         hreflang='en'
//         href='https://www.atelierdada.com/en/about/marie-ikram-bouhlel-jhaveri'
//         />"; 
//          $xml .= '<lastmod>'.date('Y-m-d', strtotime($content['dtiModified'])).'</lastmod>';
//         $xml .= '<changefreq>weekly</changefreq>';
//         $xml .= '<priority>0.5</priority>';
//         $xml .= '</url>';


//          $xml .= '<url>';
//         $xml .= '<loc>https://www.atelierdada.com/en/about/nirmit-jhaveri</loc>'; //The canicol URL to the item
//         $xml .= " <xhtml:link 
//         rel='alternate'
//         hreflang='fr'
//         href='https://www.atelierdada.com/fr/about/nirmit-jhaveri'
//         />";
//          $xml .= '<lastmod>'.date('Y-m-d', strtotime($content['dtiModified'])).'</lastmod>';
//         $xml .= '<changefreq>weekly</changefreq>';
//         $xml .= '<priority>0.5</priority>';
//         $xml .= '</url>';

//         $xml .= '<url>';
//         $xml .= '<loc>https://www.atelierdada.com/fr/about/nirmit-jhaveri</loc>'; //The canicol URL to the item
//         $xml .= " <xhtml:link 
//         rel='alternate'
//         hreflang='en'
//         href='https://www.atelierdada.com/en/about/nirmit-jhaveri'
//         />"; 
//          $xml .= '<lastmod>'.date('Y-m-d', strtotime($content['dtiModified'])).'</lastmod>';
//         $xml .= '<changefreq>weekly</changefreq>';
//         $xml .= '<priority>0.5</priority>';
//         $xml .= '</url>';

        
//            //add alternate url for studio 
//          $xml .= '<url>';
//         $xml .= '<loc>https://www.atelierdada.com/en/studios</loc>'; //The canicol URL to the item
//         $xml .= " <xhtml:link 
//         rel='alternate'
//         hreflang='fr'
//         href='https://www.atelierdada.com/fr/studios'
//         />"; 
//         $xml .= '<lastmod>'.date('Y-m-d', strtotime($content['dtiModified'])).'</lastmod>';
//         $xml .= '<changefreq>weekly</changefreq>';
//         $xml .= '<priority>0.5</priority>';
//         $xml .= '</url>';

//         $xml .= '<url>';
//         $xml .= '<loc>https://www.atelierdada.com/fr/studios</loc>'; //The canicol URL to the item
//         $xml .= " <xhtml:link 
//         rel='alternate'
//         hreflang='en'
//         href='https://www.atelierdada.com/en/studios'
//         />";  
//         $xml .= '<lastmod>'.date('Y-m-d', strtotime($content['dtiModified'])).'</lastmod>';
//         $xml .= '<changefreq>weekly</changefreq>';
//         $xml .= '<priority>0.5</priority>';
//         $xml .= '</url>';

    foreach($contents as $content) 
    {
        $type = strtolower($block_obj::$_types[$content['strContentType']]);
        $xml .= '<url>';
        $xml .= '<loc>https://www.atelierdada.com/'.$content['language_slug'].'/'.$type.'/'.$content['strSlug'].'</loc>'; //The canicol URL to the item

        
        $lang = ($content['language_slug']=='en')?'fr':'en';
       
        $xml .= '<xhtml:link rel="alternate" hreflang="'.$lang.'" href="https://www.atelierdada.com/'.$lang.'/'.$type.'/'.$content['strSlug'].'"/>';  
         
        $xml .= '<lastmod>'.date('Y-m-d', strtotime($content['dtiModified'])).'</lastmod>';
        $xml .= '<changefreq>weekly</changefreq>';
        $xml .= '<priority>0.5</priority>';
        $xml .= '</url>';
    }

    $xml .= '</urlset>';

    die($xml);