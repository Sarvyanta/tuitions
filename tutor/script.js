/* =========================================================
   SARVYANTA TUITION - TUTOR WHATSAPP FORM
   ========================================================= */

const tutorForm = document.getElementById("tutorForm");

const whatsappNumber = "917386406514";


/* =========================================================
   HELPER
   ========================================================= */

function getValue(id) {
  const element = document.getElementById(id);

  if (!element) {
    return "";
  }

  return element.value.trim();
}


function getCheckedValues(name) {
  const checked = document.querySelectorAll(
    `input[name="${name}"]:checked`
  );

  return Array.from(checked)
    .map((item) => item.value)
    .join(", ");
}


/* =========================================================
   WHATSAPP MESSAGE
   ========================================================= */

function buildTutorMessage() {

  const area = getValue("area");
  const subjects = getValue("subjects");
  const classes = getValue("classes");
  const experience = getValue("experience");
  const availability = getValue("availability");
  const languages = getValue("languages");
  const introduction = getValue("introduction");

  const modes = getCheckedValues("mode");
  const studentTypes = getCheckedValues("studentType");

  const details = [];

  if (area) {
    details.push(`Area / Location: ${area}`);
  }

  if (subjects) {
    details.push(`Subjects: ${subjects}`);
  }

  if (classes) {
    details.push(`Classes / Grades: ${classes}`);
  }

  if (experience) {
    details.push(`Teaching Experience: ${experience}`);
  }

  if (availability) {
    details.push(`Availability: ${availability}`);
  }

  if (modes) {
    details.push(`Teaching Mode: ${modes}`);
  }

  if (languages) {
    details.push(`Languages: ${languages}`);
  }

  if (studentTypes) {
    details.push(`Preferred Student Type: ${studentTypes}`);
  }

  if (introduction) {
    details.push(`Introduction / Additional Message: ${introduction}`);
  }


  /*
   * If the tutor hasn't filled anything,
   * send a normal WhatsApp message instead.
   */

  if (details.length === 0) {

    return (
      "Hello, I am interested in joining Sarvyanta " +
      "as a tutor. I would like to know more about " +
      "the tutor opportunities."
    );

  }


  return (
    "Hello Sarvyanta,\n\n" +
    "I am interested in joining the Sarvyanta tutor network.\n\n" +
    details.join("\n") +
    "\n\nThank you."
  );
}


/* =========================================================
   FORM SUBMISSION
   ========================================================= */

if (tutorForm) {

  tutorForm.addEventListener("submit", function (event) {

    event.preventDefault();


    const message = buildTutorMessage();

    const whatsappUrl =
      `https://wa.me/${whatsappNumber}?text=` +
      encodeURIComponent(message);


    /*
     * GA4 event
     */

    if (typeof gtag === "function") {

      gtag(
        "event",
        "tutor_whatsapp_enquiry",
        {
          event_category: "tutor",
          event_label: "Tutor registration WhatsApp",
          transport_type: "beacon"
        }
      );

    }


    /*
     * Open WhatsApp
     */

    window.open(
      whatsappUrl,
      "_blank",
      "noopener"
    );

  });

}
