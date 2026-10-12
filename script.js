(function(){
  // ---- Menú móvil y navegación ----
  var btns = document.querySelectorAll('.menu>button');
  var megas = document.querySelectorAll('.mega');
  var menu = document.getElementById('menu');
  var bg = document.getElementById('bg');

  function isMenuOpen() {
    return menu && menu.classList.contains('show');
  }

  function closeMegas() {
    btns.forEach(function(b) {
      b.setAttribute('aria-expanded', 'false');
    });
    megas.forEach(function(m) {
      m.classList.remove('open');
    });
  }

  function openMenu() {
    if (!menu || !bg) return;
    menu.classList.add('show');
    bg.setAttribute('aria-expanded', 'true');
    bg.setAttribute('aria-label', 'Cerrar menú');
    document.body.classList.add('menu-open');
    var firstFocusable = menu.querySelector('button, a, [tabindex="0"]');
    if (firstFocusable) {
      firstFocusable.focus();
    }
  }

  function closeMenu(restoreFocus) {
    if (!menu || !bg) return;
    var hadFocusInside = menu.contains(document.activeElement);
    menu.classList.remove('show');
    bg.setAttribute('aria-expanded', 'false');
    bg.setAttribute('aria-label', 'Abrir menú');
    document.body.classList.remove('menu-open');
    closeMegas();
    if (restoreFocus || hadFocusInside) {
      bg.focus();
    }
  }

  function toggleMenu() {
    if (isMenuOpen()) {
      closeMenu(true);
    } else {
      openMenu();
    }
  }

  if (bg) {
    bg.addEventListener('click', function(e) {
      e.stopPropagation();
      toggleMenu();
    });
  }

  // Alternar submenús (Soluciones)
  btns.forEach(function(b) {
    b.addEventListener('click', function(e) {
      e.stopPropagation();
      var targetId = b.getAttribute('aria-controls');
      var targetMega = targetId ? document.getElementById(targetId) : null;
      var isOpen = b.getAttribute('aria-expanded') === 'true';

      if (isOpen) {
        b.setAttribute('aria-expanded', 'false');
        if (targetMega) targetMega.classList.remove('open');
      } else {
        btns.forEach(function(other) {
          if (other !== b) {
            other.setAttribute('aria-expanded', 'false');
            var otherTarget = document.getElementById(other.getAttribute('aria-controls'));
            if (otherTarget) otherTarget.classList.remove('open');
          }
        });
        b.setAttribute('aria-expanded', 'true');
        if (targetMega) targetMega.classList.add('open');
      }
    });
  });

  // Cerrar con Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      if (isMenuOpen()) {
        closeMenu(true);
      } else {
        closeMegas();
      }
    }
  });

  // Cerrar al hacer clic en cualquier enlace del menú o submenú
  if (menu) {
    menu.addEventListener('click', function(e) {
      if (e.target.closest('a')) {
        closeMenu(false);
      }
    });
  }

  // Cerrar al hacer clic fuera del encabezado
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.mast')) {
      closeMegas();
      if (isMenuOpen()) {
        closeMenu(false);
      }
    }
  });

  // Restaurar estado si se redimensiona a escritorio
  window.addEventListener('resize', function() {
    if (window.innerWidth > 960 && isMenuOpen()) {
      closeMenu(false);
    }
  });

  // ---- Selector de tema (botón único alternable Sol / Luna) ----
  var STORAGE_KEY = 'pixelhost-theme';
  var themeBtn = document.getElementById('theme-btn');

  function getManualTheme() {
    try {
      var val = localStorage.getItem(STORAGE_KEY);
      if (val === 'light' || val === 'dark') return val;
    } catch (e) {}
    return null;
  }

  function getSystemTheme() {
    return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
  }

  function applyTheme(targetTheme, saveManual) {
    var theme = (targetTheme === 'dark') ? 'dark' : 'light';

    if (saveManual) {
      try {
        localStorage.setItem(STORAGE_KEY, theme);
      } catch (e) {}
    }

    document.documentElement.setAttribute('data-theme', theme);

    if (themeBtn) {
      if (theme === 'dark') {
        themeBtn.setAttribute('aria-label', 'Activar modo claro');
        themeBtn.setAttribute('title', 'Activar modo claro');
      } else {
        themeBtn.setAttribute('aria-label', 'Activar modo oscuro');
        themeBtn.setAttribute('title', 'Activar modo oscuro');
      }
    }
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', function() {
      var current = document.documentElement.getAttribute('data-theme') || (getManualTheme() || getSystemTheme());
      var nextTheme = (current === 'dark') ? 'light' : 'dark';
      applyTheme(nextTheme, true);
    });
  }

  // Inicializar estado del selector
  var initialManual = getManualTheme();
  if (initialManual) {
    applyTheme(initialManual, false);
  } else {
    applyTheme(getSystemTheme(), false);
  }

  // Si no hay elección manual, responder a cambios de preferencia del sistema
  var mql = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  function handleSystemThemeChange(e) {
    if (!getManualTheme()) {
      var newTheme = (e && typeof e.matches === 'boolean' ? e.matches : mql.matches) ? 'dark' : 'light';
      applyTheme(newTheme, false);
    }
  }

  if (mql) {
    if (mql.addEventListener) {
      mql.addEventListener('change', handleSystemThemeChange);
    } else if (mql.addListener) {
      mql.addListener(handleSystemThemeChange);
    }
  }

  // ---- Pestañas ----
  var tabs = document.querySelectorAll('.tabs button'), panels = document.querySelectorAll('.panel');
  tabs.forEach(function(t){
    t.addEventListener('click', function(){
      tabs.forEach(function(x){x.setAttribute('aria-selected', 'false')});
      t.setAttribute('aria-selected', 'true');
      panels.forEach(function(p, i){p.classList.toggle('on', i == t.dataset.t)});
    });
  });

  // ---- Formulario de contacto (demostración: arma un correo con contacto@krealab.example) ----
  var cf = document.querySelector('[data-form="contacto"]');
  if (cf) cf.addEventListener('submit', function(e){
    e.preventDefault();
    if (!cf.reportValidity()) return;
    var d = new FormData(cf), body = 'Nombre: ' + d.get('nombre') + '\nCorreo: ' + d.get('correo') + '\nTeléfono: ' + (d.get('tel') || '-') + '\nEmpresa: ' + (d.get('empresa') || '-') + '\nInterés: ' + d.get('interes') + '\n\n' + d.get('msg');
    document.getElementById('cmail').href = 'mailto:contacto@krealab.example?subject=' + encodeURIComponent('Consulta: ' + d.get('interes')) + '&body=' + encodeURIComponent(body);
    document.getElementById('cres').classList.add('on');
  });

  // ---- Libro de Reclamaciones (demostración) ----
  var lf = document.querySelector('[data-form="libro"]');
  if (lf) {
    var menor = document.getElementById('l-menor'), tut = document.getElementById('tutor');
    menor.addEventListener('change', function(){
      tut.hidden = !menor.checked;
      tut.querySelector('input').required = menor.checked;
    });
    lf.addEventListener('submit', function(e){
      e.preventDefault();
      if (!lf.reportValidity()) return;
      var d = new FormData(lf), n = 'HR-' + new Date().getFullYear() + '-' + String(Math.floor(Math.random() * 1e6)).padStart(6, '0'),
      rows = [['Hoja de Reclamación N°', n], ['Fecha', new Date().toLocaleDateString('es-PE')], ['Consumidor', d.get('nombre')], [d.get('tdoc'), d.get('ndoc')], ['Domicilio', d.get('dom')], ['Teléfono', d.get('tel')], ['Correo', d.get('mail')]];
      if (menor.checked) rows.push(['Padre, madre o tutor', d.get('tutor')]);
      rows.push(['Bien contratado', d.get('bien')], ['Monto reclamado (S/)', d.get('monto') || '-'], ['Descripción', d.get('desc')], ['Tipo', d.get('tipo')], ['Detalle', d.get('detalle')], ['Pedido del consumidor', d.get('pedido')], ['Observaciones del proveedor', 'A completar por el proveedor']);
      var dl = document.getElementById('lres-dl'), txt = '';
      dl.textContent = '';
      rows.forEach(function(r){
        var a = document.createElement('dt'), b = document.createElement('dd');
        a.textContent = r[0];
        b.textContent = r[1];
        dl.appendChild(a);
        dl.appendChild(b);
        txt += r[0] + ': ' + r[1] + '\n';
      });
      document.getElementById('lmail').href = 'mailto:' + encodeURIComponent(d.get('mail')) + '?cc=contacto@krealab.example&subject=' + encodeURIComponent('Hoja de Reclamación ' + n) + '&body=' + encodeURIComponent(txt);
      lf.hidden = true;
      document.getElementById('lres').classList.add('on');
      window.scrollTo(0, 0);
    });
    document.getElementById('lprint').addEventListener('click', function(){ window.print(); });
  }
})();