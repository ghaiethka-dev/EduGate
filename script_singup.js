(() => {
  // Elements
  const overlay = document.getElementById("overlay");
  const overlayInner = document.getElementById("overlayInner");
  const btnStudent = document.getElementById("btn-student");
  const btnTeacher = document.getElementById("btn-teacher");
  const closeBtn = document.getElementById("closeBtn");
  const imagePanel = document.getElementById("imagePanel");
  const imageLabel = document.getElementById("imageLabel");
  const formTitle = document.getElementById("formTitle");
  const formSubtitle = document.getElementById("formSubtitle");
  const studentExtra = document.getElementById("studentExtra");
  const teacherExtra = document.getElementById("teacherExtra");
  const signupForm = document.getElementById("signupForm");
  const switchRoleBtn = document.getElementById("switchRoleBtn");
  let currentRole = null;
  // Images (data-src or base64 / svg placeholders)
  const assets = {
    student: {
      label: "",
      title: "Student registration",
      subtitle: "Start your educational journey now",
      image: `
     
      url('images/1.jpg')
    `,
    },

    teacher: {
      label: "",
      title: "Teacher registration",
      subtitle: "Share your experiences with thousands of students",
      image: `
      
      url('images/3.jpg')
    `,
    },
  };

  // Utility: open overlay with role
  function openFor(role) {
    currentRole = role;
    overlay.setAttribute("aria-hidden", "false");
    overlay.style.display = "flex"; // ensure visible for animation
    // set texts
    formTitle.textContent = assets[role].title;
    formSubtitle.textContent = assets[role].subtitle;
    imageLabel.textContent = assets[role].label;
    // set image background
    imagePanel.style.backgroundImage = assets[role].image;
    // show/hide extra fields
    if (role === "student") {
      studentExtra.classList.remove("hidden");
      teacherExtra.classList.add("hidden");
      switchRoleBtn.textContent = "Create a teacher account instead.";
    } else {
      teacherExtra.classList.remove("hidden");
      studentExtra.classList.add("hidden");
      switchRoleBtn.textContent = "Create a Student account instead.";
    }
    // set focus to first input
    setTimeout(() => {
      const first = document.getElementById("name");
      if (first) first.focus();
    }, 220);
  }
  function closeOverlay() {
    overlay.setAttribute("aria-hidden", "true");
    setTimeout(() => {
      overlay.style.display = "none";
    }, 320);
    currentRole = null;
    signupForm.reset();
    clearValidation();
  }
  // Attach events
  btnStudent.addEventListener("click", () => openFor("student"));
  btnTeacher.addEventListener("click", () => openFor("teacher"));
  closeBtn.addEventListener("click", closeOverlay);
  // Clicking outside inner closes overlay
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeOverlay();
  });
  // switchRoleBtn toggles between roles
  switchRoleBtn.addEventListener("click", () => {
    if (!currentRole) return;
    const other = currentRole === "student" ? "teacher" : "student";
    openFor(other);
  });
  // ---------- Validation ----------
  const validators = {
    name: (v) => v.trim().length >= 3 || "Name must be at least 3 characters.",
    email: (v) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ||
      "Please enter a valid email address.",
    password: (v) => v.length >= 8 || "Password must be at least 8 characters.",
    confirmPassword: (v) =>
      v === document.getElementById("password").value ||
      "Passwords do not match.",
    age: (v) => {
      const n = Number(v);
      return (
        (!isNaN(n) && n >= 13 && n <= 120) || "Enter an age between 13 and 120."
      );
    },
    specialty: (v) => v.trim().length >= 2 || "Please enter a valid specialty.",
    bio: (v) => v.trim().length >= 20 || "Bio must be at least 20 characters.",
    studyLevel: (v) => true, // optional
  };

  function showError(field, message) {
    const container =
      document.querySelector(`#${field}`).closest(".field") ||
      document.querySelector(`#${field}`).parentElement;
    if (container) container.classList.add("invalid");
    const el = document.querySelector(`.error[data-for="${field}"]`);
    if (el) el.textContent = (message === true ? "" : message) || "";
  }
  function clearError(field) {
    const container =
      document.querySelector(`#${field}`).closest(".field") ||
      document.querySelector(`#${field}`).parentElement;
    if (container) container.classList.remove("invalid");
    const el = document.querySelector(`.error[data-for="${field}"]`);
    if (el) el.textContent = "";
  }
  function clearValidation() {
    document.querySelectorAll(".error").forEach((e) => (e.textContent = ""));
    document
      .querySelectorAll(".field.invalid")
      .forEach((f) => f.classList.remove("invalid"));
  }
  // Validate on input for immediate feedback
  [
    "name",
    "email",
    "password",
    "confirmPassword",
    "age",
    "specialty",
    "bio",
    "studyLevel",
  ].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("input", () => {
      if (!validators[id]) return;
      const res = validators[id](el.value);
      if (res === true) clearError(id);
      else showError(id, res);
    });
  });
  // On submit
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    clearValidation();
    const data = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
      confirmPassword: document.getElementById("confirmPassword").value,
      age: document.getElementById("age").value,
      specialty: document.getElementById("specialty")
        ? document.getElementById("specialty").value
        : "",
      bio: document.getElementById("bio")
        ? document.getElementById("bio").value
        : "",
      studyLevel: document.getElementById("studyLevel")
        ? document.getElementById("studyLevel").value
        : "",
    };
    // Collect fields to validate
    const toValidate = ["name", "email", "password", "confirmPassword", "age"];
    if (currentRole === "teacher") {
      toValidate.push("specialty", "bio");
    } else if (currentRole === "student") {
      toValidate.push("studyLevel");
    }
    let valid = true;
    toValidate.forEach((key) => {
      const fn = validators[key];
      if (!fn) return;
      const res = fn(data[key] ?? "");
      if (res !== true) {
        valid = false;
        showError(key, res);
      } else clearError(key);
    });
    if (!valid) {
      // small visual cue
      const formPanel = document.querySelector(".form-panel");
      formPanel.animate(
        [
          { transform: "translateX(0)" },
          { transform: "translateX(-6px)" },
          { transform: "translateX(0)" },
        ],
        { duration: 380, easing: "ease-out" }
      );
      return;
    }
    // If valid: (since we can't actually send to server here) show success animation/message
    showSuccess();
  });
  function showSuccess() {
    const wrap = document.querySelector(".form-wrap");
    wrap.innerHTML = `
      <div style="padding:28px 6px;text-align:center">
        <div style="font-size:44px;margin-bottom:10px">✅</div>
        <h3>Account Created Successfully</h3>
        <p class="muted">Your account has been created as a <strong>${
          currentRole === "teacher" ? "Teacher" : "Student"
        }</strong>. You can now log in and start using the platform.</p>
        <div style="margin-top:18px;">
          <button class="primary-btn" id="doneBtn">Go to Home Page</button>
        </div>
      </div>
    `;

    // done button closes overlay
    document.getElementById("doneBtn").addEventListener("click", closeOverlay);
  }
  // Initial state: hide overlay
  overlay.setAttribute("aria-hidden", "true");
  overlay.style.display = "none";
  // Accessibility: trap focus inside overlay when open (basic)
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.getAttribute("aria-hidden") === "false") {
      closeOverlay();
    }
  });
})();
lottie.loadAnimation({
  container: document.getElementById("lottie-hero"),
  renderer: "svg",
  loop: true,
  autoplay: true,
  path: "images/brain thinking.json",
});

// Middle animation
