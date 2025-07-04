"use strict";

var userAgent = navigator.userAgent.toLowerCase(),

    initialDate = new Date(),

    $document = $(document),

    $window = $(window),

    $html = $("html"),

    isDesktop = $html.hasClass("desktop"),

    isIE = userAgent.indexOf("msie") != -1 ? parseInt(userAgent.split("msie")[1]) : userAgent.indexOf("trident") != -1 ? 11 : userAgent.indexOf("edge") != -1 ? 12 : false,

    isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),

    isTouch = "ontouchstart" in window,

    plugins = {

        pointerEvents: isIE < 11 ? "js/pointer-events.min.js" : false,

        smoothScroll: $html.hasClass("use--smoothscroll") ? "js/smoothscroll.min.js" : false,

        bootstrapTooltip: $("[data-toggle='tooltip']"),

        bootstrapTabs: $(".tabs"),

        rdParallax: $(".rd-parallax"),

        rdAudioPlayer: $(".rd-audio"),

        rdVideoPlayer: $(".rd-video-player"),

        responsiveTabs: $(".responsive-tabs"),

        rdGoogleMaps: $("#rd-google-map"),

        rdNavbar: $(".rd-navbar"),

        rdVideoBG: $(".rd-video"),

        rdRange: $('.rd-range'),

        textRotator: $(".text-rotator"),

        owl: $(".owl-carousel"),

        swiper: $(".swiper-slider"),

        counter: $(".counter"),

        flickrfeed: $(".flickr"),

        twitterfeed: $(".twitter"),

        progressBar: $(".progress-bar"),

        isotope: $(".isotope"),

        countDown: $(".countdown"),

        calendar: $(".rd-calendar"),

        facebookfeed: $(".facebook"),

        instafeed: $(".instafeed"),

        facebookWidget: $('#fb-root'),

        materialTabs: $('.rd-material-tabs'),

        filePicker: $('.rd-file-picker'),

        fileDrop: $('.rd-file-drop'),

        popover: $('[data-toggle="popover"]'),

        dateCountdown: $('.DateCountdown'),

        statefulButton: $('.btn-stateful'),

        slick: $('.slick-slider'),

        scroller: $(".scroll-wrap"),

        socialite: $(".socialite"),

        viewAnimate: $('.view-animate'),

        selectFilter: $("select"),

        rdInputLabel: $(".form-label"),

        stacktable: $("[data-responsive=true]"),

        bootstrapDateTimePicker: $("[date-time-picker]"),

        customWaypoints: $('[data-custom-scroll-to]'),

        photoSwipeGallery: $("[data-photo-swipe-item]"),

        circleProgress: $(".progress-bar-circle"),

        stepper: $("input[type='number']"),

        radio: $("input[type='radio']"),

        checkbox: $("input[type='checkbox']"),

        customToggle: $("[data-custom-toggle]"),

        rdMailForm: $(".rd-mailform"),

        regula: $("[data-constraints]"),

        search: $(".rd-search"),

        searchResults: $('.rd-search-results'),

        imgZoom: $('[mag-thumb]'),

        twitter: $(".twitter-timeline")

    };

