<article class="themetechmount-box themetechmount-box-blog themetechmount-blogbox-style4 themetechmount-blogbox-format-<?php echo get_post_format() ?> <?php echo themetechmount_sanitize_html_classes(themetechmount_post_class()); ?>">
	<div class="post-item">
		<div class="themetechmount-box-content">		
			<div class="tm-featured-outer-wrapper tm-post-featured-outer-wrapper">
				<?php echo themetechmount_get_featured_media( get_the_ID(), 'themetechmount-img-blog-top' ); ?>
						<?php
						// Date
						$date_format =  get_option('date_format'); ?>
						<span class="tm-meta-line posted-on tm-posted-date">
						 
							<span class="screen-reader-text tm-hide"><?php echo esc_attr_x( 'Posted on', 'Used before publish date.', 'fablio' ); ?> </span>
							<i class="fa fa-calendar"></i>
							<a href="<?php echo esc_url( get_permalink() ); ?>" rel="bookmark">
								<time class="entry-date published" datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>"><?php echo get_the_date($date_format); ?></time>
								<time class="updated tm-hide" datetime="<?php echo esc_attr( get_the_modified_date( 'c' ) ); ?>"><?php echo get_the_modified_date($date_format); ?></time>
							</a>
						</span>
			</div>		
			<div class="themetechmount-box-desc">
				<div class="entry-header">
					<div class="tm-entry-meta-wrapper">
<div class="entry-meta tm-entry-meta tm-entry-meta-blogbox">
<span class="tm-meta-line comments-link"><i class="tm-fablio-icon-comment-2"></i> 
<a href="<?php echo get_permalink();?>">
	<?php 
	$num_comments    = get_comments_number();			
	$comments_code = '';
	if( !is_sticky() && comments_open() && ($num_comments>=0) ){
		$comments_code .= $num_comments;
		$comments_code .= esc_attr( ' Comments', 'fablio' );
		?>
	<?php }
	echo themetechmount_wp_kses($comments_code);
	?>
</a></span><span class="tm-meta-line cat-links"><i class="tm-fablio-icon-category"></i>
<?php
// Category list
$categories_list = get_the_category_list( ', ' );
if ( !empty($categories_list) ) { ?>
<span class="ts-meta-line cat-links"><span class="screen-reader-text ts-hide"><?php echo esc_attr_x( 'Categories', 'Used before category names.', 'fablio' ); ?> </span><?php echo themetechmount_wp_kses($categories_list); ?></span>
<?php } ?></span></div>
</div>
					<?php echo themetechmount_box_title(); ?>
					<div class="tm-box-desc"><?php echo themetechmount_blogbox_description(); ?></div>
					<?php echo themetechmount_blogbox_readmore(); ?>
				</div>						
			</div>
        </div>
	</div>
</article>
           