// Get the header element
const header = document.getElementById("header");

window.addEventListener("scroll", function () {
    let header = document.querySelector(".header-scroll"); // Replace with the actual class or ID of your header

    if (header) {
        // Check if the element exists
        if (window.scrollY > 0) {
            header.classList.add("stiky-header");
        } else {
            header.classList.remove("stiky-header");
        }
    }
});
var x, i, j, l, ll, selElmnt, a, b, c;

x = document.getElementsByClassName("custom-select");
l = x.length;

for (i = 0; i < l; i++) {
    selElmnt = x[i].getElementsByTagName("select")[0];

    if (!selElmnt) continue; // Prevents the error

    ll = selElmnt.options.length; // Fixed: should be selElmnt.options.length

    a = document.createElement("DIV");
    a.setAttribute("class", "select-selected");
    a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
    x[i].appendChild(a);

    b = document.createElement("DIV");
    b.setAttribute("class", "select-items select-hide");

    for (j = 1; j < ll; j++) {
        c = document.createElement("DIV");
        c.innerHTML = selElmnt.options[j].innerHTML;
        c.addEventListener("click", function (e) {
            var y, k, s, h, sl, yl;
            s = this.parentNode.parentNode.getElementsByTagName("select")[0];
            sl = s.length;
            h = this.parentNode.previousSibling;
            for (k = 0; k < sl; k++) {
                if (s.options[k].innerHTML == this.innerHTML) {
                    s.selectedIndex = k;
                    h.innerHTML = this.innerHTML;
                    y = this.parentNode.getElementsByClassName("same-as-selected");
                    yl = y.length;
                    for (var m = 0; m < yl; m++) {
                        y[m].removeAttribute("class");
                    }
                    this.setAttribute("class", "same-as-selected");
                    break;
                }
            }
            h.click();
        });
        b.appendChild(c);
    }

    x[i].appendChild(b);
    a.addEventListener("click", function (e) {
        e.stopPropagation();
        closeAllSelect(this);
        this.nextSibling.classList.toggle("select-hide");
        this.classList.toggle("select-arrow-active");
    });
}

function closeAllSelect(elmnt) {
    var x,
        y,
        i,
        xl,
        yl,
        arrNo = [];
    x = document.getElementsByClassName("select-items");
    y = document.getElementsByClassName("select-selected");
    xl = x.length;
    yl = y.length;
    for (i = 0; i < yl; i++) {
        if (elmnt == y[i]) {
            arrNo.push(i);
        } else {
            y[i].classList.remove("select-arrow-active");
        }
    }
    for (i = 0; i < xl; i++) {
        if (arrNo.indexOf(i) === -1) {
            // Fixed condition
            x[i].classList.add("select-hide");
        }
    }
}

/*if the user clicks anywhere outside the select box,
then close all select boxes:*/
document.addEventListener("click", closeAllSelect);

// Tabbing Slider
$(document).ready(function () {
    $(".fade-slider").slick({
        dots: true,
        infinite: true,
        speed: 500,
        autoplay: true,
        autoplaySpeed: 2000,
        fade: true,
        cssEase: "linear",
    });

    initSliderOnePagingInfo();

    // Initialize the slick slider
    $(".grid-slider").slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: false,
        autoplaySpeed: 2000,
        arrows: true,
    });

    initSliderPagingInfo();

    $(".stay-slider").slick({
        dots: false,
        infinite: true,
        speed: 500,
        fade: true,
        cssEase: "linear",
        arrows: true,
    });

    initSliderPaging();

    $('#myTab button[data-bs-toggle="tab"]').on("shown.bs.tab", function (event) {
        const tab = $(event.target).data("bs-target");

        $(tab + " .grid-slider").slick("refresh");

        // ... and refresh its slider.
        $(tab + " .stay-slider").slick("refresh");
        $(tab + " .stay-slider").slick("setPosition");

        // // Update the paging info on init, reInit, and afterChange events
        // $(tab + ' .stay-slider').on('init reInit afterChange', function (event, slick, currentSlide) {
        //   // Ensure currentSlide is defined; default to 0 if undefined
        //   var i = (typeof currentSlide === 'number' ? currentSlide : 0) + 1; console.log(slick);
        //   $(tab + ' .pagingInfo').html(i + "<span class='separator'> / </span><span class='slideCount'>" + slick.slideCount + '</span>');
        // });

        initSliderPaging();
        initSliderPagingInfo();
    });
});

function initSliderOnePagingInfo() {
    // Update the paging info on init, reInit, and afterChange events
    $("#sliderOne .grid-slider").on("init reInit afterChange", function (event, slick, currentSlide) {
        // Ensure currentSlide is defined; default to 0 if undefined
        if ($(event.target).hasClass("grid-slider")) {
            var i = (typeof currentSlide === "number" ? currentSlide : 0) + 1;
            $("#sliderOne .pagingInfo").html(i + "<span class='separator'> / </span><span class='slideCount'>" + slick.slideCount + "</span>");
        }
    });

    $("#sliderTwo .grid-slider").on("init reInit afterChange", function (event, slick, currentSlide) {
        // Ensure currentSlide is defined; default to 0 if undefined
        var i = (typeof currentSlide === "number" ? currentSlide : 0) + 1;
        $("#sliderTwo .pagingInfo").html(i + "<span class='separator'> / </span><span class='slideCount'>" + slick.slideCount + "</span>");
    });

    $("#sliderThree .grid-slider").on("init reInit afterChange", function (event, slick, currentSlide) {
        // Ensure currentSlide is defined; default to 0 if undefined
        var i = (typeof currentSlide === "number" ? currentSlide : 0) + 1;
        $("#sliderThree .pagingInfo").html(i + "<span class='separator'> / </span><span class='slideCount'>" + slick.slideCount + "</span>");
    }); // Trigger slick's 'init' event manually to update pagination on page load
}

