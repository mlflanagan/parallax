/*global window, console, document */
(function () {
    'use strict';

    var canvas, context,
        stars, nbrStars = 100,
        running = false;

    function randBetween(min, max) {
        return Math.random() * (max - min) + min;
    }

    function update() {
        for (var i = 0; i < nbrStars; i++) {
            stars[i].x += stars[i].dx;
            if (stars[i].x < stars[i].radius) {
                stars[i].x = canvas.width - stars[i].radius;
                // avoid repeating star patterns by changing y value
                stars[i].y = randBetween(stars[i].radius, canvas.height - stars[i].radius);
            }
        }
    }

    function draw() {
        // make sure we're really full screen, then hide mouse cursos
        if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;            
            canvas.style.cursor = 'none';
        }

        // clearRect is not needed because we fill the entire canvas in next statement
        // context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = 'black';
        context.fillRect(0, 0, canvas.width, canvas.height);

        for (var i = 0; i < nbrStars; i++) {
            context.fillStyle = stars[i].color;
            context.beginPath();
            context.arc(stars[i].x, stars[i].y, stars[i].radius, 0, 2 * Math.PI, false);
            context.closePath();
            context.fill();
        }
    }

    function mainloop() {
        update();
        draw();
    }

    function startup(e) {
        // use running flag to ignore multiple clicks
        if (!running) {
            running = true;

            // go full screen
            canvas.requestFullscreen() || canvas.webkitRequestFullscreen() || canvas.mozRequestFullScreen() || canvas.msRequestFullscreen();

            stars = [];
            var layer = 0;

            for (var i = 0; i < nbrStars; i++) {
                stars[i] = {
                    x: 0, y: 0,
                    radius: layer + 1,
                    // color: ['blue', 'red', 'green'][Math.floor(Math.random() * 3)],
                    // color: ['#999', '#ccc', '#fff'][layer],
                    color: 'white',
                    // Stars that are "further away" move more slowly, closer stars move faster.
                    // Use negative numbers to make the stars move right to left.
                    dx: [-0.5, -1.0, -1.5][layer]
                };

                stars[i].x = randBetween(stars[i].radius, canvas.width - stars[i].radius);
                stars[i].y = randBetween(stars[i].radius, canvas.height - stars[i].radius);

                // three parallax layers
                layer = (layer + 1) % 3;
            }

            window.setInterval(mainloop, 10);  // milliseconds
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        canvas = document.createElement('canvas');
        canvas.width = 1500;
        canvas.height = 800;
        document.body.appendChild(canvas);

        context = canvas.getContext('2d');
        context.font = "50px Arial";
        context.fillText("Click anywhere to begin", 10, 50);

        window.addEventListener('click', startup, true);
    });
}());

