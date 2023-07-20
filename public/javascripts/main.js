/*--------------------------------------------------
Template Name: limupa;
Description: limupa - Digital Products Store ECommerce Bootstrap 4 Template;
Template URI:;
Author Name:HasTech;
Author URI:;
Version: 1;
Note: main.js, All Default Scripting Languages For This Theme Included In This File.
-----------------------------------------------------
		CSS INDEX
		================
		01. Li's Meanmenu
		02. Header Dropdown
		03. Li's Sticky Menu Activation
		04. Nice Select
		05. Main Slider Activision
		06. Li's Product Activision
		07. Li's Product Activision
		08. Countdown
		09. Tooltip Active
		10. Scroll Up
		11. Category Menu
		12. Li's Product Activision
		13. FAQ Accordion
		14. Toggle Function Active
		15. Li's Blog Gallery Slider
		16. Counter Js
		17. Price slider
		18. Category menu Activation
		19. Featured Product active
		20. Featured Product 2 active
		21. Modal Menu Active
		22. Cart Plus Minus Button
		23. Single Prduct Carousel Activision
		24. Star Rating Js
		25. Zoom Product Venobox
		26. WOW

-----------------------------------------------------------------------------------*/

// Add event listener for the "pageshow" event
window.addEventListener("pageshow", function (event) {
    // Check the persisted property of the event object to determine if the page is being loaded from the cache
    // The pageshow event is also fired when the page is loaded from the cache, so we need to check the persisted property
    if (event.persisted) {
        // If the page is being loaded from the cache (i.e., the "Previous" button was clicked), refresh the page
        window.location.reload(true);
    }
});

