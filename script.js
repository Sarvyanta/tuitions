const WHATSAPP_NUMBER = "917386406514";

const offerings = [
  {classes:["1","2","3","4","5"],boards:["CBSE","ICSE","State Board"],subjects:["Mathematics","Science","English","Hindi","Malayalam","Telugu","All Subjects"],locations:["Kerala","Other States"],title:"Primary Classes 1–5",desc:"Foundation learning, schoolwork, homework support and subject-specific help for primary students."},
  {classes:["6","7","8"],boards:["CBSE","ICSE","State Board"],subjects:["Mathematics","Science","English","Social Science","Hindi","Malayalam","Telugu","Computer Science","All Subjects"],locations:["Kerala","Other States"],title:"Middle School Classes 6–8",desc:"Concept building, regular practice, doubt support and stronger understanding across school subjects."},
  {classes:["9","10"],boards:["CBSE","ICSE","State Board"],subjects:["Mathematics","Science","English","Social Science","Hindi","Malayalam","Telugu","Computer Science","All Subjects"],locations:["Kerala","Other States"],title:"Secondary Classes 9–10",desc:"Subject preparation, revision, practice and academic support for Classes 9 and 10."},
  {classes:["1","2","3","4","5","6","7","8","9","10"],boards:["CBSE"],subjects:["Mathematics"],locations:["Kerala","Other States"],title:"CBSE Mathematics",desc:"Online Mathematics support for CBSE students from Class 1 to Class 10."},
  {classes:["1","2","3","4","5","6","7","8","9","10"],boards:["CBSE"],subjects:["Science"],locations:["Kerala","Other States"],title:"CBSE Science",desc:"Online Science support with concepts, schoolwork, revision and doubt clarification."},
  {classes:["1","2","3","4","5","6","7","8","9","10"],boards:["ICSE"],subjects:["Mathematics","Science","English"],locations:["Kerala","Other States"],title:"ICSE Subject Support",desc:"Enquire for Mathematics, Science and English support aligned with ICSE school requirements."},
  {classes:["1","2","3","4","5","6","7","8","9","10"],boards:["State Board"],subjects:["Mathematics","Science","English","Social Science","Malayalam","Telugu"],locations:["Kerala","Other States"],title:"State Board Support",desc:"Enquire for State Board subjects and tell us the student's state and school syllabus."},
  {classes:["1","2","3","4","5","6","7","8","9","10"],boards:["CBSE","ICSE","State Board"],subjects:["All Subjects"],locations:["Kerala","Other States"],title:"All-Subject Academic Support",desc:"A broader tuition requirement across multiple school subjects. Discuss the exact need with us."}
];

function matches(item, value, field){
  return value === "all" || item[field].includes(value);
}

function renderOfferings(){
  const cls = document.getElementById("classFilter").value;
  const board = document.getElementById("boardFilter").value;
  const subject = document.getElementById("subjectFilter").value;
  const location = document.getElementById("locationFilter").value;
  const grid = document.getElementById("courseGrid");

  const filtered = offerings.filter(item =>
    matches(item, cls, "classes") &&
    matches(item, board, "boards") &&
    matches(item, subject, "subjects") &&
    matches(item, location, "locations")
  );

  document.getElementById("resultCount").textContent =
    `${filtered.length} tuition option${filtered.length === 1 ? "" : "s"} to explore`;

  if(!filtered.length){
    grid.innerHTML = `<div class="course-card"><h3>No exact option shown</h3><p>That's okay. Tell us the student's class, board and subject through WhatsApp and we can discuss the requirement.</p><a class="card-btn" href="#enquiry">Make an Inquiry</a></div>`;
    return;
  }

  grid.innerHTML = filtered.map(item => `
    <article class="course-card">
      <div class="course-tags">
        ${item.boards.map(x => `<span class="tag">${x}</span>`).join("")}
        ${item.locations.map(x => `<span class="tag">${x} teacher options</span>`).join("")}
      </div>
      <h3>${item.title}</h3>
      <p>${item.desc}</p>
      <a class="card-btn" href="#enquiry" data-selection="${item.title}">Inquiry</a>
    </article>
  `).join("");

  document.querySelectorAll("[data-selection]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.getElementById("enquirySubject").value = btn.dataset.selection;
    });
  });
}

["classFilter","boardFilter","subjectFilter","locationFilter"].forEach(id => {
  document.getElementById(id).addEventListener("change", renderOfferings);
});

document.getElementById("enquiryForm").addEventListener("submit", function(e){
  e.preventDefault();

  const parent = document.getElementById("parentName").value.trim();
  const studentClass = document.getElementById("enquiryClass").value;
  const board = document.getElementById("enquiryBoard").value;
  const subject = document.getElementById("enquirySubject").value.trim();
  const language = document.getElementById("enquiryLanguage").value.trim();
  const message = document.getElementById("enquiryMessage").value.trim();

  const text =
`Hello, I would like to enquire about online tuition.

Parent/Guardian: ${parent}
Student Class: ${studentClass}
Board: ${board}
Subject/Requirement: ${subject}
Area / preferred language / teacher location: ${language || "Not specified"}
Additional details: ${message || "Not specified"}

Please let me know about suitable teacher options and next steps.`;

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank");
});

renderOfferings();
