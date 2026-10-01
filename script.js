const WHATSAPP_NUMBER = "917386406514";

/* ================= ANALYTICS ================= */

function trackEvent(eventName, params = {}) {
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }
}

function getWhatsAppUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}


/* ================= CAMPAIGN / SOURCE TRACKING ================= */

const urlParams = new URLSearchParams(window.location.search);

const trafficSource = urlParams.get("utm_source") || "";
const trafficMedium = urlParams.get("utm_medium") || "";
const trafficCampaign = urlParams.get("utm_campaign") || "";


/* Preserve campaign information for this browser session */

if (trafficSource || trafficMedium || trafficCampaign) {
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
  sessionStorage.getItem("sarvyanta_traffic_source") || "";

const storedTrafficMedium =
  sessionStorage.getItem("sarvyanta_traffic_medium") || "";

const storedTrafficCampaign =
  sessionStorage.getItem("sarvyanta_traffic_campaign") || "";


function getTrafficParams() {
  return {
    traffic_source: storedTrafficSource || "direct",
    traffic_medium: storedTrafficMedium || "none",
    traffic_campaign: storedTrafficCampaign || "none"
  };
}


/* ================= WHATSAPP STATUS VISIT TRACKING ================= */

/*
  This specifically identifies visitors who arrive through:

  ?utm_source=whatsapp
  &utm_medium=status
  &utm_campaign=tuition

  The event is intentionally separate from GA4's standard
  acquisition reporting so we can directly verify WhatsApp
  Status traffic.
*/

const isWhatsAppStatusTraffic =
  trafficSource.toLowerCase() === "whatsapp" &&
  trafficMedium.toLowerCase() === "status";


const statusVisitAlreadyTracked =
  sessionStorage.getItem(
    "sarvyanta_whatsapp_status_visit"
  );


if (
  isWhatsAppStatusTraffic &&
  !statusVisitAlreadyTracked
) {
  trackEvent("whatsapp_status_visit", {
    traffic_source: "whatsapp",
    traffic_medium: "status",
    traffic_campaign: trafficCampaign || "tuition"
  });

  sessionStorage.setItem(
    "sarvyanta_whatsapp_status_visit",
    "1"
  );
}


/* ================= MOBILE NAV ================= */

const menuToggle = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector(".mobile-nav");
const mobileNavLinks = document.querySelectorAll(".mobile-nav a");


if (menuToggle && mobileNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mobileNav.classList.toggle("open");

    menuToggle.setAttribute(
      "aria-expanded",
      String(isOpen)
    );
  });
}


mobileNavLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (mobileNav) {
      mobileNav.classList.remove("open");
    }

    if (menuToggle) {
      menuToggle.setAttribute(
        "aria-expanded",
        "false"
      );
    }
  });
});


/* ================= ENQUIRY MODAL ================= */

const inquiryModal =
  document.getElementById("inquiryModal");

const inquiryForm =
  document.getElementById("inquiryForm");

const closeInquiryButtons =
  document.querySelectorAll("[data-close-inquiry]");

const openInquiryButtons =
  document.querySelectorAll("[data-open-inquiry]");


let currentEnquirySource = "enquiry";


function openInquiryModal(source = "enquiry", options = {}) {

  if (!inquiryModal) {
    return;
  }

  currentEnquirySource = source;

  inquiryModal.classList.add("open");

  inquiryModal.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.classList.add("modal-open");


  /* Learning preference */

  if (options.learning) {

    const learningRadio =
      document.querySelector(
        `input[name="learning"][value="${options.learning}"]`
      );

    if (learningRadio) {
      learningRadio.checked = true;
    }
  }


  /* Class preference */

  if (options.className) {

    const classSelect =
      document.getElementById("className");

    if (classSelect) {

      const matchingOption =
        Array.from(classSelect.options).find(
          (option) =>
            option.value.toLowerCase() ===
            String(options.className).toLowerCase()
        );

      if (matchingOption) {
        classSelect.value =
          matchingOption.value;
      }
    }
  }


  trackEvent("enquiry_modal_open", {
    source,
    ...getTrafficParams()
  });


  setTimeout(() => {

    const firstInput =
      inquiryModal.querySelector(
        "select, input, textarea"
      );

    if (firstInput) {
      firstInput.focus();
    }

  }, 100);
}


