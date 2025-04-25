<?php /* Template Name: Template Experiences Page*/ 
    get_header();
?>
<section class="video-banner">
    <div class="banner-section">
    <?php $url = wp_get_attachment_url( get_post_thumbnail_id($post->ID) ); ?>
    <?php if ( has_post_thumbnail() ) { ?>
    <img src="<?php echo $url ?>" class="w-100" alt="">
    <?php } else { ?>
    <img src="<?php echo get_bloginfo('stylesheet_directory')?>/images/OVERALL_UNBRANDED.jpg" class="w-100" alt="">
    <?php }?>
    <div class="banner-content">
        <h1><?php the_title();?></h1>
        <span class="circle-dot"></span>
    </div>
    <div class="banner-blue-opacity"></div>
    </div>
</section>
<section class="simple-layout goldan-bk text-center section-text-white section-padding pb-0">
    <div class="container-fluid">
        <div id="kouto-embed-root" data-brand-id="1532e416-e724-48db-ad73-0cf36575300b" class="kouto-v2"></div>
    </div>
  </section>
<?php get_footer(); ?>

<style>
  .goldan-bk {
    background-color: #FAF8F4;
  }
  #kouto-embed-root .sc-jtTWFk {
      color: #333333 !important;
  }
  .dOrJeL {
      display: none !important;
  }
  #kouto-app-root footer {
    display: none !important;
  }
</style>