function LoadingAction() {
    alphabet = "NEPTONC2WELCM";
    letter_count = 0;
    el = $("#loading");
    word = el.html().trim();
    finished = false;
  
    el.html("");
    for (var i = 0; i < word.length; i++) {
      el.append("<span>" + word.charAt(i) + "</span>");
    }
  
    setTimeout(write, 75);
    setTimeout(inc, 1000);
  }
  
  function write() {
    for (var i = letter_count; i < word.length; i++) {
      var c = Math.floor(Math.random() * 36);
      $("span").eq(i).html(alphabet[c]);
    }
    if (!finished) {
      setTimeout(write, 75);
    } else {
      window.location.href = '/home';
    }
  }
  
  function inc() {
    $("span").eq(letter_count).html(word[letter_count]);
    $("span").eq(letter_count).addClass("glow");
    letter_count++;
    if (letter_count >= word.length) {
      finished = true;
    } else {
      setTimeout(inc, 1000);
    }
  }
  
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
      LoadingAction();
    } else {
      const errorMessage = await response.text();
      alert(errorMessage);
    }
  };
  
  const startMatrixAnimation = () => {
    document.querySelector('form').style.display = 'none';
    document.getElementById('LogoLetter').style.display = 'none';
    document.getElementById('loading').style.display = 'block';
    document.getElementById('particles-js').style.display = 'none';
  
    const canvas = document.createElement('canvas');
    canvas.setAttribute('id', 'matrix-animation');
    document.body.appendChild(canvas);
  
    initMatrixAnimation();
  };
  
  const initMatrixAnimation = () => {
    const canvas = document.getElementById('matrix-animation');
    const ctx = canvas.getContext('2d');
  
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  
    let letters = 'ABCDEFGHIJKLMNOPQRSTUVXYZ'.repeat(6);
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
  