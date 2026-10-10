document.addEventListener('DOMContentLoaded',()=>{
const m=document.querySelector('.menu'),n=document.querySelector('#primary-nav');
if(m&&n)m.addEventListener('click',()=>{const o=n.classList.toggle('open');m.setAttribute('aria-expanded',String(o))});
const rm=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const io=(!rm&&'IntersectionObserver'in window)?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{rootMargin:'0px 0px -8%'}):null;
document.querySelectorAll('.product-card,.answer-card,.related-grid a').forEach(el=>{el.classList.add('reveal');if(io)io.observe(el);else el.classList.add('visible')});
const f=document.querySelector('#quoteForm'),s=document.querySelector('#formStatus');
if(!f)return;
const started=Date.now();
const say=(t,c)=>{if(s){s.textContent=t;s.className='form-status '+(c||'')}};
const pu=f.elements.page_url;if(pu)pu.value=location.href;
f.addEventListener('submit',async e=>{
 e.preventDefault();
 if(f.elements.website&&f.elements.website.value){say('Thank you. Your request was received.','ok');f.reset();return}
 if(Date.now()-started<3000){say('Please take a moment to check your details, then send again.','err');return}
 const name=(f.elements.user_name.value||'').trim(),phone=(f.elements.user_phone.value||'').replace(/\D/g,''),zip=(f.elements.user_zip.value||'').trim();
 if(name.length<2){say('Please enter your name.','err');f.elements.user_name.focus();return}
 if(phone.length<10){say('Please enter a phone number with area code.','err');f.elements.user_phone.focus();return}
 if(!/^\d{5}(-\d{4})?$/.test(zip)&&!/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(zip)){say('Please enter a 5-digit ZIP code (or Canadian postal code).','err');f.elements.user_zip.focus();return}
 const b=f.querySelector('button[type=submit]');
 if(!window.emailjs){say('The form could not send right now. Please call 1-888-779-2284.','err');return}
 b.disabled=true;b.textContent='Sending…';say('Sending your request…');
 try{emailjs.init({publicKey:'alWutsHLG6c3h9P2j'});await emailjs.sendForm('service_usimtub','template_5n0cskt',f);say('Request received. A representative will follow up.','ok');f.reset();b.textContent='Request sent'}
 catch(err){say('The form could not send. Please call 1-888-779-2284.','err');b.disabled=false;b.textContent='Send my request'}
});
});
