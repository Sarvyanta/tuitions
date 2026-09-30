const WHATSAPP_NUMBER = "917386405614";


/* ================= ANALYTICS ================= */

function trackEvent(eventName, params = {}) {
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }
}


function getWhatsAppUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}


/* ================= MOBILE NAV ================= */

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

if (menuToggle && mainNav) {

  menuToggle.addEventListener("click", () => {

    const isOpen = mainNav.classList.toggle("show");

    menuToggle.setAttribute(
      "aria-expanded",
      String(isOpen)
    );

    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close menu" : "Open menu"
    );

    trackEvent("mobile_menu_toggle", {
      state: isOpen ? "open" : "closed"
    });

  });


  mainNav.querySelectorAll("a").forEach((link) => {

    link.addEventListener("click", () => {

      mainNav.classList.remove("show");

      menuToggle.setAttribute(
        "aria-expanded",
        "false"
      );

      menuToggle.setAttribute(
        "aria-label",
        "Open menu"
      );

    });

  });

}


/* ================= ENQUIRY / DEMO MODAL ================= */

const inquiryModal =
  document.getElementById("inquiryModal");

const modalClose =
  document.getElementById("modalClose");

const inquiryForm =
  document.getElementById("inquiryForm");

const modalTitle =
  document.getElementById("modalTitle");

const modalKicker =
  document.getElementById("modalKicker");

const modalDescription =
  document.getElementById("modalDescription");


let currentEnquirySource = "unknown";


function openInquiryModal(
  source = "unknown",
  learning = "",
  className = ""
) {

  if (!inquiryModal) return;

  currentEnquirySource = source;

  inquiryModal.dataset.source = source;

  const isFreeDemo =
    source === "free_demo";


  if (modalKicker) {

    modalKicker.textContent =
      isFreeDemo
        ? "Free Demo Class"
        : "Tuition Enquiry";

  }


  if (modalTitle) {

    modalTitle.textContent =
      isFreeDemo
        ? "Book your free demo class."
        : "Tell us what you need.";

  }


  if (modalDescription) {

    modalDescription.textContent =
      isFreeDemo
        ? "Share the details you already know. We’ll continue with you through WhatsApp."
        : "Share the details you already know. You don't need to fill everything.";

  }


  inquiryModal.classList.add("show");

  inquiryModal.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.classList.add(
    "modal-open"
  );


  if (learning) {

    const option =
      inquiryForm?.querySelector(
        `input[name="learning"][value="${CSS.escape(learning)}"]`
      );

    if (option) {
      option.checked = true;
    }

  }


  if (className) {

    const classSelect =
      document.getElementById("className");

    if (classSelect) {
      classSelect.value = className;
    }

  }


  /*
    Existing GA4 event names are retained
    so historical analytics are not disrupted.
  */

  trackEvent("inquiry_open", {

    source,

    form_type:
      isFreeDemo
        ? "free_demo"
        : "enquiry"

  });


  const nameField =
    document.getElementById("name");

  setTimeout(() => {
    nameField?.focus();
  }, 80);

}


function closeInquiryModal() {

  if (!inquiryModal) return;

  inquiryModal.classList.remove("show");

  inquiryModal.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.classList.remove(
    "modal-open"
  );

  currentEnquirySource = "unknown";

}


/* OPEN BUTTONS */

document
  .querySelectorAll("[data-open-inquiry]")
  .forEach((button) => {

    button.addEventListener("click", () => {

      const source =
        button.dataset.inquirySource ||
        "unknown";

      const learning =
        button.dataset.learning ||
        "";

      const className =
        button.dataset.class ||
        "";

      openInquiryModal(
        source,
        learning,
        className
      );

    });

  });


/* CLOSE BUTTONS */

document
  .querySelectorAll("[data-close-modal]")
  .forEach((element) => {

    element.addEventListener(
      "click",
      closeInquiryModal
    );

  });


modalClose?.addEventListener(
  "click",
  closeInquiryModal
);


document.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key === "Escape" &&
      inquiryModal?.classList.contains("show")
    ) {
      closeInquiryModal();
    }

  }
);


/* ================= CLASS SELECTION ================= */

document
  .querySelectorAll("[data-class]")
  .forEach((button) => {

    button.addEventListener("click", () => {

      const selectedClass =
        button.dataset.class || "";

      trackEvent(
        "class_selected",
        {
          class_name: selectedClass
        }
      );

      openInquiryModal(
        "class_selector",
        "",
        selectedClass
      );

    });

  });


