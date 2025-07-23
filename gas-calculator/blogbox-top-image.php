<article class="themetechmount-box themetechmount-box-blog themetechmount-blogbox-top-image themetechmount-blogbox-format-<?php echo get_post_format() ?> <?php echo themetechmount_sanitize_html_classes(themetechmount_post_class()); ?>">
	<div class="post-item">
		<div class="themetechmount-box-content">		
			<div class="tm-featured-outer-wrapper tm-post-featured-outer-wrapper">
				 <?php  echo themetechmount_get_featured_media( '', 'themetechmount-img-blog-top' ); ?>
			</div>		
			<div class="themetechmount-box-desc">
							
				<div class="entry-header">
				<?php	// Category list
					$categories_list = get_the_category_list( ', ' );
					if ( !empty($categories_list) ) { ?>
					<span class="ts-meta-line cat-links"><span class="screen-reader-text ts-hide"><?php echo esc_attr_x( 'Categories', 'Used before category names.', 'fablio' ); ?> </span><?php echo themetechmount_wp_kses($categories_list); ?></span>
					<?php } ?>

					
					<?php echo themetechmount_box_title(); ?>
					<div class="tm-box-desc tm-entry-meta-wrapper">
						<div class="tm-blog-avatar tm-wrap-cell">
							<?php echo get_avatar( get_the_author_meta( 'ID' ), 32 );?> 
							<div class="author-name">
							<?php echo sprintf( esc_html__( '%1$s', 'fablio' ), get_the_author() ); ?></div>
						</div>

						<div class="entry-meta tm-entry-meta tm-entry-meta-blogbox tm-wrap-cell">
						
						 <!-- date -->
						<span class="tm-meta-line posted-on">
						<i class="fa fa-calendar"></i>
						<span class="screen-reader-text themetechmount-hide">
							<?php echo esc_attr_x( 'Posted on', 'Used before publish date.', 'elic' ); ?>
						</span>
						<a href="<?php the_permalink(); ?>" rel="bookmark">
							<time class="entry-date published" datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>"><?php echo get_the_date( get_option('date_format') ); ?></time>
							<time class="updated themetechmount-hide" datetime="<?php echo esc_attr( get_the_modified_date( 'c' ) ); ?>"><?php echo get_the_modified_date( get_option('date_format') ); ?></time>
						</a>
						</span>

						<!-- comment -->
						<?php
						if ( ! post_password_required() && ( comments_open() || get_comments_number() ) ) {
						?>
						<span class="tm-meta-line comments-link">
							<a href="<?php comments_link(); ?>"><i class="tm-fablio-icon-comment-2"></i> <?php echo get_comments_number(); ?>&nbsp;<?php echo esc_attr__( 'Comments', 'fablio' ); ?></a>
						</span>
						<?php
						}
						?>	
						
						</div>

						<div class="tm-box-social tm-wrap-cell">
							<?php echo themetechmount_social_share_box('post'); ?>
						</div>	
					</div>
				</div>						
					<?php echo themetechmount_blogbox_readmore(); ?>
			</div>
        </div>
	</div>
</article>
