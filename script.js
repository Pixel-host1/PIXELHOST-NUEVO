(function(){
var btns=document.querySelectorAll('.menu>button'),megas=document.querySelectorAll('.mega'),menu=document.getElementById('menu');
function closeAll(){btns.forEach(function(b){b.setAttribute('aria-expanded','false')});megas.forEach(function(m){m.classList.remove('open')})}
btns.forEach(function(b){b.addEventListener('click',function(){
var open=b.getAttribute('aria-expanded')==='true';closeAll();
if(!open){b.setAttribute('aria-expanded','true');document.getElementById(b.getAttribute('aria-controls')).classList.add('open')}})});
megas.forEach(function(m){m.addEventListener('click',function(e){if(e.target.closest('a')){closeAll();if(menu)menu.classList.remove('show')}})});
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeAll()});
document.addEventListener('click',function(e){if(!e.target.closest('.mast'))closeAll()});
var bg=document.getElementById('bg');
if(bg)bg.addEventListener('click',function(){menu.classList.toggle('show')});

var tabs=document.querySelectorAll('.tabs button'),panels=document.querySelectorAll('.panel');
tabs.forEach(function(t){t.addEventListener('click',function(){
tabs.forEach(function(x){x.setAttribute('aria-selected','false')});t.setAttribute('aria-selected','true');
panels.forEach(function(p,i){p.classList.toggle('on',i==t.dataset.t)})})});

/* Formulario de contacto (demostración: arma un correo, no guarda datos) */
var cf=document.querySelector('[data-form="contacto"]');
if(cf)cf.addEventListener('submit',function(e){
e.preventDefault();if(!cf.reportValidity())return;
var d=new FormData(cf),body='Nombre: '+d.get('nombre')+'\nCorreo: '+d.get('correo')+'\nTeléfono: '+(d.get('tel')||'-')+'\nEmpresa: '+(d.get('empresa')||'-')+'\nInterés: '+d.get('interes')+'\n\n'+d.get('msg');
document.getElementById('cmail').href='mailto:contacto@meridian.example?subject='+encodeURIComponent('Consulta: '+d.get('interes'))+'&body='+encodeURIComponent(body);
document.getElementById('cres').classList.add('on');
});

/* Libro de Reclamaciones (demostración) */
var lf=document.querySelector('[data-form="libro"]');
if(lf){
var menor=document.getElementById('l-menor'),tut=document.getElementById('tutor');
menor.addEventListener('change',function(){tut.hidden=!menor.checked;tut.querySelector('input').required=menor.checked});
lf.addEventListener('submit',function(e){
e.preventDefault();if(!lf.reportValidity())return;
var d=new FormData(lf),n='HR-'+new Date().getFullYear()+'-'+String(Math.floor(Math.random()*1e6)).padStart(6,'0'),
rows=[['Hoja de Reclamación N°',n],['Fecha',new Date().toLocaleDateString('es-PE')],['Consumidor',d.get('nombre')],[d.get('tdoc'),d.get('ndoc')],['Domicilio',d.get('dom')],['Teléfono',d.get('tel')],['Correo',d.get('mail')]];
if(menor.checked)rows.push(['Padre, madre o tutor',d.get('tutor')]);
rows.push(['Bien contratado',d.get('bien')],['Monto reclamado (S/)',d.get('monto')||'-'],['Descripción',d.get('desc')],['Tipo',d.get('tipo')],['Detalle',d.get('detalle')],['Pedido del consumidor',d.get('pedido')],['Observaciones del proveedor','A completar por el proveedor']);
var dl=document.getElementById('lres-dl'),txt='';dl.textContent='';
rows.forEach(function(r){var a=document.createElement('dt'),b=document.createElement('dd');a.textContent=r[0];b.textContent=r[1];dl.appendChild(a);dl.appendChild(b);txt+=r[0]+': '+r[1]+'\n'});
document.getElementById('lmail').href='mailto:'+encodeURIComponent(d.get('mail'))+'?cc=contacto@meridian.example&subject='+encodeURIComponent('Hoja de Reclamación '+n)+'&body='+encodeURIComponent(txt);
lf.hidden=true;document.getElementById('lres').classList.add('on');window.scrollTo(0,0);
});
document.getElementById('lprint').addEventListener('click',function(){window.print()});
}
})();