(function ($) {
    "use Strict";
    /*----------------------------------------*/
    /* 	01. Li's Meanmenu
	/*----------------------------------------*/
    jQuery(".hb-menu nav").meanmenu({
        meanMenuContainer: ".mobile-menu",
        meanScreenWidth: "991",
    });
    /*----------------------------------------*/
    /*  02. Header Dropdown
	/*----------------------------------------*/
    // Li's Dropdown Menu
    $(".ht-setting-trigger, .ht-currency-trigger, .ht-language-trigger, .hm-minicart-trigger, .cw-sub-menu").on(
        "click",
        function (e) {
            e.preventDefault();
            $(this).toggleClass("is-active");
            $(this).siblings(".ht-setting, .ht-currency, .ht-language, .minicart, .cw-sub-menu li").slideToggle();
        }
    );
    // Close the toggled elements when clicking outside
    $(document).on("click", function (e) {
        const clickedElement = e.target;

        // Check if the clicked element is inside the toggle elements
        const isInsideToggleElements =
            $(clickedElement).closest(
                ".ht-setting-trigger, .ht-currency-trigger, .ht-language-trigger, .hm-minicart-trigger, .cw-sub-menu"
            ).length > 0;

        // If the clicked element is not inside the toggle elements, close them
        if (!isInsideToggleElements) {
            $(
                ".ht-setting-trigger, .ht-currency-trigger, .ht-language-trigger, .hm-minicart-trigger, .cw-sub-menu"
            ).removeClass("is-active");
            $(".ht-setting, .ht-currency, .ht-language, .minicart, .cw-sub-menu li").slideUp();
        }
    });

    // // Prevent the click event from propagating when clicking inside the toggle elements
    // $(".ht-setting, .ht-currency, .ht-language, .minicart, .cw-sub-menu li").on("click", function (e) {
    //     e.stopPropagation();
    // });
    $(".ht-setting-trigger.is-active").siblings(".catmenu-body").slideDown();
    /*----------------------------------------*/
    /* 03. Li's Sticky Menu Activation
	/*----------------------------------------*/
    $(window).on("scroll", function () {
        if ($(this).scrollTop() > 300) {
            $(".header-sticky").addClass("sticky");
        } else {
            $(".header-sticky").removeClass("sticky");
        }
    });
    /*----------------------------------------*/
    /*  04. Nice Select
	/*----------------------------------------*/
    $(document).ready(function () {
        $(".nice-select").niceSelect();
    });
    /*----------------------------------------*/
    /* 05. Main Slider Activision
	/*----------------------------------------*/
    $(".slider-active").owlCarousel({
        loop: true,
        margin: 0,
        nav: true,
        autoplay: true,
        items: 1,
        autoplayTimeout: 10000,
        navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
        dots: true,
        autoHeight: true,
        lazyLoad: true,
    });
    /*----------------------------------------*/
    /* 06. Li's Product Activision
	/*----------------------------------------*/
    $(".product-active").owlCarousel({
        loop: true,
        nav: true,
        dots: false,
        autoplay: false,
        autoplayTimeout: 5000,
        navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
        item: 5,
        responsive: {
            0: {
                items: 1,
            },
            480: {
                items: 2,
            },
            768: {
                items: 3,
            },
            992: {
                items: 4,
            },
            1200: {
                items: 5,
            },
        },
    });
    /*----------------------------------------*/
    /* 07. Li's Product Activision
	/*----------------------------------------*/
    $(".special-product-active").owlCarousel({
        loop: true,
        nav: false,
        dots: false,
        autoplay: false,
        autoplayTimeout: 5000,
        navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-left"></i>'],
        item: 4,
        responsive: {
            0: {
                items: 1,
            },
            480: {
                items: 1,
            },
            768: {
                items: 2,
            },
            992: {
                items: 3,
            },
            1200: {
                items: 4,
            },
        },
    });
    /*----------------------------------------*/
    /* 08. Countdown
	/*----------------------------------------*/
    $(".li-countdown").countdown("2019/12/01", function (event) {
        $(this).html(
            event.strftime(
                '<div class="count">%D <span>Days:</span></div> <div class="count">%H <span>Hours:</span></div> <div class="count">%M <span>Mins:</span></div><div class="count"> %S <span>Secs</span></div>'
            )
        );
    });
    /*----------------------------------------*/
    /* 09. Tooltip Active
	/*----------------------------------------*/
    $(".product-action a, .social-link a").tooltip({
        animated: "fade",
        placement: "top",
        container: "body",
    });
    /*----------------------------------------*/
    /* 10. Scroll Up
	/*----------------------------------------*/
    $.scrollUp({
        scrollText: '<i class="fa fa-angle-double-up"></i>',
        easingType: "linear",
        scrollSpeed: 900,
    });
    /*----------------------------------------*/
    /* 11. Category Menu
	/*----------------------------------------*/
    $(".rx-parent").on("click", function () {
        $(".rx-child").slideToggle();
        $(this).toggleClass("rx-change");
    });
    //    category heading
    $(".category-heading").on("click", function () {
        $(".category-menu-list").slideToggle(300);
    });
    /*-- Category Menu Toggles --*/
    function categorySubMenuToggle() {
        var screenSize = $(window).width();
        if (screenSize <= 991) {
            $("#cate-toggle .right-menu > a").prepend('<i class="expand menu-expand"></i>');
            $(".category-menu .right-menu ul").slideUp();
            //        $('.category-menu .menu-item-has-children i').on('click', function(e){
            //            e.preventDefault();
            //            $(this).toggleClass('expand');
            //            $(this).siblings('ul').css('transition', 'none').slideToggle();
            //        })
        } else {
            $(".category-menu .right-menu > a i").remove();
            $(".category-menu .right-menu ul").slideDown();
        }
    }
    categorySubMenuToggle();
    $(window).resize(categorySubMenuToggle);

    /*-- Category Sub Menu --*/
    function categoryMenuHide() {
        var screenSize = $(window).width();
        if (screenSize <= 991) {
            $(".category-menu-list").hide();
        } else {
            $(".category-menu-list").show();
        }
    }
    categoryMenuHide();
    $(window).resize(categoryMenuHide);
    $(".category-menu-hidden").find(".category-menu-list").hide();
    $(".category-menu-list").on("click", "li a, li a .menu-expand", function (e) {
        var $a = $(this).hasClass("menu-expand") ? $(this).parent() : $(this);
        if ($a.parent().hasClass("right-menu")) {
            if ($a.attr("href") === "#" || $(this).hasClass("menu-expand")) {
                if ($a.siblings("ul:visible").length > 0) $a.siblings("ul").slideUp();
                else {
                    $(this).parents("li").siblings("li").find("ul:visible").slideUp();
                    $a.siblings("ul").slideDown();
                }
            }
        }
        if ($(this).hasClass("menu-expand") || $a.attr("href") === "#") {
            e.preventDefault();
            return false;
        }
    });
    /*----------------------------------------*/
    /* 12. Li's Product Activision
	/*----------------------------------------*/
    $(".li-featured-product-active").owlCarousel({
        loop: true,
        nav: false,
        dots: false,
        margin: 30,
        autoplay: false,
        autoplayTimeout: 5000,
        navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-left"></i>'],
        item: 2,
        responsive: {
            0: {
                items: 1,
            },
            480: {
                items: 2,
            },
            768: {
                items: 2,
            },
            992: {
                items: 2,
            },
            1200: {
                items: 2,
            },
        },
    });
    /*----------------------------------------*/
    /* 13. FAQ Accordion
	/*----------------------------------------*/
    $(".card-header a").on("click", function () {
        $(".card").removeClass("actives");
        $(this).parents(".card").addClass("actives");
    });
    /*----------------------------------------*/
    /* 14. Toggle Function Active
	/*----------------------------------------*/
    // showlogin toggle
    $("#showlogin").on("click", function () {
        $("#checkout-login").slideToggle(900);
    });
    // showlogin toggle
    $("#showcoupon").on("click", function () {
        $("#checkout_coupon").slideToggle(900);
    });
    // showlogin toggle
    $("#cbox").on("click", function () {
        $("#cbox-info").slideToggle(900);
    });

    // showlogin toggle
    $("#ship-box").on("click", function () {
        $("#ship-box-info").slideToggle(1000);
    });
    /*----------------------------------------*/
    /* 15. Li's Blog Gallery Slider
	/*----------------------------------------*/
    var gallery = $(".li-blog-gallery-slider");
    gallery.slick({
        arrows: false,
        autoplay: true,
        autoplaySpeed: 5000,
        pauseOnFocus: false,
        pauseOnHover: false,
        fade: true,
        dots: true,
        infinite: true,
        slidesToShow: 1,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    arrows: false,
                },
            },
        ],
    });
    /*----------------------------------------*/
    /* 16. Counter Js
	/*----------------------------------------*/
    $(".counter").counterUp({
        delay: 10,
        time: 1000,
    });
    /*----------------------------------------*/
    /* 17. Price slider
	/*----------------------------------------*/
    var sliderrange = $("#slider-range");
    var amountprice = $("#amount");
    $(function () {
        sliderrange.slider({
            range: true,
            min: 0,
            max: 1200,
            values: [300, 800],
            slide: function (event, ui) {
                amountprice.val("$" + ui.values[0] + " - $" + ui.values[1]);
            },
        });
        amountprice.val("$" + sliderrange.slider("values", 0) + " - $" + sliderrange.slider("values", 1));
    });
    /*----------------------------------------*/
    /* 18. Category menu Activation
	/*----------------------------------------*/
    $(".category-sub-menu li.has-sub > a").on("click", function () {
        $(this).removeAttr("href");
        var element = $(this).parent("li");
        if (element.hasClass("open")) {
            element.removeClass("open");
            element.find("li").removeClass("open");
            element.find("ul").slideUp();
        } else {
            element.addClass("open");
            element.children("ul").slideDown();
            element.siblings("li").children("ul").slideUp();
            element.siblings("li").removeClass("open");
            element.siblings("li").find("li").removeClass("open");
            element.siblings("li").find("ul").slideUp();
        }
    });
    /*----------------------------------------*/
    /* 19. Featured Product active
	/*----------------------------------------*/
    $(".featured-product-active").owlCarousel({
        loop: true,
        nav: true,
        autoplay: false,
        autoplayTimeout: 5000,
        navText: ['<i class="ion-ios-arrow-back"></i>', '<i class="ion-ios-arrow-forward"></i>'],
        item: 3,
        responsive: {
            0: {
                items: 1,
            },
            768: {
                items: 2,
            },
            992: {
                items: 2,
            },
            1100: {
                items: 2,
            },
            1200: {
                items: 2,
            },
        },
    });
    /*----------------------------------------*/
    /* 20. Featured Product 2 active
	/*----------------------------------------*/
    $(".featured-product-active-2").owlCarousel({
        loop: true,
        nav: true,
        autoplay: false,
        autoplayTimeout: 5000,
        navText: ['<i class="ion-ios-arrow-back"></i>', '<i class="ion-ios-arrow-forward"></i>'],
        item: 3,
        responsive: {
            0: {
                items: 1,
            },
            768: {
                items: 2,
            },
            992: {
                items: 1,
            },
            1100: {
                items: 1,
            },
            1200: {
                items: 1,
            },
        },
    });
    /*----------------------------------------*/
    /* 21. Modal Menu Active
	/*----------------------------------------*/
    $(".product-details-images").each(function () {
        var $this = $(this);
        var $thumb = $this.siblings(".product-details-thumbs, .tab-style-left");
        $this.slick({
            arrows: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: false,
            autoplaySpeed: 5000,
            dots: false,
            infinite: true,
            centerMode: false,
            centerPadding: 0,
            asNavFor: $thumb,
        });
    });
    $(".product-details-thumbs").each(function () {
        var $this = $(this);
        var $details = $this.siblings(".product-details-images");
        $this.slick({
            slidesToShow: 4,
            slidesToScroll: 1,
            autoplay: false,
            autoplaySpeed: 5000,
            dots: false,
            infinite: true,
            focusOnSelect: true,
            centerMode: true,
            centerPadding: 0,
            prevArrow: '<span class="slick-prev"><i class="fa fa-angle-left"></i></span>',
            nextArrow: '<span class="slick-next"><i class="fa fa-angle-right"></i></span>',
            asNavFor: $details,
        });
    });
    $(".tab-style-left, .tab-style-right").each(function () {
        var $this = $(this);
        var $details = $this.siblings(".product-details-images");
        $this.slick({
            slidesToShow: 3,
            slidesToScroll: 1,
            autoplay: false,
            autoplaySpeed: 5000,
            dots: false,
            infinite: true,
            focusOnSelect: true,
            vertical: true,
            centerPadding: 0,
            prevArrow: '<span class="slick-prev"><i class="fa fa-angle-down"></i></span>',
            nextArrow: '<span class="slick-next"><i class="fa fa-angle-up"></i></span>',
            asNavFor: $details,
        });
    });
    /*----------------------------------------*/
    /* 22. Cart Plus Minus Button
	/*----------------------------------------*/
    // $(".cart-plus-minus").append('<div class="dec qtybutton"><i class="fa fa-angle-down"></i></div><div class="inc qtybutton"><i class="fa fa-angle-up"></i></div>');
    // $(".qtybutton").on("click", function () {
    // 	var $button = $(this);
    // 	var oldValue = $button.parent().find("input").val();
    // 	if ($button.hasClass('inc')) {
    // 		var newVal = parseFloat(oldValue) + 1;
    // 	} else {
    // 		// Don't allow decrementing below zero
    // 		if (oldValue > 0) {
    // 			var newVal = parseFloat(oldValue) - 1;
    // 		} else {
    // 			newVal = 0;
    // 		}
    // 	}
    // 	$button.parent().find("input").val(newVal);
    // });
    /*----------------------------------------*/
    /* 23. Single Prduct Carousel Activision
	/*----------------------------------------*/
    $(".sp-carousel-active").owlCarousel({
        loop: true,
        nav: false,
        dots: false,
        autoplay: false,
        autoplayTimeout: 5000,
        navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-left"></i>'],
        item: 4,
        responsive: {
            0: {
                items: 1,
            },
            480: {
                items: 2,
            },
            768: {
                items: 2,
            },
            992: {
                items: 3,
            },
            1200: {
                items: 4,
            },
        },
    });
    /*----------------------------------------*/
    /* 24. Star Rating Js
	/*----------------------------------------*/
    $(function () {
        $(".star-rating").barrating({
            theme: "fontawesome-stars",
        });
    });
    /*----------------------------------------*/
    /* 25. Zoom Product Venobox
	/*----------------------------------------*/
    $(".venobox").venobox({
        spinner: "wave",
        spinColor: "#cb9a00",
    });
    /*----------------------------------------*/
    /* 26. WOW
	/*----------------------------------------*/
    new WOW().init();
})(jQuery);
/*----------------------------------------------------------------------------------------------------*/
/*------------------------------------------> The End <-----------------------------------------------*/
/*----------------------------------------------------------------------------------------------------*/
$(document).ready(function () {
    $("#sign-up").validate({
        rules: {
            fname: {
                required: true,
                minlength: 3,
                maxlength: 20,
            },
            lname: {
                required: true,
                maxlength: 20,
            },
            email: {
                required: true,
                email: true,
            },
            password: {
                required: true,
                maxlength: 12,
            },
            password_confirm: {
                required: true,
                maxlength: 12,
                equalTo: '[name="password"]',
            },
        },
        messages: {
            fname: {
                required: "First name is empty",
            },
        },
    });
    $("#log-in").validate({
        rules: {
            login_email: {
                required: true,
                email: true,
            },
        },
        messages: {
            login_email: {
                required: "Please enter the email id",
                email: "Please enter a valid email id",
            },
        },
    });

    $("#addProducts").validate({
        rules: {
            name: {
                required: true,
            },
            category: {
                required: true,
            },
            price: {
                required: true,
            },
            manufacture: {
                required: true,
            },
            rating: {
                required: true,
            },
            tags: {
                required: true,
            },
            image: {
                required: true,
            },
            key_features: {
                required: true,
            },
            description: {
                required: true,
            },
        },
    });

    $("#log-in").validate({
        rules: {
            login_email: {
                required: true,
                email: true,
            },
            login_password: {
                required: true,
                maxlength: 12,
            },
        },
    });

    $("#change-password").validate({
        rules: {
            currentPassword: {
                required: true,
            },
            newPassword: {
                required: true,
            },
            confirmPassword: {
                required: true,
                equalTo: '[name="newPassword"]',
            },
        },
    });

    $("#change-email").validate({
        rules: {
            password: {
                required: true,
            },
            newEmail: {
                required: true,
                email: true,
            },
        },
    });

    $("#checkout-form").validate({
        rules: {
            checkout_fname: {
                required: true,
            },
            checkout_lname: {
                required: true,
            },
            checkout_email: {
                required: true,
                email: true,
            },
            checkout_flatNo: {
                required: true,
            },
            checkout_area: {
                required: true,
            },
            checkout_district: {
                required: true,
            },
            checkout_state: {
                required: true,
            },
            checkout_pincode: {
                required: true,
            },
            checkout_phone: {
                required: true,
            },
        },
    });

    $("#checkout-form2").validate({
        rules: {
            checkout_fname: {
                required: true,
            },
            checkout_lname: {
                required: true,
            },
            checkout_email: {
                required: true,
                email: true,
            },
            checkout_flatNo: {
                required: true,
            },
            checkout_area: {
                required: true,
            },
            checkout_district: {
                required: true,
            },
            checkout_state: {
                required: true,
            },
            checkout_pincode: {
                required: true,
            },
            checkout_phone: {
                required: true,
            },
        },
    });

    $("#payment").validate({
        rules: {
            payment: {
                required: true,
            },
        },
        messages: {
            payment: "Please select Payment Method",
        },
        errorPlacement: (error) => {
            // alert(error.text());
            $("#paymentErrorModal").modal("toggle");
            document.getElementById("errText").innerText = error.text();
        },
    });

    $("#reviewForm").validate({
        rules: {
            comment: { required: true },
            author: { required: true },
            author_email: {
                required: true,
            },
        },
    });

    $("#search").validate({
        rules: {
            search: {
                required: true,
            },
        },
        errorPlacement: function (error, element) {
            return true; // This prevents the error message from being displayed
        },
    });

    let user = document.getElementById("username").innerText;
    // alert(user)
    // Check if the modal has been shown before
    var modalShown = localStorage.getItem("modalShown");

    // Check if the user's account is "My Account"
    if (user === "My Account") {
        // Check if the page's location is the root URL "/"
        if (window.location.pathname === "/" && !modalShown) {
            // Show the modal
            $("#signup").modal("toggle");

            // Set the local storage to remember that the modal has been shown
            localStorage.setItem("modalShown", true);
        }
    }
    // Set a timeout to clear the local storage after 1 minute (in milliseconds)
    setTimeout(function () {
        localStorage.removeItem("modalShown");
      }, 3 * 60 * 60 * 1000); // 60,000 milliseconds = 1 minute 
});