/* ================= WHATSAPP ================= */

document
  .querySelectorAll("[data-whatsapp-click]")
  .forEach((link) => {

    link.addEventListener("click", () => {

      trackEvent(
        "whatsapp_click",
        {
          source:
            link.dataset.whatsappClick ||
            "unknown"
        }
      );

    });

  });


/* ================= FORM SUBMISSION ================= */

inquiryForm?.addEventListener(
  "submit",
  (event) => {

    event.preventDefault();


    const formData =
      new FormData(inquiryForm);


    const name =
      String(
        formData.get("name") || ""
      ).trim();


    const className =
      String(
        formData.get("className") || ""
      ).trim();


    const subject =
      String(
        formData.get("subject") || ""
      ).trim();


    const learning =
      String(
        formData.get("learning") || ""
      ).trim();


    const location =
      String(
        formData.get("location") || ""
      ).trim();


    const message =
      String(
        formData.get("message") || ""
      ).trim();


    if (!name) {

      alert(
        "Please enter a parent, guardian or student name."
      );

      document
        .getElementById("name")
        ?.focus();

      return;

    }


    const isFreeDemo =
      currentEnquirySource === "free_demo";


    /*
      No names, phone numbers, locations
      or free-text are sent to GA4.
    */

    trackEvent(
      "inquiry_submitted",
      {

        has_class:
          Boolean(className),

        has_subject:
          Boolean(subject),

        learning_type:
          learning ||
          "not_selected",

        has_location:
          Boolean(location),

        has_message:
          Boolean(message),

        request_type:
          isFreeDemo
            ? "free_demo"
            : "enquiry"

      }
    );


    const lines = [

      "Hello Sarvyanta Tuition Connect,",

      isFreeDemo
        ? "I would like to book a free demo class."
        : "I would like to make a tuition enquiry.",

      `Name: ${name}`,

      className
        ? `Class: ${className}`
        : "",

      subject
        ? `Subject: ${subject}`
        : "",

      learning
        ? `Learning preference: ${learning}`
        : "",

      location
        ? `Area / City: ${location}`
        : "",

      message
        ? `Requirement: ${message}`
        : "",

      "Please let me know the suitable next steps."

    ].filter(Boolean);


    window.open(
      getWhatsAppUrl(
        lines.join("\n")
      ),
      "_blank",
      "noopener,noreferrer"
    );


    inquiryForm.reset();

    closeInquiryModal();

  }
);


/* ================= FAQ TRACKING ================= */

document
  .querySelectorAll(".faq-list details")
  .forEach((item) => {

    item.addEventListener(
      "toggle",
      () => {

        if (item.open) {

          const question =
            item
              .querySelector("summary")
              ?.childNodes[0]
              ?.textContent
              ?.trim() || "";

          trackEvent(
            "faq_open",
            {
              question
            }
          );

        }

      }
    );

  });


/* ================= SCROLL DEPTH ================= */

const scrollMilestones = [
  25,
  50,
  75,
  90
];

const reachedMilestones =
  new Set();


function trackScrollDepth() {

  const scrollable =
    document.documentElement.scrollHeight -
    window.innerHeight;

  if (scrollable <= 0) return;


  const percentage =
    Math.round(
      (window.scrollY / scrollable) * 100
    );


  scrollMilestones.forEach(
    (milestone) => {

      if (
        percentage >= milestone &&
        !reachedMilestones.has(
          milestone
        )
      ) {

        reachedMilestones.add(
          milestone
        );

        trackEvent(
          "scroll_depth",
          {
            percent: milestone
          }
        );

      }

    }
  );

}


window.addEventListener(
  "scroll",
  trackScrollDepth,
  { passive: true }
);


/* ================= URL PREFILL ================= */

const urlParams =
  new URLSearchParams(
    window.location.search
  );

const classFromUrl =
  urlParams.get("class");


if (classFromUrl) {

  const classSelect =
    document.getElementById(
      "className"
    );

  if (classSelect) {

    const normalizedClass =
      classFromUrl
        .replace(/\+/g, " ")
        .toLowerCase();


    const matchingOption =
      Array.from(
        classSelect.options
      ).find(
        (option) =>
          option.value
            .toLowerCase() ===
          normalizedClass
      );


    if (matchingOption) {

      classSelect.value =
        matchingOption.value;

    }

  }

}


/* ================= PAGE VIEW ================= */

trackEvent(
  "tuition_page_view",
  {
    page_type:
      "tuition_landing"
  }
);