function initSliderPagingInfo() {
    // Update the paging info on init, reInit, and afterChange events
    $("#tab-0 .stay-slider").on("init reInit afterChange", function (event, slick, currentSlide) {
        // Ensure currentSlide is defined; default to 0 if undefined
        var i = (typeof currentSlide === "number" ? currentSlide : 0) + 1;
        $("#tab-0 .pagingInfo").html(i + "<span class='separator'> / </span><span class='slideCount'>" + slick.slideCount + "</span>");
    });

    // Update the paging info on init, reInit, and afterChange events
    $("#tab-1 .stay-slider").on("init reInit afterChange", function (event, slick, currentSlide) {
        // Ensure currentSlide is defined; default to 0 if undefined
        var i = (typeof currentSlide === "number" ? currentSlide : 0) + 1;
        $("#tab-1 .pagingInfo").html(i + "<span class='separator'> / </span><span class='slideCount'>" + slick.slideCount + "</span>");
    });
}
function initSliderPaging() {
    // When the mainButton is clicked
    $("#tab-0 .stay-slider-arrow .custome-left-arrow").click(function () {
        // Simulate a click on button2
        $("#tab-0 .stay-slider-arrow .slick-prev").click();
    });
    $("#tab-0 .stay-slider-arrow .custome-right-arrow").click(function () {
        // Simulate a click on button2
        $("#tab-0 .stay-slider-arrow .slick-next").click();
    });

    // When the mainButton is clicked
    $("#tab-1 .stay-slider-arrow .custome-left-arrow").click(function () {
        // Simulate a click on button2
        $("#tab-1 .stay-slider-arrow .slick-prev").click();
    });
    $("#tab-1 .stay-slider-arrow .custome-right-arrow").click(function () {
        // Simulate a click on button2
        $("#tab-1 .stay-slider-arrow .slick-next").click();
    });
}

$(document).ready(function () {
    $(".slider-one .custome-left-arrow").click(function () {
        // Simulate a click on button2
        $(".slider-one .slick-prev").click();
    });
    $(".slider-one .custome-right-arrow").click(function () {
        // Simulate a click on button2
        $(".slider-one .slick-next").click();
    });
    $(".slider-two .custome-left-arrow").click(function () {
        // Simulate a click on button2
        $(".slider-two .slick-prev").click();
    });
    $(".slider-two .custome-right-arrow").click(function () {
        // Simulate a click on button2
        $(".slider-two .slick-next").click();
    });
    $(".event-slider .event-left-arrow").click(function () {
        // Simulate a click on button2
        $(".event-slider .slick-prev").click();
    });
    $(".event-slider .event-right-arrow").click(function () {
        // Simulate a click on button2
        $(".event-slider .slick-next").click();
    });
    $(".testimonial-slider .event-left-arrow").click(function () {
        // Simulate a click on button2
        $(".testimonial-slider .slick-prev").click();
    });
    $(".testimonial-slider .event-right-arrow").click(function () {
        // Simulate a click on button2
        $(".testimonial-slider .slick-next").click();
    });
});

$(".event-slider").slick({
    centerMode: true,
    slidesToShow: 3,
    responsive: [
        {
            breakpoint: 768,
            settings: {
                arrows: false,
                centerMode: true,

                slidesToShow: 3,
            },
        },
        {
            breakpoint: 480,
            settings: {
                arrows: false,
                centerMode: true,
                slidesToShow: 1,
            },
        },
    ],
});
$(".testimonial-slider").slick({
    centerMode: true,
    slidesToShow: 1.67,
    responsive: [
        {
            breakpoint: 768,
            settings: {
                arrows: false,
                centerMode: true,

                slidesToShow: 1,
            },
        },
        {
            breakpoint: 480,
            settings: {
                arrows: false,
                centerMode: true,
                slidesToShow: 1,
            },
        },
    ],
});
$(".insta-slider").slick({
    dots: false,
    infinite: true,
    speed: 500,
    fade: true,
    cssEase: "linear",
    autoplaySpeed: 2000,
    autoplay: true,
});

document.addEventListener("DOMContentLoaded", function () {
    AOS.init();
});
$(".grid-slider-new").slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 2000,
    arrows: true,
    prevArrow: '<button type="button" class="slick-prev">←</button>',
    nextArrow: '<button type="button" class="slick-next">→</button>',
});

$(".grid-slider-new").on("init afterChange", function (event, slick, currentSlide) {
    let currentIndex = (currentSlide ? currentSlide : 0) + 1;
    let totalSlides = slick.slideCount;
    $(".slider-counter").text(currentIndex + " / " + totalSlides);
});

// Append the counter between arrows
$(".grid-slider-new").append('<div class="slider-counter">1 / 1</div>');

function reveal() {
    $(".page-loader, .page-loader-v, .animate__animated").each(function () {
        var className = $(this).data("class");
        var scroll = $(window).scrollTop() + $(window).height();
        var elementTop = $(this).offset().top;
        if (elementTop < scroll) {
            $(this).addClass(className);
        }
    });
}

window.addEventListener("scroll", reveal);
$(".dining-slider").slick({
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2000,
});