function addToCart(prodId, category) {
    $.ajax({
        url: "/add-to-cart",
        method: "post",
        data: {
            prodId,
            category,
        },
        success: (response) => {
            if (response.status) {
                let count = $("#count-cart").html();
                count = parseInt(count) + 1;
                $("#count-cart").html(count);

                // Call the updateMiniCart function to update the mini cart with the new response data
                updateMiniCart(response.minicart, response.user);
                $("#cart-amount").text(response.totalAmount);
                $("#cart-amount2").text(response.totalAmount);
            } else {
                $("#exampleModalCenter").modal("hide");
                $("#signup").modal("show");
            }
        },
    });
}

// Function to update mini cart items using jQuery
function updateMiniCart(minicartData, user) {
    $("#minicart").empty();
    minicartData.forEach((product) => {
        // console.log(product);
        const listItem = $("<li></li>");

        // Construct the inner HTML content for each product using jQuery
        listItem.append(`
        <a href="#" class="minicart-product-image">
          <img src="/images/product/${product.category}/${product._id}/0.jpg" alt="cart products" />
        </a>`);
        listItem.append(`
        <div class="minicart-product-details">
          <h6><a href="#">${product.name}</a></h6>
          <span>₹ ${product.price} x ${product.quantity}</span>
        </div>`);
        listItem.append(`
        <button class="close" title="Remove">
          <i class="fa fa-trash" onclick="removeCartItem('${user._id}','${product._id}')"></i>
        </button>`);

        // Append the created li element to the ul element using jQuery's append method
        $("#minicart").append(listItem);
    });
}

