const MINIMUM_CUTOFF_PERCENT = 60.0;
const STORAGE_KEY = 'gcm_multan_applications_2026';

const PROGRAM_CATALOG = {
  'B.Tech': {
    title: 'B.Tech — Bachelor of Technology',
    baseFee: 2400,
    specializations: [
      'Computer Science & Engineering',
      'Artificial Intelligence & Data Science',
      'Electronics & Communication Engg',
      'Mechanical & Robotics Engineering'
    ]
  },
  'B.Sc': {
    title: 'B.Sc — Bachelor of Science (Honors)',
    baseFee: 1500,
    specializations: [
      'Computer Science (Honors)',
      'Biotechnology & Genetics',
      'Physics & Astrophysics',
      'Mathematics & Data Analytics'
    ]
  },
  'B.Com': {
    title: 'B.Com — Bachelor of Commerce',
    baseFee: 1350,
    specializations: [
      'Accounting & Corporate Finance',
      'Banking, FinTech & Insurance',
      'Corporate Secretaryship',
      'International Business & Taxation'
    ]
  },
  'B.A': {
    title: 'B.A — Bachelor of Arts (Honors)',
    baseFee: 1200,
    specializations: [
      'Economics & Public Policy',
      'Clinical & Applied Psychology',
      'English Literature & Journalism',
      'Political Science & International Relations'
    ]
  }
};

