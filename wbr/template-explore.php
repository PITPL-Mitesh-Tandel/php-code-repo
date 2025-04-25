<?php /* Template Name: Template Explore Page*/ 
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
<section class="resort-on-the-sand explore-before-after section-padding">
    <div class="container-fluid">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-12 col-md-8">
                    <h2><?php the_field('section_1_title'); ?></h2>
                    <?php the_field('section_1_content'); ?>
                </div>
            </div>
        </div>
    </div>
</section>
<section class="deal-special-book-list section-padding">
    <div class="container-fluid p-0">
    <?php if(get_field('section_2_columns_new')) :
    while(the_repeater_field('section_2_columns_new')): ?>
        <div class="row deal-special-book-list-row">
            <div class="col-12 col-md-7 p-0 jj-block page-loader" data-class="animate-rtl">
                <div class="page-wrapper"><img src="<?php the_sub_field('section_2_column_image');?>" class="w-100" alt=""></div>
            </div>
            <div class="col-12 col-md-5 deal-special-book-content list-with-icon aos-init aos-animate">
                <h4><?php the_sub_field('section_2_column_title');?></h4>
                <?php the_sub_field('section_2_column_description_top');?>
                <ul>
                    <?php if(get_sub_field('section_2_attractions')) :
                    while(the_repeater_field('section_2_attractions')): ?>
                        <li><img src="<?php the_sub_field('section_2_attraction_image');?>" alt=""><?php the_sub_field('section_2_attraction_title');?></li>
                    <?php
                        endwhile;
                        endif; ?>
                </ul>
                <?php if ( get_sub_field('section_2_column_btn_text') == true ) { ?>
                    <a href="<?php the_sub_field('section_2_column_btn_link');?>" class="cmn-btn"><?php the_sub_field('section_2_column_btn_text');?> <img src="<?php echo get_bloginfo('stylesheet_directory')?>/images/right-arrow.svg" alt=""></a>
                <?php } ?>
            </div>
        </div>
    <?php
        endwhile;
        endif; ?>       
    </div>
    </div>
</section>
<section class="instafeed section-padding">
  <div class="container-fluid">
    <div class="container">
      <div class="row">
        <div class="col-12 text-center">
          <h2 class="text-dark-blue"><?php the_field('instagram_section_title'); ?></h2>
          <p><img src="<?php echo get_bloginfo('stylesheet_directory')?>/images/insta-blue.svg" alt=""> <span><a href="<?php the_field('instagram_section_link'); ?>" target="_blank">waterfrontbeachresort</a> </span></p>
        </div>
        <div class="col-12">
          <div class="insta-slider">
            <?php 	
            $images = get_field('instagram_section_slider');	
            if( $images ): ?>	
            <?php foreach( $images as $image ): ?>	
                <div><img src="<?php echo esc_url($image['url']); ?>" alt="Image" class="w-100"></div>
            <?php endforeach; ?>
            <?php endif; ?>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
<?php get_footer(); ?>