function addToList(prodId) {
    $.ajax({
        url: "/add-to-list",
        method: "post",
        data: {
            prodId,
        },
        success: (response) => {
            if (response.status) {
                let count = $("#count-list").html();
                count = parseInt(count) + 1;
                $("#count-list").html(count);
            } else {
                // alert("Please Login...")
                $("#exampleModalCenter").modal("hide");
                $("#signup").modal("show");
            }
        },
    });
}

function removeCartItem(userId, prodId) {
    $.ajax({
        url: "/remove-from-cart",
        method: "post",
        data: {
            userId,
            prodId,
        },
        success: (response) => {
            if (response.status) {
                alert("Product will be removed");
                // location.reload();
                if (window.location.pathname === "/shopping-cart") {
                    updateMiniCart(response.minicart, response.user);
                    if (response.cart.length === 0) {
                        location.reload();
                    } else {
                        updateShopCart(response.cart, response.user);
                    }
                    $("#cart-amount").text(response.totalAmount);
                    $("#cart-amount2").text(response.totalAmount);
                    $("#count-cart").html(response.cartCount);
                    $(".cart-total").text("₹ " + response.totalAmount);
                } else {
                    updateMiniCart(response.minicart, response.user);
                    $("#cart-amount").text(response.totalAmount);
                    $("#cart-amount2").text(response.totalAmount);
                    $("#count-cart").html(response.cartCount);
                }
            }
        },
    });
}

