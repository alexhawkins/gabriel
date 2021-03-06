define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Lightbox = require('famous/views/Lightbox');
    var SlideView = require('views/SlideView');
    var Easing = require('famous/transitions/Easing');


    function DeckView() {
        View.apply(this, arguments);

        this.rootModifier = new StateModifier({
            size: this.options.size,
            origin: [0.5, 0.5],
            align: [0.5, 0.5],
            transform: Transform.inFront
        });

        this.mainNode = this.add(this.rootModifier);

        _createLightbox.call(this);
        _createSlides.call(this);

        this.on('swipeLeft', this.swipeLeft.bind(this));
        this.on('swipeRight', this.swipeRight.bind(this));
    }

    DeckView.prototype = Object.create(View.prototype);
    DeckView.prototype.constructor = DeckView;

    DeckView.DEFAULT_OPTIONS = {
        size: [window.innerWidth * 0.9, window.innerHeight * 0.75],
        data: undefined,
        lightboxOpts: {
            // inOpacity: 1,
            // outOpacity: 0,
            // inTransform: Transform.translate(window.innerWidth, 0, 0),
            // outTransform: Transform.translate(-window.innerWidth * 2, 0, 0),
            inTransition: {
                duration: 0,
                curve: 'easeOut'
            },
            outTransition: {
                duration: 0,
                curve: Easing.inCubic
            }
        }
    };

    DeckView.prototype.showCurrentSlide = function() {
        var slide = this.slides[this.currentIndex];
        this.lightbox.show(slide);
        // this.lightbox.show(slide, function() {
        //     slide.fadeIn();
        // }.bind(this));
    };
    DeckView.prototype.swipeLeft = function() {
        var slide = this.slides[this.currentIndex];
        slide.options.position.set([-500, 0], {
            method: 'spring',
            period: 150,
        });

        this.showNextSlide();
    };

    DeckView.prototype.swipeRight = function() {
        var slide = this.slides[this.currentIndex];
        slide.options.position.set([500, 0], {
            method: 'spring',
            period: 150,
        });
        this.showNextSlide();
    };

    DeckView.prototype.showNextSlide = function() {
        this.currentIndex++;
        if (this.currentIndex === this.slides.length) this.currentIndex = 0;
        this.slides[this.currentIndex].options.position.set([0, 0]);
        var slide = this.slides[this.currentIndex];
        this.lightbox.show(slide);
    };

    function _createLightbox() {
        this.lightbox = new Lightbox(this.options.lightboxOpts);
        this.mainNode.add(this.lightbox);
    }

    function _createSlides() {
        this.slides = [];
        this.currentIndex = 0;

        for (var i = 0; i < this.options.data.length; i++) {
            var slide = new SlideView({
                size: this.options.size,
                photoUrl: this.options.data[i]
            });

            this.slides.push(slide);

            // adding click listener
            // on click, calling .showNextSlide()
            // note that we're binding showNextSlide to the slideshow
            // to maintain the correct context when called
            slide.on('swipeRight', this.swipeRight.bind(this));
            slide.on('swipeLeft', this.swipeLeft.bind(this));
        }

        this.showNextSlide();
    }

    module.exports = DeckView;
});
