<?php /* Template Name: Template Weddings Page*/ 
    get_header();
?>
<section class="video-banner">
    <div class="banner-section">
      <video autoplay loop muted>
        <source src="<?php the_field('section_1_video'); ?>" type="video/mp4">
        Your browser does not support the video tag.
      </video>
      <!-- <img src="<?php echo get_bloginfo('stylesheet_directory')?>/images/OVERALL_UNBRANDED.jpg" class="w-100" alt=""> -->
      <div class="banner-content text-center">
        <p><a href="mailto:weddings@waterfrontresort.com" class="cmn-btn mb-0 m-2">Contact our team</a></p>
        <span class="circle-dot"></span>
      </div>
      <div class="banner-blue-opacity"></div>
    </div>
  </section>
  <section class="section-padding weddings-section pb-0">
    <div class="container-fluid">
      <div class="row">
          <ul class="nav nav-tabs" id="myTab" role="tablist">
            <li class="nav-item" role="presentation">
              <a href="/weddings" class="nav-link active">Weddings</a>
            </li>
            <li class="nav-item" role="presentation">
              <a href="/weddings/venues" class="nav-link">Venues</a>
            </li>
            <li class="nav-item" role="presentation">
              <a href="/weddings/catering" class="nav-link"> Catering</a>
            </li>
            <li class="nav-item" role="presentation">
              <a href="/weddings/exquisite-cultural-weddings" class="nav-link"> Cultural Weddings</a>
            </li>
            <!-- <li class="nav-item" role="presentation">
              <a href="/weddings/plan-your-wedding" class="nav-link"> Plan Your Wedding</a>
            </li> -->
          </ul>
      </div>
    </div>
  </section>
  <section class="section-padding weddings-section pt-0">
    <div class="container-fluid">
      <div class="container pt-4">
        <div class="row justify-content-center">
          <div class="deal-and-special-card-list">
            <?php if(get_field('section_3_columns')) :
            while(the_repeater_field('section_3_columns')): ?>
                  <div class="deal-special white-card-opacity">
                    <a href="<?php the_sub_field('section_3_column_btn_link');?>" target="_blank">
                      <img src="<?php the_sub_field('section_3_column_image');?>" alt="Image">
                      <div class="card-opacity"></div>
                      <h3 class="card-title"><?php the_sub_field('section_3_column_name');?></h3>
                      <div class="deal-special-content">
                          <h3><?php the_sub_field('section_3_column_name');?></h3>
                          <p><?php the_sub_field('section_3_column_content');?></p>
                          <div><span class="cmn-btn">VIEW DETAILS <img src="<?php echo get_bloginfo('stylesheet_directory')?>/images/right-arrow.svg" alt=""></span></div>
                      </div>
                      </a>
                  </div>
            <?php
                endwhile;
                endif; ?>
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- <section class="section-padding deal-and-special-section bg-sky-blue">
    <div class="container-fluid">
      <div class="container">
        <div class="row justify-content-center">
          <div class="deal-and-special-card-list">
            <?php if(get_field('section_3_columns')) :
            while(the_repeater_field('section_3_columns')): ?>
                <div class="deal-special white-card-opacity">
                    <img src="<?php the_sub_field('section_3_column_image');?>" alt="Image">
                    <div class="card-opacity"></div>
                    <h3 class="card-title"><?php the_sub_field('section_3_column_name');?></h3>
                    <div class="deal-special-content">
                        <h3><?php the_sub_field('section_3_column_name');?></h3>
                        <p><?php the_sub_field('section_3_column_content');?></p>
                        <div><a href="<?php the_sub_field('section_3_column_btn_link');?>" class="cmn-btn">VIEW DETAILS <img src="<?php echo get_bloginfo('stylesheet_directory')?>/images/right-arrow.svg" alt=""></a>
                        </div>
                    </div>
                </div>
            <?php
                endwhile;
                endif; ?>
          </div>
        </div>
      </div>
    </div>
  </section> -->
  <section class="private-event-seciton section-padding private-dark-white-bk lets-plan-section" style="background-image: url('<?php the_field('section_4_image'); ?>');" >
    <div class="private-opacity-bk private-dark-white-opacity-bk"></div>
    <div class="container-fluid section-padding">
      <div class="container">
        <div class="row">
          <div class="col-12 col-md-6">
            <div class="private-event-content">
              <h2 class="text-uppercase"><?php the_field('section_4_title'); ?></h2>
              <h6 class="writing-text"><?php the_field('section_4_sub_title'); ?></h6>
              <?php the_field('section_4_content'); ?>
              <a href="<?php the_field('section_4_btn_link'); ?>" class="cmn-btn">Contact our team <img src="<?php echo get_bloginfo('stylesheet_directory')?>/images/right-arrow.svg" alt=""></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section class="section-padding deal-special-book-list weddings-section">
    <div class="container-fluid p-0">
      <div class="row deal-special-book-list-row justify-content-center">
        <div class="col-12 col-md-8 text-center amenities-section">
            <h2 class="text-uppercase" style="color: #796646;"><?php the_field('section_2_title'); ?></h2>
            <h6 class="writing-text"><?php the_field('section_2_sub_title'); ?></h6>
            <?php the_field('section_2_content'); ?>
            <p><img src="<?php the_field('section_2_logo'); ?>" class="bsw-icon" alt=""></p>
            <p class="">
                <?php if(get_field('section_2_buttons')) :
                while(the_repeater_field('section_2_buttons')): ?>
                    <a href="<?php the_sub_field('section_2_button_link');?>" class="cmn-btn mb-0 m-2"><?php the_sub_field('section_2_button_name');?> <img src="<?php echo get_bloginfo('stylesheet_directory')?>/images/right-arrow.svg" alt=""></a>
                <?php
                endwhile;
                endif; ?>
            </p>
          </div>
      </div>
    </div>
  </section>
  <section class="section-padding deal-special-book-list bg-white pt-0 pb-0">
    <div class="container-fluid p-0">
      <div class="row deal-special-book-list-row justify-content-center">
        <div class="col-12 col-md-6 deal-special-book-content amenities-section two-grid-li" data-aos="fade-up"
          data-aos-anchor-placement="center-bottom">
          <h2 class="text-goldan text-uppercase"><?php the_field('section_5_title'); ?></h2>
          <h6 class="writing-text"><?php the_field('section_5_sub_title'); ?></h6>
          <?php the_field('section_5_content'); ?>
        </div>
      </div>
    </div>
  </section>
  <section class="position-relative">
    <img src="<?php the_field('section_6_image'); ?>" class="w-100" alt="">
  </section>
  <section class="section-padding event-section">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12 text-center mb-3">
          <h2 class="text-goldan">Testimonials</h2>
        </div>
        <div class="col-12">
          <div class="testimonial-slider">
            <?php if(get_field('reviews')) :
            while(the_repeater_field('reviews')): ?>
            <div>
              <div class="testimonial-slider-arrow">
                <img src="<?php echo get_bloginfo('stylesheet_directory')?>/images/slider-left-arrow.png" class="event-left-arrow" alt="">
                <img src="<?php echo get_bloginfo('stylesheet_directory')?>/images/slider-right-arrow.png" class="event-right-arrow" alt="">
              </div>
              <div class="testimonial-card">
                <p><?php the_sub_field('review_content');?></p>
                <p class="author"><?php the_sub_field('review_name');?></p>
                <p class="rating-star">
                    <?php if(get_sub_field('review_star')) :
                    while(the_repeater_field('review_star')): ?>
                        <img src="<?php the_sub_field('review_star_image');?>" alt="">
                    <?php
                    endwhile;
                    endif; ?>
                </p>
              </div>
            </div>
            <?php
                endwhile;
                endif; ?>
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- <section class="deal-special-book-list section-padding bg-sky-blue share-plan">
    <div class="container-fluid p-0">
      <div class="row deal-special-book-list-row">
        <div class="col-12 col-md-6 deal-special-book-content aos-init aos-animate" data-aos="fade-up" data-aos-anchor-placement="center-bottom">
          <div class="private-event-content">
            <h2 class="text-uppercase"><?php the_field('section_8_title'); ?></h2>
            <h6 class="writing-text"><?php the_field('section_8_subtitle'); ?></h6>
            <?php the_field('section_8_content'); ?>
            <a href="<?php the_field('section_8_btn_link'); ?>" class="cmn-btn"><?php the_field('section_8_btn_text'); ?> <img src="<?php echo get_bloginfo('stylesheet_directory')?>/images/right-arrow.svg" alt=""></a>
          </div>
        </div>
        <div class="col-12 col-md-6 p-0 jj-block">
          <img src="<?php the_field('section_8_image'); ?>" class="w-100" alt="">
        </div>
      </div>
    </div>
  </section> -->
  <section class="instafeed section-padding">
    <div class="container-fluid">
      <div class="container">
        <div class="row">
          <div class="col-12 text-center">
            <h2 class="text-dark-blue"><?php the_field('instagram_section_title'); ?></h2>
            <p><img src="<?php echo get_bloginfo('stylesheet_directory')?>/images/insta-blue.svg" alt=""> <span> <a href="<?php the_field('instagram_section_link'); ?>">waterfrontweddings</a></span></p>
          </div>
          <div class="col-12">
            <div class="insta-slider">
                <?php 	
                $images = get_field('instagram_section_slider');	
                if( $images ): ?>	
                <?php foreach( $images as $image ): ?>	
                <div>
                    <img src="<?php echo esc_url($image['url']); ?>" alt="">
                </div>
                <?php endforeach; ?>
                <?php endif; ?>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <style>
    .banner-content .cmn-btn {
        padding: 11px 15px 11px 15px;
    }
    .banner-content a.cmn-btn img{
        position: relative !important;
    }
    .weddings-section {
      background-color: #f0ede8;
   }
  .weddings-section #myTab {
      background: var(--BG, #faf8f4);
  }
  </style>
<?php get_footer(); ?>