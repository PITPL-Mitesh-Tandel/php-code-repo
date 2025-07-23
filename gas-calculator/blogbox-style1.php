<article class="themetechmount-box themetechmount-box-blog themetechmount-blogbox-styleone themetechmount-blogbox-format-<?php echo get_post_format() ?> <?php echo themetechmount_sanitize_html_classes(themetechmount_post_class()); ?>">
	<div class="post-item">
		<div class="themetechmount-box-content">		
			<div class="tm-featured-outer-wrapper tm-post-featured-outer-wrapper">
				<?php echo themetechmount_get_featured_media( get_the_ID(), 'themetechmount-img-blog-top' ); ?>
			</div>		
			<div class="themetechmount-box-desc">
				<div class="tm-box-post-date">
				<?php echo get_the_date( 'Y' );?><br/>
					<span><?php echo get_the_date( 'd M' );?></span>
				</div>
				<div class="entry-header">
					<?php echo fablio_entry_meta(); ?>
					<?php echo themetechmount_box_title(); ?>
					<p class="axisevent"><?php echo themetechmount_blogbox_description(); ?></p>
					<p class="axiseventcolor"><?php echo themetechmount_blogbox_readmore(); ?></p>
				</div>						
			</div>
        </div>
	</div>
</article>
