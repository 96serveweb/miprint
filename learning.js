const SUPABASE_URL = "https://gwkcpbncazaeuiqdxqyn.supabase.co";

const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3a2NwYm5jYXphZXVpcWR4cXluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2ODgyMzAsImV4cCI6MjEwMzI2NDIzMH0.bA0AwTwXn9TAK3szVxwiC9QQyRde3Dyt0DrSXABFQ1w";

const LEARNING_APPLICATION_URL =
  `${SUPABASE_URL}/functions/v1/submit-learning-application`;

  const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

const STORE_KEY="miPrintLearningV1";
const starterCourse={
 id:"course-windows-basics-1",title:"Windows Basics Starter",subtitle:"Computer Literacy • Section 1",
 description:"An introductory computer literacy lesson covering the Windows desktop, Start menu, taskbar, files, folders and basic window navigation.",
 section:1,published:true,
 summary:`Windows is an operating system that lets you interact with a computer using windows, icons, menus and a pointer.

The Desktop is the main screen after signing in. The Taskbar usually appears at the bottom and shows the Start button, open apps and system icons.

The Start menu opens applications, searches for files and gives access to settings or power options. A window can be minimized, maximized/restored or closed.

Files store information such as documents, pictures and PDFs. Folders help organise files. File Explorer lets you browse drives, folders and files.

The Recycle Bin temporarily stores deleted files so they can sometimes be restored before permanent deletion.`,
 questions:[
  {id:"q1",text:"Which items are normally found on the Windows taskbar?",answers:[{text:"Start button",correct:true},{text:"Open application icons",correct:true},{text:"System clock",correct:true},{text:"Printed paper tray",correct:false}]},
  {id:"q2",text:"Which actions can you normally perform using controls in the top-right corner of a window?",answers:[{text:"Minimize the window",correct:true},{text:"Maximize or restore the window",correct:true},{text:"Close the window",correct:true},{text:"Format the hard drive",correct:false}]},
  {id:"q3",text:"Which statements about files and folders are correct?",answers:[{text:"Files can store documents, images or PDFs",correct:true},{text:"Folders help organise files",correct:true},{text:"File Explorer can browse files",correct:true},{text:"A folder is a printer cartridge",correct:false}]},
  {id:"q4",text:"What can the Windows Start menu be used for?",answers:[{text:"Opening applications",correct:true},{text:"Searching for files",correct:true},{text:"Accessing settings",correct:true},{text:"Physically repairing a monitor",correct:false}]},
  {id:"q5",text:"Which statements about the Recycle Bin are correct?",answers:[{text:"It can temporarily hold deleted files",correct:true},{text:"Some deleted files can be restored",correct:true},{text:"It is used to browse the internet",correct:false},{text:"It can be emptied to permanently remove contents",correct:true}]}
 ]
};
function initialState(){return{admin:{email:"admin@miprint.local",password:"Admin2026!"},course:starterCourse,applications:[],students:[],courseClosed:false,lastAnnualCleanupYear:null,certificateSequence:{}}}
function annualCleanup(){
 const now=new Date(); const year=now.getFullYear();
 const last=state?.lastAnnualCleanupYear;

 if(now.getMonth()===0 && now.getDate()===1 && last!==year){
   state.applications=[];
   state.lastAnnualCleanupYear=year;
   saveState();
 }
}
function loadState(){try{return JSON.parse(localStorage.getItem(STORE_KEY))||initialState()}catch{return initialState()}}
let state=loadState(),session=null,adminQuestionDraft=[]; annualCleanup();
const $=id=>document.getElementById(id), $$=s=>[...document.querySelectorAll(s)];
function saveState(){localStorage.setItem(STORE_KEY,JSON.stringify(state))}
function esc(v=""){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function openModal(id){$(id).classList.add("open")} function closeModal(id){$(id).classList.remove("open")}
$$("[data-close]").forEach(b=>b.onclick=()=>closeModal(b.dataset.close));
["loginOpenBtn","heroLoginBtn"].forEach(id=>$(id).onclick=()=>openModal("loginModal"));
async function openRegistrationModal() {

  const courseSelect =
    $("regCourse");

  courseSelect.innerHTML = `
    <option value="">
      Loading courses...
    </option>
  `;

  openModal("registerModal");

  try {

    const {
  data,
  error
  } = await supabaseClient.rpc(
    "get_public_learning_courses"
  );

    if (error) {
      throw error;
    }

    courseSelect.innerHTML = `
      <option value="">
        Select a course
      </option>

      ${(data || [])
        .map(course => `
          <option value="${course.id}">
            ${esc(course.title)}
          </option>
        `)
        .join("")}
    `;

  } catch (error) {

    console.error(
      "Unable to load registration courses:",
      error
    );

    courseSelect.innerHTML = `
      <option value="">
        Unable to load courses
      </option>
    `;
  }
}

["registerOpenBtn","heroRegisterBtn"]
  .forEach(
    id =>
      $(id).onclick =
        openRegistrationModal
  );

$("regNationality").onchange=()=>{const sa=$("regNationality").value==="South African";$("identityLabel").textContent=sa?"South African identity number":"Passport number";$("documentLabel").textContent=sa?"Certified ID document":"Valid passport copy"};

$("registerSubmitBtn").onclick = async () => {
  const btn = $("registerSubmitBtn");
  const msg = $("registerMessage");

  const file = $("regDocument").files[0];

  const fullName = $("regFullName").value.trim();
  const legalName =
  fullName.replace(/\s+/g, " ").trim();

const nameParts =
  legalName.split(" ");

if (nameParts.length < 2) {
  msg.className =
    "form-message error";

  msg.textContent =
    "Enter your surname first, followed by all your names exactly as they appear on your ID or passport.";

  return;
}
  const email = $("regEmail").value.trim().toLowerCase();
  const phone = $("regPhone").value.trim();
  const nationality = $("regNationality").value;
  const birthYear = $("regBirthYear").value.trim();
  const identity = $("regIdentity").value.trim();
  const address = $("regAddress").value.trim();
  const education = $("regEducation").value;
  const currentStatus = $("regStatus").value;
  const courseId = $("regCourse").value;
  const consent = $("regConsent").checked;

  msg.className = "form-message";
  msg.textContent = "";

if (
  !fullName ||
  !email ||
  !phone ||
  !nationality ||
  !birthYear ||
  !identity ||
  !address ||
  !courseId ||
  !file ||
  !consent
) {
    msg.className = "form-message error";
    msg.textContent =
      "Please complete all required fields and attach the required certified ID/passport.";

    return;
  }

  if (
    file.type !== "application/pdf" ||
    !file.name.toLowerCase().endsWith(".pdf")
  ) {
    msg.className = "form-message error";
    msg.textContent =
      "ID/passport copy must be a PDF file only.";

    return;
  }

  if (file.size > 25 * 1024 * 1024) {
    msg.className = "form-message error";
    msg.textContent =
      "The PDF is larger than 25 MB. Please choose a smaller file.";

    return;
  }

  const formData = new FormData();

  formData.append(
  "full_name",
  legalName
);
  formData.append("email", email);
  formData.append("phone", phone);
  formData.append("nationality", nationality);
  formData.append("birth_year", birthYear);
  formData.append("identity_or_passport", identity);
  formData.append("residential_address", address);
  formData.append("education_level", education);
  formData.append("current_status", currentStatus);
  formData.append(
  "course_id",
  courseId
);
  formData.append("document", file);

  const originalButtonText = btn.innerHTML;

  btn.disabled = true;
  btn.innerHTML =
    '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';

  msg.className = "form-message";
  msg.textContent =
    "Uploading your application. Please wait...";

  try {
    const response = await fetch(
      LEARNING_APPLICATION_URL,
      {
        method: "POST",

        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`
        },

        body: formData
      }
    );

    let result;

    try {
      result = await response.json();
    } catch {
      result = {};
    }

    if (!response.ok) {
      throw new Error(
        result.error ||
        "Application could not be submitted."
      );
    }

    msg.className = "form-message success";
    msg.textContent = "Application submitted successfully.";
    ["regFullName","regEmail","regPhone","regBirthYear","regIdentity","regAddress","regDocument"].forEach(id => $(id).value = "");
    $("regCourse").value = "";
    $("regConsent").checked = false;
    closeModal("registerModal");
    openModal("registrationSuccessModal");

  } catch (error) {
    console.error(
      "Learning application submission failed:",
      error
    );

    msg.className = "form-message error";
    msg.textContent =
      error instanceof Error
        ? error.message
        : "Something went wrong. Please try again.";

  } finally {
    btn.disabled = false;
    btn.innerHTML = originalButtonText;
  }
};

$("loginSubmitBtn").onclick = async () => {
  const email = $("loginEmail").value
    .trim()
    .toLowerCase();

  const password = $("loginPassword").value.trim();
  const msg = $("loginMessage");
  const btn = $("loginSubmitBtn");

  msg.className = "form-message";
  msg.textContent = "";

  if (!email || !password) {
    msg.className = "form-message error";
    msg.textContent =
      "Please enter your email address and password.";
    return;
  }

  const originalText = btn.innerHTML;

  btn.disabled = true;
  btn.innerHTML =
    '<i class="fa-solid fa-spinner fa-spin"></i> Signing in...';

  try {
    const {
      data,
      error
    } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw error;
    }

    if (!data.user) {
      throw new Error("Login failed.");
    }

    const {
      data: isAdmin,
      error: adminCheckError
    } = await supabaseClient.rpc(
      "is_learning_admin"
    );

    if (adminCheckError) {
      console.error(adminCheckError);

      await supabaseClient.auth.signOut();

      throw new Error(
        "Unable to verify administrator access."
      );
    }

    if (isAdmin === true) {
      session = {
        role: "admin",
        authUserId: data.user.id
      };

      closeModal("loginModal");

      await showAdmin();

      return;
    }

    // Some approved student rows were created before their Auth user ID was linked.
    // Link only an existing active student with a matching verified email.
    const { error: linkError } = await supabaseClient.rpc('link_my_existing_learning_student');
    if (linkError) console.warn('Student account link could not be verified:', linkError.message);
    const student = await loadCurrentStudent(data.user.id);

if (!student) {
  await supabaseClient.auth.signOut();

  throw new Error(
    "No approved student profile is linked to this login email. Ask the administrator to check the student's email and approval status."
  );
}

if (!student.active) {
  await supabaseClient.auth.signOut();

  throw new Error(
    "Your student account has been deactivated."
  );
}

session = {
  role: "student",
  studentId: student.id,
  authUserId: data.user.id
};

closeModal("loginModal");

showStudent();

return;

  } catch (error) {
    console.error("Login error:", error);

    msg.className = "form-message error";

    msg.textContent =
      error?.message ||
      "Login details not recognised.";

  } finally {
    btn.disabled = false;
    btn.innerHTML = originalText;
  }
};

async function loadAdminApplications() {
  const {
  data,
  error
} = await supabaseClient.rpc(
  "get_admin_learning_applications"
);

  if (error) {
    console.error(
      "Unable to load applications:",
      error
    );

    throw new Error(
      "Unable to load student applications."
    );
  }

  state.applications = (data || []).map(app => ({
    id: app.application_id,

    fullName: app.full_name,
    email: app.email,
    phone: app.phone,
    nationality: app.nationality,
    birthYear: app.birth_year,
    identity: app.identity_or_passport,
    address: app.residential_address,
    education: app.education_level,
    currentStatus: app.current_status,

    documentPath: app.document_path,

    documentName:
      app.document_path
        ? "Certified document"
        : "No document",

    status: app.application_status,

    rejectionReason: app.rejection_reason,
    courseId: app.course_id,
    courseTitle: app.course_title || "",
    appliedAt: app.created_at
  }));
}

async function loadAdminStudents() {
  const {
    data,
    error
  } = await supabaseClient
    .from("learning_students")
    .select(`
      id,
      application_id,
      auth_user_id,
      full_name,
      email,
      birth_year,
      phone,
      nationality,
      identity_or_passport,
      residential_address,
      education_level,
      current_status,
      active,
      created_at
    `)
    .order("created_at", {
      ascending: false
    });

  if (error) {
    console.error(
      "Unable to load students:",
      error
    );

    throw new Error(
      "Unable to load approved students."
    );
  }

  state.students = (data || []).map(student => ({
    id: student.id,
    applicationId: student.application_id,
    authUserId: student.auth_user_id,
    fullName: student.full_name,
    email: student.email,
    birthYear: student.birth_year,
    phone: student.phone,
    nationality: student.nationality,
    identity: student.identity_or_passport,
    address: student.residential_address,
    education: student.education_level,
    currentStatus: student.current_status,
    active: student.active,

    progress: {},
    certificates: []
  }));
}

async function loadAdminCertificates() {
  const {
    data,
    error
  } = await supabaseClient.rpc(
    "get_admin_learning_certificates"
  );

  if (error) {
    console.error(
      "Unable to load admin certificates:",
      error
    );

    throw new Error(
      "Unable to load certificates."
    );
  }

  state.students.forEach(student => {
    student.certificates = [];
  });

  for (const certificate of data || []) {
    const student =
      state.students.find(
        item =>
          item.id === certificate.student_id
      );

    if (!student) {
      continue;
    }

    student.certificates.push({
      id: certificate.id,

      courseId:
        certificate.course_id,

      courseTitle:
        certificate.course_title,

      certificateCode:
        certificate.certificate_number,

      score:
        certificate.score,

      awardedAt:
        certificate.awarded_at
    });
  }
}

async function loadAdminCourseApplications() {
  const {
    data,
    error
  } = await supabaseClient.rpc(
    "get_admin_learning_course_applications"
  );

  if (error) {
    console.error(
      "Unable to load course applications:",
      error
    );

    throw new Error(
      "Unable to load course applications."
    );
  }

  state.courseApplications =
    (data || []).map(
      application => ({
        id:
          application.application_id,

        studentId:
          application.student_id,

        studentName:
          application.student_name,

        studentEmail:
          application.student_email,

        courseId:
          application.course_id,

        courseTitle:
          application.course_title,

        status:
          application.application_status,

        rejectionReason:
          application.rejection_reason || "",

        appliedAt:
          application.applied_at,

        reviewedAt:
          application.reviewed_at
      })
    );

  return state.courseApplications;
}

async function loadCurrentStudent(authUserId) {
  const {
    data,
    error
  } = await supabaseClient
    .from("learning_students")
    .select(`
      id,
      application_id,
      auth_user_id,
      full_name,
      email,
      birth_year,
      phone,
      nationality,
      identity_or_passport,
      residential_address,
      education_level,
      current_status,
      active,
      created_at
    `)
    .eq("auth_user_id", authUserId)
    .maybeSingle();

  if (error) {
    console.error(
      "Unable to load student:",
      error
    );

    throw new Error(
      "Unable to load student account."
    );
  }

  if (!data) {
    return null;
  }

  const student = {
    id: data.id,
    applicationId: data.application_id,
    authUserId: data.auth_user_id,
    fullName: data.full_name,
    email: data.email,
    birthYear: data.birth_year,
    phone: data.phone,
    nationality: data.nationality,
    identity: data.identity_or_passport,
    address: data.residential_address,
    education: data.education_level,
    currentStatus: data.current_status,
    active: data.active,

    progress: {},
    certificates: []
  };

  state.students = [student];

  return student;
}
let passwordSetupAllowed = false;

$("setPasswordBtn").onclick = async () => {
  if (!passwordSetupAllowed) {

  alert(
    "Password setup session is not valid."
  );

  closeModal(
    "setPasswordModal"
  );

  return;
}
  const password =
    $("newStudentPassword").value;

  const confirmPassword =
    $("confirmStudentPassword").value;

  const msg =
    $("setPasswordMessage");

  const btn =
    $("setPasswordBtn");

  msg.className =
    "form-message";

  msg.textContent = "";

  if (
    !password ||
    !confirmPassword
  ) {
    msg.className =
      "form-message error";

    msg.textContent =
      "Please enter and confirm your password.";

    return;
  }

  if (password.length < 8) {
    msg.className =
      "form-message error";

    msg.textContent =
      "Password must be at least 8 characters.";

    return;
  }

  if (password !== confirmPassword) {
    msg.className =
      "form-message error";

    msg.textContent =
      "The passwords do not match.";

    return;
  }

  const originalText =
    btn.innerHTML;

  btn.disabled = true;

  btn.innerHTML =
    '<i class="fa-solid fa-spinner fa-spin"></i> Creating password...';

  try {
    const { data: currentAuth, error: sessionError } =
      await supabaseClient.auth.getSession();
    if (sessionError || !currentAuth?.session?.user) {
      throw new Error("Your password link has expired. Request a new password setup link from Student Login.");
    }
    const { data, error } = await supabaseClient.auth.updateUser({ password });

    if (error) {
      throw error;
    }

    if (!data.user) {
      throw new Error(
        "Password could not be created."
      );
    }

    msg.className =
      "form-message success";

    msg.textContent =
      "Password created successfully.";

    $("newStudentPassword").value = "";
    $("confirmStudentPassword").value = "";

setTimeout(async () => {
  closeModal(
    "setPasswordModal"
  );

  passwordSetupAllowed = false;

  await supabaseClient.auth.signOut();

      openModal("loginModal");

      $("loginMessage").className =
        "form-message success";

      $("loginMessage").textContent =
        "Your password is ready. Log in with your student email and new password.";

    }, 1200);

  } catch (error) {
    console.error(
      "Password creation failed:",
      error
    );

    msg.className =
      "form-message error";

    msg.textContent =
      error?.message ||
      "Unable to create your password.";

  } finally {
    btn.disabled = false;
    btn.innerHTML =
      originalText;
  }
};

// A recovery link must establish a Supabase session before updateUser().
// Keep the auth callback synchronous to avoid deadlocking Supabase auth operations.
supabaseClient.auth.onAuthStateChange((event, authSession) => {
  if (event === "PASSWORD_RECOVERY" && authSession?.user) {
    passwordSetupAllowed = true;
    showPublic();
    openModal("setPasswordModal");
  }
});

async function processPasswordRecoveryLink() {
  const url = new URL(window.location.href);
  const hash = new URLSearchParams(url.hash.replace(/^#/, ""));
  const type = url.searchParams.get("type") || hash.get("type");
  const tokenHash = url.searchParams.get("token_hash");
  const code = url.searchParams.get("code");
  const isRecovery = type === "recovery" ||
    (code && sessionStorage.getItem("learningPasswordRecoveryPending") === "1");

  if (tokenHash && type === "recovery") {
    const { error } = await supabaseClient.auth.verifyOtp({ token_hash: tokenHash, type: "recovery" });
    if (error) throw error;
  } else if (code && isRecovery) {
    // Supabase may have already exchanged this one-time code automatically.
    const { data: existing } = await supabaseClient.auth.getSession();
    if (!existing?.session) {
      const { error } = await supabaseClient.auth.exchangeCodeForSession(code);
      if (error) throw error;
    }
  }

  if (isRecovery) {
    const { data: { session: recoverySession }, error } = await supabaseClient.auth.getSession();
    if (error || !recoverySession?.user) {
      throw error || new Error("Password setup link has expired or is invalid. Request a new link.");
    }
    passwordSetupAllowed = true;
    sessionStorage.removeItem("learningPasswordRecoveryPending");
    window.history.replaceState({}, document.title, url.pathname);
    showPublic();
    openModal("setPasswordModal");
    return true;
  }
  return false;
}

$("forgotPasswordBtn").onclick = async () => {
  const email = $("loginEmail").value.trim();
  const msg = $("loginMessage");
  const btn = $("forgotPasswordBtn");

  msg.className = "form-message";
  msg.textContent = "";

  if (!email) {
    msg.className = "form-message error";
    msg.textContent =
      "Enter your student email address first.";
    return;
  }

  const originalText = btn.innerHTML;

  btn.disabled = true;
  btn.innerHTML =
    '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

  try {
    sessionStorage.setItem("learningPasswordRecoveryPending", "1");
    const { error } =
      await supabaseClient.auth.resetPasswordForEmail(
        email,
        {
          redirectTo:
            "https://miprints.co.za/learning.html?type=recovery"
        }
      );

    if (error) {
      throw error;
    }

    msg.className = "form-message success";
    msg.textContent =
      "Check your email for the password setup link.";

  } catch (error) {
    console.error(error);

    msg.className = "form-message error";
    msg.textContent =
      error?.message ||
      "Unable to send password setup email.";

  } finally {
    btn.disabled = false;
    btn.innerHTML = originalText;
  }
};

function hidePublic(){document.querySelector(".topbar").classList.add("hidden");$("publicLanding").classList.add("hidden")}
function showPublic(){document.querySelector(".topbar").classList.remove("hidden");$("publicLanding").classList.remove("hidden");$("studentApp").classList.add("hidden");$("adminApp").classList.add("hidden");session=null}
$("studentLogoutBtn").onclick = async () => {

  await supabaseClient.auth.signOut();

  session = null;

  showPublic();
};

$("adminLogoutBtn").onclick = async () => {
  await supabaseClient.auth.signOut();
  showPublic();
};
function currentStudent(){return state.students.find(s=>s.id===session?.studentId)}
async function applyForCourse(courseId) {
  try {
    const {
      data,
      error
    } = await supabaseClient.rpc(
      "apply_learning_course",
      {
        p_course_id: courseId
      }
    );

    if (error) {
      throw error;
    }

    alert(
      "Your course application has been submitted for approval."
    );

    await loadStudentCourseApplications();

    renderAvailableCourses();

    return data;

  } catch (error) {
    console.error(
      "Course application failed:",
      error
    );

    alert(
      error?.message ||
      "Unable to apply for this course."
    );

    return null;
  }
}

window.applyForCourse =
  applyForCourse;

async function loadAvailableCourses() {
  const {
    data,
    error
  } = await supabaseClient
    .from("learning_courses")
    .select(`
      id,
      title,
      subtitle,
      description,
      section_number,
      summary,
      published,
      closed,
      assessment_open,
      created_at
    `)
    .eq("published", true)
    .eq("closed", false)
    .order("created_at", {
      ascending: false
    });

  if (error) {
    console.error(
      "Unable to load available courses:",
      error
    );

    throw new Error(
      "Unable to load available courses."
    );
  }

  state.availableCourses =
    data || [];

  return state.availableCourses;
}

async function loadStudentEnrollments() {

  const {
    data,
    error
  } = await supabaseClient.rpc(
    "get_my_learning_courses"
  );

  if (error) {

    console.error(
      "Unable to load student courses:",
      error
    );

    throw new Error(
      "Unable to load your enrolled courses."
    );
  }


  state.enrollments =
    (data || []).map(
      item => ({

        id:
          item.enrollment_id,

        course_id:
          item.course_id,

        status:
          item.enrollment_status,

        enrolled_at:
          item.enrolled_at,

        completed_at:
          item.completed_at

      })
    );


  state.myCourses =
    (data || []).map(
      item => ({

        id:
          item.course_id,

        title:
          item.title,

        subtitle:
          item.subtitle || "",

        description:
          item.description || "",

        section:
          item.section_number || 1,

        summary:
          item.summary || "",

        published:
          item.published === true,

        closed:
          item.closed === true,

        assessmentOpen:
          item.assessment_open === true,

        enrollmentStatus:
          item.enrollment_status,

        enrolledAt:
          item.enrolled_at,

        completedAt:
          item.completed_at

      })
    );


  return state.enrollments;
}

async function loadStudentCourseApplications() {
  const {
    data,
    error
  } = await supabaseClient.rpc(
    "get_my_learning_course_applications"
  );

  if (error) {
    console.error(
      "Unable to load course applications:",
      error
    );

    throw new Error(
      "Unable to load your course applications."
    );
  }

  state.courseApplications =
    (data || []).map(
      application => ({
        id:
          application.application_id,

        courseId:
          application.course_id,

        status:
          application.application_status,

        rejectionReason:
          application.rejection_reason || "",

        appliedAt:
          application.applied_at,

        reviewedAt:
          application.reviewed_at
      })
    );

  return state.courseApplications;
}

function renderAvailableCourses() {
  const container =
    $("availableCoursesList");

  if (!container) {
    return;
  }

  const courses =
    state.availableCourses || [];

  const enrollments =
    state.enrollments || [];

    const applications =
  state.courseApplications || [];

  if (!courses.length) {
    container.innerHTML = `
      <div class="locked-card">
        <i class="fa-solid fa-book"></i>

        <h3>No courses available</h3>

        <p>
          There are currently no published courses
          available for enrolment.
        </p>
      </div>
    `;

    return;
  }

  container.innerHTML =
    courses.map(course => {

      const enrollment =
  enrollments.find(
    item =>
      item.course_id === course.id &&
      (
        item.status === "enrolled" ||
        item.status === "completed"
      )
  );

  const application =
  applications.find(
    item =>
      item.courseId === course.id
  );

      return `
        <article class="course-card">

          <h3>
            ${esc(course.title)}
          </h3>

          <p>
            ${esc(
              course.description || ""
            )}
          </p>

          ${
  enrollment
    ? `
      <button
        class="ghost-btn"
        type="button"
        disabled
      >
        <i class="fa-solid fa-check"></i>
        ${
          enrollment.status === "completed"
            ? "Completed"
            : "Enrolled"
        }
      </button>
    `

    : application?.status === "pending"
      ? `
        <button
          class="ghost-btn"
          type="button"
          disabled
        >
          <i class="fa-solid fa-clock"></i>
          Pending Approval
        </button>
      `

    : application?.status === "approved"
      ? `
        <button
          class="ghost-btn"
          type="button"
          disabled
        >
          <i class="fa-solid fa-check"></i>
          Approved
        </button>
      `

    : application?.status === "rejected"
      ? `
        <button
          class="danger-btn"
          type="button"
          disabled
        >
          <i class="fa-solid fa-xmark"></i>
          Application Rejected
        </button>

        ${
          application.rejectionReason
            ? `
              <p class="form-message error">
                ${esc(application.rejectionReason)}
              </p>
            `
            : ""
        }
      `

    : `
      <button
        class="primary-btn"
        type="button"
        onclick="applyForCourse('${course.id}')"
      >
        <i class="fa-solid fa-paper-plane"></i>
        Apply for Course
      </button>
    `
}

        </article>
      `;
    }).join("");
}

function renderMyCourses() {
  const container =
    $("myCoursesList");

  if (!container) {
    return;
  }

  const courses =
  state.myCourses || [];

  const enrollments =
    state.enrollments || [];

const enrolledCourses =
  courses;

  if (!enrolledCourses.length) {
    container.innerHTML = `
      <div class="locked-card">
        <i class="fa-solid fa-book-open"></i>

        <h3>No enrolled courses</h3>

        <p>
          Enrol in an available course and it
          will appear here.
        </p>
      </div>
    `;

    return;
  }

  container.innerHTML =
    enrolledCourses.map(course => `
      <article class="course-card">

        <h3>
          ${esc(course.title)}
        </h3>

        <p>
          ${esc(course.description || "")}
        </p>

        <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">

<span class="status-chip">
  ${
    enrollments.find(
      enrollment =>
        enrollment.course_id === course.id
    )?.status === "completed"
      ? "Completed"
      : "Enrolled"
  }
</span>

  <button
    class="primary-btn"
    type="button"
    onclick="openEnrolledCourse('${course.id}')"
  >
    Open Course
  </button>

</div>

      </article>
    `).join("");
}

async function openEnrolledCourse(courseId) {
  try {

    const enrollment =
  (state.enrollments || [])
    .find(
      item =>
        item.course_id === courseId &&
        (
          item.status === "enrolled" ||
          item.status === "completed"
        )
    );

    if (!enrollment) {
      alert(
        "You are not enrolled in this course."
      );

      return;
    }

    await loadStudentCourse(
      courseId
    );

    await loadStudentProgress();

    renderStudent();

    showStudentView(
      "studentCourse"
    );

  } catch (error) {

    console.error(
      "Unable to open enrolled course:",
      error
    );

    alert(
      error?.message ||
      "Unable to open this course."
    );
  }
}


window.openEnrolledCourse =
  openEnrolledCourse;

async function loadStudentLessonSections(courseId) {
  const { data, error } = await supabaseClient.rpc(
    "get_my_learning_course_sections", { p_course_id: courseId }
  );
  if (error) {
    console.error("Unable to load lesson sections:", error);
    throw new Error("Unable to load lesson sections. Check that the accompanying SQL update is installed.");
  }
  if (!Array.isArray(data)) throw new Error("Invalid lesson sections response.");
  return data.map(section => ({
    id: section.id,
    number: Number(section.section_number),
    title: section.title || "",
    summary: section.summary || ""
  })).sort((a,b) => a.number - b.number);
}

async function loadStudentCourse(
  courseId = null
) {

  let course = null;
let error = null;

if (courseId) {

  const result =
    await supabaseClient.rpc(
      "get_my_learning_course",
      {
        p_course_id: courseId
      }
    );

  error =
    result.error;

  course =
    result.data?.[0] || null;

}

else {
  // No course can be loaded until the student selects an enrolled course.
  course = null;
  error = null;
}

  if (error) {

    console.error(
      "Unable to load student course:",
      error
    );

    throw new Error(
      "Unable to load the course."
    );
  }

  if (courseId && course && course.id !== courseId) {
    throw new Error("The selected course could not be verified.");
  }
  if (courseId && course && !(state.enrollments || []).some(e =>
      e.course_id === courseId && (e.status === "enrolled" || e.status === "completed"))) {
    throw new Error("You have not been approved for this course.");
  }
  if (!course) {

    state.course = {
      id: null,
      title: "No course available",
      subtitle: "",
      description:
        "There is currently no published course.",
      section: 1,
      summary: "",
      published: false,
      assessmentOpen: false,
      questions: []
    };

    state.courseClosed = true;

    return null;
  }

  let studentQuestions = [];

  const courseEnrollment =
  (state.enrollments || [])
    .find(
      enrollment =>
        enrollment.course_id === course.id
    );

const canWriteAssessment =
  courseEnrollment?.status === "enrolled" &&
  course.published === true && course.closed !== true;


  if (
  course.assessment_open === true &&
  canWriteAssessment
) {

    const {
      data: assessmentRows,
      error: assessmentError
    } = await supabaseClient.rpc(
      "get_learning_assessment_options",
      {
        p_course_id: course.id
      }
    );


    if (assessmentError) {

      console.error(
        "Unable to load assessment options:",
        assessmentError
      );

      throw new Error(
        "Unable to load the assessment."
      );
    }


    const questionMap =
      new Map();


    for (
      const row of assessmentRows || []
    ) {

      if (
        !questionMap.has(
          row.question_id
        )
      ) {

        questionMap.set(
          row.question_id,
          {
            id: row.question_id,

            text:
              row.question_text,

            sortOrder:
              row.question_sort_order || 0,

            answers: []
          }
        );
      }


      questionMap
        .get(row.question_id)
        .answers.push({
          id: row.answer_id,

          text:
            row.answer_text,

          sortOrder:
            row.answer_sort_order || 0
        });
    }


    studentQuestions =
      Array.from(
        questionMap.values()
      )
        .sort(
          (a, b) =>
            a.sortOrder -
            b.sortOrder
        )
        .map(
          question => ({
            id: question.id,

            text:
              question.text,

            answers:
              question.answers
                .sort(
                  (a, b) =>
                    a.sortOrder -
                    b.sortOrder
                )
                .map(
                  answer => ({
                    id: answer.id,
                    text: answer.text
                  })
                )
          })
        );
  }

  state.course = {

    id:
      course.id,

    title:
      course.title,

    subtitle:
      course.subtitle || "",

    description:
      course.description || "",

    section:
      course.section_number || 1,

    summary:
      course.summary || "",

    sections: await loadStudentLessonSections(course.id),

    published:
      course.published === true,

    assessmentOpen:
      course.assessment_open === true,

    questions:
      studentQuestions
  };


  state.courseClosed =
    course.closed === true;


  return state.course;
}

async function loadStudentProgress() {
  const student =
    currentStudent();

  if (!student?.id) {
    throw new Error(
      "Student account could not be loaded."
    );
  }

  const {
    data: attempts,
    error: attemptsError
  } = await supabaseClient
    .from("learning_attempts")
    .select(`
      id,
      course_id,
      attempt_number,
      score,
      result,
      submitted_at
    `)
    .eq("student_id", student.id)
    .order("attempt_number", {
      ascending: true
    });

  if (attemptsError) {
    console.error(
      "Unable to load attempts:",
      attemptsError
    );

    throw attemptsError;
  }

  const {
  data: certificates,
  error: certificatesError
} = await supabaseClient.rpc(
  "get_my_learning_certificates"
);

  if (certificatesError) {
    console.error(
      "Unable to load certificates:",
      certificatesError
    );

    throw certificatesError;
  }

  student.progress = {};

  for (const attempt of attempts || []) {
    if (!student.progress[attempt.course_id]) {
      student.progress[attempt.course_id] = {
        attempts: []
      };
    }

    student.progress[
      attempt.course_id
    ].attempts.push({
      id: attempt.id,
      attemptNumber:
        attempt.attempt_number,
      score: attempt.score,
      result: attempt.result,
      submittedAt:
        attempt.submitted_at
    });
  }

student.certificates =
  (certificates || []).map(
    certificate => ({
      id:
        certificate.id,

      courseId:
        certificate.course_id,

      courseTitle:
        certificate.course_title,

      certificateCode:
        certificate.certificate_number,

      score:
        certificate.score,

      awardedAt:
        certificate.awarded_at
    })
  );
}

async function showStudent() {
  try {
await loadAvailableCourses();
await loadStudentEnrollments();
await loadStudentCourseApplications();

state.course = {
  id: null,
  title: "Choose a course",
  subtitle: "",
  description:
    "Open one of your enrolled courses below.",
  section: 1,
  summary: "",
  published: false,
  assessmentOpen: false,
  questions: []
};

state.courseClosed = true;

await loadStudentProgress();

    hidePublic();

    $("studentApp")
      .classList.remove("hidden");

    $("adminApp")
      .classList.add("hidden");

    renderStudent();
    renderAvailableCourses();
    renderMyCourses();

    showStudentView(
      "studentDashboard"
    );

  } catch (error) {
    console.error(
      "Student course loading failed:",
      error
    );

    alert(
      error?.message ||
      "Unable to load your course."
    );
  }
}

async function loadAdminCourse(courseId = null) {

  let courseQuery = supabaseClient
    .from("learning_courses")
    .select(`
      id,
      title,
      subtitle,
      description,
      section_number,
      summary,
      published,
      closed,
      assessment_open,
      created_at,
      updated_at
    `)
    .order("created_at", { ascending: false })
    .limit(1);
  if (courseId) courseQuery = courseQuery.eq("id", courseId);
  const { data: courseRows, error } = await courseQuery;


  if (error) {
    console.error(
      "Unable to load course:",
      error
    );

    throw new Error(
      "Unable to load the learning course."
    );
  }

  const data =
  courseRows?.[0] || null;

  if (!data) {
    state.course = { id: null, title: "", subtitle: "", description: "", section: 1, summary: "", published: false, assessmentOpen: false, questions: [] };
    state.courseClosed = false;
    adminSections=[];activeSectionId=null;courseSectionDrafts.clear();
    return null;
  }

  const {
    data: questions,
    error: questionsError
  } = await supabaseClient
    .from("learning_questions")
    .select(`
      id,
      question_text,
      sort_order,
      section_id,
      learning_answers (
        id,
        answer_text,
        is_correct,
        sort_order
      )
    `)
    .eq("course_id", data.id)
    .order("sort_order", {
      ascending: true
    });

  if (questionsError) {
    console.error(
      "Unable to load questions:",
      questionsError
    );

    throw new Error(
      "Unable to load course questions."
    );
  }

  state.course = {
    id: data.id,
    title: data.title,
    subtitle: data.subtitle || "",
    description: data.description || "",
    section: data.section_number || 1,
    summary: data.summary || "",
    published: data.published === true,

    assessmentOpen:
  data.assessment_open === true,

    questions: (questions || []).map(
  question => ({
    id: question.id,
    sectionId: question.section_id,

    text:
      question.question_text,

    answers:
      (question.learning_answers || [])
        .sort(
          (a, b) =>
            (a.sort_order || 0) -
            (b.sort_order || 0)
        )
        .map(answer => ({
          id: answer.id,
          text: answer.answer_text,
          correct:
            answer.is_correct === true
        }))
  })
)
  };

  state.courseClosed =
    data.closed === true;

  await refreshAdminSections();
  return state.course;
}

async function showAdmin() {
  hidePublic();

  $("adminApp").classList.remove("hidden");
  $("studentApp").classList.add("hidden");

  try {
await loadAdminApplications();
await loadAdminStudents();
await loadAdminCertificates();
await loadAdminCourseApplications();
await loadAdminCourse(state.adminSelectedCourseId || null);
await loadAdminCourseLibrary();

renderAdmin();
    showAdminView("adminDashboard");

  } catch (error) {
    console.error(error);

    $("applicationsTable").innerHTML = `
      <div class="locked-card">
        <i class="fa-solid fa-triangle-exclamation"></i>
        <h3>Applications could not be loaded</h3>
        <p>${esc(error.message)}</p>
      </div>
    `;
  }
}
function showStudentView(id){$$("#studentApp .app-view").forEach(v=>v.classList.add("hidden"));$(id).classList.remove("hidden");$$("[data-student-view]").forEach(b=>b.classList.toggle("active",b.dataset.studentView===id))}
function showAdminView(id){$$("#adminApp .app-view").forEach(v=>v.classList.add("hidden"));$(id).classList.remove("hidden");$$("[data-admin-view]").forEach(b=>b.classList.toggle("active",b.dataset.adminView===id))}
$$("[data-student-view]").forEach(
  button => {

    button.onclick = async () => {

      const view =
        button.dataset.studentView;

      if (view === "studentCourse") {

        try {

          await loadAvailableCourses();

          await loadStudentEnrollments();

          await loadStudentCourseApplications();

          renderAvailableCourses();
          renderMyCourses();

        } catch (error) {

          console.error(
            "Course list refresh failed:",
            error
          );

          alert(
            error?.message ||
            "Unable to refresh your courses."
          );
        }
      }

      showStudentView(view);
    };
  }
);
$$("[data-admin-view]").forEach(b=>b.onclick=()=>showAdminView(b.dataset.adminView));$$("[data-student-jump]").forEach(b=>b.onclick=()=>showStudentView(b.dataset.studentJump));$$("[data-admin-jump]").forEach(b=>b.onclick=()=>showAdminView(b.dataset.adminJump));
$("studentMenuBtn").onclick=()=>document.querySelector("#studentApp .sidebar").classList.toggle("open");$("adminMenuBtn").onclick=()=>document.querySelector("#adminApp .sidebar").classList.toggle("open");

function bestScore(s){const a=s.progress?.[state.course.id]?.attempts||[];return a.length?Math.max(...a.map(x=>x.score)):null}
function hasCert(s){return (s.certificates||[]).some(c=>c.courseId===state.course.id)}
function renderStudent(){

 const s = currentStudent();

 const courseSelected =
   !!state.course?.id;

 const p =
   courseSelected
     ? s.progress?.[state.course.id] || {
         attempts: []
       }
     : {
         attempts: []
       };

 const best =
   courseSelected
     ? bestScore(s)
     : null;
 $("studentWelcome").textContent=`Welcome, ${s.fullName.split(" ")[0]}`;$("dashProgress").textContent=p.attempts.length?`${p.attempts.length}/2 attempts used`:"Not started";$("dashMark").textContent=best===null?"—":`${best}%`;$("dashCertificates").textContent=(s.certificates||[]).length;
 ["dashCourseTitle","courseTitleStudent","courseHeadingStudent"].forEach(id=>$(id).textContent=state.course.title);$("dashCourseDescription").textContent=state.course.description;$("courseSubtitleStudent").textContent=state.course.subtitle;$("courseDescriptionStudent").textContent=state.course.description;
const coursePassed =
  p.attempts.some(
    attempt =>
      attempt.result === "pass"
  );

const left =
  courseSelected
    ? coursePassed
      ? 0
      : Math.max(
          0,
          2 - p.attempts.length
        )
    : 0;

$("attemptChip").textContent =
  courseSelected
    ? `${left} attempts available`
    : "Choose a course";

$("attemptsRemaining").textContent =
  courseSelected
    ? `${left} attempts remaining`
    : "Choose a course first"; 
    
const enrollment =
  (state.enrollments || [])
    .find(
      item =>
        item.course_id === state.course?.id
    );

const completedCourse =
  enrollment?.status === "completed";

const allowed =
  s.active &&
  courseSelected &&
  !!enrollment &&
  (enrollment.status === "enrolled" || enrollment.status === "completed") &&
  ((state.course.published && !state.courseClosed) || completedCourse);

$("courseLocked")
  .classList.toggle(
    "hidden",
    allowed
  );

$("courseContent")
  .classList.toggle(
    "hidden",
    !allowed
  );
  
  $("summarySections").innerHTML = (state.course.sections || []).length
    ? state.course.sections.map(section => `<article class="summary-card"><h4>Section ${section.number}: ${esc(section.title)}</h4><p>${esc(section.summary || "No lesson details have been added to this section yet.")}</p></article>`).join("")
    : `<article class="summary-card"><h4>Lesson details unavailable</h4><p>No saved sections were found for this course. Ask your administrator to check the saved lesson sections.</p></article>`;
 renderAssessment(s);renderResults(s);renderCerts(s);renderProfile(s);
 $("studentUpdateFeed").innerHTML=`<div class="update-item"><strong>Application approved</strong><span>Your student account is active.</span></div><div class="update-item"><strong>${state.course.published?"Course published":"Course hidden"}</strong><span>${esc(state.course.title)}</span></div>${best!==null?`<div class="update-item"><strong>Best mark: ${best}%</strong><span>${best>=60?"Pass":"Not yet passed"}</span></div>`:""}`
}
function nextCertificateCode(){
 const year=new Date().getFullYear();
 state.certificateSequence ||= {};
 state.certificateSequence[year]=(state.certificateSequence[year]||0)+1;
 return `MIP-${year}-${String(state.certificateSequence[year]).padStart(5,"0")}`;
}
function renderAssessment(s) {

  if (!state.course.assessmentOpen) {

    $("assessmentForm").innerHTML = `
      <div class="locked-card">
        <i class="fa-solid fa-lock"></i>

        <h3>Assessment Locked</h3>

        <p>
          The assessment has not started yet.
          Continue studying the course summary
          and wait for your facilitator to open
          the assessment.
        </p>
      </div>
    `;

    $("submitAssessmentBtn").disabled =
      true;

    $("submitAssessmentBtn").textContent =
      "Assessment Locked";

    return;
  }


  const attempts =
    s.progress?.[state.course.id]?.attempts ||
    [];

const alreadyPassed =
  attempts.some(
    attempt =>
      attempt.result === "pass"
  );

const disabled =
  alreadyPassed ||
  attempts.length >= 2;


  $("assessmentForm").innerHTML =
    state.course.questions
      .map(
        (q, qi) => `
          <div class="question-card">

            <h4>
              ${qi + 1}. ${esc(q.text)}
            </h4>

            ${q.answers
              .map(
                a => `
                  <label class="option">

                    <input
                      type="radio"
                      name="${q.id}"
                      value="${a.id}"
                      ${disabled ? "disabled" : ""}
                    >

                    <span>
                      ${esc(a.text)}
                    </span>

                  </label>
                `
              )
              .join("")}

          </div>
        `
      )
      .join("");


  $("submitAssessmentBtn").disabled =
    disabled;

$("submitAssessmentBtn").textContent =
  alreadyPassed
    ? "Course Passed"
    : attempts.length >= 2
      ? "No attempts remaining"
      : attempts.length === 1
        ? "Submit Final Attempt"
        : "Submit Assessment";
}
$("submitAssessmentBtn").onclick = async () => {

  const student =
    currentStudent();

  const courseId =
    state.course?.id;

  const msg =
    $("assessmentMessage");

  const btn =
    $("submitAssessmentBtn");


  if (!student || !courseId) {

    alert(
      "Open an enrolled course first."
    );

    return;
  }


  const attempts =
    student.progress?.[courseId]?.attempts ||
    [];


  const alreadyPassed =
    attempts.some(
      attempt =>
        attempt.result === "pass"
    );


  if (alreadyPassed) {

    msg.className =
      "form-message success";

    msg.textContent =
      "You already passed this course. No further attempt is required.";

    return;
  }


  if (attempts.length >= 2) {

    msg.className =
      "form-message error";

    msg.textContent =
      "You have used both assessment attempts.";

    return;
  }


  const selectedAnswerIds = [];


  for (
    const question
    of state.course.questions || []
  ) {

    const selected =
      document.querySelector(
        `input[name="${question.id}"]:checked`
      );


    if (!selected) {

      msg.className =
        "form-message error";

      msg.textContent =
        "Please answer every question before submitting.";

      return;
    }


    selectedAnswerIds.push(
      selected.value
    );
  }


  if (!selectedAnswerIds.length) {

    msg.className =
      "form-message error";

    msg.textContent =
      "There are no assessment questions to submit.";

    return;
  }


  const originalText =
    btn.innerHTML;


  btn.disabled = true;

  btn.innerHTML =
    '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';


  msg.className =
    "form-message";

  msg.textContent =
    "Submitting and recording your assessment...";


  try {

    const {
      error
    } =
      await supabaseClient.rpc(
        "submit_learning_assessment",
        {
          p_course_id:
            courseId,

          p_answer_ids:
            selectedAnswerIds
        }
      );


    if (error) {
      throw error;
    }


    await loadStudentProgress();

    await loadStudentEnrollments();


    const refreshedAttempts =
      student.progress?.[courseId]?.attempts ||
      [];


    const latestAttempt =
      refreshedAttempts[
        refreshedAttempts.length - 1
      ];


    if (
      latestAttempt?.result === "pass"
    ) {

      msg.className =
        "form-message success";

      msg.textContent =
        `Congratulations. You passed with ${latestAttempt.score}%. Your certificate has been recorded.`;

    } else if (
      refreshedAttempts.length === 1
    ) {

      msg.className =
        "form-message error";

      msg.textContent =
        `You scored ${latestAttempt?.score ?? 0}%. The pass mark is 60%. You have one final attempt remaining.`;

    } else {

      msg.className =
        "form-message error";

      msg.textContent =
        `You scored ${latestAttempt?.score ?? 0}%. You have now used both attempts.`;
    }


    renderStudent();

    renderMyCourses();


  } catch (error) {

    console.error(
      "Assessment submission failed:",
      error
    );


    msg.className =
      "form-message error";

    msg.textContent =
      error?.message ||
      "Unable to submit your assessment.";


    renderAssessment(
      student
    );


  } finally {

    const latestAttempts =
      student.progress?.[courseId]?.attempts ||
      [];


    const latestPassed =
      latestAttempts.some(
        attempt =>
          attempt.result === "pass"
      );


    if (
      !latestPassed &&
      latestAttempts.length < 2 &&
      state.course.assessmentOpen
    ) {

      btn.disabled = false;

      btn.innerHTML =
        latestAttempts.length === 1
          ? "Submit Final Attempt"
          : originalText;
    }
  }
};

function renderResults(s) {

  const allResults = [];


  Object.entries(
    s.progress || {}
  ).forEach(
    ([courseId, progress]) => {

      const course =
        (state.myCourses || [])
          .find(
            item =>
              item.id === courseId
          ) ||

        (state.availableCourses || [])
          .find(
            item =>
              item.id === courseId
          ) ||

        (
          state.course?.id === courseId
            ? state.course
            : null
        );


      const courseTitle =
        course?.title ||
        "Course";


      (progress.attempts || [])
        .forEach(
          attempt => {

            allResults.push({
              ...attempt,
              courseId,
              courseTitle
            });

          }
        );
    }
  );


  allResults.sort(
    (a, b) =>
      new Date(b.submittedAt) -
      new Date(a.submittedAt)
  );


  $("studentResultsContent").innerHTML =
    allResults.length

      ? allResults.map(
          result => `

            <article class="result-card">

              <div class="result-score ${
                result.result === "fail"
                  ? "fail"
                  : ""
              }">
                ${result.score}%
              </div>

              <div>
                <h3>
                  ${esc(result.courseTitle)}
                  • Attempt ${result.attemptNumber}
                </h3>

                <p>
                  ${
                    new Date(
                      result.submittedAt
                    ).toLocaleString()
                  }
                </p>
              </div>

              <div class="result-status ${result.result}">
                ${result.result.toUpperCase()}
              </div>

            </article>

          `
        ).join("")

      : `
        <div class="locked-card">

          <i class="fa-solid fa-chart-simple"></i>

          <h3>
            No results yet
          </h3>

          <p>
            Complete an assessment to see your marks.
          </p>

        </div>
      `;
}
function renderCerts(s){const c=s.certificates||[];$("studentCertificateList").innerHTML=c.length?c.map(x=>`<article class="certificate-card"><h3>${esc(x.courseTitle)}</h3><p>${new Date(x.awardedAt).toLocaleDateString()} • ${x.score}%</p><button class="primary-btn" onclick="openCertificate('${s.id}','${x.id}')">View Certificate</button></article>`).join(""):`<div class="locked-card"><i class="fa-solid fa-award"></i><h3>No certificates yet</h3><p>Pass a course to receive a certificate.</p></div>`}
function renderProfile(s){const rows=[["Full name",s.fullName],["Email",s.email],["Phone",s.phone],["Nationality",s.nationality],["Identity / Passport","••••••"+String(s.identity).slice(-4)],["Year of birth",s.birthYear],["Education",s.education],["Current status",s.currentStatus],["Application","Approved"],["Document",s.documentName]];$("studentProfileCard").innerHTML=rows.map(([k,v])=>`<div class="profile-item"><span>${k}</span><strong>${esc(v)}</strong></div>`).join("")}


function renderAdmin() {
  const pending =
    state.applications.filter(
      a => a.status === "pending"
    );

  const approved =
    state.students.filter(
      s => s.active
    );

  const certs =
    state.students.flatMap(
      s => s.certificates || []
    );

  const ranked =
    approved
      .map(s => ({
        s,
        score: bestScore(s)
      }))
      .filter(x => x.score !== null)
      .sort(
        (a, b) =>
          b.score - a.score
      );


  $("adminPendingCount").textContent =
    pending.length;

  $("adminApprovedCount").textContent =
    approved.length;

  $("adminTopStudent").textContent =
    ranked.length
      ? `${ranked[0].s.fullName.split(" ")[0]} ${ranked[0].score}%`
      : "—";

  $("adminCertificateCount").textContent =
    certs.length;


  $("adminCurrentCourse").textContent =
    state.course.title;


  $("adminCurrentCourseState").textContent =
    state.courseClosed
      ? "Course session is closed."
      : state.course.published
        ? "Course is published for approved students."
        : "Course is hidden from students.";


    renderApplications();
    renderCourseApplications();
    renderStudents();
    renderBuilder();
    renderAdminCourseLibrary();
    renderAdminCerts();


}

function renderApplications() {
  $("applicationsTable").innerHTML =
    state.applications.length
      ? state.applications.map(a => `
          <article class="data-row">

            <div class="data-main">
              <strong>${esc(a.fullName)}</strong>
              <span>
                ${esc(a.email)}
                •
                ${esc(a.documentName)}
              </span>
              <span>
                Course:
                <strong>
                  ${esc(a.courseTitle || "Not specified")}
                </strong>
              </span>
            </div>

            <small>
              ${esc(a.nationality)}
            </small>

            <small>
              ${esc(a.status.toUpperCase())}
            </small>

            <div class="row-actions">

        ${
          a.documentPath
            ? `
              <button
                class="secondary"
                onclick="viewApplicationDocument('${a.id}')">
                <i class="fa-solid fa-file-pdf"></i>
                View ID
              </button>
            `
            : ""
        }

        ${
          a.status === "pending"
            ? `
              <button
                class="approve"
                onclick="approveApplication('${a.id}')">
                Approve
              </button>

              <button
                class="reject"
                onclick="rejectApplication('${a.id}')">
                Reject
              </button>
            `
            : ""
        }

      </div>

          </article>
        `).join("")
      : `
          <div class="locked-card">
            <i class="fa-solid fa-inbox"></i>
            <h3>No applications yet</h3>
          </div>
        `;
}

function renderCourseApplications() {
  const container =
    $("courseApplicationsTable");

  if (!container) {
    return;
  }

  const applications =
    state.courseApplications || [];

  container.innerHTML =
    applications.length
      ? applications.map(application => `
          <article class="data-row">

            <div class="data-main">
              <strong>
                ${esc(application.studentName)}
              </strong>

              <span>
                ${esc(application.studentEmail)}
              </span>

              <span>
                Course:
                <strong>
                  ${esc(application.courseTitle)}
                </strong>
              </span>
            </div>

            <small>
              ${esc(
                application.status.toUpperCase()
              )}
            </small>

            <small>
              ${
                application.appliedAt
                  ? new Date(
                      application.appliedAt
                    ).toLocaleString()
                  : ""
              }
            </small>

            ${
              application.status === "rejected" &&
              application.rejectionReason
                ? `
                  <small>
                    Reason:
                    ${esc(
                      application.rejectionReason
                    )}
                  </small>
                `
                : ""
            }

            <div class="row-actions">

              ${
                application.status === "pending"
                  ? `
                    <button
                      class="approve"
                      type="button"
                      onclick="approveCourseApplication('${application.id}')"
                    >
                      Approve
                    </button>

                    <button
                      class="reject"
                      type="button"
                      onclick="rejectCourseApplication('${application.id}')"
                    >
                      Reject
                    </button>
                  `
                  : ""
              }

            </div>

          </article>
        `).join("")
      : `
          <div class="locked-card">
            <i class="fa-solid fa-book"></i>

            <h3>
              No course applications yet
            </h3>

            <p>
              Student course applications will appear here.
            </p>
          </div>
        `;
}

window.viewApplicationDocument = async id => {
  const application =
    state.applications.find(
      item => item.id === id
    );

  if (!application?.documentPath) {
    alert(
      "No certified document was found for this application."
    );
    return;
  }

  const previewWindow =
    window.open("", "_blank");

  if (!previewWindow) {
    alert(
      "Please allow pop-ups to view the certified document."
    );
    return;
  }

  try {
    const {
      data,
      error
    } = await supabaseClient.storage
      .from("learning-documents")
      .createSignedUrl(
        application.documentPath,
        120
      );

    if (error) {
      throw error;
    }

    if (!data?.signedUrl) {
      throw new Error(
        "Document link was not returned."
      );
    }

    previewWindow.location.href =
      data.signedUrl;

  } catch (error) {
    previewWindow.close();

    console.error(
      "Unable to open application document:",
      error
    );

    alert(
      error?.message ||
      "Unable to open the certified document."
    );
  }
};

window.approveApplication = async id => {
  const application = state.applications.find(
    a => a.id === id
  );

  if (!application) return;

  const confirmed = confirm(
    `Approve ${application.fullName} as a student?`
  );

  if (!confirmed) return;

  try {
    const {
      data,
      error
    } = await supabaseClient.functions.invoke(
      "approve-learning-application",
      {
        body: {
          application_id: id
        }
      }
    );

    if (error) {
  console.error(
    "Approval function error:",
    error
  );

  let functionMessage =
    data?.error ||
    error.message ||
    "Unable to approve application.";

  try {
    const response =
      error.context;

    if (response) {
      const result =
        await response.json();

      console.error(
        "Approval function response:",
        result
      );

      functionMessage =
        result?.error ||
        result?.message ||
        functionMessage;
    }
  } catch (responseError) {
    console.error(
      "Unable to read approval error response:",
      responseError
    );
  }

  throw new Error(
    functionMessage
  );
}

    if (!data?.success) {
      throw new Error(
        data?.error ||
        "Application approval failed."
      );
    }

    await loadAdminApplications();

    renderAdmin();

    alert(
      data.message ||
      "Application approved successfully."
    );

  } catch (error) {
    console.error(
      "Application approval failed:",
      error
    );

    alert(
      error?.message ||
      "Unable to approve this application."
    );
  }
};

window.approveCourseApplication = async id => {

  const application =
    (state.courseApplications || [])
      .find(
        item =>
          item.id === id
      );

  if (!application) {
    return;
  }

  const confirmed = confirm(
    `Approve ${application.studentName} for ${application.courseTitle}?`
  );

  if (!confirmed) {
    return;
  }

  try {

    const {
      data,
      error
    } = await supabaseClient.rpc(
      "approve_learning_course_application",
      {
        p_application_id: id
      }
    );

    if (error) {
      throw error;
    }

    await loadAdminCourseApplications();

    renderAdmin();

    alert(
      `${application.studentName} has been approved for ${application.courseTitle}.`
    );

    return data;

  } catch (error) {

    console.error(
      "Course application approval failed:",
      error
    );

    alert(
      error?.message ||
      "Unable to approve this course application."
    );
  }
};

window.rejectApplication = async id => {
  const application = state.applications.find(
    a => a.id === id
  );

  if (!application) return;

  const reason = prompt(
    "Reason for rejection:",
    "Course full / requirements not met"
  );

  if (reason === null) return;

  const cleanReason = reason.trim();

  if (!cleanReason) {
    alert("Please provide a rejection reason.");
    return;
  }

  const confirmed = confirm(
    `Reject application for ${application.fullName}?`
  );

  if (!confirmed) return;

  try {
    const {
      error
    } = await supabaseClient
      .from("learning_applications")
      .update({
        application_status: "rejected",
        rejection_reason: cleanReason,
        reviewed_at: new Date().toISOString()
      })
      .eq("id", id);

    if (error) {
      throw error;
    }

    await loadAdminApplications();

    renderAdmin();

    alert("Application rejected successfully.");

  } catch (error) {
    console.error(
      "Application rejection failed:",
      error
    );

    alert(
      error?.message ||
      "Unable to reject this application."
    );
  }
};

window.rejectCourseApplication = async id => {

  const application =
    (state.courseApplications || [])
      .find(
        item =>
          item.id === id
      );

  if (!application) {
    return;
  }

  const reason = prompt(
    `Reason for rejecting ${application.studentName} from ${application.courseTitle}:`,
    "Course full / requirements not met"
  );

  if (reason === null) {
    return;
  }

  const cleanReason =
    reason.trim();

  if (!cleanReason) {
    alert(
      "Please provide a rejection reason."
    );

    return;
  }

  const confirmed = confirm(
    `Reject ${application.studentName}'s application for ${application.courseTitle}?`
  );

  if (!confirmed) {
    return;
  }

  try {

    const {
      error
    } = await supabaseClient.rpc(
      "reject_learning_course_application",
      {
        p_application_id: id,
        p_reason: cleanReason
      }
    );

    if (error) {
      throw error;
    }

    await loadAdminCourseApplications();

    renderAdmin();

    alert(
      `${application.studentName}'s course application has been rejected.`
    );

  } catch (error) {

    console.error(
      "Course application rejection failed:",
      error
    );

    alert(
      error?.message ||
      "Unable to reject this course application."
    );
  }
};

function renderStudents(){const ranked=state.students.map(s=>({s,score:bestScore(s)})).sort((a,b)=>(b.score??-1)-(a.score??-1));$("studentsTable").innerHTML=ranked.length?ranked.map((x,i)=>`<article class="data-row"><div class="data-main"><strong>${i===0&&x.score!==null?"🏆 ":""}${esc(x.s.fullName)}</strong><span>${esc(x.s.email)}</span></div><small>${x.score===null?"No mark":x.score+"%"}</small><small>${hasCert(x.s)?"Certificate awarded":"No certificate"}</small><div class="row-actions"><button class="secondary" onclick="toggleStudent('${x.s.id}')">${x.s.active?"Deactivate":"Activate"}</button></div></article>`).join(""):`<div class="locked-card"><i class="fa-solid fa-users"></i><h3>No approved students</h3></div>`}
window.toggleStudent = async id => {
  const student = state.students.find(
    s => s.id === id
  );

  if (!student) return;

  const newStatus = !student.active;

  const confirmed = confirm(
    `${newStatus ? "Activate" : "Deactivate"} ${student.fullName}?`
  );

  if (!confirmed) return;

  try {
    const { error } = await supabaseClient
      .from("learning_students")
      .update({
        active: newStatus
      })
      .eq("id", id);

    if (error) {
      throw error;
    }

    await loadAdminStudents();

    renderAdmin();

    alert(
      `Student ${newStatus ? "activated" : "deactivated"} successfully.`
    );

  } catch (error) {
    console.error(
      "Student status update failed:",
      error
    );

    alert(
      error?.message ||
      "Unable to update student status."
    );
  }
};


async function loadAdminCourseLibrary() {
  const {data,error}=await supabaseClient.from("learning_courses")
    .select("id,title,subtitle,description,summary,published,closed,assessment_open,created_at")
    .order("created_at",{ascending:false});
  if(error) throw error;
  state.adminCourseLibrary=data||[];
  // Fetch section summaries for each course; never silently hide saved lesson content.
  const ids=state.adminCourseLibrary.map(c=>c.id);
  if(ids.length){
    const {data:sectionRows,error:sectionError}=await supabaseClient
      .rpc('admin_read_learning_sections');
    if(sectionError)throw new Error('Cannot read saved sections: '+sectionError.message+'. Install 04_ADMIN_SECTION_READ.sql.');
    for(const course of state.adminCourseLibrary){
      course.sections=(sectionRows||[]).filter(s=>s.course_id===course.id);
    }
  }
  return state.adminCourseLibrary;
}
function renderAdminCourseLibrary() {
  const el=$("adminCoursesList");if(!el)return;
  const courses=state.adminCourseLibrary||[];
  el.innerHTML=courses.length?courses.map(x=>`<article class="course-library-row">
    <div><strong>${esc(x.title)}</strong>
      ${x.subtitle?`<p>${esc(x.subtitle)}</p>`:''}
      ${x.description?`<p>${esc(x.description)}</p>`:''}
      <details class="course-library-details"><summary>View saved section details (${(x.sections||[]).length})</summary>
      ${(x.sections||[]).length?(x.sections||[]).map(section=>`<div class="course-library-section"><strong>Section ${section.section_number}: ${esc(section.title)}</strong><p style="white-space:pre-wrap">${esc(section.summary||'No summary saved')}</p></div>`).join(''):`<p>No section records found.${x.summary?' Legacy summary exists in course record.':''}</p>`}
      </details><small>${x.published?"Published":"Hidden"} • ${x.closed?"Session closed":"Session open"} • ${x.assessment_open?"Assessment open":"Assessment closed"}</small></div>
    <div class="row-actions">
      <button class="secondary" onclick="editLibraryCourse('${x.id}')">Edit</button>
      <button class="approve" onclick="setLibraryPublish('${x.id}',${!x.published})">${x.published?"Hide Course":"Publish Course"}</button>
      <button class="secondary" onclick="setLibraryAssessment('${x.id}',${!x.assessment_open})">${x.assessment_open?"Close Assessment":"Open Assessment"}</button>
      <button class="${x.closed?'secondary':'reject'}" onclick="setLibrarySession('${x.id}',${!x.closed})">${x.closed?"Reopen Course Session":"Close Course Session"}</button>
      <button class="secondary" onclick="repeatLibraryCourse('${x.id}')">Repeat as New Intake</button>
    </div>
  </article>`).join(""):'<p>No saved courses yet. Click New Course to begin.</p>';
}
window.editLibraryCourse=async id=>{
  try{state.adminSelectedCourseId=id;builderRenderedCourseId=null;courseSectionDrafts.clear();adminSections=[];activeSectionId=null;adminQuestionDraft=[];await loadAdminCourse(id);renderAdmin();showAdminView("adminCourse");}
  catch(e){alert(e.message||"Unable to load this course.");}
};
async function updateLibraryCourseStatus(id, changes) {
  const course=(state.adminCourseLibrary||[]).find(x=>x.id===id);
  if(!course) { alert("Course not found. Reload Manage Courses."); return; }
  try {
    const {data:{user},error:authError}=await supabaseClient.auth.getUser();
    if(authError||!user) throw Error("Administrator session expired. Log in again.");
    const {data:isAdmin,error:adminError}=await supabaseClient.rpc("is_learning_admin");
    if(adminError||isAdmin!==true) throw Error("Administrator access could not be verified.");
    const {data,error}=await supabaseClient.from("learning_courses")
      .update({...changes,updated_at:new Date().toISOString()})
      .eq("id",id).select("id,published,closed,assessment_open").single();
    if(error) throw error;
    await loadAdminCourseLibrary();
    if(state.course?.id===id) {
      state.course.published=data.published;
      state.course.assessmentOpen=data.assessment_open;
      state.courseClosed=data.closed;
    }
    renderAdminCourseLibrary();
  } catch(e) {console.error("Course status update failed",e);alert(e?.message||"Unable to update course status.");}
}
window.setLibraryPublish=(id,published)=>updateLibraryCourseStatus(id,{published});
window.setLibraryAssessment=(id,assessmentOpen)=>updateLibraryCourseStatus(id,{assessment_open:assessmentOpen});
window.setLibrarySession=(id,closed)=>{
  const course=(state.adminCourseLibrary||[]).find(x=>x.id===id);
  if(!course)return;
  const verb=closed?"Close":"Reopen";
  if(!confirm(`${verb} the course session for "${course.title}"? This does not delete any course or student records.`))return;
  // Session status is independent of publication and assessment status.
  return updateLibraryCourseStatus(id,{closed});
};
window.repeatLibraryCourse=async id=>{
  if(!confirm("Create a separate new intake with copied sections, questions and answers? Previous students will NOT be enrolled in the new intake."))return;
  try{const {data,error}=await supabaseClient.rpc("admin_repeat_learning_course",{p_source_course_id:id});if(error)throw error;
    const newId=typeof data==="string"?data:data?.course_id;if(!newId)throw Error("No new course ID returned.");
    await loadAdminCourseLibrary();await editLibraryCourse(newId);alert("New intake created as an unpublished course. Edit its title if needed, then publish it.");}
  catch(e){alert(e.message||"Unable to create repeat intake.");}
};
$("newCourseBtn").onclick=()=>{
  state.adminSelectedCourseId=null;builderRenderedCourseId=null;
  state.course={id:null,title:"",subtitle:"",description:"",section:1,summary:"",published:false,assessmentOpen:false,questions:[]};
  state.courseClosed=false;adminSections=[];activeSectionId=null;courseSectionDrafts.clear();ensureInitialSection();renderAdmin();showAdminView("adminCourse");
};
$("backToCoursesBtn").onclick=async()=>{await loadAdminCourseLibrary();renderAdminCourseLibrary();showAdminView("adminCourses");};
// Section records are stored independently; the course-level assessment remains unchanged.
let adminSections=[], activeSectionId=null;
async function fetchCourseSections(courseId){
  if(!courseId)return [];
  const {data,error}=await supabaseClient.rpc('admin_read_learning_sections');
  if(error)throw new Error('Cannot read saved sections: '+error.message+'. Install 04_ADMIN_SECTION_READ.sql.');
  return (data||[]).filter(s=>s.course_id===courseId);
}
async function refreshAdminSections(){
  adminSections=await fetchCourseSections(state.course?.id);
  if(!adminSections.some(s=>s.id===activeSectionId))activeSectionId=adminSections[0]?.id||null;
}
function readQuestionDraftFromInputs(){
  $$('[data-q]').forEach(e=>{const q=adminQuestionDraft[Number(e.dataset.q)];if(q)q.text=e.value.trim()});
  $$('[data-a]').forEach(e=>{const [q,a]=e.dataset.a.split(':').map(Number);if(adminQuestionDraft[q]?.answers[a])adminQuestionDraft[q].answers[a].text=e.value.trim()});
  $$('[data-c]').forEach(e=>{const [q,a]=e.dataset.c.split(':').map(Number);if(adminQuestionDraft[q]?.answers[a])adminQuestionDraft[q].answers[a].correct=e.checked});
}
// Keep unsaved edits for every section until the single Save Course action.
let courseSectionDrafts = new Map();
let builderRenderedCourseId = null;
function sectionDraftKey(id){return id || '__new__';}
function ensureInitialSection(){
  if(adminSections.length || courseSectionDrafts.size)return;
  const key='__draft_'+crypto.randomUUID();
  courseSectionDrafts.set(key,{id:null,title:'',summary:'',section_number:1,questions:[]});
  activeSectionId=key;
}

function snapshotSelectedSection(){
  if(!$('courseSectionTitleInput') || !activeSectionId)return;
  readQuestionDraftFromInputs();
  const saved=adminSections.find(s=>s.id===activeSectionId);
  courseSectionDrafts.set(activeSectionId,{
    id:saved?.id||null,
    title:$('courseSectionTitleInput').value.trim(),
    summary:$('courseSummaryInput').value.trim(),
    section_number:Number($('courseSectionInput').value),
    questions:JSON.parse(JSON.stringify(adminQuestionDraft))
  });
}
function showSelectedSection(){
  const selected=adminSections.find(s=>s.id===activeSectionId);
  const draft=courseSectionDrafts.get(activeSectionId);
  const newDrafts=[...courseSectionDrafts.entries()].filter(([key,d])=>!d.id);
  $('courseSectionSelect').innerHTML=adminSections.map(s=>{
    const edited=courseSectionDrafts.get(s.id);
    return `<option value="${s.id}">Section ${edited?.section_number??s.section_number}: ${esc(edited?.title??s.title)}</option>`;
  }).join('')+newDrafts.map(([key,d])=>`<option value="${key}">Section ${d.section_number}: ${esc(d.title||'New section (unsaved)')}</option>`).join('');
  $('courseSectionSelect').value=activeSectionId||'';
  $('courseSectionTitleInput').value=draft?.title??selected?.title??'';
  $('courseSectionInput').value=draft?.section_number??selected?.section_number??'';
  $('courseSummaryInput').value=draft?.summary??selected?.summary??'';
  adminQuestionDraft=JSON.parse(JSON.stringify(draft?.questions??(state.course.questions||[]).filter(q=>q.sectionId===activeSectionId)));
  renderQuestionBuilder();
}
$('courseSectionSelect').onchange=e=>{
  const target=e.target.value;
  snapshotSelectedSection();
  activeSectionId=target||null;
  showSelectedSection();
};
$('addSectionBtn').onclick=()=>{
  snapshotSelectedSection();
  const used=new Set([
    ...adminSections.map(s=>courseSectionDrafts.get(s.id)?.section_number??s.section_number),
    ...[...courseSectionDrafts.values()].filter(d=>!d.id).map(d=>d.section_number)
  ]);
  let number=1;
  while(used.has(number))number++;
  const key='__draft_'+crypto.randomUUID();
  activeSectionId=key;
  courseSectionDrafts.set(key,{
    id:null,title:'',summary:'',section_number:number,questions:[]
  });
  showSelectedSection();
};
function renderBuilder(){
  // Do not overwrite an in-progress edit when dashboard data is refreshed.
  if (builderRenderedCourseId === (state.course?.id || '__new__') &&
      activeSectionId && $('courseSectionSelect')?.value === activeSectionId) {
    snapshotSelectedSection();
  }
  builderRenderedCourseId = state.course?.id || '__new__';
  if($('editingCourseName')) $('editingCourseName').textContent=state.course?.title||'New course';
  $('courseTitleInput').value=state.course.title;
  $('courseSubtitleInput').value=state.course.subtitle;
  $('courseDescriptionInput').value=state.course.description;
  if(!adminSections.length && !courseSectionDrafts.size)ensureInitialSection();
  showSelectedSection();
}
function renderQuestionBuilder(){$("questionBuilder").innerHTML=adminQuestionDraft.map((q,qi)=>`<div class="question-builder-item"><label>Question ${qi+1}</label><textarea data-q="${qi}" rows="2">${esc(q.text)}</textarea>${q.answers.map((a,ai)=>`<div class="answer-grid"><input data-a="${qi}:${ai}" value="${esc(a.text)}"><label class="correct-toggle"><input type="checkbox" data-c="${qi}:${ai}" ${a.correct?"checked":""}> Correct</label></div>`).join("")}<button class="remove-q" onclick="removeQuestion(${qi})">Remove question</button></div>`).join("")}
$("addQuestionBtn").onclick=()=>{readQuestionDraftFromInputs();adminQuestionDraft.push({id:crypto.randomUUID(),text:"New question",answers:[{text:"Option A",correct:true},{text:"Option B",correct:false},{text:"Option C",correct:false},{text:"Option D",correct:false}]});renderQuestionBuilder()};
window.removeQuestion=i=>{readQuestionDraftFromInputs();adminQuestionDraft.splice(i,1);renderQuestionBuilder()};
// One request, one PostgreSQL transaction. No partial course saves.
$('saveCourseBtn').onclick=async()=>{
  snapshotSelectedSection();
  const title=$('courseTitleInput').value.trim();
  const subtitle=$('courseSubtitleInput').value.trim();
  const description=$('courseDescriptionInput').value.trim();
  if(!title){alert('Enter a course title.');return;}
  if(!adminSections.length && !courseSectionDrafts.size)ensureInitialSection();
  const sections=adminSections.map(saved=>{
    const draft=courseSectionDrafts.get(saved.id);
    return draft||{
      id:saved.id,title:saved.title,summary:saved.summary,
      section_number:saved.section_number,
      questions:JSON.parse(JSON.stringify((state.course.questions||[]).filter(q=>q.sectionId===saved.id)))
    };
  }).concat([...courseSectionDrafts.values()].filter(d=>!d.id));
  if(!sections.length){alert('Add at least one section before saving.');return;}
  const numbers=new Set();
  for(const section of sections){
    if(!section.title||!Number.isInteger(section.section_number)||section.section_number<1){
      alert('Every section needs a title and a valid number.');return;
    }
    if(numbers.has(section.section_number)){
      alert('Section numbers must be unique.');return;
    }
    numbers.add(section.section_number);
    if(!section.questions?.length){alert(`Add questions to section ${section.section_number}.`);return;}
    for(const [i,q] of section.questions.entries()){
      if(!q.text?.trim()||!q.answers?.length||q.answers.some(a=>!a.text?.trim())||q.answers.filter(a=>a.correct).length!==1){
        alert(`Complete question ${i+1} in section ${section.section_number}, including exactly one correct answer.`);return;
      }
    }
  }
  const btn=$('saveCourseBtn'),original=btn.textContent;
  btn.disabled=true;btn.textContent='Saving course...';
  try{
    const {data:{user},error:authError}=await supabaseClient.auth.getUser();
    if(authError||!user)throw new Error('Administrator login expired. Log in again before saving.');
    const {data:isAdmin,error:adminError}=await supabaseClient.rpc('is_learning_admin');
    if(adminError||isAdmin!==true)throw new Error('This login does not have active learning administrator access.');
    const persistedQuestionIds=new Set((state.course.questions||[]).map(q=>q.id));
    const persistedAnswerIds=new Set((state.course.questions||[]).flatMap(q=>q.answers||[]).map(a=>a.id));
    const {data:courseId,error}=await supabaseClient.rpc('admin_save_learning_course_atomic',{
      p_course_id:state.course?.id||null,
      p_title:title,p_subtitle:subtitle,p_description:description,
      p_sections:sections.map(d=>({
        id:d.id||null,title:d.title,summary:d.summary||'',section_number:d.section_number,
        questions:d.questions.map(q=>({
          id:persistedQuestionIds.has(q.id)?q.id:null,text:q.text,
          answers:q.answers.map(a=>({id:persistedAnswerIds.has(a.id)?a.id:null,text:a.text,correct:a.correct===true}))
        }))
      }))
    });
    if(error)throw error;
    if(!courseId)throw new Error('Save did not return a course ID.');
    courseSectionDrafts.clear();
    builderRenderedCourseId=null;
    state.adminSelectedCourseId=courseId;
    await loadAdminCourse(courseId);
    await loadAdminCourseLibrary();
    const verified=(state.adminCourseLibrary||[]).find(c=>c.id===courseId);
    if(!verified || (verified.sections||[]).length!==sections.length){
      throw new Error('Save returned an ID, but section verification did not match. Do not save again.');
    }
    renderAdmin();
    showAdminView('adminCourse');
    alert('Course and '+verified.sections.length+' sections saved and verified.');
  }catch(e){
    console.error('Atomic course save failed',e);
    alert('Course was not saved: '+(e.message||'Unknown error')+'\nYour unsaved edits are still on this page.');
  }finally{btn.disabled=false;btn.textContent=original;}
};
async function saveSectionQuestions(skipInputRead = false) {

  if (!state.course?.id) {
    throw new Error("No Supabase course was loaded.");
  }
  if(!activeSectionId)throw new Error("Save or select a section before saving questions.");

  if (!skipInputRead) {
  $$("[data-q]").forEach(element => {
    const questionIndex =
      Number(element.dataset.q);

    adminQuestionDraft[questionIndex].text =
      element.value.trim();
  });

  $$("[data-a]").forEach(element => {
    const [questionIndex, answerIndex] =
      element.dataset.a
        .split(":")
        .map(Number);

    adminQuestionDraft[questionIndex]
      .answers[answerIndex]
      .text = element.value.trim();
  });

  $$("[data-c]").forEach(element => {
    const [questionIndex, answerIndex] =
      element.dataset.c
        .split(":")
        .map(Number);

    adminQuestionDraft[questionIndex]
      .answers[answerIndex]
      .correct = element.checked;
  });

  }

  if (!adminQuestionDraft.length) {
    throw new Error("Add at least one question before saving.");
  }

  for (
    let i = 0;
    i < adminQuestionDraft.length;
    i++
  ) {
    const question =
      adminQuestionDraft[i];

    if (!question.text) {
      throw new Error(`Question ${i + 1} cannot be empty.`);
    }

    if (!question.answers?.length) {
      throw new Error(`Question ${i + 1} needs answers.`);
    }

    const emptyAnswer =
      question.answers.some(
        answer => !answer.text
      );

    if (emptyAnswer) {
      alert(
        `Complete all answers for Question ${i + 1}.`
      );
      return;
    }

    const correctAnswers =
      question.answers.filter(
        answer => answer.correct
      );

    if (correctAnswers.length !== 1) {
      throw new Error(`Question ${i + 1} must have exactly one correct answer.`);
    }
  }


  try {

    const oldQuestions =
      (state.course.questions || []).filter(q=>q.sectionId===activeSectionId);

    const draftQuestionIds =
      adminQuestionDraft.map(
        question => question.id
      );

    // Safety: never implicitly delete existing questions when saving a section.
    const missingQuestionIds=oldQuestions.filter(q=>q.id&&!draftQuestionIds.includes(q.id));
    if(missingQuestionIds.length)throw new Error('Saving would remove existing questions. Removal is disabled for safety.');

    for (
      let questionIndex = 0;
      questionIndex <
        adminQuestionDraft.length;
      questionIndex++
    ) {
      const question =
        adminQuestionDraft[
          questionIndex
        ];

      if (!question.id) {
        question.id =
          crypto.randomUUID();
      }

      const {
        error: questionError
      } = await supabaseClient
        .from("learning_questions")
        .upsert({
          id: question.id,

          course_id:
            state.course.id,
          section_id:activeSectionId,

          question_text:
            question.text,

          sort_order:
            questionIndex
        });

      if (questionError) {
        throw questionError;
      }

      const oldQuestion =
        oldQuestions.find(
          item =>
            item.id === question.id
        );

      const oldAnswers =
        oldQuestion?.answers || [];

      const draftAnswerIds =
        question.answers
          .filter(answer => answer.id)
          .map(answer => answer.id);

      // Safety: never implicitly delete existing answers.
      if(oldAnswers.some(a=>a.id&&!draftAnswerIds.includes(a.id)))throw new Error('Saving would remove existing answers. Removal is disabled for safety.');

      for (
        let answerIndex = 0;
        answerIndex <
          question.answers.length;
        answerIndex++
      ) {
        const answer =
          question.answers[
            answerIndex
          ];

        if (!answer.id) {
          answer.id =
            crypto.randomUUID();
        }

        const {
          error: answerError
        } = await supabaseClient
          .from("learning_answers")
          .upsert({
            id: answer.id,

            question_id:
              question.id,

            answer_text:
              answer.text,

            is_correct:
              answer.correct === true,

            sort_order:
              answerIndex
          });

        if (answerError) {
          throw answerError;
        }
      }
    }

    state.course.questions = [
      ...(state.course.questions||[]).filter(q=>q.sectionId!==activeSectionId),
      ...JSON.parse(JSON.stringify(adminQuestionDraft)).map(q=>({...q,sectionId:activeSectionId}))
    ];



  } catch (error) {
    console.error("Question save failed:", error);
    throw error;
  }
}
$("resetLearningDataBtn").onclick = async () => {
  const first = confirm("PERMANENT RESET: Delete ALL learning courses, questions, applications, student records, attempts and certificates? Admin accounts and other website data will remain. This cannot be undone.");
  if (!first) return;
  const phrase = prompt('Type RESET LEARNING DATA to confirm permanent deletion:');
  if (phrase !== 'RESET LEARNING DATA') return;
  const btn = $("resetLearningDataBtn");
  btn.disabled = true;
  try {
    const { data, error } = await supabaseClient.rpc("admin_reset_learning_data");
    if (error) throw error;
    if (data !== true) throw new Error("Database did not confirm the reset.");
    localStorage.removeItem(STORE_KEY);
    state = initialState();
    state.course = { id: null, title: "", subtitle: "", description: "", section: 1, summary: "", published: false, assessmentOpen: false, questions: [] };
    state.applications = []; state.students = []; state.certificates = []; state.courseApplications = [];
    await showAdmin();
    alert("Learning records were cleared. Administrator records were preserved. Save Course Information to create a fresh course.");
  } catch (error) {
    console.error("Learning reset failed:", error);
    alert("Reset failed; no successful reset was confirmed. " + (error?.message || "Please check the database function."));
  } finally { btn.disabled = false; }
};

function renderAdminCerts(){const all=state.students.flatMap(s=>(s.certificates||[]).map(c=>({s,c})));$("certificateAdminList").innerHTML=all.length?all.map(({s,c})=>`<article class="certificate-card"><h3>${esc(s.fullName)}</h3><p><strong>${esc(c.certificateCode||"Pending code")}</strong> • ${esc(c.courseTitle)} • ${c.score}% • ${new Date(c.awardedAt).toLocaleDateString()}</p><button class="primary-btn" onclick="openCertificate('${s.id}','${c.id}')">Print / Save PDF</button></article>`).join(""):`<div class="locked-card"><i class="fa-solid fa-award"></i><h3>No certificates yet</h3></div>`}
window.openCertificate = (sid, cid) => {

  const student =
    state.students.find(
      item => item.id === sid
    );

  const certificate =
    student?.certificates?.find(
      item => item.id === cid
    );

  if (!student || !certificate) {
    return;
  }


  const awardDate =
    new Date(
      certificate.awardedAt
    ).toLocaleDateString(
      "en-ZA",
      {
        day: "2-digit",
        month: "long",
        year: "numeric"
      }
    );


  const certificateNumber =
    certificate.certificateCode ||
    "MIP-LEGACY";


  $("certificatePreview").innerHTML = `

    <div class="certificate-sheet certificate-modern">
      <div class="certificate-pattern" aria-hidden="true"></div>

      <!-- SECURITY BACKGROUND -->
      <div
        class="certificate-security-mark"
        aria-hidden="true"
      >
        MI PRINT
      </div>


      <!-- TOP BRAND -->
      <header class="certificate-header">

        <div class="certificate-brand">
          <span>My</span> Learning
        </div>

        <div class="certificate-brand-subtitle">
          TRAINING
        </div>

        <div class="certificate-number">
          CERTIFICATE NO.
          <strong>
            ${esc(certificateNumber)}
          </strong>
          <p class="verify">
          Verify here: https://miprints.co.za/verify
        </p>
        </div>

      </header>


      <!-- MAIN CERTIFICATE CONTENT -->
      <main class="certificate-main">

        <h1>
          Certificate
          <span>of Achievement</span>
        </h1>


        <div class="certificate-ornament">

          <span></span>

          <i class="fa-solid fa-diamond"></i>

          <span></span>

        </div>


        <p class="certificate-intro">
          This certificate is proudly presented to
        </p>


        <div class="certificate-student-name">
          ${esc(student.fullName)}
        </div>


        <p class="certificate-copy">
          for successfully completing the learning programme
        </p>


        <div class="certificate-course-name">
          ${esc(certificate.courseTitle)}
        </div>


        <p class="certificate-copy certificate-copy-small">
          and demonstrating satisfactory knowledge
          and understanding of the course content.
        </p>


        <div class="certificate-score">

          <span>
            Final Recorded Score
          </span>

          <strong>
            ${certificate.score}%
          </strong>

        </div>

      </main>


      <!-- SIGNATURE AND DATE -->
      <section class="certificate-authorisation">


<div class="certificate-signature-block managing-director">

  <div class="signature-space" style="margin-bottom: 10px;">
    <img
      src="assets/images/director.png"
      alt="Managing Director signature"
      class="certificate-signature-image"
    >
  </div>

  <strong>Managing Director</strong>

  <small>Authorised Signature</small>

</div>


        <div class="certificate-signature-block">

          <div class="signature-space">

            <img
              src="assets/images/signature.png"
              alt="Managing Director signature"
              class="certificate-signature-image"
            >

          </div>

          <div class="certificate-sign-line"></div>

          <strong>
            Facilitator
          </strong>

          <small>
            Authorised Signature
          </small>

        </div>


        <div class="certificate-date-block">

          <div class="certificate-date-value">
            ${awardDate}
          </div>

          <div class="certificate-sign-line"></div>

          <strong>
            Date of Completion
          </strong>

          <small>
            Certificate Award Date
          </small>

        </div>


      </section>


      <!-- BOTTOM ORGANISATION LOGOS -->
      <footer class="certificate-logo-footer">

        <div class="certificate-logo-rule"></div>

        <div class="certificate-logos">

          <img
            src="assets/images/logo-001.png"
            alt="Organisation logo"
          >

          <img
            src="assets/images/letterhead.png"
            alt="Organisation logo"
          >

        </div>

      </footer>


    </div>

  `;


  openModal(
    "certificateModal"
  );

};

$("printCertificateBtn").onclick=()=>window.print();
async function restoreLearningSession() {

  try {

    const {
      data,
      error
    } = await supabaseClient.auth.getSession();

    if (error) {
      throw error;
    }


    const authSession =
      data?.session;

    const user =
      authSession?.user;

      const url =
  new URL(
    window.location.href
  );

const hashParams =
  new URLSearchParams(
    window.location.hash
      .replace(/^#/, "")
  );

// Invitation links sign the approved student into the portal.
// Password creation is handled separately by the password reset email.

    if (!user) {
      showPublic();
      return;
    }

    const {
      data: isAdmin,
      error: adminCheckError
    } = await supabaseClient.rpc(
      "is_learning_admin"
    );


    if (adminCheckError) {
      throw adminCheckError;
    }


    if (isAdmin === true) {

      session = {
        role: "admin",
        authUserId: user.id
      };

      await showAdmin();

      return;
    }

    const { error: linkError } = await supabaseClient.rpc('link_my_existing_learning_student');
    if (linkError) console.warn('Student account link could not be verified:', linkError.message);
    const student = await loadCurrentStudent(user.id);


    if (
      !student ||
      !student.active
    ) {

      await supabaseClient.auth.signOut();

      showPublic();

      return;
    }


    session = {
      role: "student",
      studentId: student.id,
      authUserId: user.id
    };


    await showStudent();

  } catch (error) {

    console.error(
      "Session restoration failed:",
      error
    );

    session = null;

    showPublic();
  }
}


async function initializeLearningPage() {

  const minimumLoadingTime =
    5000;

  const startedAt =
    Date.now();


  try {

    let recoveryHandled = false;
    try {
      recoveryHandled = await processPasswordRecoveryLink();
    } catch (error) {
      console.error("Password recovery link failed:", error);
      showPublic();
      openModal("loginModal");
      $("loginMessage").className = "form-message error";
      $("loginMessage").textContent = error?.message || "Password setup link is invalid. Request another link.";
      recoveryHandled = true;
    }
    if (!recoveryHandled) await restoreLearningSession();

  } finally {

    const elapsed =
      Date.now() -
      startedAt;


    const remaining =
      Math.max(
        0,
        minimumLoadingTime -
        elapsed
      );


    if (remaining > 0) {

      await new Promise(
        resolve =>
          setTimeout(
            resolve,
            remaining
          )
      );
    }


    const loader =
      $("learningPageLoader");


    if (loader) {

      loader.classList.add(
        "ready"
      );


      setTimeout(
        () =>
          loader.classList.add(
            "hidden"
          ),
        500
      );
    }

  }

}


initializeLearningPage();