function updateShopCart(items, user) {
    $("#shop-cart").empty();
    items.forEach((item) => {
        console.log(item);
        const tableRow = $("<tr></tr>");

        tableRow.append(`<td style="border:none;cursor: pointer;" class="li-product-remove"><a ><i
                            class="fa fa-trash"
                            style="font-size: large;"
                            onclick="removeCartItem('${user._id}','${item._id}')"
                        ></i></a></td>`);
        tableRow.append(`<td style="border:none" class="li-product-thumbnail"><a href="/single-product/{{this._id}}"><img
                            src="/images/product/${item.category}/${item._id}/0.jpg"
                            alt="Li's Product Image"
                            style="height:90px;"
                        /></a></td>`);
        tableRow.append(
            `<td style="border:none" class="li-product-name"><a href="/single-product/${item._id}">${item.name}</a></td>`
        );
        tableRow.append(`<td style="border:none" class="li-product-price"><span
                            class="amount"
                        >₹ ${item.price}</span></td>`);
        tableRow.append(`<td style="border:none" class="quantity">
                            <div class="cart-plus-minus">
                                <input class="cart-plus-minus-box quantityInput" value="${item.quantity}" type="text" id="${item._id}"/>
                                <div class="dec qtybutton" onclick="changeQty('${user._id}','${item._id}',-1)" ><i class="fa fa-angle-down"></i></div>
                                <div class="inc qtybutton" onclick="changeQty('${user._id}','${item._id}',1)"><i class="fa fa-angle-up"></i></div>
                            </div>
                        </td>`);
        tableRow.append(`<td style="border:none" class="product-subtotal"><span
                            class="amount"
                        >₹ ${item.prodPrice}</span></td>`);

        // Update the quantity input field value using jQuery
        const quantityInput = $(`#${item._id}`);
        quantityInput.val(item.quantity);
        $("#shop-cart").append(tableRow);
    });
}