// Evaluate marks against the mandatory 60% cutoff and scholarship tiers
function evaluateMarksEligibility(obtained, max) {
  const safeMax = max > 0 ? max : 500;
  const clampedObtained = Math.max(0, Math.min(obtained, safeMax));
  const percentage = Number(((clampedObtained / safeMax) * 100).toFixed(2));
  const isEligible = percentage >= MINIMUM_CUTOFF_PERCENT;

  let tierName = 'Below Minimum Cutoff (< 60%)';
  let scholarshipRate = 0;
  let scholarshipLabel = 'Not Eligible for Admission';

  if (percentage >= 90) {
    tierName = "Chancellor's Honors Merit (90%+)";
    scholarshipRate = 0.50;
    scholarshipLabel = "50% Chancellor's Merit Scholarship";
  } else if (percentage >= 75) {
    tierName = "First Class with Distinction (75%–89.9%)";
    scholarshipRate = 0.25;
    scholarshipLabel = "25% Dean's Distinction Scholarship";
  } else if (percentage >= MINIMUM_CUTOFF_PERCENT) {
    tierName = 'Standard General Merit (60%–74.9%)';
    scholarshipRate = 0;
    scholarshipLabel = 'Standard Merit Eligible (0% Fee Waiver)';
  }

  return {
    obtained: clampedObtained,
    max: safeMax,
    percentage,
    isEligible,
    tierName,
    scholarshipRate,
    scholarshipLabel
  };
}

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements - Quick Checker
  const quickObtainedInput = document.getElementById('quick-obtained');
  const quickMaxInput = document.getElementById('quick-max');
  const quickPctDisplay = document.getElementById('quick-pct-display');
  const quickProgressFill = document.getElementById('quick-progress-fill');
  const quickResultBox = document.getElementById('quick-result-box');
  const quickStatusIcon = document.getElementById('quick-status-icon');
  const quickStatusTitle = document.getElementById('quick-status-title');
  const quickStatusDesc = document.getElementById('quick-status-desc');
  const quickTransferBtn = document.getElementById('quick-transfer-btn');

  // DOM Elements - Admission Form
  const admissionForm = document.getElementById('admission-form');
  const applicantNameInput = document.getElementById('applicant-name');
  const marksModeRadios = document.querySelectorAll('input[name="marksMode"]');
  const panelAggregate = document.getElementById('mode-aggregate-panel');
  const panelSubjects = document.getElementById('mode-subjects-panel');
  const marksObtainedInput = document.getElementById('marks-obtained');
  const marksMaxInput = document.getElementById('marks-max');
  const calculatedPctInput = document.getElementById('calculated-percentage');
  const subjectInputs = document.querySelectorAll('.subject-input');

  // Form Eligibility Banner Elements
  const gateBanner = document.getElementById('form-eligibility-banner');
  const gateBadge = document.getElementById('gate-badge');
  const gateHeading = document.getElementById('gate-heading');
  const gateScholarship = document.getElementById('gate-scholarship');
  const gateProgressFill = document.getElementById('gate-progress-fill');
  const gateMessage = document.getElementById('gate-message');
  const submitBtn = document.getElementById('submit-application-btn');
  const submitLockNotice = document.getElementById('submit-lock-notice');

  // Program & Specialization Selectors
  const programSelect = document.getElementById('program-select');
  const specializationSelect = document.getElementById('specialization-select');
  const selectProgramButtons = document.querySelectorAll('.select-program-btn');

  // Live Summary Sidebar Elements
  const sumName = document.getElementById('sum-name');
  const sumProgram = document.getElementById('sum-program');
  const sumSpec = document.getElementById('sum-spec');
  const sumMarks = document.getElementById('sum-marks');
  const sumEligibility = document.getElementById('sum-eligibility');
  const sumBaseFee = document.getElementById('sum-base-fee');
  const sumDiscount = document.getElementById('sum-discount');
  const sumNetFee = document.getElementById('sum-net-fee');

  // Applications Directory & Receipt Modal
  const applicationsListEl = document.getElementById('applications-list');
  const navAppCountEl = document.getElementById('nav-app-count');
  const mobileNavAppCountEl = document.getElementById('mobile-nav-app-count');
  const clearAppsBtn = document.getElementById('clear-apps-btn');
  const receiptDialog = document.getElementById('receipt-dialog');
  const receiptBody = document.getElementById('receipt-body');
  const printReceiptBtn = document.getElementById('print-receipt-btn');
  const closeReceiptBtn = document.getElementById('close-receipt-btn');

  // Mobile Menu Drawer Elements
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileNavDrawer = document.getElementById('mobile-nav-drawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link, .mobile-nav-close-trigger');

  if (mobileMenuToggle && mobileNavDrawer) {
    function toggleMobileMenu(forceState) {
      const isCurrentlyOpen = mobileNavDrawer.classList.contains('active');
      const shouldOpen = forceState !== undefined ? forceState : !isCurrentlyOpen;

      if (shouldOpen) {
        mobileNavDrawer.classList.add('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'true');
        mobileNavDrawer.setAttribute('aria-hidden', 'false');
      } else {
        mobileNavDrawer.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileNavDrawer.setAttribute('aria-hidden', 'true');
      }
    }

    mobileMenuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });

    mobileNavLinks.forEach((link) => {
      link.addEventListener('click', () => {
        toggleMobileMenu(false);
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (
        mobileNavDrawer.classList.contains('active') &&
        !mobileNavDrawer.contains(e.target) &&
        !mobileMenuToggle.contains(e.target)
      ) {
        toggleMobileMenu(false);
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNavDrawer.classList.contains('active')) {
        toggleMobileMenu(false);
      }
    });
  }

  // 1. Quick Eligibility Checker Logic
  function updateQuickChecker() {
    const obtained = parseFloat(quickObtainedInput.value) || 0;
    const max = parseFloat(quickMaxInput.value) || 500;
    const result = evaluateMarksEligibility(obtained, max);

    quickPctDisplay.textContent = `${result.percentage.toFixed(2)}%`;
    quickProgressFill.style.width = `${Math.min(100, result.percentage)}%`;

    if (result.isEligible) {
      quickProgressFill.className = 'progress-fill eligible';
      quickResultBox.className = 'eligibility-status-box status-eligible';
      quickStatusIcon.textContent = '✓';
      quickStatusTitle.textContent = `Eligible for All UG Programs (${result.percentage.toFixed(1)}%)`;
      quickStatusDesc.textContent =
        result.scholarshipRate > 0
          ? `Exceeds the 60% cutoff! Qualifies for ${result.scholarshipLabel}.`
          : `Meets the mandatory 60.0% minimum passing cutoff for B.Tech, B.Sc, B.Com & B.A.`;
    } else {
      const shortfall = (MINIMUM_CUTOFF_PERCENT - result.percentage).toFixed(2);
      quickProgressFill.className = 'progress-fill ineligible';
      quickResultBox.className = 'eligibility-status-box status-ineligible';
      quickStatusIcon.textContent = '✕';
      quickStatusTitle.textContent = `Not Eligible (${result.percentage.toFixed(1)}% < 60% Cutoff)`;
      quickStatusDesc.textContent = `Short by ${shortfall}%. A minimum of 60.0% aggregate marks is required to submit the admission form.`;
    }
  }

  quickObtainedInput.addEventListener('input', updateQuickChecker);
  quickMaxInput.addEventListener('input', updateQuickChecker);

  quickTransferBtn.addEventListener('click', () => {
    // Set aggregate mode and copy values into the Admission Form
    document.querySelector('input[name="marksMode"][value="aggregate"]').checked = true;
    panelAggregate.classList.remove('hidden');
    panelSubjects.classList.add('hidden');

    marksObtainedInput.value = quickObtainedInput.value;
    marksMaxInput.value = quickMaxInput.value;
    updateFormMarksAndEligibility();

    document.getElementById('admission-form-section').scrollIntoView({ behavior: 'smooth' });
  });

  // 2. Populate Specializations when Program Changes
  function populateSpecializations(programCode) {
    const prog = PROGRAM_CATALOG[programCode] || PROGRAM_CATALOG['B.Tech'];
    specializationSelect.innerHTML = '';
    prog.specializations.forEach((spec) => {
      const opt = document.createElement('option');
      opt.value = spec;
      opt.textContent = spec;
      specializationSelect.appendChild(opt);
    });
    updateFormMarksAndEligibility();
  }

  programSelect.addEventListener('change', (e) => {
    populateSpecializations(e.target.value);
  });

  specializationSelect.addEventListener('change', updateFormMarksAndEligibility);
  applicantNameInput.addEventListener('input', updateFormMarksAndEligibility);

  // Program Card "Select & Apply" buttons
  selectProgramButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const progCode = btn.getAttribute('data-program');
      programSelect.value = progCode;
      populateSpecializations(progCode);
      document.getElementById('admission-form-section').scrollIntoView({ behavior: 'smooth' });
    });
  });

  // 3. Marks Mode Switcher (Aggregate vs 5-Subject Breakdown)
  marksModeRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
      const mode = document.querySelector('input[name="marksMode"]:checked').value;
      if (mode === 'subjects') {
        panelSubjects.classList.remove('hidden');
        panelAggregate.classList.add('hidden');
        syncSubjectsToAggregate();
      } else {
        panelAggregate.classList.remove('hidden');
        panelSubjects.classList.add('hidden');
        updateFormMarksAndEligibility();
      }
    });
  });

  function syncSubjectsToAggregate() {
    let sum = 0;
    subjectInputs.forEach((inp) => {
      const val = Math.max(0, Math.min(100, parseFloat(inp.value) || 0));
      sum += val;
    });
    marksObtainedInput.value = sum;
    marksMaxInput.value = 500;
    updateFormMarksAndEligibility();
  }

  subjectInputs.forEach((inp) => {
    inp.addEventListener('input', syncSubjectsToAggregate);
  });

  marksObtainedInput.addEventListener('input', updateFormMarksAndEligibility);
  marksMaxInput.addEventListener('input', updateFormMarksAndEligibility);

  // 4. Core Form Eligibility Gate & Live Sidebar Update
  function updateFormMarksAndEligibility() {
    const obtained = parseFloat(marksObtainedInput.value) || 0;
    const max = parseFloat(marksMaxInput.value) || 500;
    const evalResult = evaluateMarksEligibility(obtained, max);

    calculatedPctInput.value = `${evalResult.percentage.toFixed(2)}%`;
    gateProgressFill.style.width = `${Math.min(100, evalResult.percentage)}%`;

    if (evalResult.isEligible) {
      gateBanner.className = 'live-eligibility-gate gate-pass';
      gateBadge.className = 'gate-pill pill-pass';
      gateBadge.textContent = 'ELIGIBLE (≥ 60%)';
      gateHeading.textContent = `Marks Criteria Met: ${evalResult.percentage.toFixed(2)}% Aggregate`;
      gateScholarship.textContent = evalResult.scholarshipLabel;
      gateMessage.innerHTML = `Your score of <strong>${evalResult.obtained} / ${evalResult.max} (${evalResult.percentage.toFixed(2)}%)</strong> satisfies the mandatory <strong>60.0% minimum cutoff</strong>. Admission form submission is unlocked.`;

      submitBtn.disabled = false;
      submitLockNotice.classList.add('hidden');
    } else {
      const neededMarks = Math.ceil((MINIMUM_CUTOFF_PERCENT / 100) * evalResult.max);
      gateBanner.className = 'live-eligibility-gate gate-fail';
      gateBadge.className = 'gate-pill pill-fail';
      gateBadge.textContent = 'INELIGIBLE (< 60%)';
      gateHeading.textContent = `Below 60% Cutoff: ${evalResult.percentage.toFixed(2)}% Aggregate`;
      gateScholarship.textContent = 'Minimum 60.0% Required';
      gateMessage.innerHTML = `Your score of <strong>${evalResult.obtained} / ${evalResult.max} (${evalResult.percentage.toFixed(2)}%)</strong> is below the mandatory <strong>60.0% minimum passing criteria</strong> (requires at least <strong>${neededMarks} / ${evalResult.max}</strong>). Form submission is locked.`;

      submitBtn.disabled = true;
      submitLockNotice.classList.remove('hidden');
    }

    // Update Sticky Summary Sidebar
    const progCode = programSelect.value || 'B.Tech';
    const progInfo = PROGRAM_CATALOG[progCode] || PROGRAM_CATALOG['B.Tech'];
    const discountAmount = Math.round(progInfo.baseFee * evalResult.scholarshipRate);
    const netFee = progInfo.baseFee - discountAmount;

    sumName.textContent = applicantNameInput.value.trim() || 'Not entered yet';
    sumProgram.textContent = progCode;
    sumSpec.textContent = specializationSelect.value || progInfo.specializations[0];
    sumMarks.textContent = `${evalResult.obtained} / ${evalResult.max} (${evalResult.percentage.toFixed(2)}%)`;
    sumEligibility.innerHTML = evalResult.isEligible
      ? '<span class="badge-mini pass">Eligible (≥ 60%)</span>'
      : '<span class="badge-mini fail">Ineligible (< 60%)</span>';

    sumBaseFee.textContent = `$${progInfo.baseFee.toLocaleString()} / yr`;
    sumDiscount.textContent =
      discountAmount > 0
        ? `- $${discountAmount.toLocaleString()} (${evalResult.scholarshipRate * 100}% Off)`
        : '$0 (Standard Tier)';
    sumNetFee.textContent = `$${netFee.toLocaleString()} / yr`;

    return evalResult;
  }

  // 5. Demo Preset Buttons (One-click test cases)
  document.getElementById('preset-eligible').addEventListener('click', () => {
    fillDemoPreset({
      name: 'Hamza Tariq',
      dob: '2008-04-12',
      email: 'hamza.tariq@studentmail.edu.pk',
      phone: '+92 300 6543210',
      gender: 'Male',
      guardian: 'Tariq Mahmood',
      address: 'House 42, Gulgasht Colony, Multan',
      board: 'BISE Multan',
      year: '2026',
      roll: 'BISEM26-88412',
      obtained: 410,
      max: 500,
      program: 'B.Tech',
      sop: 'Regional Science Olympiad winner; built an automated solar tracking prototype.'
    });
  });

  document.getElementById('preset-scholar').addEventListener('click', () => {
    fillDemoPreset({
      name: 'Ayesha Fatima',
      dob: '2008-08-23',
      email: 'ayesha.fatima@scholar.edu.pk',
      phone: '+92 321 8112233',
      gender: 'Female',
      guardian: 'Dr. Usman Gillani',
      address: '19 Model Town, Block B, Multan',
      board: 'BISE Multan',
      year: '2026',
      roll: 'BISEM26-99204',
      obtained: 465,
      max: 500,
      program: 'B.Sc',
      sop: 'Board position holder in Biology & Chemistry; research project in plant genetics.'
    });
  });

  document.getElementById('preset-ineligible').addEventListener('click', () => {
    fillDemoPreset({
      name: 'Bilal Raza',
      dob: '2008-01-19',
      email: 'bilal.raza@example.com',
      phone: '+92 333 9220112',
      gender: 'Male',
      guardian: 'Raza Hussain',
      address: '78 Cantt Area, Multan',
      board: 'BISE Multan',
      year: '2026',
      roll: 'BISEM26-31094',
      obtained: 270,
      max: 500,
      program: 'B.Com',
      sop: 'Interested in corporate accounting and entrepreneurship.'
    });
  });

  function fillDemoPreset(data) {
    document.querySelector('input[name="marksMode"][value="aggregate"]').checked = true;
    panelAggregate.classList.remove('hidden');
    panelSubjects.classList.add('hidden');

    applicantNameInput.value = data.name;
    document.getElementById('applicant-dob').value = data.dob;
    document.getElementById('applicant-email').value = data.email;
    document.getElementById('applicant-phone').value = data.phone;
    document.getElementById('applicant-gender').value = data.gender;
    document.getElementById('guardian-name').value = data.guardian;
    document.getElementById('applicant-address').value = data.address;
    document.getElementById('exam-board').value = data.board;
    document.getElementById('passing-year').value = data.year;
    document.getElementById('roll-number').value = data.roll;
    marksObtainedInput.value = data.obtained;
    marksMaxInput.value = data.max;
    programSelect.value = data.program;
    populateSpecializations(data.program);
    document.getElementById('applicant-sop').value = data.sop;

    updateFormMarksAndEligibility();
  }

  // 6. Form Submission & Receipt Modal
  admissionForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const evalResult = updateFormMarksAndEligibility();
    if (!evalResult.isEligible) {
      gateBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    if (!admissionForm.checkValidity()) {
      admissionForm.reportValidity();
      return;
    }

    const progCode = programSelect.value;
    const progInfo = PROGRAM_CATALOG[progCode];
    const discountAmount = Math.round(progInfo.baseFee * evalResult.scholarshipRate);
    const netFee = progInfo.baseFee - discountAmount;

    const appRecord = {
      id: `GCM-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      submittedAt: new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      name: applicantNameInput.value.trim(),
      dob: document.getElementById('applicant-dob').value,
      email: document.getElementById('applicant-email').value.trim(),
      phone: document.getElementById('applicant-phone').value.trim(),
      gender: document.getElementById('applicant-gender').value,
      guardian: document.getElementById('guardian-name').value.trim(),
      board: document.getElementById('exam-board').value,
      passingYear: document.getElementById('passing-year').value,
      rollNumber: document.getElementById('roll-number').value.trim(),
      obtained: evalResult.obtained,
      max: evalResult.max,
      percentage: evalResult.percentage,
      tierName: evalResult.tierName,
      scholarshipLabel: evalResult.scholarshipLabel,
      program: progCode,
      specialization: specializationSelect.value,
      hostel: document.getElementById('hostel-preference').value,
      netFee
    };

    const saved = getSavedApplications();
    saved.unshift(appRecord);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));

    renderApplicationsDirectory();
    openReceiptDialog(appRecord);
  });

  admissionForm.addEventListener('reset', () => {
    setTimeout(() => {
      populateSpecializations('B.Tech');
      updateFormMarksAndEligibility();
    }, 10);
  });

  // 7. Applications Storage & Directory Rendering
  function getSavedApplications() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (err) {
      console.error(err);
    }
    // Seed with 1 sample application on first load so the directory looks alive
    const initialSeed = [
      {
        id: 'GCM-2026-4819',
        submittedAt: 'Sep 28, 2026, 06:30 PM',
        name: 'Zainab Qureshi',
        dob: '2008-03-15',
        email: 'zainab.qureshi@student.edu.pk',
        phone: '+92 301 4506789',
        gender: 'Female',
        guardian: 'Salman Qureshi',
        board: 'BISE Multan',
        passingYear: '2026',
        rollNumber: 'BISEM26-11209',
        obtained: 442,
        max: 500,
        percentage: 88.4,
        tierName: 'First Class with Distinction (75%–89.9%)',
        scholarshipLabel: "25% Dean's Distinction Scholarship",
        program: 'B.Tech',
        specialization: 'Artificial Intelligence & Data Science',
        hostel: 'On-Campus Hostel Required',
        netFee: 1800
      }
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialSeed));
    return initialSeed;
  }

  function renderApplicationsDirectory() {
    const apps = getSavedApplications();
    if (navAppCountEl) navAppCountEl.textContent = apps.length;
    if (mobileNavAppCountEl) mobileNavAppCountEl.textContent = apps.length;
    applicationsListEl.innerHTML = '';

    if (apps.length === 0) {
      applicationsListEl.innerHTML = `
        <div class="app-record-card">
          <h4>No applications stored yet</h4>
          <p style="color: var(--text-secondary); font-size: 0.9rem;">
            Complete and submit the Undergraduate Admission Form above (with &ge; 60% marks) to generate an official application record.
          </p>
        </div>
      `;
      return;
    }

    apps.forEach((app) => {
      const card = document.createElement('article');
      card.className = 'app-record-card';
      card.innerHTML = `
        <div class="app-record-top">
          <span class="app-id-code">${app.id}</span>
          <span class="badge-mini pass">${app.percentage.toFixed(2)}% • Eligible</span>
        </div>
        <div>
          <h4>${app.name}</h4>
          <p style="font-size: 0.84rem; color: var(--text-secondary);">
            <strong>${app.program}</strong> — ${app.specialization}
          </p>
        </div>
        <div class="app-record-meta">
          <div><span>10+2 Marks:</span> <strong>${app.obtained}/${app.max}</strong></div>
          <div><span>Board:</span> <strong>${app.board} (${app.passingYear})</strong></div>
          <div><span>Merit Status:</span> <strong>${app.scholarshipLabel}</strong></div>
          <div><span>Net Tuition:</span> <strong>$${app.netFee.toLocaleString()}/yr</strong></div>
        </div>
        <button type="button" class="btn btn-outline btn-sm view-receipt-btn">
          View Official Admission Slip
        </button>
      `;
      card.querySelector('.view-receipt-btn').addEventListener('click', () => {
        openReceiptDialog(app);
      });
      applicationsListEl.appendChild(card);
    });
  }

  clearAppsBtn.addEventListener('click', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    renderApplicationsDirectory();
  });

  function openReceiptDialog(app) {
    receiptBody.innerHTML = `
      <div class="receipt-grid">
        <div class="receipt-item">
          <span>Application ID</span>
          <strong>${app.id}</strong>
        </div>
        <div class="receipt-item">
          <span>Submission Timestamp</span>
          <strong>${app.submittedAt}</strong>
        </div>
        <div class="receipt-item">
          <span>Applicant Full Name</span>
          <strong>${app.name}</strong>
        </div>
        <div class="receipt-item">
          <span>Parent / Guardian</span>
          <strong>${app.guardian}</strong>
        </div>
        <div class="receipt-item">
          <span>Degree &amp; Specialization</span>
          <strong>${app.program} (${app.specialization})</strong>
        </div>
        <div class="receipt-item">
          <span>Qualifying Exam Board &amp; Roll No.</span>
          <strong>${app.board} • ${app.rollNumber}</strong>
        </div>
        <div class="receipt-item">
          <span>12th Standard Aggregate Score</span>
          <strong>${app.obtained} / ${app.max} (${app.percentage.toFixed(2)}%)</strong>
        </div>
        <div class="receipt-item">
          <span>Minimum Cutoff Verification</span>
          <strong style="color: var(--success);">PASSED (&ge; 60.0% Cutoff Met)</strong>
        </div>
        <div class="receipt-item">
          <span>Merit Scholarship Awarded</span>
          <strong>${app.scholarshipLabel}</strong>
        </div>
        <div class="receipt-item">
          <span>Net Annual Tuition Payable</span>
          <strong>$${app.netFee.toLocaleString()} / Academic Year</strong>
        </div>
      </div>
      <p style="font-size: 0.82rem; color: var(--text-secondary);">
        Please present this provisional admission receipt along with your original HSSC / 12th marksheet during physical document verification at the Govt College of Multan Admissions Office.
      </p>
    `;
    if (typeof receiptDialog.showModal === 'function') {
      receiptDialog.showModal();
    }
  }

  closeReceiptBtn.addEventListener('click', () => receiptDialog.close());
  printReceiptBtn.addEventListener('click', () => window.print());

  // Initialize Page State
  populateSpecializations('B.Tech');
  updateQuickChecker();
  updateFormMarksAndEligibility();
  renderApplicationsDirectory();
});
