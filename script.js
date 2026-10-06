(function(){
var btns=document.querySelectorAll('.menu>button'),megas=document.querySelectorAll('.mega');
function closeAll(){btns.forEach(function(b){b.setAttribute('aria-expanded','false')});megas.forEach(function(m){m.classList.remove('open')})}
btns.forEach(function(b){b.addEventListener('click',function(){
var open=b.getAttribute('aria-expanded')==='true';closeAll();
if(!open){b.setAttribute('aria-expanded','true');document.getElementById(b.getAttribute('aria-controls')).classList.add('open')}})});
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeAll()});
document.addEventListener('click',function(e){if(!e.target.closest('.mast'))closeAll()});
document.getElementById('bg').addEventListener('click',function(){document.getElementById('menu').classList.toggle('show')});
var tabs=document.querySelectorAll('.tabs button'),panels=document.querySelectorAll('.panel');
tabs.forEach(function(t){t.addEventListener('click',function(){
tabs.forEach(function(x){x.setAttribute('aria-selected','false')});t.setAttribute('aria-selected','true');
panels.forEach(function(p,i){p.classList.toggle('on',i==t.dataset.t)})})});
})();