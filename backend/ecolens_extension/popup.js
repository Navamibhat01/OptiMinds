/* aura-panel.js
   Basic interactions for the Aura mock panel:
   - Close button hides panel
   - Escape key hides panel
   - Action buttons have a pulse animation
   - "View Product" link provides small click feedback
   Keep this file named exactly or update the <script> in the HTML.
*/

(function(){
  const auraPanel = document.getElementById('auraPanel');
  const closeBtn = document.getElementById('closeBtn');
  const feedbackBtn = document.getElementById('feedbackBtn');
  const saveBtn = document.getElementById('saveBtn');

  // Close/hide panel
  closeBtn.addEventListener('click', () => {
    auraPanel.classList.add('hidden');
  });

  // If user presses Escape, also hide the panel
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      auraPanel.classList.add('hidden');
    }
  });

  // Visual pulse for action buttons
  function pulse(btn){
    btn.animate([
      { transform: 'translateY(0)', boxShadow: 'none' },
      { transform: 'translateY(-3px)', boxShadow: '0 10px 24px rgba(0,0,0,0.35)' },
      { transform: 'translateY(0)', boxShadow: 'none' }
    ], { duration: 360 });
  }

  feedbackBtn.addEventListener('click', () => {
    pulse(feedbackBtn);
    console.log('Feedback action (mock)');
  });
  saveBtn.addEventListener('click', () => {
    pulse(saveBtn);
    console.log('Save to Green List (mock)');
  });

  // "View Product" links - tiny interaction
  document.querySelectorAll('.plink').forEach(pl => {
    pl.addEventListener('click', (e) => {
      e.stopPropagation();
      pl.animate([{ transform:'scale(1)' }, { transform:'scale(.98)' }, { transform:'scale(1)' }], { duration:160 });
      console.log('View product clicked (mock):', pl.previousElementSibling?.alt || 'product');
    });
  });

  // Accessibility: if panel is hidden, move focus back to body.
  auraPanel.addEventListener('transitionend', (e) => {
    if (auraPanel.classList.contains('hidden')) {
      document.body.focus();
    }
  });

  // Reopen panel for demo by pressing "o"
  document.addEventListener('keydown', (e) => {
    if (e.key === 'o' || e.key === 'O') {
      auraPanel.classList.remove('hidden');
    }
  });

  // Example: To programmatically update score (if needed):
  // document.querySelector('.score').style.setProperty('--percent', 85);
})();
