const canvas = document.getElementById("mouseTrail");
const ctx = canvas.getContext("2d");

let points = [];

const settings = {
    lines: 18,
    maxPoints: 130,
    spread: 2.2,
    lineWidth: 1.1,
    opacity: 0.30
};

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);

window.addEventListener("mousemove", function (e) {

    points.push({
        x: e.clientX,
        y: e.clientY,
        life: 1
    });

    if (points.length > settings.maxPoints) {
        points.shift();
    }
});

function getLinePoint(point, index, line) {

    const waveX = Math.sin(
        index * 0.22 + line * 0.65
    );

    const waveY = Math.cos(
        index * 0.18 + line * 0.55
    );

    const spread =
        (line - (settings.lines - 1) / 2)
        * settings.spread;

    return {
        x: point.x + spread + waveX * (line * 1.4),
        y: point.y + spread + waveY * (line * 1.4)
    };
}

function drawLine(line) {

    if (points.length < 2) return;

    ctx.beginPath();

    const first = getLinePoint(points[0], 0, line);

    ctx.moveTo(first.x, first.y);

    for (let i = 1; i < points.length; i++) {

        const current =
            getLinePoint(points[i], i, line);

        const previous =
            getLinePoint(points[i - 1], i - 1, line);

        const centerX =
            (previous.x + current.x) / 2;

        const centerY =
            (previous.y + current.y) / 2;

        ctx.quadraticCurveTo(
            previous.x,
            previous.y,
            centerX,
            centerY
        );
    }

    const opacity =
        Math.max(
            settings.opacity - line * 0.012,
            0.03
        );

    /* BLACK LINES */
    ctx.strokeStyle =
        `rgba(0, 0, 0, ${opacity})`;

    ctx.lineWidth = settings.lineWidth;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.stroke();
}

function animate() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    for (
        let line = 0;
        line < settings.lines;
        line++
    ) {
        drawLine(line);
    }

    points.forEach(point => {
        point.life -= 0.012;
    });

    points = points.filter(
        point => point.life > 0
    );

    requestAnimationFrame(animate);
}

animate();