$document.ready(function() {

    function getSwiperHeight(object, attr) {

        var val = object.attr("data-" + attr),

            dim;

        if (!val) {

            return undefined;

        }

        dim = val.match(/(px)|(%)|(vh)$/i);

        if (dim.length) {

            switch (dim[0]) {

                case "px":

                    return parseFloat(val);

                case "vh":

                    return $(window).height() * (parseFloat(val) / 100);

                case "%":

                    return object.width() * (parseFloat(val) / 100);

            }

        } else {

            return undefined;

        }

    }



    function toggleSwiperInnerVideos(swiper) {

        var prevSlide = $(swiper.slides[swiper.previousIndex]),

            nextSlide = $(swiper.slides[swiper.activeIndex]),

            videos;

        prevSlide.find("video").each(function() {

            this.pause();

        });

        videos = nextSlide.find("video");

        if (videos.length) {

            videos.get(0).play();

        }

    }



    function toggleSwiperCaptionAnimation(swiper) {

        var prevSlide = $(swiper.container),

            nextSlide = $(swiper.slides[swiper.activeIndex]);

        prevSlide.find("[data-caption-animate]").each(function() {

            var $this = $(this);

            $this.removeClass("animated").removeClass($this.attr("data-caption-animate")).addClass("not-animated");

        });

        nextSlide.find("[data-caption-animate]").each(function() {

            var $this = $(this),

                delay = $this.attr("data-caption-delay");

            setTimeout(function() {

                $this.removeClass("not-animated").addClass($this.attr("data-caption-animate")).addClass("animated");

            }, delay ? parseInt(delay) : 0);

        });

    }



    function makeParallax(el, speed, wrapper, prevScroll) {

        var scrollY = window.scrollY || window.pageYOffset;

        if (prevScroll != scrollY) {

            prevScroll = scrollY;

            el.addClass('no-transition');

            el[0].style['transform'] = 'translate3d(0,' + -scrollY * (1 - speed) + 'px,0)';

            el.height();

            el.removeClass('no-transition');

            if (el.attr('data-fade') === 'true') {

                var bound = el[0].getBoundingClientRect(),

                    offsetTop = bound.top * 2 + scrollY,

                    sceneHeight = wrapper.outerHeight(),

                    sceneDevider = wrapper.offset().top + sceneHeight / 2.0,

                    layerDevider = offsetTop + el.outerHeight() / 2.0,

                    pos = sceneHeight / 6.0,

                    opacity;

                if (sceneDevider + pos > layerDevider && sceneDevider - pos < layerDevider) {

                    el[0].style["opacity"] = 1;

                } else {

                    if (sceneDevider - pos < layerDevider) {

                        opacity = 1 + ((sceneDevider + pos - layerDevider) / sceneHeight / 3.0 * 5);

                    } else {

                        opacity = 1 - ((sceneDevider - pos - layerDevider) / sceneHeight / 3.0 * 5);

                    }

                    el[0].style["opacity"] = opacity < 0 ? 0 : opacity > 1 ? 1 : opacity.toFixed(2);

                }

            }

        }

        requestAnimationFrame(function() {

            makeParallax(el, speed, wrapper, prevScroll);

        });

    }



    function isScrolledIntoView(elem) {

        var $window = $(window);

        return elem.offset().top + elem.outerHeight() >= $window.scrollTop() && elem.offset().top <= $window.scrollTop() + $window.height();

    }



    function lazyInit(element, func) {

        var $win = jQuery(window);

        $win.on('load scroll', function() {

            if ((!element.hasClass('lazy-loaded') && (isScrolledIntoView(element)))) {

                func.call();

                element.addClass('lazy-loaded');

            }

        });

    }



    function liveSearch(options) {

        $('#' + options.live).removeClass('cleared').html();

        options.current++;

        options.spin.addClass('loading');

        $.get(handler, {

            s: decodeURI(options.term),

            liveSearch: options.live,

            dataType: "html",

            liveCount: options.liveCount,

            filter: options.filter,

            template: options.template

        }, function(data) {

            options.processed++;

            var live = $('#' + options.live);

            if (options.processed == options.current && !live.hasClass('cleared')) {

                live.find('> #search-results').removeClass('active');

                live.html(data);

                setTimeout(function() {

                    live.find('> #search-results').addClass('active');

                }, 50);

            }

            options.spin.parents('.rd-search').find('.input-group-addon').removeClass('loading');

        })

    }



    function attachFormValidator(elements) {

        for (var i = 0; i < elements.length; i++) {

            var o = $(elements[i]),

                v;

            o.addClass("form-control-has-validation").after("<span class='form-validation'></span>");

            v = o.parent().find(".form-validation");

            if (v.is(":last-child")) {

                o.addClass("form-control-last-child");

            }

        }

        elements.on('input change propertychange blur', function(e) {

            var $this = $(this),

                results;

            if (e.type != "blur") {

                if (!$this.parent().hasClass("has-error")) {

                    return;

                }

            }

            if ($this.parents('.rd-mailform').hasClass('success')) {

                return;

            }

            if ((results = $this.regula('validate')).length) {

                for (i = 0; i < results.length; i++) {

                    $this.siblings(".form-validation").text(results[i].message).parent().addClass("has-error")

                }

            } else {

                $this.siblings(".form-validation").text("").parent().removeClass("has-error")

            }

        }).regula('bind');

    }



    function isValidated(elements) {

        var results, errors = 0;

        if (elements.length) {

            for (j = 0; j < elements.length; j++) {

                var $input = $(elements[j]);

                if ((results = $input.regula('validate')).length) {

                    for (k = 0; k < results.length; k++) {

                        errors++;

                        $input.siblings(".form-validation").text(results[k].message).parent().addClass("has-error");

                    }

                } else {

                    $input.siblings(".form-validation").text("").parent().removeClass("has-error")

                }

            }

            return errors == 0;

        }

        return true;

    }



    function initBootstrapTooltip(tooltipPlacement) {

        if (window.innerWidth < 599) {

            plugins.bootstrapTooltip.tooltip('destroy');

            plugins.bootstrapTooltip.tooltip({

                placement: 'bottom'

            });

        } else {

            plugins.bootstrapTooltip.tooltip('destroy');

            plugins.bootstrapTooltip.tooltipPlacement;

            plugins.bootstrapTooltip.tooltip();

        }

    }

    var o = $("#copyright-year");

    if (o.length) {

        o.text(initialDate.getFullYear());

    }

    if (isIE) {

        if (isIE < 10) {

            $html.addClass("lt-ie-10");

        }

        if (isIE < 11) {

            if (plugins.pointerEvents) {

                $.getScript(plugins.pointerEvents).done(function() {

                    $html.addClass("ie-10");

                    PointerEventsPolyfill.initialize({});

                });

            }

        }

        if (isIE === 11) {

            $("html").addClass("ie-11");

        }

        if (isIE === 12) {

            $("html").addClass("ie-edge");

        }

    }

    if (plugins.bootstrapTooltip.length) {

        var tooltipPlacement = plugins.bootstrapTooltip.attr('data-placement');

        initBootstrapTooltip(tooltipPlacement);

        $(window).on('resize orientationchange', function() {

            initBootstrapTooltip(tooltipPlacement);

        })

    }

    if (plugins.smoothScroll) {

        $.getScript(plugins.smoothScroll);

    }

    if (plugins.rdAudioPlayer.length > 0) {

        var i;

        for (i = 0; i < plugins.rdAudioPlayer.length; i++) {

            $(plugins.rdAudioPlayer[i]).RDAudio();

        }

    }

    if (plugins.textRotator.length) {

        var i;

        for (i = 0; i < plugins.textRotator.length; i++) {

            var textRotatorItem = plugins.textRotator[i];

            $(textRotatorItem).rotator();

        }

    }

    if (plugins.materialTabs.length) {

        var i;

        for (i = 0; i < plugins.materialTabs.length; i++) {

            var materialTabsItem = plugins.materialTabs[i];

            $(materialTabsItem).RDMaterialTabs({});

        }

    }

    if (plugins.selectFilter.length) {

        var i;

        for (i = 0; i < plugins.selectFilter.length; i++) {

            var select = $(plugins.selectFilter[i]);

            select.select2({

                theme: "bootstrap"

            }).next().addClass(select.attr("class").match(/(input-sm)|(input-lg)|($)/i).toString().replace(new RegExp(",", 'g'), " "));

        }

    }

    if (plugins.stepper.length) {

        plugins.stepper.stepper({

            labels: {

                up: "",

                down: ""

            }

        });

    }

    if (plugins.radio.length) {

        var i;

        for (i = 0; i < plugins.radio.length; i++) {

            var $this = $(plugins.radio[i]);

            $this.addClass("radio-custom").after("<span class='radio-custom-dummy'></span>")

        }

    }

    if (plugins.popover.length) {

        if (window.innerWidth < 767) {

            plugins.popover.attr('data-placement', 'bottom');

            plugins.popover.popover();

        } else {

            plugins.popover.popover();

        }

    }

    if (plugins.countDown.length) {

        var i;

        for (i = 0; i < plugins.countDown.length; i++) {

            var countDownItem = plugins.countDown[i],

                d = new Date(),

                type = countDownItem.getAttribute('data-type'),

                time = countDownItem.getAttribute('data-time'),

                format = countDownItem.getAttribute('data-format'),

                settings = [];

            d.setTime(Date.parse(time)).toLocaleString();

            settings[type] = d;

            settings['format'] = format;

            $(countDownItem).countdown(settings);

        }

    }

    if (plugins.statefulButton.length) {

        $(plugins.statefulButton).on('click', function() {

            var statefulButtonLoading = $(this).button('loading');

            setTimeout(function() {

                statefulButtonLoading.button('reset')

            }, 2000);

        })

    }

    if (plugins.circleProgress.length) {

        var i;

        for (i = 0; i < plugins.circleProgress.length; i++) {

            var circleProgressItem = $(plugins.circleProgress[i]);

            $document.on("scroll", function() {

                if (!circleProgressItem.hasClass('animated')) {

                    var arrayGradients = circleProgressItem.attr('data-gradient').split(",");

                    circleProgressItem.circleProgress({

                        value: circleProgressItem.attr('data-value'),

                        size: circleProgressItem.attr('data-size') ? circleProgressItem.attr('data-size') : 175,

                        fill: {

                            gradient: arrayGradients,

                            gradientAngle: Math.PI / 4

                        },

                        startAngle: -Math.PI / 4 * 2,

                        emptyFill: $(this).attr('data-empty-fill') ? $(this).attr('data-empty-fill') : "rgb(245,245,245)"

                    }).on('circle-animation-progress', function(event, progress, stepValue) {

                        $(this).find('span').text(String(stepValue.toFixed(2)).replace('0.', '').replace('1.', '1'));

                    });

                    circleProgressItem.addClass('animated');

                }

            }).trigger("scroll");

        }

    }

    if (plugins.progressBar.length) {

        var i, bar, type;

        for (i = 0; i < plugins.progressBar.length; i++) {

            var progressItem = plugins.progressBar[i];

            bar = null;

            if (progressItem.className.indexOf("progress-bar-horizontal") > -1) {

                type = 'Line';

            }

            if (progressItem.className.indexOf("progress-bar-radial") > -1) {

                type = 'Circle';

            }

            if (progressItem.getAttribute("data-stroke") && progressItem.getAttribute("data-value") && type) {

                bar = new ProgressBar[type](progressItem, {

                    strokeWidth: Math.round(parseFloat(progressItem.getAttribute("data-stroke")) / progressItem.offsetWidth * 100),

                    trailWidth: progressItem.getAttribute("data-trail") ? Math.round(parseFloat(progressItem.getAttribute("data-trail")) / progressItem.offsetWidth * 100) : 0,

                    text: {

                        value: progressItem.getAttribute("data-counter") === "true" ? '0' : null,

                        className: 'progress-bar__body',

                        style: null

                    }

                });

                bar.svg.setAttribute('preserveAspectRatio', "none meet");

                if (type === 'Line') {

                    bar.svg.setAttributeNS(null, "height", progressItem.getAttribute("data-stroke"));

                }

                bar.path.removeAttribute("stroke");

                bar.path.className.baseVal = "progress-bar__stroke";

                if (bar.trail) {

                    bar.trail.removeAttribute("stroke");

                    bar.trail.className.baseVal = "progress-bar__trail";

                }

                if (progressItem.getAttribute("data-easing") && !isIE) {

                    $(document).on("scroll", {

                        "barItem": bar

                    }, $.proxy(function(event) {

                        var bar = event.data.barItem;

                        if (isScrolledIntoView($(this)) && this.className.indexOf("progress-bar--animated") === -1) {

                            this.className += " progress-bar--animated";

                            bar.animate(parseInt(this.getAttribute("data-value")) / 100.0, {

                                easing: this.getAttribute("data-easing"),

                                duration: this.getAttribute("data-duration") ? parseInt(this.getAttribute("data-duration")) : 800,

                                step: function(state, b) {

                                    if (b._container.className.indexOf("progress-bar-horizontal") > -1 || b._container.className.indexOf("progress-bar-vertical") > -1) {

                                        b.text.style.width = Math.abs(b.value() * 100).toFixed(0) + "%"

                                    }

                                    b.setText(Math.abs(b.value() * 100).toFixed(0));

                                }

                            });

                        }

                    }, progressItem)).trigger("scroll");

                } else {

                    bar.set(parseInt($(progressItem).attr("data-value")) / 100.0);

                    bar.setText($(progressItem).attr("data-value"));

                    if (type === 'Line') {

                        bar.text.style.width = parseInt($(progressItem).attr("data-value")) + "%";

                    }

                }

            } else {

                console.error(progressItem.className + ": progress bar type is not defined");

            }

        }

    }

    

    if (plugins.rdNavbar.length) {

        plugins.rdNavbar.RDNavbar({

            stickUpClone: (plugins.rdNavbar.attr("data-stick-up-clone")) ? plugins.rdNavbar.attr("data-stick-up-clone") === 'true' : false

        });

        if (plugins.rdNavbar.attr("data-body-class")) {

            document.body.className += ' ' + plugins.rdNavbar.attr("data-body-class");

        }

    }

    if (plugins.viewAnimate.length) {

        var i;

        for (i = 0; i < plugins.viewAnimate.length; i++) {

            var $view = $(plugins.viewAnimate[i]).not('.active');

            $document.on("scroll", $.proxy(function() {

                if (isScrolledIntoView(this)) {

                    this.addClass("active");

                }

            }, $view)).trigger("scroll");

        }

    }

    if (plugins.swiper.length) {

        var i;

        for (i = 0; i < plugins.swiper.length; i++) {

            var s = $(plugins.swiper[i]);

            var pag = s.find(".swiper-pagination"),

                next = s.find(".swiper-button-next"),

                prev = s.find(".swiper-button-prev"),

                bar = s.find(".swiper-scrollbar"),

                parallax = s.parents('.rd-parallax').length,

                swiperSlide = s.find(".swiper-slide");

            for (j = 0; j < swiperSlide.length; j++) {

                var $this = $(swiperSlide[j]),

                    url;

                if (url = $this.attr("data-slide-bg")) {

                    $this.css({

                        "background-image": "url(" + url + ")",

                        "background-size": "cover"

                    })

                }

            }

            swiperSlide.end().find("[data-caption-animate]").addClass("not-animated").end().swiper({

                autoplay: s.attr('data-autoplay') ? s.attr('data-autoplay') === "false" ? undefined : s.attr('data-autoplay') : 5000,

                direction: s.attr('data-direction') ? s.attr('data-direction') : "horizontal",

                effect: s.attr('data-slide-effect') ? s.attr('data-slide-effect') : "fade",

                speed: s.attr('data-slide-speed') ? s.attr('data-slide-speed') : 2000,

                keyboardControl: s.attr('data-keyboard') === "true",

                mousewheelControl: s.attr('data-mousewheel') === "true",

                mousewheelReleaseOnEdges: s.attr('data-mousewheel-release') === "true",

                nextButton: next.length ? next.get(0) : null,

                prevButton: prev.length ? prev.get(0) : null,

                pagination: pag.length ? pag.get(0) : null,

                paginationClickable: pag.length ? pag.attr("data-clickable") !== "false" : false,

                paginationBulletRender: pag.length ? pag.attr("data-index-bullet") === "true" ? function(index, className) {

                    return '<span class="' + className + '">' + (index + 1) + '</span>';

                } : null : null,

                scrollbar: bar.length ? bar.get(0) : null,

                scrollbarDraggable: bar.length ? bar.attr("data-draggable") !== "false" : true,

                scrollbarHide: bar.length ? bar.attr("data-draggable") === "false" : false,

                loop: s.attr('data-loop') !== "false",

                onTransitionStart: function(swiper) {

                    toggleSwiperInnerVideos(swiper);

                },

                onTransitionEnd: function(swiper) {

                    toggleSwiperCaptionAnimation(swiper);

                },

                onInit: function(swiper) {

                    toggleSwiperInnerVideos(swiper);

                    toggleSwiperCaptionAnimation(swiper);

                    var swiperParalax = s.find(".swiper-parallax");

                    for (var k = 0; k < swiperParalax.length; k++) {

                        var $this = $(swiperParalax[k]),

                            speed;

                        if (parallax && !isIEBrows && !isMobile) {

                            if (speed = $this.attr("data-speed")) {

                                makeParallax($this, speed, s, false);

                            }

                        }

                    }

                    $(window).on('resize', function() {

                        swiper.update(true);

                    })

                }

            });

            $(window).on("resize", function() {

                var mh = getSwiperHeight(s, "min-height"),

                    h = getSwiperHeight(s, "height");

                if (h) {

                    s.css("height", mh ? mh > h ? mh : h : h);

                }

            }).trigger("resize");

        }

    }

    if (plugins.rdVideoPlayer.length) {

        var i;

        for (i = 0; i < plugins.rdVideoPlayer.length; i++) {

            var videoItem = plugins.rdVideoPlayer[i],

                volumeWrap = $(".rd-video-volume-wrap");

            $(videoItem).RDVideoPlayer({});

            volumeWrap.on("mouseenter", function() {

                $(this).addClass("hover")

            });

            volumeWrap.on("mouseleave", function() {

                $(this).removeClass("hover")

            });

            if (isTouch) {

                volumeWrap.find(".rd-video-volume").on("click", function() {

                    $(this).toggleClass("hover")

                });

                $document.on("click", function(e) {

                    if (!$(e.target).is(volumeWrap) && $(e.target).parents(volumeWrap).length == 0) {

                        volumeWrap.find(".rd-video-volume").removeClass("hover")

                    }

                })

            }

        }

    }

    if (plugins.rdParallax.length) {

        var i;

        $.RDParallax();

        if (!isIE && !isMobile) {

            $(window).on("scroll", function() {

                for (i = 0; i < plugins.rdParallax.length; i++) {

                    var parallax = $(plugins.rdParallax[i]);

                    if (isScrolledIntoView(parallax)) {

                        parallax.find(".rd-parallax-inner").css("position", "fixed");

                    } else {

                        parallax.find(".rd-parallax-inner").css("position", "absolute");

                    }

                }

            });

        }

        $("a[href='#']").on("click", function(event) {

            setTimeout(function() {

                $(window).trigger("resize");

            }, 300);

        });

    }

    if (plugins.search.length || plugins.searchResults) {

        var handler = "bat/rd-search.php";

        var defaultTemplate = '<h5 class="search_title"><a target="_top" href="#{href}" class="search_link">#{title}</a></h5>' + '<p>...#{token}...</p>' + '<p class="match"><em>Terms matched: #{count} - URL: #{href}</em></p>';

        var defaultFilter = '*.html';

        if (plugins.search.length) {

            for (i = 0; i < plugins.search.length; i++) {

                var searchItem = $(plugins.search[i]),

                    options = {

                        element: searchItem,

                        filter: (searchItem.attr('data-search-filter')) ? searchItem.attr('data-search-filter') : defaultFilter,

                        template: (searchItem.attr('data-search-template')) ? searchItem.attr('data-search-template') : defaultTemplate,

                        live: (searchItem.attr('data-search-live')) ? searchItem.attr('data-search-live') : false,

                        liveCount: (searchItem.attr('data-search-live-count')) ? parseInt(searchItem.attr('data-search-live')) : 4,

                        current: 0,

                        processed: 0,

                        timer: {}

                    };

                if ($('.rd-navbar-search-toggle').length) {

                    var toggle = $('.rd-navbar-search-toggle');

                    toggle.on('click', function() {

                        if (!($(this).hasClass('active'))) {

                            searchItem.find('input').val('').trigger('propertychange');

                        }

                    });

                }

                if (options.live) {

                    var clearHandler = false;

                    searchItem.find('input').on("keyup input propertychange", $.proxy(function() {

                        this.term = this.element.find('input').val().trim();

                        this.spin = this.element.find('.input-group-addon');

                        clearTimeout(this.timer);

                        if (this.term.length > 2) {

                            this.timer = setTimeout(liveSearch(this), 200);

                            if (clearHandler == false) {

                                clearHandler = true;

                                $("body").on("click", function(e) {

                                    if ($(e.toElement).parents('.rd-search').length == 0) {

                                        $('#rd-search-results-live').addClass('cleared').html('');

                                        $(this).unbind('click');

                                        clearHandler = false;

                                    }

                                })

                            }

                        } else if (this.term.length == 0) {

                            $('#' + this.live).addClass('cleared').html('');

                        }

                    }, options, this));

                }

                searchItem.submit($.proxy(function() {

                    $('<input />').attr('type', 'hidden').attr('name', "filter").attr('value', this.filter).appendTo(this.element);

                    return true;

                }, options, this))

            }

        }

        if (plugins.searchResults.length) {

            var regExp = /\?.*s=([^&]+)\&filter=([^&]+)/g;

            var match = regExp.exec(location.search);

            if (match != null) {

                $.get(handler, {

                    s: decodeURI(match[1]),

                    dataType: "html",

                    filter: match[2],

                    template: defaultTemplate,

                    live: ''

                }, function(data) {

                    plugins.searchResults.html(data);

                })

            }

        }

    }

    if (plugins.slick.length) {

        var i;

        for (i = 0; i < plugins.slick.length; i++) {

            var $slickItem = $(plugins.slick[i]);

            $slickItem.slick({

                slidesToScroll: parseInt($slickItem.attr('data-slide-to-scroll')) || 1,

                asNavFor: $slickItem.attr('data-for') || false,

                dots: $slickItem.attr("data-dots") == "true",

                infinite: $slickItem.attr("data-loop") == "true",

                focusOnSelect: true,

                arrows: $slickItem.attr("data-arrows") == "true",

                swipe: $slickItem.attr("data-swipe") == "true",

                autoplay: $slickItem.attr("data-autoplay") == "false",

                vertical: $slickItem.attr("data-vertical") == "true",

                centerMode: $slickItem.attr("data-center-mode") == "true",

                centerPadding: $slickItem.attr("data-center-padding") ? $slickItem.attr("data-center-padding") : '0.50',

                mobileFirst: true,

                responsive: [{

                    breakpoint: 0,

                    settings: {

                        slidesToShow: parseInt($slickItem.attr('data-items')) || 1,

                    }

                }, {

                    breakpoint: 480,

                    settings: {

                        slidesToShow: parseInt($slickItem.attr('data-xs-items')) || 1,

                    }

                }, {

                    breakpoint: 768,

                    settings: {

                        slidesToShow: parseInt($slickItem.attr('data-sm-items')) || 1,

                    }

                }, {

                    breakpoint: 992,

                    settings: {

                        slidesToShow: parseInt($slickItem.attr('data-md-items')) || 1,

                    }

                }, {

                    breakpoint: 1200,

                    settings: {

                        slidesToShow: parseInt($slickItem.attr('data-lg-items')) || 1,

                    }

                }]

            }).on('afterChange', function(event, slick, currentSlide, nextSlide) {

                var $this = $(this),

                    childCarousel = $this.attr('data-child');

                if (childCarousel) {

                    $(childCarousel + ' .slick-slide').removeClass('slick-current');

                    $(childCarousel + ' .slick-slide').eq(currentSlide).addClass('slick-current');

                }

            });

        }

    }

    if (plugins.counter.length) {

        var i;

        for (i = 0; i < plugins.counter.length; i++) {

            var counterNotAnimated = plugins.counter.not(".animated");

            $document.on("scroll", function() {

                for (i = 0; i < counterNotAnimated.length; i++) {

                    var counterNotAnimatedItem = $(counterNotAnimated[i]);

                    if ((!counterNotAnimatedItem.hasClass("animated")) && (isScrolledIntoView(counterNotAnimatedItem))) {

                        counterNotAnimatedItem.countTo({

                            refreshInterval: 40,

                            speed: counterNotAnimatedItem.attr("data-speed") || 1000

                        });

                        counterNotAnimatedItem.addClass('animated');

                    }

                }

            });

            $document.trigger("scroll");

        }

    }

    if (plugins.isotope.length) {

        var i, isogroup = [];

        for (i = 0; i < plugins.isotope.length; i++) {

            var isotopeItem = plugins.isotope[i],

                iso = new Isotope(isotopeItem, {

                    itemSelector: '.isotope-item',

                    layoutMode: isotopeItem.getAttribute('data-isotope-layout') ? isotopeItem.getAttribute('data-isotope-layout') : 'masonry',

                    filter: '*'

                });

            isogroup.push(iso);

        }

        $(window).on('load', function() {

            setTimeout(function() {

                var i;

                for (i = 0; i < isogroup.length; i++) {

                    isogroup[i].element.className += " isotope--loaded";

                    isogroup[i].layout();

                }

            }, 600);

        });

        var resizeTimout;

        $("[data-isotope-filter]").on("click", function(e) {

            e.preventDefault();

            var filter = $(this);

            clearTimeout(resizeTimout);

            filter.parents(".isotope-filters").find('.active').removeClass("active");

            filter.addClass("active");

            var iso = $('.isotope[data-isotope-group="' + this.getAttribute("data-isotope-group") + '"]');

            iso.isotope({

                itemSelector: '.isotope-item',

                layoutMode: iso.attr('data-isotope-layout') ? iso.attr('data-isotope-layout') : 'masonry',

                filter: this.getAttribute("data-isotope-filter") == '*' ? '*' : '[data-filter*="' + this.getAttribute("data-isotope-filter") + '"]'

            });

        }).eq(0).trigger("click")

    }

    if (isDesktop && $html.hasClass("wow-animation") && $(".wow").length) {

        new WOW().init();

    }

    if (plugins.bootstrapTabs.length) {

        var i;

        for (i = 0; i < plugins.bootstrapTabs.length; i++) {

            var bootstrapTabsItem = $(plugins.bootstrapTabs[i]);

            bootstrapTabsItem.on("click", "a", function(event) {

                event.preventDefault();

                $(this).tab('show');

            });

        }

    }

    if (plugins.scroller.length) {

        var i;

        for (i = 0; i < plugins.scroller.length; i++) {

            var scrollerItem = $(plugins.scroller[i]);

            scrollerItem.mCustomScrollbar({

                scrollInertia: 200,

                scrollButtons: {

                    enable: true

                }

            });

        }

    }

    if (plugins.socialite.length) {

        Socialite.load();

    }

    if (plugins.rdVideoBG.length) {

        var i;

        for (i = 0; i < plugins.rdVideoBG.length; i++) {

            var videoItem = $(plugins.rdVideoBG[i]);

            videoItem.RDVideo({});

        }

    }

    if (plugins.rdInputLabel.length) {

        plugins.rdInputLabel.RDInputLabel();

    }

    if (plugins.regula.length) {

        attachFormValidator(plugins.regula);

    }

    if (plugins.rdMailForm.length) {

        var i, j, k, msg = {

            'MF000': 'Successfully sent!',

            'MF001': 'Recipients are not set!',

            'MF002': 'Form will not work locally!',

            'MF003': 'Please, define email field in your form!',

            'MF004': 'Please, define type of your form!',

            'MF254': 'Something went wrong with PHPMailer!',

            'MF255': 'Aw, snap! Something went wrong.'

        };

        for (i = 0; i < plugins.rdMailForm.length; i++) {

            var $form = $(plugins.rdMailForm[i]);

            $form.attr('novalidate', 'novalidate').ajaxForm({

                data: {

                    "form-type": $form.attr("data-form-type") || "contact",

                    "counter": i

                },

                beforeSubmit: function() {

                    var form = $(plugins.rdMailForm[this.extraData.counter]);

                    var inputs = form.find("[data-constraints]");

                    if (isValidated(inputs)) {

                        var output = $("#" + form.attr("data-form-output"));

                        if (output.hasClass("snackbars")) {

                            output.html('<p><span class="icon text-middle fa fa-circle-o-notch fa-spin icon-xxs"></span><span>Sending</span></p>');

                            output.addClass("active");

                        }

                    } else {

                        return false;

                    }

                },

                error: function(result) {

                    var output = $("#" + $(plugins.rdMailForm[this.extraData.counter]).attr("data-form-output"));

                    output.text(msg[result]);

                },

                success: function(result) {

                    var form = $(plugins.rdMailForm[this.extraData.counter]);

                    var output = $("#" + form.attr("data-form-output"));

                    form.addClass('success');

                    result = result.length == 5 ? result : 'MF255';

                    output.text(msg[result]);

                    if (result === "MF000") {

                        if (output.hasClass("snackbars")) {

                            output.html('<p><span class="icon text-middle mdi mdi-check icon-xxs"></span><span>' + msg[result] + '</span></p>');

                        } else {

                            output.addClass("success");

                            output.addClass("active");

                        }

                    } else {

                        if (output.hasClass("snackbars")) {

                            output.html(' <p class="snackbars-left"><span class="icon icon-xxs mdi mdi-alert-outline text-middle"></span><span>' + msg[result] + '</span></p>');

                        } else {

                            output.addClass("error");

                            output.addClass("active");

                        }

                    }

                    form.clearForm();

                    form.find('input, textarea').blur();

                    setTimeout(function() {

                        output.removeClass("active");

                        form.removeClass('success');

                    }, 5000);

                }

            });

        }

    }

    if (plugins.rdRange.length) {

        plugins.rdRange.RDRange({});

    }

    if (plugins.photoSwipeGallery.length) {

        $document.delegate("[data-photo-swipe-item]", "click", function(event) {

            event.preventDefault();

            var $el = $(this),

                $galleryItems = $el.parents("[data-photo-swipe-gallery]").find("a[data-photo-swipe-item]"),

                pswpElement = document.querySelectorAll('.pswp')[0],

                encounteredItems = {},

                pswpItems = [],

                options, pswpIndex = 0,

                pswp;

            if ($galleryItems.length == 0) {

                $galleryItems = $el;

            }

            $galleryItems.each(function() {

                var $item = $(this),

                    src = $item.attr('href'),

                    size = $item.attr('data-size').split('x'),

                    pswdItem;

                if ($item.is(':visible')) {

                    if (!encounteredItems[src]) {

                        pswdItem = {

                            src: src,

                            w: parseInt(size[0], 10),

                            h: parseInt(size[1], 10),

                            el: $item

                        };

                        encounteredItems[src] = {

                            item: pswdItem,

                            index: pswpIndex

                        };

                        pswpItems.push(pswdItem);

                        pswpIndex++;

                    }

                }

            });

            options = {

                index: encounteredItems[$el.attr('href')].index,

                getThumbBoundsFn: function(index) {

                    var $el = pswpItems[index].el,

                        offset = $el.offset();

                    return {

                        x: offset.left,

                        y: offset.top,

                        w: $el.width()

                    };

                }

            };

            pswp = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, pswpItems, options);

            pswp.init();

        });

    }

    if (plugins.stacktable.length) {

        var i;

        for (i = 0; i < plugins.stacktable.length; i++) {

            var stacktableItem = $(plugins.stacktable[i]);

            stacktableItem.stacktable();

        }

    }

    if (plugins.customToggle.length) {

        var i;

        for (i = 0; i < plugins.customToggle.length; i++) {

            var $this = $(plugins.customToggle[i]);

            $this.on('click', function(e) {

                e.preventDefault();

                $("#" + $(this).attr('data-custom-toggle')).add(this).toggleClass('active');

            });

            if ($this.attr("data-custom-toggle-disable-on-blur") === "true") {

                $("body").on("click", $this, function(e) {

                    if (e.target !== e.data[0] && $("#" + e.data.attr('data-custom-toggle')).find($(e.target)).length == 0 && e.data.find($(e.target)).length == 0) {

                        $("#" + e.data.attr('data-custom-toggle')).add(e.data[0]).removeClass('active');

                    }

                })

            }

        }

    }

    if (plugins.imgZoom.length) {

        var i;

        for (i = 0; i < plugins.imgZoom.length; i++) {

            var $imgZoomItem = $(plugins.imgZoom[i]);

            $imgZoomItem.mag();

        }

    }

    if (plugins.customWaypoints.length) {

        var i;

        for (i = 0; i < plugins.customWaypoints.length; i++) {

            var $this = $(plugins.customWaypoints[i]);

            $this.on('click', function(e) {

                e.preventDefault();

                $("body, html").stop().animate({

                    scrollTop: $("#" + $(this).attr('data-custom-scroll-to')).offset().top

                }, 1000, function() {

                    $(window).trigger("resize");

                });

            });

        }

    }

});



$('.fc-event').on('touchstart', function(e) {

    'use strict';

    var link = $(".fc-event");

    if (link.hasClass('hover')) {

        return true;

    } else {

        link.addClass('hover');

        $('.fc-event').not(this).removeClass('hover');

        e.preventDefault();

        return false;

    }

});