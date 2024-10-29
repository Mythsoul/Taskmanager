document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      document.getElementById('funFactPopup').classList.remove('hidden');
    }, 5000);
  });
  
  function closeFunFactPopup() {
    document.getElementById('funFactPopup').classList.add('hidden');
  }
  
  function showTermsAndConditions() {
    document.getElementById('termsModal').classList.remove('hidden');
  }
  
  function closeTermsModal() {
    document.getElementById('termsModal').classList.add('hidden');
  }