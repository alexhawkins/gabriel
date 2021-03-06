define(function(require, exports, module) {
    var View          = require('famous/core/View');
    var Surface       = require('famous/core/Surface');
    var Transform     = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var ImageSurface  = require('famous/surfaces/ImageSurface');

    function StripView() {
        View.apply(this, arguments);
        _createBackground.call(this);
        _createIcon.call(this);
        _createTitle.call(this);
    }

    StripView.prototype = Object.create(View.prototype);
    StripView.prototype.constructor = StripView;

    StripView.DEFAULT_OPTIONS = {
        width: window.innerWidth,
        height: 55,
        iconSize: 32,
        iconUrl: 'img/settings.png',
        title: 'Settings'
    };

    function _createBackground() {
        this.backgroundSurface = new Surface({
            size: [this.options.width, this.options.height],
            classes: ['strip-view']
        });

        this.add(this.backgroundSurface);
    }

     function _createIcon() {
        var iconSurface = new ImageSurface({
            size: [this.options.iconSize, this.options.iconSize],
            content : this.options.iconUrl,
            properties: {
                pointerEvents : 'none'
            }
        });

        var iconModifier = new StateModifier({
            // places the icon in the proper location
            transform: Transform.translate(24, 12, 0)
        });

        this.add(iconModifier).add(iconSurface);
    }

    function _createTitle() {
        var titleSurface = new Surface({
            size: [true, true],
            content: this.options.title,
            classes: ['menu-titles']
        });

        var titleModifier = new StateModifier({
            transform: Transform.translate(75, 18, 0)
        });

        this.add(titleModifier).add(titleSurface);
    }




    module.exports = StripView;
});