function closeInquiryModal() {

  if (!inquiryModal) {
    return;
  }

  inquiryModal.classList.remove("open");

  inquiryModal.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.classList.remove("modal-open");

  currentEnquirySource = "enquiry";
}


openInquiryButtons.forEach((button) => {

  button.addEventListener("click", () => {

    const source =
      button.dataset.inquirySource ||
      "enquiry";

    const learning =
      button.dataset.learning || "";

    const className =
      button.dataset.class || "";

    openInquiryModal(source, {
      learning,
      className
    });

  });

});


closeInquiryButtons.forEach((button) => {

  button.addEventListener("click", () => {
    closeInquiryModal();
  });

});


if (inquiryModal) {

  inquiryModal.addEventListener(
    "click",
    (event) => {

      if (
        event.target === inquiryModal
      ) {
        closeInquiryModal();
      }

    }
  );
}


document.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key === "Escape" &&
      inquiryModal &&
      inquiryModal.classList.contains("open")
    ) {
      closeInquiryModal();
    }

  }
);


/* ================= CLASS SELECTION ================= */

const classButtons =
  document.querySelectorAll("[data-class]");


classButtons.forEach((button) => {

  button.addEventListener("click", () => {

    const className =
      button.dataset.class || "";

    trackEvent("class_selected", {
      class_name: className,
      ...getTrafficParams()
    });


    openInquiryModal(
      "class_selection",
      {
        className
      }
    );

  });

});


/* ================= WHATSAPP BUTTONS ================= */

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


const whatsappButtons =
  document.querySelectorAll(
    "[data-whatsapp-click]"
  );


whatsappButtons.forEach((button) => {

  button.addEventListener("click", () => {

    const source =
      button.dataset.whatsappClick ||
      "unknown";

    const message =
      whatsappMessages[source] ||
      whatsappMessages.floating;


    trackEvent("whatsapp_click", {
      button_location: source,
      ...getTrafficParams()
    });


    window.open(
      getWhatsAppUrl(message),
      "_blank",
      "noopener,noreferrer"
    );

  });

});


/* ================= FORM SUBMISSION ================= */

if (inquiryForm) {

  inquiryForm.addEventListener(
    "submit",
    (event) => {

      event.preventDefault();


      const formData =
        new FormData(inquiryForm);


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


      const isFreeDemo =
        currentEnquirySource ===
        "free_demo";


      /*
        Privacy-safe analytics.

        We DO NOT send:
        - Name
        - Phone number
        - Location value
        - Free-text requirement
        - WhatsApp number

        Only boolean/categorical information is
        sent to GA4.
      */

      trackEvent("inquiry_submitted", {

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

      });


      /* Build WhatsApp message */

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


      inquiryForm.reset();

      closeInquiryModal();

    }
  );

}


/* ================= FAQ TRACKING ================= */

const faqItems =
  document.querySelectorAll(
    "details"
  );


faqItems.forEach((faq, index) => {

  faq.addEventListener(
    "toggle",
    () => {

      if (faq.open) {

        trackEvent(
          "faq_opened",
          {
            faq_number: index + 1,
            ...getTrafficParams()
          }
        );

      }

    }
  );

});


/* ================= SCROLL DEPTH ================= */

const scrollMilestones =
  [25, 50, 75, 90];

const scrollTracked =
  new Set();


window.addEventListener(
  "scroll",
  () => {

    const scrollTop =
      window.scrollY;

    const documentHeight =
      document.documentElement
        .scrollHeight -
      window.innerHeight;


    if (documentHeight <= 0) {
      return;
    }


    const scrollPercentage =
      Math.round(
        (scrollTop /
          documentHeight) *
        100
      );


    scrollMilestones.forEach(
      (milestone) => {

        if (
          scrollPercentage >= milestone &&
          !scrollTracked.has(milestone)
        ) {

          scrollTracked.add(milestone);


          trackEvent(
            "scroll_depth",
            {
              depth_percent:
                milestone,

              ...getTrafficParams()
            }
          );

        }

      }
    );

  },
  {
    passive: true
  }
);


/* ================= URL CLASS PREFILL ================= */

const classFromUrl =
  urlParams.get("class");


if (classFromUrl) {

  const classSelect =
    document.getElementById(
      "className"
    );


  if (classSelect) {

    const matchingOption =
      Array.from(
        classSelect.options
      ).find(
        (option) =>
          option.value.toLowerCase() ===
          classFromUrl.toLowerCase()
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
