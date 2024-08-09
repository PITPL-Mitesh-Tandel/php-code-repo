$('.jcarousel')
.on('jcarousel:createend', function() {
	$(this).jcarousel('scroll', $('.jcarousel li:eq('+get_initialSlide($('.jcarousel').find("ul"))+')'), false);
}).jcarousel();

$('.jcarousel-prev').on('jcarouselcontrol:active', function() {
	$(this).removeClass('inactive');
}).on('jcarouselcontrol:inactive', function() {
	$(this).addClass('inactive');
}).jcarouselControl({
	target: '-=1'
});


$('.jcarousel-next').on('jcarouselcontrol:active', function() {
	$(this).removeClass('inactive');
}).on('jcarouselcontrol:inactive', function() {
	$(this).addClass('inactive');
}).jcarouselControl({
	target: '+=1'
});

function get_initialSlide(el){
  var initialSlide = $( ".month-day" ).index( el.find('.month-day.active') )
  return parseInt(initialSlide);
}
