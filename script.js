/* =========================================================
   SARVYANTA TUITION CONNECT
   Version 2
   ========================================================= */


/* ================= CONFIG ================= */

const WHATSAPP_NUMBER = "917386405614";


/* ================= HELPERS ================= */

function trackEvent(eventName, params = {}) {
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }
}


function getWhatsAppUrl(message) {
  return (
    "https://wa.me/" +
    WHATSAPP_NUMBER +
    "?text=" +
    encodeURIComponent(message)
  );
}


/* ================= MOBILE NAV ================= */

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

if (menuToggle && mainNav) {

  menuToggle.addEventListener("click", () => {

    const isOpen = mainNav.classList.toggle("open");

    menuToggle.setAttribute(
      "aria-expanded",
      String(isOpen)
    );

    trackEvent(
      isOpen
        ? "mobile_menu_open"
        : "mobile_menu_close"
    );

  });


  mainNav.querySelectorAll("a").forEach(link => {

    link.addEventListener("click", () => {

      mainNav.classList.remove("open");

      menuToggle.setAttribute(
        "aria-expanded",
        "false"
      );

    });

  });

}


/* ================= INQUIRY MODAL ================= */

const inquiryModal =
  document.getElementById("inquiryModal");

const modalClose =
  document.getElementById("modalClose");


function openInquiryModal(source = "unknown", learning = "", className = "") {

  if (!inquiryModal) return;

  inquiryModal.classList.add("show");

  inquiryModal.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.classList.add("modal-open");

  trackEvent("inquiry_open", {
    source: source
  });


  if (learning) {

    const learningInput =
      document.querySelector(
        `input[name="learning"][value="${learning}"]`
      );

    if (learningInput) {
      learningInput.checked = true;
    }

  }


  if (className) {

    const classSelect =
      document.getElementById("className");

    if (classSelect) {
      classSelect.value = className;
    }

  }


  setTimeout(() => {

    const nameInput =
      document.getElementById("name");

    if (nameInput) {
      nameInput.focus();
    }

  }, 100);

}


function closeInquiryModal() {

  if (!inquiryModal) return;

  inquiryModal.classList.remove("show");

  inquiryModal.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.classList.remove("modal-open");

}


document
  .querySelectorAll("[data-open-inquiry]")
  .forEach(button => {

    button.addEventListener("click", () => {

      openInquiryModal(
        button.dataset.inquirySource || "button",
        button.dataset.learning || "",
        button.dataset.class || ""
      );

    });

  });


if (modalClose) {

  modalClose.addEventListener(
    "click",
    closeInquiryModal
  );

}


document
  .querySelectorAll("[data-close-modal]")
  .forEach(element => {

    element.addEventListener(
      "click",
      closeInquiryModal
    );

  });


document.addEventListener("keydown", event => {

  if (
    event.key === "Escape" &&
    inquiryModal &&
    inquiryModal.classList.contains("show")
  ) {

    closeInquiryModal();

  }

});


/* ================= CLASS BUTTONS ================= */

document
  .querySelectorAll("[data-class]")
  .forEach(button => {

    button.addEventListener("click", () => {

      const selectedClass =
        button.dataset.class;

      trackEvent("class_selected", {
        class_name: selectedClass
      });

      openInquiryModal(
        "class_selector",
        "",
        selectedClass
      );

    });

  });


/* ================= WHATSAPP TRACKING ================= */

document
  .querySelectorAll("[data-whatsapp-click]")
  .forEach(link => {

    link.addEventListener("click", () => {

      const source =
        link.dataset.whatsappClick || "unknown";

      trackEvent("whatsapp_click", {
        source: source
      });

    });

  });


/* ================= INQUIRY FORM ================= */

const inquiryForm =
  document.getElementById("inquiryForm");


if (inquiryForm) {

  inquiryForm.addEventListener(
    "submit",
    event => {

      event.preventDefault();


      const formData =
        new FormData(inquiryForm);


      /*
       * Read form values locally.
       * Do NOT send names, free-text messages,
       * locations or phone numbers to GA4.
       */

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

        return;

      }


      /*
       * GA4 event intentionally contains
       * NO personal information.
       */

      trackEvent("inquiry_submitted", {
        has_class: Boolean(className),
        has_subject: Boolean(subject),
        learning_type:
          learning || "not_selected",
        has_location: Boolean(location),
        has_message: Boolean(message)
      });


      /*
       * Build the WhatsApp message first,
       * then encode the COMPLETE message once.
       */

      const lines = [
        "Hello Sarvyanta Tuition Connect,",
        "",
        "I would like to make a tuition inquiry.",
        "",
        `Name: ${name}`
      ];


      if (className) {
        lines.push(
          `Class: ${className}`
        );
      }


      if (subject) {
        lines.push(
          `Subject: ${subject}`
        );
      }


      if (learning) {
        lines.push(
          `Learning preference: ${learning}`
        );
      }


      if (location) {
        lines.push(
          `Area / City: ${location}`
        );
      }


      if (message) {
        lines.push(
          "",
          `Requirement: ${message}`
        );
      }


      lines.push(
        "",
        "Please let me know the suitable next steps."
      );


      const whatsappMessage =
        lines.join("\n");


      const whatsappUrl =
        getWhatsAppUrl(
          whatsappMessage
        );


      window.open(
        whatsappUrl,
        "_blank",
        "noopener,noreferrer"
      );


      /*
       * Reset form after preparing
       * the WhatsApp inquiry.
       */

      inquiryForm.reset();

      closeInquiryModal();

    }
  );

}


/* ================= FAQ TRACKING ================= */

document
  .querySelectorAll("details")
  .forEach(item => {

    item.addEventListener(
      "toggle",
      () => {

        if (!item.open) return;

        const question =
          item.querySelector("summary");

        if (!question) return;

        trackEvent("faq_open", {
          question:
            question.textContent
              .replace("+", "")
              .trim()
        });

      }
    );

  });


/* ================= SCROLL DEPTH ================= */

const scrollMarks = {
  25: false,
  50: false,
  75: false,
  90: false
};


function checkScrollDepth() {

  const documentHeight =
    document.documentElement.scrollHeight -
    window.innerHeight;

  if (documentHeight <= 0) return;

  const percentage =
    (window.scrollY / documentHeight) * 100;


  Object.keys(scrollMarks).forEach(mark => {

    const numericMark =
      Number(mark);

    if (
      percentage >= numericMark &&
      !scrollMarks[mark]
    ) {

      scrollMarks[mark] = true;

      trackEvent("scroll_depth", {
        percent: numericMark
      });

    }

  });

}


window.addEventListener(
  "scroll",
  checkScrollDepth,
  { passive: true }
);


/* ================= PREFILL FROM URL ================= */

/*
 * Optional:
 *
 * ?class=Class%208
 *
 * can open the form with a class preselected
 * if you decide to use such links later.
 */

const urlParams =
  new URLSearchParams(
    window.location.search
  );

const urlClass =
  urlParams.get("class");


if (urlClass) {

  const classSelect =
    document.getElementById("className");

  if (
    classSelect &&
    [...classSelect.options]
      .some(option => option.value === urlClass)
  ) {

    classSelect.value = urlClass;

  }

}


/* ================= INITIAL PAGE EVENT ================= */

trackEvent("tuition_page_view", {
  page_type: "tuition_landing"
});
