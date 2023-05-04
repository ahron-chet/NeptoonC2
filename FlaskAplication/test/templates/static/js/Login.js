const login = async () => {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
  
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password
      }),
    });
  
    if (response.ok) {
      startMatrixAnimation();
      setTimeout(() => {
        window.location.href = '/home';
      }, 40000);
    } else {
      const errorMessage = await response.text();
      alert(errorMessage);
    }
  };
  
  const startMatrixAnimation = () => {
    document.querySelector('form').style.display = 'none';
  
    const canvas = document.createElement('canvas');
    canvas.setAttribute('id', 'matrix-animation');
    document.body.appendChild(canvas);
  
    const loadingContainer = document.createElement('div');
    loadingContainer.setAttribute('id', 'loading-container');
    loadingContainer.innerHTML = '<h1 style="color: #0f0; text-align: center; z-index: 5;margin-top: 50%;">Loading...</h1>';
    document.body.appendChild(loadingContainer);
  
    initMatrixAnimation();
  
    setTimeout(() => {
      loadingContainer.remove();
    }, 10000);
  };
  
  const initMatrixAnimation = () => {
    const canvas = document.getElementById('matrix-animation');
    const ctx = canvas.getContext('2d');
  
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  
    let letters = 'ABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZ';
    letters = letters.split('');
  
    const fontSize = 10;
    const columns = canvas.width / fontSize;
  
    const drops = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = 1;
    }
  
    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, .1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
  
      for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillStyle = '#0f0';
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        drops[i]++;
  
        if (drops[i] * fontSize > canvas.height && Math.random() > .95) {
          drops[i] = 0;
        }
      }
    };
  
    setInterval(draw, 33);
  };
  