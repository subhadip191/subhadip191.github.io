// ======================================================
// SUBHADIP MAITY — PORTFOLIO V8 — Three.js Background
// Colored particle nebula with depth + mouse reactivity
// ======================================================
(function(){
  if (typeof THREE === 'undefined') return;

  var canvas = document.getElementById('bg-canvas');
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // ---- Star particles (white, small) ----
  var starCount = 4000;
  var starGeo = new THREE.BufferGeometry();
  var starPos = new Float32Array(starCount * 3);
  var starSizes = new Float32Array(starCount);

  for (var i = 0; i < starCount; i++) {
    starPos[i*3]   = (Math.random() - 0.5) * 120;
    starPos[i*3+1] = (Math.random() - 0.5) * 120;
    starPos[i*3+2] = (Math.random() - 0.5) * 120;
    starSizes[i] = Math.random() * 2 + 0.5;
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  starGeo.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));

  var starMat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.08,
    transparent: true,
    opacity: 0.6,
    sizeAttenuation: true,
    depthWrite: false
  });
  var stars = new THREE.Points(starGeo, starMat);
  scene.add(stars);

  // ---- Nebula particles (colored, larger, sparse) ----
  var nebulaCount = 300;
  var nebulaGeo = new THREE.BufferGeometry();
  var nebulaPos = new Float32Array(nebulaCount * 3);
  var nebulaColors = new Float32Array(nebulaCount * 3);
  var nebulaSizes = new Float32Array(nebulaCount);

  var palette = [
    [0.66, 0.33, 0.97],  // purple
    [0.49, 0.30, 1.0],   // violet
    [0.45, 0.23, 0.82],  // deep purple
    [0.85, 0.56, 0.98],  // light purple
    [0.55, 0.45, 0.95],  // lavender
  ];

  for (var j = 0; j < nebulaCount; j++) {
    nebulaPos[j*3]   = (Math.random() - 0.5) * 80;
    nebulaPos[j*3+1] = (Math.random() - 0.5) * 80;
    nebulaPos[j*3+2] = (Math.random() - 0.5) * 60 - 15; // slightly behind
    var col = palette[Math.floor(Math.random() * palette.length)];
    nebulaColors[j*3]   = col[0];
    nebulaColors[j*3+1] = col[1];
    nebulaColors[j*3+2] = col[2];
    nebulaSizes[j] = Math.random() * 3 + 1;
  }
  nebulaGeo.setAttribute('position', new THREE.BufferAttribute(nebulaPos, 3));
  nebulaGeo.setAttribute('color', new THREE.BufferAttribute(nebulaColors, 3));
  nebulaGeo.setAttribute('size', new THREE.BufferAttribute(nebulaSizes, 1));

  var nebulaMat = new THREE.PointsMaterial({
    size: 0.35,
    vertexColors: true,
    transparent: true,
    opacity: 0.2,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  var nebula = new THREE.Points(nebulaGeo, nebulaMat);
  scene.add(nebula);

  camera.position.z = 30;

  // ---- Mouse tracking ----
  var mouseX = 0, mouseY = 0;
  var winHx = window.innerWidth / 2;
  var winHy = window.innerHeight / 2;

  document.addEventListener('mousemove', function(e){
    mouseX = (e.clientX - winHx) * 0.0003;
    mouseY = (e.clientY - winHy) * 0.0003;
  });

  // ---- Render loop ----
  function animate(){
    requestAnimationFrame(animate);

    if (!prefersReduced) {
      stars.rotation.y += 0.00004;
      stars.rotation.x += 0.00002;
      nebula.rotation.y += 0.00006;
      nebula.rotation.x += 0.00003;

      stars.rotation.y += mouseX * 0.5;
      stars.rotation.x += mouseY * 0.5;
      nebula.rotation.y += mouseX * 0.3;
      nebula.rotation.x += mouseY * 0.3;
    }

    renderer.render(scene, camera);
  }
  animate();

  // ---- Resize ----
  window.addEventListener('resize', function(){
    winHx = window.innerWidth / 2;
    winHy = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
})();