function removeListItem(userId, prodId) {
    $.ajax({
        url: "/remove-from-list",
        method: "post",
        data: {
            userId,
            prodId,
        },
        success: (response) => {
            if (response.status) {
                alert("Product will be removed");
                location.reload();
            }
        },
    });
}

function changeQty(userId, prodId, count) {
    let quantity = parseInt(document.getElementById(prodId).value);
    count = parseInt(count);

    $.ajax({
        url: "/change-qty",
        method: "post",
        data: {
            userId,
            prodId,
            count,
            quantity,
        },
        success: (response) => {
            if (response.removeProduct) {
                alert("Product will be Removed");
                location.reload(true);
            } else {
                document.getElementById(prodId).value = quantity + count;
                location.reload(true);
            }
        },
    });
}

function openmodal(prodId) {
    console.log(prodId);
    $.ajax({
        url: "/product-modal",
        method: "post",
        data: {
            prodId,
        },
        success: (response) => {
            $("#exampleModalCenter #modalName").html(response.name);
            $("#exampleModalCenter #modalPrice").html(response.price);
            $("#exampleModalCenter #modalDescription").html(response.description);
            $("#exampleModalCenter #modalRating").html(response.rating);
            $("#exampleModalCenter #modalManufacture").html(response.manufacture);
            $(".image1").attr("src", "/images/product/" + response.category + "/" + response._id + "/0.jpg ");
            $(".image2").attr("src", `/images/product/${response.category}/${response._id}/1.jpg`);
            $(".image3").attr("src", "/images/product/" + response.category + "/" + response._id + "/2.jpg");
            $(".image4").attr("src", "/images/product/" + response.category + "/" + response._id + "/3.jpg");
            $(".image5").attr("src", `/images/product/${response.category}/${response._id}/4.jpg`);
            $("#exampleModalCenter").modal("show");
            $("#add-to-cart").on("click", function () {
                // Update the function attribute
                (functionAttribute = response._id), response.name;

                // Call the updated function with the new attribute
                addToCart(functionAttribute);
            });
            $("#add-to-List").on("click", function () {
                // Update the function attribute
                (functionAttribute = response._id), response.name;

                // Call the updated function with the new attribute
                addToList(functionAttribute);
            });
        },
    });
}

function openLoginModal() {
    $("#signup").modal("hide");
    $("#login").modal("toggle");
}

function openSignupModal() {
    $("#login").modal("hide");
    $("#signup").modal("toggle");
}

function login() {
    document.getElementById("log-in").addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent the default form submission

        // Additional code or validation logic here
    });

    if ($("#log-in").valid()) {
        let email = document.getElementById("login_email").value;
        let password = document.getElementById("login_password").value;
        // console.log(email);
        $.ajax({
            url: "/login",
            method: "post",
            data: {
                email,
                password,
            },
            success: (response) => {
                if (response.status) {
                    console.log(response.user);
                    $("#login").modal("toggle");
                    document.getElementById("username").textContent = "Hello, " + response.user.fname;
                    location.reload(true);
                } else {
                    //   alert('Invalid credentials');
                    document.getElementById("login_password").value = null;

                    if (response.errMsg === "User not found") {
                        $("#login").modal("hide");
                        $("#signup").modal("show");
                    } else {
                        document.getElementById("errMsg").textContent = response.errMsg;
                    }
                }
            },
        });
    }
}

