document.addEventListener("DOMContentLoaded", function() {
    console.log("Community Arts & Culture Portal loaded and ready.");
  
    // Filter functionality for events
    const filterInput = document.getElementById("event-filter");
    const filterStatus = document.getElementById("filter-status");
    const eventItems = document.querySelectorAll(".event-item");
  
    filterInput.addEventListener("input", function() {
      const keyword = filterInput.value.toLowerCase();
      let visibleCount = 0;
      eventItems.forEach(function(eventItem) {
        const text = eventItem.textContent.toLowerCase();
        if (text.includes(keyword)) {
          eventItem.style.display = "block";
          visibleCount++;
        } else {
          eventItem.style.display = "none";
        }
      });
      filterStatus.textContent = visibleCount + " event" + (visibleCount === 1 ? "" : "s") + " shown.";
    });
  
    // Modal functionality for event submission
    const openModalButton = document.getElementById("open-submit-modal");
    const closeModalButton = document.getElementById("close-submit-modal");
    const submitModal = document.getElementById("submit-modal");
    const submitEventForm = document.getElementById("submit-event-form");
    const eventListContainer = document.querySelector(".event-list");
  
    // Open the modal when the button is clicked
    openModalButton.addEventListener("click", function() {
      submitModal.classList.add("open");
      document.getElementById("event-title").focus(); // Set focus on the first field for accessibility
    });
  
    // Close the modal when the close button is clicked
    closeModalButton.addEventListener("click", function() {
      submitModal.classList.remove("open");
    });
  
    // Close the modal when clicking outside the modal content
    submitModal.addEventListener("click", function(e) {
      if (e.target === submitModal) {
        submitModal.classList.remove("open");
      }
    });
  
    // Close the modal when the Escape key is pressed
    document.addEventListener("keydown", function(e) {
      if (e.key === "Escape" && submitModal.classList.contains("open")) {
        submitModal.classList.remove("open");
      }
    });
  
    // Handle event submission
    submitEventForm.addEventListener("submit", function(e) {
      e.preventDefault();
      // Collect event details from the form fields
      const title = document.getElementById("event-title").value;
      const date = document.getElementById("event-date").value;
      const location = document.getElementById("event-location").value;
      const description = document.getElementById("event-description").value;
  
      // Create a new event element
      const newEvent = document.createElement("article");
      newEvent.className = "event-item";
      newEvent.setAttribute("tabindex", "0");
      newEvent.innerHTML = `
        <h3>${title}</h3>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Location:</strong> ${location}</p>
        <p>${description}</p>
      `;
      
      // Append the new event to the event list
      eventListContainer.appendChild(newEvent);
      
      // Reset the form and close the modal
      submitEventForm.reset();
      submitModal.classList.remove("open");
      
      // Update the filter status live region with the total number of events
      filterStatus.textContent = document.querySelectorAll(".event-item").length + " events total.";
    });
  
    // Basic client-side validation for the contact form
    const contactForm = document.getElementById("contact-form");
    contactForm.addEventListener("submit", function(e) {
      if (!contactForm.checkValidity()) {
        e.preventDefault();
        alert("Please fill out all required fields correctly.");
      }
    });

    // Seasonal theming
    (function applySeasonalTheme() {
      const month = new Date().getMonth() + 1; // 1–12
      let theme;
      if (month >= 3 && month <= 5)      theme = 'theme-spring';
      else if (month >= 6 && month <= 8) theme = 'theme-summer';
      else if (month >= 9 && month <= 11)theme = 'theme-autumn';
      else                                theme = 'theme-winter';
      document.body.classList.add(theme);
    })();

    // Leaflet map integration
    (function initMap() {
      const map = L.map('map').setView([40.7128, -74.0060], 12); // New York coords
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Add markers for each event
      document.querySelectorAll('.event-item').forEach(item => {
        const title = item.querySelector('h3').textContent;
        const date  = item.querySelector('p strong').nextSibling.textContent.trim();
        // Dummy coords: you can extend data attributes for real coords
        const coords = item.dataset.coords ? item.dataset.coords.split(',') : [40.7128, -74.0060];
        L.marker(coords).addTo(map)
          .bindPopup(`<strong>${title}</strong><br>${date}`);
      });
    })();

    // Simple reviews widget
    document.querySelectorAll('.review-widget').forEach(widget => {
      const eventId = widget.dataset.eventId;
      const stars   = widget.querySelectorAll('.stars span');
      const countEl = widget.querySelector('.review-count');
      // Load stored rating
      let avg = +localStorage.getItem(eventId + '-avg') || 0;
      let cnt = +localStorage.getItem(eventId + '-cnt') || 0;
      updateDisplay(avg, cnt);

      stars.forEach(star => {
        star.addEventListener('click', () => {
          const val = +star.dataset.value;
          avg = (avg * cnt + val) / (++cnt);
          localStorage.setItem(eventId + '-avg', avg);
          localStorage.setItem(eventId + '-cnt', cnt);
          updateDisplay(avg, cnt);
        });
      });

      function updateDisplay(average, count) {
        stars.forEach(s => {
          s.classList.toggle('rated', +s.dataset.value <= Math.round(average));
        });
        countEl.textContent = `(${count})`;
      }
    });
  });
  