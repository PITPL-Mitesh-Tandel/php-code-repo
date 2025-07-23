<article class="themetechmount-box themetechmount-box-blog themetechmount-blogbox-styleone themetechmount-blogbox-stylefive themetechmount-blogbox-format-<?php echo get_post_format() ?> <?php echo themetechmount_sanitize_html_classes(themetechmount_post_class()); ?>">
	<div class="post-item">
		<div class="themetechmount-box-content">		
			<div class="tm-featured-outer-wrapper tm-post-featured-outer-wrapper">
				<?php echo themetechmount_get_featured_media( get_the_ID(), 'themetechmount-img-blog-top' ); ?>
			</div>		
			<div class="themetechmount-box-desc">
				<div class="entry-header">
					<?php echo themetechmount_box_title(); ?>
					
					<?php /* echo fablio_entry_meta(); */ ?>
					<div class="tm-box-desc">
						<?php echo themetechmount_blogbox_description(); ?>
					</div>
					<?php echo themetechmount_blogbox_readmore(); ?>
					<div class="tm-blog-readmore-icon">						    
						<a href="<?php echo esc_url( get_permalink() ); ?>" rel="bookmark" target="_blank"><i class="fa fa-long-arrow-right"></i></a>	
					</div>
				</div>						
			</div>
        </div>
	</div>
</article>
