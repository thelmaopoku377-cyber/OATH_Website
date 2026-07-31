document.addEventListener("DOMContentLoaded", () => {
  // Grab all essential UI elements upfront
  const modal = document.getElementById("bookingModal");
  const closeModal = document.querySelector(".close-btn");
  const serviceInput = document.getElementById("serviceName");
  const modalTitle = document.getElementById("modalTitle");
  const bookingForm = document.getElementById("bookingForm");
  const formResult = document.getElementById("formResult");
  const submitBtn = document.getElementById("submitBtn");

  // 1. Open modal when clicking any service card or button
  const serviceCards = document.querySelectorAll(".card, .service-card, .book-btn, button");

  serviceCards.forEach(card => {
    card.addEventListener("click", (e) => {
      const cardElement = e.target.closest(".card, .service-card") || card;
      const titleElement = cardElement.querySelector("h3, h4, p, span");
      const cardTitle = titleElement ? titleElement.innerText : "Hair Service";

      if (serviceInput) serviceInput.value = cardTitle;
      if (modalTitle) modalTitle.innerText = `Book ${cardTitle}`;
      if (modal) modal.style.display = "block";
    });
  });

  // 2. Close modal when clicking 'X'
  if (closeModal) {
    closeModal.addEventListener("click", () => {
      if (modal) modal.style.display = "none";
    });
  }

  // 3. Close modal when clicking outside of the white box
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      if (modal) modal.style.display = "none";
    }
  });

  // 4. Send form data to Web3Forms
  if (bookingForm) {
    bookingForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = "Sending...";
      }
      if (formResult) {
        formResult.style.color = "#555";
        formResult.innerText = "Submitting your booking...";
      }

      const formData = new FormData(bookingForm);

      try {
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: formData
        });

        const data = await response.json();

        if (data.success) {
          if (formResult) {
            formResult.style.color = "green";
            formResult.innerText = "Success! Your booking request has been sent.";
          }
          bookingForm.reset();

          setTimeout(() => {
            if (modal) modal.style.display = "none";
            if (formResult) formResult.innerText = "";
          }, 2500);
        } else {
          if (formResult) {
            formResult.style.color = "red";
            formResult.innerText = "Something went wrong. Please try again.";
          }
        }
      } catch (error) {
        if (formResult) {
          formResult.style.color = "red";
          formResult.innerText = "Network error. Please check your connection.";
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerText = "Confirm Booking";
        }
      }
    });
  }
});