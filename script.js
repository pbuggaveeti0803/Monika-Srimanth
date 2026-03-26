document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("rsvpForm");
  const resultDiv = document.getElementById("formResult");

  const attendanceItems = document.querySelectorAll(".attendance-item");

  /* SHOW / HIDE GUEST COUNT */

  attendanceItems.forEach((item) => {
    const radios = item.querySelectorAll('input[type="radio"]');
    const guestWrap = item.querySelector(".guest-count-wrap");
    const guestInput = item.querySelector(".guest-input");

    radios.forEach((radio) => {
      radio.addEventListener("change", () => {
        if (radio.value === "Attending" && radio.checked) {
          guestWrap.classList.remove("hidden");
          guestInput.required = true;
        }

        if (radio.value === "Not Attending" && radio.checked) {
          guestWrap.classList.add("hidden");
          guestInput.required = false;
          guestInput.value = "";
        }
      });
    });
  });

  /* VALIDATION */

  function isFormValid() {
    const name = form.querySelector('input[name="name"]');

    if (!name.value.trim()) return false;

    for (let item of attendanceItems) {
      const radios = item.querySelectorAll('input[type="radio"]');
      const guestInput = item.querySelector(".guest-input");

      let selected = false;
      let attending = false;

      radios.forEach((radio) => {
        if (radio.checked) {
          selected = true;
          if (radio.value === "Attending") attending = true;
        }
      });

      if (!selected) return false;

      if (attending && (!guestInput.value || guestInput.value < 1)) {
        return false;
      }
    }

    return true;
  }

  /* SUBMIT */

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // clear previous message
    resultDiv.classList.remove("hidden");
    resultDiv.innerHTML = "";

    if (!isFormValid()) {
      resultDiv.innerHTML = `
        <div class="error-message">
          <p>Please fill all required fields before submitting.</p>
        </div>
      `;
      resultDiv.scrollIntoView({ behavior: "smooth" });
      return;
    }

    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        form.reset();

        document
          .querySelectorAll(".guest-count-wrap")
          .forEach((el) => el.classList.add("hidden"));

        resultDiv.innerHTML = `
          <div class="success-message">
            <p>🎉 Your RSVP has been received successfully.</p>
          </div>
        `;
      } else {
        throw new Error();
      }
    } catch {
      resultDiv.innerHTML = `
        <div class="error-message">
          <p>Something went wrong. Please try again.</p>
        </div>
      `;
    }
  });
});
