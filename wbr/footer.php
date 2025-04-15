<?php
/**
 * @package WordPress
 * @subpackage Theme_Compat
 * @deprecated 3.0.0
 *
 * This file is here for backward compatibility with old themes and will be removed in a future version
 */
// _deprecated_file(
// 	/* translators: %s: Template name. */
// 	sprintf( __( 'Theme without %s' ), basename( __FILE__ ) ),
// 	'3.0.0',
// 	null,
// 	/* translators: %s: Template name. */
// 	sprintf( __( 'Please include a %s template in your theme.' ), basename( __FILE__ ) )
// );
?>
  <?php $footer_query = new WP_Query( array(  'p' => 13 , 'post_type' => 'any' ));
      while ($footer_query->have_posts() ) : $footer_query->the_post();
  ?>
  <footer>
    <div class="container-fluid">
      <div class="container">
        <div class="row">
          <div class="footer-main-links">
            <div class="quick-links">
              <ul class="footer-contact-details">
                <li><a href="<?php the_field('footer_add_link'); ?>" target="_blank"><img src="<?php echo get_bloginfo('stylesheet_directory')?>/images/map.svg" alt=""> <span><?php the_field('footer_address'); ?></span></a></li>
                <?php if(get_field('footer_phone_number')) :
                while(the_repeater_field('footer_phone_number')): ?>
                  <li><a href="callto:<?php the_sub_field('footer_phone_no');?>"><img src="<?php echo get_bloginfo('stylesheet_directory')?>/images/call-gold.svg" alt=""><span><?php the_sub_field('footer_phone_no');?></span></a></li>
                <?php
                endwhile;
                endif; ?>
              </ul>
            </div>
            <div class="quick-links">
              <?php wp_nav_menu( array('menu' => 'FooterMenu-1' )); ?>
            </div>
            <div class="quick-links">
              <?php wp_nav_menu( array('menu' => 'FooterMenu-2' )); ?>
            </div>
            <div class="quick-links">
              <ul class="social-group">
                <li class="footer-social-media">
                    <?php if(get_field('header_social_media')) :
                    while(the_repeater_field('header_social_media')): ?>
                      <a href="<?php the_sub_field('header_social_link');?>" target="_blank"><img src="<?php the_sub_field('header_social_icons');?>" alt="" /></a>
                    <?php
                    endwhile;
                    endif; ?>
                </li>
                <!-- <li><span>6<sub>4</sub> °F</span></li> -->
                <li>
                  <?php echo do_shortcode('[shortcode-weather-atlas selected_widget_id=8b07d63e]'); ?>
                </li>
                <li>
                  <p>&copy; <?php echo date("Y"); ?> Hilton, All Rights Reserved</p>
                </li>
                <li><a href="/privacy-policy/">Privacy Policy</a> <a href="/site-map/">Site Map</a></li>
                <li><a href="/ada-website-conformance/">ADA Website Conformance</a> <a href="/donations/">Donations</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <div class="footer-logos">
              <?php if(get_field('footer_bottom_logos')) :
              while(the_repeater_field('footer_bottom_logos')): ?>
                <?php if ( get_sub_field('footer_bottom_logo_link') == true ) { ?>
                  <a href="<?php the_sub_field('footer_bottom_logo_link');?>" target="_blank"><img src="<?php the_sub_field('footer_bottom_logo_image');?>" alt=""></a>
                <?php } else {?>
                  <img src="<?php the_sub_field('footer_bottom_logo_image');?>" alt="">
                <?php } ?>
              <?php
              endwhile;
              endif; ?>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
  <?php endwhile; wp_reset_postdata(); ?>
  <!-- Vendor JS Files -->
  <script src="<?php echo get_bloginfo('stylesheet_directory')?>/js/jquery-3.3.1.slim.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/js/bootstrap.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js"></script>
  <script src="<?php echo get_bloginfo('stylesheet_directory')?>/js/bootstrap.min.js"></script>
  <script src="<?php echo get_bloginfo('stylesheet_directory')?>/js/slick.js"></script>
 
  <script src="<?php echo get_bloginfo('stylesheet_directory')?>/js/custom.js?n=2"></script>
  <script src="https://storage.googleapis.com/embed-script.letsway.com/v1-latest/main.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js"></script>
  <!-- <script>
    document.addEventListener("DOMContentLoaded", function(){
        document.querySelector(".cmn-btn").addEventListener("click", function(event){
            event.preventDefault(); // Prevent default form submission (only needed for demo)
            setTimeout(function(){
                let modal = document.getElementById("exampleModalCenter");
                let bootstrapModal = bootstrap.Modal.getInstance(modal);
                bootstrapModal.hide(); // Close modal
            }, 500);
        });
    });
</script> -->
<script>
  document.addEventListener("DOMContentLoaded", function () {
    const menuLinks = document.querySelectorAll(".offcanvas-body a"); // Select all menu links
    const activeClass = "active"; // Class to apply

    // Retrieve the last active link from cookies
    const lastActiveLink = getCookie("activeMenu");

    if (lastActiveLink) {
        menuLinks.forEach(link => {
            if (link.href === lastActiveLink) {
                link.classList.add(activeClass); // Add active class
            }
        });
    }

    // Add click event to update the active menu item in cookies
    menuLinks.forEach(link => {
        link.addEventListener("click", function () {
            document.cookie = `activeMenu=${this.href}; path=/; max-age=86400`; // Save in cookie for 1 day
        });
    });

    // Function to get cookie value
    function getCookie(name) {
        const cookies = document.cookie.split("; ");
        for (let cookie of cookies) {
            const [key, value] = cookie.split("=");
            if (key === name) return decodeURIComponent(value);
        }
        return null;
    }
});

</script>
  <?php wp_footer(); ?>
</body>

</html>