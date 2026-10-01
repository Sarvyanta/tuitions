const WHATSAPP_NUMBER = "917386406514";

/* ================= ANALYTICS ================= */

function trackEvent(eventName, params = {}) {
  if (typeof window.gtag === "function") {
    window.gtag(
      "event",
      eventName,
      params
    );
  }
}

function getWhatsAppUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}


/* ================= CAMPAIGN / SOURCE TRACKING ================= */

const urlParams =
  new URLSearchParams(
    window.location.search
  );

const trafficSource =
  urlParams.get("utm_source") || "";

const trafficMedium =
  urlParams.get("utm_medium") || "";

const trafficCampaign =
  urlParams.get("utm_campaign") || "";


/*
  Preserve campaign information
  for this browser session.
*/

if (
  trafficSource ||
  trafficMedium ||
  trafficCampaign
) {
  sessionStorage.setItem(
    "sarvyanta_traffic_source",
    trafficSource
  );

  sessionStorage.setItem(
    "sarvyanta_traffic_medium",
    trafficMedium
  );

  sessionStorage.setItem(
    "sarvyanta_traffic_campaign",
    trafficCampaign
  );
}


const storedTrafficSource =
  sessionStorage.getItem(
    "sarvyanta_traffic_source"
  ) || "";

const storedTrafficMedium =
  sessionStorage.getItem(
    "sarvyanta_traffic_medium"
  ) || "";

const storedTrafficCampaign =
  sessionStorage.getItem(
    "sarvyanta_traffic_campaign"
  ) || "";


function getTrafficParams() {
  return {

    traffic_source:
      storedTrafficSource ||
      "direct",

    traffic_medium:
      storedTrafficMedium ||
      "none",

    traffic_campaign:
      storedTrafficCampaign ||
      "none"

  };
}


/* ================= WHATSAPP STATUS VISIT ================= */

/*
  Detect visitors arriving through:

  ?utm_source=whatsapp
  &utm_medium=status
  &utm_campaign=tuition
*/

const isWhatsAppStatusTraffic =
  trafficSource.toLowerCase() === "whatsapp" &&
  trafficMedium.toLowerCase() === "status";


if (isWhatsAppStatusTraffic) {

  trackEvent(
    "whatsapp_status_visit",
    {
      traffic_source: "whatsapp",
      traffic_medium: "status",
      traffic_campaign:
        trafficCampaign || "tuition"
    }
  );

}


/* ================= MOBILE NAV ================= */

const menuToggle =
  document.getElementById(
    "menuToggle"
  );

const mainNav =
  document.getElementById(
    "mainNav"
  );


if (
  menuToggle &&
  mainNav
) {

  menuToggle.addEventListener(
    "click",
    () => {

      const isOpen =
        mainNav.classList.toggle(
          "show"
        );


      menuToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
      );


      menuToggle.setAttribute(
        "aria-label",
        isOpen
          ? "Close menu"
          : "Open menu"
      );


      trackEvent(
        "mobile_menu_toggle",
        {

          state:
            isOpen
              ? "open"
              : "closed",

          ...getTrafficParams()

        }
      );

    }
  );


  mainNav
    .querySelectorAll("a")
    .forEach(
      (link) => {

        link.addEventListener(
          "click",
          () => {

            mainNav.classList.remove(
              "show"
            );


            menuToggle.setAttribute(
              "aria-expanded",
              "false"
            );


            menuToggle.setAttribute(
              "aria-label",
              "Open menu"
            );

          }
        );

      }
    );

}


/* ================= ENQUIRY MODAL ================= */

const inquiryModal =
  document.getElementById(
    "inquiryModal"
  );

const modalClose =
  document.getElementById(
    "modalClose"
  );

const inquiryForm =
  document.getElementById(
    "inquiryForm"
  );

const modalTitle =
  document.getElementById(
    "modalTitle"
  );

const modalKicker =
  document.getElementById(
    "modalKicker"
  );

const modalDescription =
  document.getElementById(
    "modalDescription"
  );


let currentEnquirySource =
  "unknown";


function openInquiryModal(
  source = "unknown",
  learning = "",
  className = ""
) {

  if (!inquiryModal) {
    return;
  }


  currentEnquirySource =
    source;


  inquiryModal.dataset.source =
    source;


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


  inquiryModal.classList.add(
    "show"
  );


  inquiryModal.setAttribute(
    "aria-hidden",
    "false"
  );


  document.body.classList.add(
    "modal-open"
  );


  /* PRESELECT LEARNING */

  if (learning) {

    const option =
      inquiryForm?.querySelector(
        `input[name="learning"][value="${CSS.escape(learning)}"]`
      );


    if (option) {
      option.checked = true;
    }

  }


  /* PRESELECT CLASS */

  if (className) {

    const classSelect =
      document.getElementById(
        "className"
      );


    if (classSelect) {

      classSelect.value =
        className;

    }

  }


  /* GA4 */

  trackEvent(
    "inquiry_open",
    {

      source,

      form_type:
        isFreeDemo
          ? "free_demo"
          : "enquiry",

      ...getTrafficParams()

    }
  );


  /* FOCUS */

  setTimeout(
    () => {

      document
        .getElementById(
          "className"
        )
        ?.focus();

    },
    80
  );

}


