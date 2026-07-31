document.addEventListener("DOMContentLoaded", () => {
  // 1. Grab all UI elements
  const modal = document.getElementById("bookingModal");
  const closeModal = document.querySelector(".close-btn");
  const serviceInput = document.getElementById("serviceName");
  const modalTitle = document.getElementById("modalTitle");
  const bookingForm = document.getElementById("bookingForm");
  const formResult = document.getElementById("formResult");
  const submitBtn = document.getElementById("submitBtn");

  // 2. Open modal when clicking any service card or button
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

  // 3. Close modal when clicking 'X'
  if (closeModal) {
    closeModal.addEventListener("click", () => {
      if (modal) modal.style.display = "none";
    });
  }

  // 4. Close modal when clicking outside of the white modal box
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      if (modal) modal.style.display = "none";
    }
  });

  // 5. Send form data to Web3Forms & handle green success message
  if (bookingForm) {
    bookingForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Show temporary sending state
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
          // Display green success message
          if (formResult) {
            formResult.style.color = "#28a745"; // Green
            formResult.innerText = "✓ Success! Your booking request has been sent.";
          }
          bookingForm.reset();

          // Keep modal open for 3 seconds so client can read the success message
          setTimeout(() => {
            if (modal) modal.style.display = "none";
            if (formResult) formResult.innerText = "";
          }, 3000);
        } else {
          // Display red error message
          if (formResult) {
            formResult.style.color = "#dc3545"; // Red
            formResult.innerText = "Something went wrong. Please try again.";
          }
        }
      } catch (error) {
        if (formResult) {
          formResult.style.color = "#dc3545"; // Red
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