// Mobile menu toggle
function toggleMobileMenu(btn){
  const menu = document.getElementById('mobile-menu');
  const expanded = btn.getAttribute('aria-expanded') === 'true';
  btn.setAttribute('aria-expanded', String(!expanded));
  menu.style.display = expanded ? 'none' : 'block';
}

// Smooth scroll
function scrollToSection(sel){
  const el = document.querySelector(sel);
  if(!el) return;
  el.scrollIntoView({behavior:'smooth',block:'start'});
  setTimeout(()=> el.setAttribute('tabindex','-1') && el.focus(),350);
}

// Simulator basic logic
function runSimulator(){
  const valor = Number(document.getElementById('valor').value) || 0;
  const planPrice = Number(document.getElementById('plan-select').value) || 0;
  const meses = Number(document.getElementById('meses').value) || 1;
  if(valor <= 0){ showSimResult('Please enter a valid value.'); return; }
  const surcharge = 0.02 * valor;
  const total = (planPrice * meses) + surcharge;
  showSimResult(`Estimate → Premium: S/ ${total.toFixed(2)} (includes S/ ${surcharge.toFixed(2)} risk surcharge).`);
}
function showSimResult(txt){
  const el = document.getElementById('sim-result');
  el.textContent = txt;
  el.style.fontWeight = 600;
  el.style.color = 'var(--blue)';
}
function resetSimulator(){
  document.getElementById('valor').value = 1000;
  document.getElementById('plan-select').value = '9.9';
  document.getElementById('meses').value = 1;
  document.getElementById('sim-result').textContent = '';
}

// Modals handling
function openModal(id){
  const overlay = document.getElementById(id);
  overlay.style.display = 'flex';
  overlay.setAttribute('aria-hidden','false');
  const first = overlay.querySelector('input,button,a,select,textarea');
  if(first) first.focus();
}
function closeModal(id){
  const overlay = document.getElementById(id);
  overlay.style.display = 'none';
  overlay.setAttribute('aria-hidden','true');
}

// Contract modal demo
function openContractModal(planName, price){
  document.getElementById('contract-title').textContent = `Subscribe - ${planName}`;
  document.getElementById('contract-desc').textContent = `Plan ${planName} — S/ ${price} / month (demo). Fill your data.`;
  openModal('modal-contract');
}
function submitContract(evt){
  evt.preventDefault();
  const name = document.getElementById('fullname').value;
  const email = document.getElementById('email').value;
  closeModal('modal-contract');
  alert(`Thank you ${name}. We received your demo request. We will contact you at ${email}.`);
}

// Claim modal demo
function openClaimModal(){
  openModal('modal-claim');
}
function submitClaim(evt){
  evt.preventDefault();
  const name = document.getElementById('claim-name').value;
  const email = document.getElementById('claim-email').value;
  closeModal('modal-claim');
  alert(`Claim submitted. Thank you ${name}. We'll send status to ${email} (demo).`);
}

// Support center: show centered card with options
function openSupportCenter(){
  openModal('modal-support');
}
// Contact actions
function openWhatsApp(){
  // Replace number with yours. Using Peru example +51900000000
  const phone = '51900000000';
  const text = encodeURIComponent('Hello ResiCare team, I need support.');
  const url = `https://wa.me/${phone}?text=${text}`;
  window.open(url,'_blank');
}
function openGmailCompose(){
  const to = 'contacto@resicare.example';
  const subject = encodeURIComponent('Support request - ResiCare');
  const body = encodeURIComponent('Hello, I need help with...');
  // Gmail compose URL (opens Gmail if logged in)
  const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${subject}&body=${body}`;
  window.open(url,'_blank');
}
function openMailTo(){
  const to = 'contacto@resicare.example';
  const subject = encodeURIComponent('Support request - ResiCare');
  const body = encodeURIComponent('Hello, I need help with...');
  window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
}

// Small accessibility: Esc to close modals
document.addEventListener('keydown', function(e){
  if(e.key === 'Escape'){
    document.querySelectorAll('.modal-overlay[aria-hidden="false"]').forEach(ov=> ov.style.display='none');
  }
});