function closeInquiryModal() {

  if (!inquiryModal) {
    return;
  }


  inquiryModal.classList.remove(
    "show"
  );


  inquiryModal.setAttribute(
    "aria-hidden",
    "true"
  );


  document.body.classList.remove(
    "modal-open"
  );


  currentEnquirySource =
    "unknown";

}


/* ================= OPEN ENQUIRY BUTTONS ================= */

document
  .querySelectorAll(
    "[data-open-inquiry]"
  )
  .forEach(
    (button) => {

      button.addEventListener(
        "click",
        () => {

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

        }
      );

    }
  );


/* ================= CLOSE MODAL ================= */

document
  .querySelectorAll(
    "[data-close-modal]"
  )
  .forEach(
    (element) => {

      element.addEventListener(
        "click",
        closeInquiryModal
      );

    }
  );


modalClose?.addEventListener(
  "click",
  closeInquiryModal
);


/* ================= ESCAPE ================= */

document.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key === "Escape" &&
      inquiryModal?.classList.contains(
        "show"
      )
    ) {

      closeInquiryModal();

    }

  }
);


/* ================= CLASS SELECTION ================= */

document
  .querySelectorAll(
    "[data-class]"
  )
  .forEach(
    (button) => {

      button.addEventListener(
        "click",
        () => {

          const selectedClass =
            button.dataset.class ||
            "";


          trackEvent(
            "class_selected",
            {

              class_name:
                selectedClass,

              ...getTrafficParams()

            }
          );


          openInquiryModal(
            "class_selector",
            "",
            selectedClass
          );

        }
      );

    }
  );


/* ================= WHATSAPP ================= */

const whatsappMessages = {

  top_bar:
    "Hello Sarvyanta Tuition Connect,\nI would like to know more about online and home tuition for Classes 1–10.",

  navigation:
    "Hello Sarvyanta Tuition Connect,\nI would like to enquire about tuition support for Classes 1–10.",

  hero:
    "Hello Sarvyanta Tuition Connect,\nI would like to enquire about tuition for Classes 1–10. Please share the suitable options.",

  bottom_cta:
    "Hello Sarvyanta Tuition Connect,\nI would like to make a tuition enquiry. Please help me with the next steps.",

  floating:
    "Hello Sarvyanta Tuition Connect,\nI would like to make a tuition enquiry. Please help me with the suitable tuition option."

};


document
  .querySelectorAll(
    "[data-whatsapp-click]"
  )
  .forEach(
    (link) => {

      const source =
        link.dataset.whatsappClick ||
        "unknown";


      const message =
        whatsappMessages[source] ||
        "Hello Sarvyanta Tuition Connect,\nI would like to make a tuition enquiry.";


      /*
        Set pre-filled WhatsApp message.
      */

      link.href =
        getWhatsAppUrl(
          message
        );


      link.addEventListener(
        "click",
        () => {

          trackEvent(
            "whatsapp_click",
            {

              source,

              ...getTrafficParams()

            }
          );

        }
      );

    }
  );


/* ================= FORM SUBMISSION ================= */

inquiryForm?.addEventListener(
  "submit",
  (event) => {

    event.preventDefault();


    const formData =
      new FormData(
        inquiryForm
      );


    const className =
      String(
        formData.get(
          "className"
        ) ||
        ""
      ).trim();


    const subject =
      String(
        formData.get(
          "subject"
        ) ||
        ""
      ).trim();


    const learning =
      String(
        formData.get(
          "learning"
        ) ||
        ""
      ).trim();


    const location =
      String(
        formData.get(
          "location"
        ) ||
        ""
      ).trim();


    const message =
      String(
        formData.get(
          "message"
        ) ||
        ""
      ).trim();


    const isFreeDemo =
      currentEnquirySource ===
      "free_demo";


    /*
      PRIVACY

      No name, phone number,
      location or free-text
      is sent to GA4.

      Only non-personal
      enquiry attributes are
      tracked.
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
            : "enquiry",

        ...getTrafficParams()

      }
    );


    /* ================= WHATSAPP MESSAGE ================= */

    const lines = [

      "Hello Sarvyanta Tuition Connect,",

      isFreeDemo
        ? "I would like to book a free demo class."
        : "I would like to make a tuition enquiry.",

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


    /* RESET */

    inquiryForm.reset();

    closeInquiryModal();

  }
);


/* ================= FAQ TRACKING ================= */

document
  .querySelectorAll(
    ".faq-list details"
  )
  .forEach(
    (item) => {

      item.addEventListener(
        "toggle",
        () => {

          if (item.open) {

            const question =
              item
                .querySelector(
                  "summary"
                )
                ?.childNodes[0]
                ?.textContent
                ?.trim() ||
              "";


            trackEvent(
              "faq_open",
              {

                question,

                ...getTrafficParams()

              }
            );

          }

        }
      );

    }
  );


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
    document.documentElement
      .scrollHeight -
    window.innerHeight;


  if (scrollable <= 0) {
    return;
  }


  const percentage =
    Math.round(
      (
        window.scrollY /
        scrollable
      ) * 100
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

            percent:
              milestone,

            ...getTrafficParams()

          }
        );

      }

    }
  );

}


window.addEventListener(
  "scroll",
  trackScrollDepth,
  {
    passive: true
  }
);


/* ================= URL CLASS PREFILL ================= */

const classFromUrl =
  urlParams.get(
    "class"
  );


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
      "tuition_landing",

    ...getTrafficParams()

  }
);
