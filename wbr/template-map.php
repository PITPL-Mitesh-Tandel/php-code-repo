<?php /* Template Name: Template E-Map Page*/
get_header();
?>
<section class="video-banner">
    <div class="banner-section">
        <?php $url = wp_get_attachment_url(get_post_thumbnail_id($post->ID)); ?>
        <?php if (has_post_thumbnail()) { ?>
            <img src="<?php echo $url ?>" class="w-100" alt="">
        <?php } else { ?>
            <img src="<?php echo get_bloginfo('stylesheet_directory') ?>/images/OVERALL_UNBRANDED.jpg" class="w-100" alt="">
        <?php } ?>
        <div class="banner-content">
            <h1><?php the_title(); ?></h1>
            <span class="circle-dot"></span>
        </div>
        <div class="banner-blue-opacity"></div>
    </div>
</section>
<section class="simple-layout deal-and-special-section text-center py-2">
    <div id="mapWidget"></div>
</section>
<script src="<?php echo get_bloginfo('stylesheet_directory') ?>/js/wbr-map.min.js"></script>
<script type="text/javascript">
    WBRMap.init('#mapWidget');
</script>
<?php get_footer(); ?>