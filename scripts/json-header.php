<?php
header("Content-Type: application/json; charset=utf-8");
$response = array(
  "test" => "test"
);
die(json_encode($response));
?>
<script>
$(document).ready(function() { 
	$('.header-nav-item .header-nav-folder-title').each(function() {
      	if ($(this).text().trim() == 'SERVICES') {
          $(this).click(function() {
          	window.location = '/rhinoplasty-and-septoplasty';
          });
        }
	});
});
</script>
