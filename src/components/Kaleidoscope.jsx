import { useEffect, useRef } from 'react';

const Kaleidoscope = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    let w2 = w / 2,
      h2 = h / 2;
    const { PI, sin, cos } = Math;
    const PI2 = PI * 2;

    const slices = 15;
    const mirror = true;

    let img;
    let pattern;
    let offset = { x: 50, y: 10 };
    let animationId;

    const handleClick = () => {
      offset.x = 0;
      offset.y = 0;
    };

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      w2 = w / 2;
      h2 = h / 2;
    };

    const handleMouseMove = (e) => {
      offset.x += img.width * (e.movementX / w);
      offset.y += img.height * (e.movementY / h);
    };

    const loop = () => {
      ctx.clearRect(0, 0, w, h);

      let radius = w2 + h2;
      let deltaAngle = PI2 / slices;

      let x = [
        -1,
        -1 /*radius * sin(0)*/,
        radius * sin(deltaAngle),
        radius * sin(deltaAngle / 2)
      ];
      let y = [
        -1,
        radius /*radius * cos(0)*/,
        radius * cos(deltaAngle),
        radius * cos(deltaAngle / 2)
      ];

      for (let i = 0; i < slices; i++) {
        // draw the damn thing
        ctx.translate(w2, h2);
        ctx.rotate(i * deltaAngle);
        ctx.translate(offset.x, offset.y);
        ctx.beginPath();
        ctx.moveTo(x[0] - offset.x, y[0] - offset.y);
        ctx.lineTo(x[1] - offset.x, y[1] - offset.y);
        ctx.lineTo(x[2] - offset.x, y[2] - offset.y);
        ctx.lineTo(x[0] - offset.x, y[0] - offset.y);
        ctx.fillStyle = pattern;
        ctx.fill();
        ctx.resetTransform();

        if (mirror) {
          ctx.translate(w2, h2);
          ctx.rotate((i - 1) * deltaAngle);
          ctx.scale(-1, 1);
          ctx.translate(offset.x, offset.y);

          ctx.beginPath();
          ctx.moveTo(x[0] - offset.x, y[0] - offset.y);
          ctx.lineTo(x[1] - offset.x, y[1] - offset.y);
          ctx.lineTo(x[3] - offset.x, y[3] - offset.y);
          ctx.lineTo(x[0] - offset.x, y[0] - offset.y);
          ctx.fillStyle = pattern;
          ctx.fill();

          ctx.resetTransform();
        }
      }

      offset.x = (offset.x + 0.75) % img.width;
      offset.y = (offset.y + 0.25) % img.height;

      // loop
      animationId = requestAnimationFrame(loop);
    };

    const setup = () => {
      img = new Image();
      img.src = '/icon-image.jpeg';

      img.onload = function () {
        pattern = ctx.createPattern(img, 'repeat');
        loop();
      };

      img.onerror = function () {
        console.error('Failed to load image');
      };
    };

    canvas.addEventListener('click', handleClick);
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    setup();

    return () => {
      canvas.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        opacity: 0.65,
        filter: 'blur(1px) brightness(1.5)',
        zIndex: 0
      }}
    />
  );
};

export default Kaleidoscope;