function logout() {
    $.ajax({
        url: "/logout",
        success: (response) => {
            if (response.status) {
                location.reload(true);
            }
        },
    });
}

function signup() {
    document.getElementById("sign-up").addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent the default form submission

        // Additional code or validation logic here
    });
    if ($("#sign-up").valid()) {
        let fname = document.getElementById("fname").value;
        let lname = document.getElementById("lname").value;
        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;
        let password_confirm = document.getElementById("password_confirm").value;
        $.ajax({
            url: "/signup",
            method: "post",
            data: {
                fname,
                lname,
                email,
                password,
                password_confirm,
            },
            success: (response) => {
                if (response.status) {
                    $("#signup").modal("toggle");
                    console.log(response.user.name);
                    document.getElementById("username").textContent = "Hello, " + response.user.fname;
                    location.reload(true);
                } else {
                    if (response.errMsg === "User Exists! Please login.") {
                        $("#signup").modal("hide");
                        $("#login").modal("show");
                    }
                }
            },
        });
    }
}

function editor() {
    var editable = document.getElementById("editable");
    var saveBtn = document.getElementById("edit-save");
    editable.contentEditable = "true";
    saveBtn.style.display = "inline-block";
}

function changeAddress() {
    editable.contentEditable = "false";
    var flatNo = document.getElementById("flatNo").innerText;
    var area = document.getElementById("area").innerText;
    var pincode = document.getElementById("pincode").innerText;
    var landmark = document.getElementById("landmark").innerText;
    var district = document.getElementById("district").innerText;
    var state = document.getElementById("state").innerText;
    $.ajax({
        url: "/update-address",
        method: "post",
        data: {
            flatNo,
            area,
            pincode,
            landmark,
            district,
            state,
        },
        success: (response) => {
            if (response.status) {
                alert(`Address updated successfully!`);
                location.reload();
                saveBtn.style.display = "none";
            }
        },
    });
}

$(document).ready(function () {
    $(".single-checkbox").click(function () {
        $(".single-checkbox").not(this).prop("checked", false);
    });
});

function checkout() {
    // console.log("submitted");
    var form_data;
    var payment = $("#payment").serialize();
    var amount = document.getElementById("totalAmount").innerText;
    console.log(amount);
    var checkBox = document.getElementById("ship-box");
    if (checkBox.checked) {
        if ($("#checkout-form2").valid() && $("#payment").valid()) {
            form_data = $("#checkout-form2").serialize();
        } else {
            return;
        }
    } else {
        if ($("#checkout-form").valid() && $("#payment").valid()) {
            form_data = $("#checkout-form").serialize();
        } else {
            return;
        }
    }
    // console.log(form_data);

    var formDataObject = {};
    form_data.split("&").forEach(function (pair) {
        var keyValue = pair.split("=");
        var key = keyValue[0].replace("form_data[", "").replace("]", "");
        var value = decodeURIComponent(keyValue[1].replace(/\+/g, " "));
        formDataObject[key] = value;
    });
    $.ajax({
        url: "/checkout",
        method: "post",
        data: { form_data: formDataObject, payment: payment, totalAmount: amount },
        success: function ({ response, user }) {
            console.log(response.codSuccess);
            if (response.codSuccess) {
                $("#thankYouModal").modal("toggle");
            } else {
                razorpayPayment(response, user);
            }
        },
    });
}

function razorpayPayment(order, user) {
    var options = {
        key: "rzp_test_dSwiWA9mOk0adS", // Enter the Key ID generated from the Dashboard
        amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: "INR",
        name: "Yella || 'Discover, Shop, and Experience with Yella'",
        description: "Test Transaction",
        image: "/images/menu/logo/2.png",
        order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        handler: function (response) {
            verifyPayment(response, order);
        },
        prefill: {
            name: user.fname,
            email: user.email,
            contact: user.phone,
        },
        notes: {
            address: "Razorpay Corporate Office",
        },
        theme: {
            color: "#fed700",
        },
    };
    var rzp1 = new Razorpay(options);
    rzp1.on("payment.failed", function (response) {
        verifyPayment(response, order);
    });
    rzp1.open();
}

function verifyPayment(payment, order) {
    // console.log(payment);
    $.ajax({
        url: "/verify-payment",
        method: "post",
        data: {
            payment,
            order,
        },
        success: (response) => {
            console.log(response);
            if (response.status) {
                $("#thankYouModal").modal("toggle");
            } else {
                // alert(response.errMsg);
                $("#paymentErrorModal").modal("toggle");
                document.getElementById("errText").innerText = response.errMsg;
            }
        },
    });
}

