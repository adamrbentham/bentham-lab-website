// Submits the contact form to Web3Forms without leaving the page.
// Without JavaScript the form still posts normally.
(function () {
  var form = document.querySelector('.contact-form');
  if (!form || !window.fetch) return;
  var status = form.querySelector('.form-status');
  var button = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    button.disabled = true;
    status.className = 'form-status';
    status.textContent = 'Sending…';

    fetch(form.action, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(form)
    })
      .then(function (res) { return res.json().then(function (data) { return { ok: res.ok, data: data }; }); })
      .then(function (r) {
        if (r.ok && r.data.success) {
          form.reset();
          status.classList.add('is-ok');
          status.textContent = 'Thank you. Your message has been sent.';
        } else {
          throw new Error((r.data && r.data.message) || 'Submission failed');
        }
      })
      .catch(function () {
        status.classList.add('is-error');
        status.innerHTML = 'Sorry, the message could not be sent. Please email <a href="mailto:adam.r.bentham@durham.ac.uk">adam.r.bentham@durham.ac.uk</a> directly.';
      })
      .then(function () { button.disabled = false; });
  });
})();
