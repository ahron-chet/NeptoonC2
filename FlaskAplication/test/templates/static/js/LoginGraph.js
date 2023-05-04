

window.addEventListener('DOMContentLoaded', function() {
    particlesJS('particles-js', {
      particles: {
        number: {
          value: 80,
          density: {
            enable: true,
            value_area: 800,
          },
        },
        color: {
          value: '#ffffff',
        },
        shape: {
          type: 'circle',
        },
        opacity: {
          value: 0.5,
          random: false,
        },
        size: {
          value: 3,
          random: true,
        },
        line_linked: {
          enable: true,
          distance: 200,
          color: '#0f0',
          opacity: 0.8,
          width: 1.5,
        },
        move: {
          enable: true,
          speed: 4,
          direction: 'none',
          random: false,
          straight: false,
          out_mode: 'out',
          bounce: false,
          attract: {
            enable: false,
            rotateX: 900,
            rotateY: 1500,
          },
        },
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: {
            enable: true,
            mode: 'grab',
          },
          onclick: {
            enable: true,
            mode: 'push',
          },
          resize: true,
        },
        modes: {
          grab: {
            distance: 200,
            line_linked: {
              opacity: 1,
            },
          },
          bubble: {
            distance: 400,
            size: 40,
            duration: 10,
            opacity: 8,
            speed: 3,
          },
          repulse: {
            distance: 200,
            duration: 10,
          },
          push: {
            particles_nb: 4,
          },
          remove: {
            particles_nb: 2,
          },
        },
      },
      retina_detect: true,
    });;
  });
  