document.getElementById("closeModalButton").addEventListener("click", function (event) {
    document.getElementById("thankYouModal").style.display = "none";
    location.href = "/";
});

function closeModal() {
    $("#paymentErrorModal").modal("hide");
    location.reload();
}

function openOrderModal(orderId, date, status, price) {
    $.ajax({
        url: "/orderd-products",
        method: "post",
        data: { orderId },
        success: (products) => {
            $("#modal-body").empty();
            products.forEach((product) => {
                let orderName = product.products[0].name;
                let orderQuantity = product.quantity;
                let prodPrice = product.products[0].price;
                // console.log(orderName);
                // Create the row elements with the respective data
                var row = $('<div class="row mt-4 mb-2" style="display:flex;justify-content:space-between;"></div>');
                row.append(
                    `<div class="col-md-2"><a href="/single-product/${product.products[0]._id}"><img src="/images/product/${product.products[0].category}/${product.products[0]._id}/0.jpg" class="img-fluid" alt="" /></a></div>`
                );
                row.append(
                    `<div class="col-md-2 text-center d-flex justify-content-center align-items-center">
                      <a href="/single-product/${product.products[0]._id}">
                        <p class="text-muted mb-0 wish" id="orderName">${orderName}</p>
                      </a>
                    </div>`
                );

                row.append(
                    '<div class="col-md-2 text-center d-flex justify-content-center align-items-center"><p class="text-muted mb-0 small">Quantity: <span id="orderQuantity">' +
                        orderQuantity +
                        "</span></p></div>"
                );
                row.append(
                    '<div class="col-md-2 text-center d-flex justify-content-center align-items-center"><p class="text-muted mb-0 small">Unit Price: ₹ <span id="prodPrice">' +
                        prodPrice +
                        "</span></p></div>"
                );

                // Append the row to the card body
                $("#modal-body").append(row);
                $("#modal-body").append('<hr  style="background-color: #e0e0e0; opacity: 1; margin:0 !important;" />');
            });
            $("#orderProducts").modal("show");

            var elements = document.querySelectorAll("#orderPrice1, #orderPrice2");

            // Iterate over the selected elements and update their innerText
            elements.forEach(function (element) {
                element.innerText = price;
            });

            document.getElementById("orderDate").innerText = date;
            document.getElementById("invoiceNo").innerText = orderId;

            if (status === "Order Pending") {
                document.getElementById("track-bar").style.width = "0";
            } else if (status === "Order Placed") {
                document.getElementById("track-bar").style.width = "15%";
            } else if (status === "Order Shipped") {
                document.getElementById("track-bar").style.width = "43%";
            } else if (status === "In Transit") {
                document.getElementById("track-bar").style.width = "50%";
            } else if (status === "Out For Delivery") {
                document.getElementById("track-bar").style.width = "70%";
            } else if (status === "Delivered") {
                document.getElementById("track-bar").style.width = "100%";
            }
        },
    });
}

function deleteOrder(orderId) {
    $.ajax({
        url: "/delete-pending-order",
        method: "post",
        data: { orderId },
        success: (response) => {
            if (response.status) {
                location.reload(true);
            }
        },
    });
}

function reviewModal() {
    $("#reviewModal").modal("show");
}

function submitReview() {
    let formData;
    if ($("#reviewForm").valid()) {
        formData = $("#reviewForm").serialize();
        $("#reviewModal").modal("hide");

        $.ajax({
            url: "/submit-review",
            method: "post",
            data: formData,
            success: (response) => {
                if (response.status) {
                    // console.log(response);
                    response.reviews.forEach((review) => {
                        // console.log(review.name);
                        let div = '<div class="comment-details"></div>';
                        div.append('<h4 class="title-block">' + review.name + "</h4>");
                        div.append('<p style="margin-bottom: 2px;">' + review.comment + "</p>");
                        div.append(" <p>" + review.rating + "</p>");

                        $("#reviews").append(div);
                    });
                }
            },
        });
    }
}

function payOnline(orderId, price) {
    $.ajax({
        url: "/pay-online",
        method: "post",
        data: {
            orderId: orderId,
            price: price,
        },
        success: ({ response, user }) => {
            razorpayPayment(response, user);
        },
    });
}

function closeModal3() {
    $("#thankYouModal").modal("hide");
    location.reload();
}

function closeModal2() {
    $("#paymentErrorModal").modal("hide");
    location.reload();
}

function changeStatus(status, orderId) {
    $.ajax({
        url: "/changeorderStatus",
        method: "post",
        data: {
            orderId,
            status,
        },
    });
}

function searchProducts(event) {
    event.preventDefault();
    let category = event.target.category.value;
    let search = event.target.search.value;
    const url = `/products?category=${encodeURIComponent(category)}&search=${encodeURIComponent(search)}`;

    // Set the form's action to the constructed URL
    event.target.action = url;

    // Submit the form
    event.target.submit();
}
