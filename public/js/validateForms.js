const validate = () => {
  // Get forms on page
  const forms = document.querySelectorAll(".validated-form");

  // Submit if true
  if (forms[0].checkValidity()) {
    forms[0].requestSubmit();
    // Else show user errors
  } else {
    // Add validation class
    forms[0].classList.add("was-validated");

    const elements = [...forms[0].querySelectorAll("input, textarea, select")];

    // Find message containers after invalid inputs
    const messages = [
      ...forms[0].querySelectorAll(
        "input + .validate-msg, textarea + .validate-msg, select + .validate-msg"
      ),
    ];

    // Add validation message after
    for (let i = 0; i < elements.length; i++) {
      messages[i].textContent = elements[i].validationMessage;
      if (elements[i].validationMessage === "") {
        messages[i].textContent = "Good";
      }

      // Add listener on each element to update the message when necessary
      elements[i].addEventListener("input", () => {
        if (elements[i].checkValidity()) {
          messages[i].textContent = "Good";
        } else {
          messages[i].textContent = elements[i].validationMessage;
        }
      });
    }
  }
};
