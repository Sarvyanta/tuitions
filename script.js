/* =========================================
   SARVYANTA TUITION CONNECT
   Main interaction script
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  const WHATSAPP_NUMBER = "917386405614";

  const inquiryModal = document.getElementById("inquiryModal");
  const modalClose = document.getElementById("modalClose");
  const inquiryForm = document.getElementById("inquiryForm");

  const menuButton = document.getElementById("menuButton");
  const mobileMenu = document.getElementById("mobileMenu");


  /* =========================================
     GOOGLE ANALYTICS HELPER
  ========================================= */

  function trackEvent(eventName, parameters = {}) {

    if (typeof window.gtag === "function") {
      window.gtag(
        "event",
        eventName,
        parameters
      );
    }

  }


  /* =========================================
     OPEN INQUIRY MODAL
  ========================================= */

  function openInquiry(prefillType = "") {

    if (!inquiryModal) return;

    inquiryModal.classList.add("active");

    inquiryModal.setAttribute(
      "aria-hidden",
      "false"
    );

    document.body.style.overflow = "hidden";

    if (prefillType) {

      const learningMode =
        document.getElementById("learningMode");

      if (learningMode) {

        if (
          prefillType === "Online Tuition" ||
          prefillType === "Home Tuition"
        ) {
          learningMode.value = prefillType;
        }

      }

    }

    trackEvent(
      "tuition_inquiry_open",
      {
        inquiry_type:
          prefillType || "general"
      }
    );

    setTimeout(() => {

      const nameInput =
        document.getElementById("studentName");

      if (nameInput) {
        nameInput.focus();
      }

    }, 150);

  }


  /* =========================================
     CLOSE INQUIRY MODAL
  ========================================= */

  function closeInquiry() {

    if (!inquiryModal) return;

    inquiryModal.classList.remove("active");

    inquiryModal.setAttribute(
      "aria-hidden",
      "true"
    );

    document.body.style.overflow = "";

  }


  /* =========================================
     ALL OPEN-INQUIRY BUTTONS
  ========================================= */

  document
    .querySelectorAll("[data-open-inquiry]")
    .forEach((button) => {

      button.addEventListener(
        "click",
        () => openInquiry()
      );

    });


  /* =========================================
     QUICK INQUIRY OPTIONS
  ========================================= */

  document
    .querySelectorAll("[data-inquiry-type]")
    .forEach((button) => {

      button.addEventListener(
        "click",
        () => {

          const inquiryType =
            button.dataset.inquiryType;

          openInquiry(inquiryType);

        }
      );

    });


  /* =========================================
     CLASS BUTTONS
  ========================================= */

  document
    .querySelectorAll("[data-class]")
    .forEach((button) => {

      button.addEventListener(
        "click",
        () => {

          const selectedClass =
            button.dataset.class;

          openInquiry();

          const classSelect =
            document.getElementById("studentClass");

          if (classSelect) {
            classSelect.value =
              selectedClass;
          }

          trackEvent(
            "select_class",
            {
              selected_class:
                selectedClass
            }
          );

        }
      );

    });


  /* =========================================
     MODAL CLOSE EVENTS
  ========================================= */

  if (modalClose) {

    modalClose.addEventListener(
      "click",
      closeInquiry
    );

  }


  document
    .querySelectorAll("[data-close-modal]")
    .forEach((element) => {

      element.addEventListener(
        "click",
        closeInquiry
      );

    });


  /* =========================================
     ESC KEY
  ========================================= */

  document.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key === "Escape" &&
        inquiryModal &&
        inquiryModal.classList.contains("active")
      ) {

        closeInquiry();

      }

    }
  );


  /* =========================================
     MOBILE MENU
  ========================================= */

  if (menuButton && mobileMenu) {

    menuButton.addEventListener(
      "click",
      () => {

        const isOpen =
          mobileMenu.classList.toggle("active");

        menuButton.setAttribute(
          "aria-expanded",
          String(isOpen)
        );

      }
    );


    mobileMenu
      .querySelectorAll("a")
      .forEach((link) => {

        link.addEventListener(
          "click",
          () => {

            mobileMenu.classList.remove(
              "active"
            );

            menuButton.setAttribute(
              "aria-expanded",
              "false"
            );

          }
        );

      });

  }


  /* =========================================
     INQUIRY FORM → WHATSAPP
  ========================================= */

  if (inquiryForm) {

    inquiryForm.addEventListener(
      "submit",
      (event) => {

        event.preventDefault();


        const formData =
          new FormData(inquiryForm);


        const studentName =
          String(
            formData.get("studentName") || ""
          ).trim();


        const studentClass =
          String(
            formData.get("studentClass") || ""
          ).trim();


        const subject =
          String(
            formData.get("subject") || ""
          ).trim();


        const learningMode =
          String(
            formData.get("learningMode") || ""
          ).trim();


        const location =
          String(
            formData.get("location") || ""
          ).trim();


        const message =
          String(
            formData.get("message") || ""
          ).trim();


        let whatsappMessage =
          "Hi, I would like to make a tuition inquiry.%0A%0A";


        if (studentName) {

          whatsappMessage +=
            "Name: " +
            studentName +
            "%0A";

        }


        if (studentClass) {

          whatsappMessage +=
            "Class: " +
            studentClass +
            "%0A";

        }


        if (subject) {

          whatsappMessage +=
            "Subject: " +
            subject +
            "%0A";

        }


        if (learningMode) {

          whatsappMessage +=
            "Learning preference: " +
            learningMode +
            "%0A";

        }


        if (location) {

          whatsappMessage +=
            "Location: " +
            location +
            "%0A";

        }


        if (message) {

          whatsappMessage +=
            "%0ARequirement:%0A" +
            encodeURIComponent(message);

        }


        whatsappMessage +=
          "%0A%0ASent through Sarvyanta Tuition Connect.";


        const whatsappURL =
          "https://wa.me/" +
          WHATSAPP_NUMBER +
          "?text=" +
          whatsappMessage;


        trackEvent(
          "whatsapp_inquiry",
          {
            class:
              studentClass || "not_specified",

            subject:
              subject || "not_specified",

            learning_mode:
              learningMode || "not_specified",

            location:
              location || "not_specified"
          }
        );


        window.open(
          whatsappURL,
          "_blank",
          "noopener"
        );


        /*
         * Reset after launching WhatsApp.
         */

        inquiryForm.reset();

        closeInquiry();

      }
    );

  }


  /* =========================================
     DIRECT WHATSAPP CLICK TRACKING
  ========================================= */

  document
    .querySelectorAll(
      'a[href*="wa.me"]'
    )
    .forEach((link) => {

      link.addEventListener(
        "click",
        () => {

          trackEvent(
            "whatsapp_click",
            {
              source:
                link.className ||
                "whatsapp_link"
            }
          );

        }
      );

    });


  /* =========================================
     FAQ TRACKING
  ========================================= */

  document
    .querySelectorAll(
      ".faq-list details"
    )
    .forEach((faq) => {

      faq.addEventListener(
        "toggle",
        () => {

          if (faq.open) {

            const question =
              faq.querySelector("summary");

            trackEvent(
              "faq_open",
              {
                question:
                  question
                    ? question.textContent.trim()
                    : "unknown"
              }
            );

          }

        }
      );

    });


  /* =========================================
     SCROLL DEPTH TRACKING
  ========================================= */

  const scrollMarks = {
    25: false,
    50: false,
    75: false,
    90: false
  };


  window.addEventListener(
    "scroll",
    () => {

      const scrollTop =
        window.scrollY;

      const documentHeight =
        document.documentElement.scrollHeight -
        window.innerHeight;

      if (documentHeight <= 0) return;

      const percentage =
        Math.round(
          (scrollTop / documentHeight) *
          100
        );


      Object.keys(scrollMarks)
        .forEach((mark) => {

          const numericMark =
            Number(mark);

          if (
            percentage >= numericMark &&
            !scrollMarks[mark]
          ) {

            scrollMarks[mark] = true;

            trackEvent(
              "scroll_depth",
              {
                percentage:
                  numericMark
              }
            );

          }

        });

    },
    {
      passive: true
    }
  );


  /* =========================================
     EXTERNAL LINK SAFETY
  ========================================= */

  document
    .querySelectorAll(
      'a[target="_blank"]'
    )
    .forEach((link) => {

      const rel =
        link.getAttribute("rel") || "";

      if (
        !rel.includes("noopener")
      ) {

        link.setAttribute(
          "rel",
          "noopener"
        );

      }

    });


});
