/**
 * ==============================================================================
 * Govt College of Multan - Admissions, Eligibility & Fee Calculator Portal
 * ==============================================================================
 * 
 * VIVA QUICK REFERENCE:
 * 1. COURSE_RATES (Object): Stores monthly fees for all 4 courses.
 * 2. calculateCourseFee(courseName, months) (Function):
 *    - Applies 5% discount for 3 months, 10% discount for 6+ months.
 *    - Returns { originalFee, discountPercent, discountAmount, finalFee }.
 * 3. evaluateEligibility(name, marks, course) (Function):
 *    - 70%+        -> Direct Admission
 *    - 50% to 69%  -> Eligible, counselling recommended
 *    - Below 50%   -> Contact admission counsellor
 * 4. LocalStorage Keys:
 *    - 'gcm_theme' -> stores user theme ('light' or 'dark')
 *    - 'gcm_multan_applications_2026' -> stores submitted student applications
 * ==============================================================================
 */

// Course Monthly Pricing Catalog
const COURSE_RATES = {
  'Web Development': 5000,
  'Graphic Design': 4000,
  'AI Course': 7000,
  'Freelancing': 3500
};

// LocalStorage Keys
const STORAGE_KEY_APPS = 'gcm_multan_applications_2026';
const STORAGE_KEY_THEME = 'gcm_theme';

/**
 * FEATURE #1: Student Admission Eligibility Checker Function
 * @param {string} name - Student Full Name
 * @param {number} marks - Percentage or Marks out of 100
 * @param {string} course - Desired Course Name
 * @returns {object} - Structured status, category, CSS class, and guidance message
 */
function evaluateEligibility(name, marks, course) {
  // Clamping marks safely between 0 and 100
  const numericMarks = parseFloat(marks) || 0;
  const safeMarks = Math.max(0, Math.min(100, numericMarks));

  let status = '';
  let category = '';
  let cssClass = '';
  let badgeClass = '';
  let alertClass = '';
  let advice = '';

  // Core Assignment Logic:
  // 70%+       -> Direct Admission
  // 50% - 69%  -> Eligible, counselling recommended
  // Below 50%  -> Contact admission counsellor
  if (safeMarks >= 70) {
    status = 'Direct Admission';
    category = 'Direct Merit Track';
    cssClass = 'result-direct';
    badgeClass = 'badge-success';
    alertClass = 'alert-success';
    advice = `🎉 <strong>Direct Admission Approved!</strong> ${name}'s score of <strong>${safeMarks.toFixed(1)}%</strong> exceeds the 70% threshold. You are eligible for immediate enrollment in <strong>${course}</strong>.`;
  } else if (safeMarks >= 50) {
    status = 'Eligible, counselling recommended';
    category = 'Counselling & Academic Guidance Track';
    cssClass = 'result-counsel';
    badgeClass = 'badge-warning';
    alertClass = 'alert-warning';
    advice = `📋 <strong>Eligible with Counselling:</strong> ${name}'s score is <strong>${safeMarks.toFixed(1)}%</strong> (between 50% and 69%). You are eligible for <strong>${course}</strong>. A short counselling orientation is recommended.`;
  } else {
    status = 'Contact admission counsellor';
    category = 'Foundation & Pre-Course Review';
    cssClass = 'result-counsellor';
    badgeClass = 'badge-danger';
    alertClass = 'alert-danger';
    advice = `⚠️ <strong>Counsellor Review Required:</strong> ${name}'s score of <strong>${safeMarks.toFixed(1)}%</strong> is below the 50% regular cutoff. Please contact our admission counsellor or click WhatsApp support to discuss foundation eligibility.`;
  }

  return {
    name: name || 'Student',
    marks: safeMarks,
    course: course || 'Web Development',
    status,
    category,
    cssClass,
    badgeClass,
    alertClass,
    advice
  };
}

/**
 * FEATURE #2: Fee Calculator Function
 * Calculates Original Fee, Duration Discount, and Final Payable Fee.
 * @param {string} courseName - Name of the course
 * @param {number} months - Duration in months (1, 3, 6, 12, etc.)
 * @returns {object} - Breakdown showing Original Fee -> Discount -> Final Fee
 */
function calculateCourseFee(courseName, months) {
  const monthlyRate = COURSE_RATES[courseName] || 5000;
  const numMonths = Math.max(1, parseInt(months, 10) || 1);

  // Original Fee = Monthly Rate * Number of Months
  const originalFee = monthlyRate * numMonths;

  // Assignment Discount Rules:
  // 3 months   -> 5% discount
  // 6+ months  -> 10% discount
  // Otherwise  -> 0% discount
  let discountPercent = 0;
  if (numMonths >= 6) {
    discountPercent = 10;
  } else if (numMonths >= 3) {
    discountPercent = 5;
  }

  const discountRate = discountPercent / 100;
  const discountAmount = Math.round(originalFee * discountRate);
  const finalFee = originalFee - discountAmount;
  const effectiveMonthly = Math.round(finalFee / numMonths);

  return {
    courseName,
    monthlyRate,
    numMonths,
    originalFee,
    discountPercent,
    discountAmount,
    finalFee,
    effectiveMonthly
  };
}

// ==============================================================================
// DOM Content Loaded - Interactive Event Handlers & Real-Time Sync
// ==============================================================================
document.addEventListener('DOMContentLoaded', () => {
  // ----------------------------------------------------------------------------
  // 1. Extra Feature: Dark / Light Mode Toggle
  // ----------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = document.getElementById('theme-icon');
  const htmlRoot = document.documentElement;

  // Retrieve saved theme or system preference
  const savedTheme = localStorage.getItem(STORAGE_KEY_THEME) || 'light';
  setTheme(savedTheme);

  function setTheme(theme) {
    htmlRoot.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY_THEME, theme);
    if (theme === 'dark') {
      themeIcon.textContent = '☀️';
      themeToggleBtn.setAttribute('title', 'Switch to Light Theme');
    } else {
      themeIcon.textContent = '🌙';
      themeToggleBtn.setAttribute('title', 'Switch to Dark Theme');
    }
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
    });
  }

  // ----------------------------------------------------------------------------
  // 2. Mobile Drawer Navigation
  // ----------------------------------------------------------------------------
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

    document.addEventListener('click', (e) => {
      if (
        mobileNavDrawer.classList.contains('active') &&
        !mobileNavDrawer.contains(e.target) &&
        !mobileMenuToggle.contains(e.target)
      ) {
        toggleMobileMenu(false);
      }
    });
  }

  // ----------------------------------------------------------------------------
  // 3. Hero Quick Eligibility Checker Widget
  // ----------------------------------------------------------------------------
  const heroNameInput = document.getElementById('hero-student-name');
  const heroMarksInput = document.getElementById('hero-student-marks');
  const heroCourseInput = document.getElementById('hero-student-course');
  const heroPctDisplay = document.getElementById('hero-pct-display');
  const heroProgressFill = document.getElementById('hero-progress-fill');
  const heroResultBox = document.getElementById('hero-result-box');
  const heroStatusIcon = document.getElementById('hero-status-icon');
  const heroStatusTitle = document.getElementById('hero-status-title');
  const heroStatusDesc = document.getElementById('hero-status-desc');

  function updateHeroChecker() {
    if (!heroMarksInput) return;
    const name = heroNameInput ? heroNameInput.value.trim() : 'Student';
    const marks = parseFloat(heroMarksInput.value) || 0;
    const course = heroCourseInput ? heroCourseInput.value : 'Web Development';

    const result = evaluateEligibility(name, marks, course);
    heroPctDisplay.textContent = `${result.marks.toFixed(1)}%`;
    heroProgressFill.style.width = `${result.marks}%`;

    if (result.marks >= 70) {
      heroProgressFill.className = 'progress-fill eligible';
      heroResultBox.className = 'eligibility-status-box status-direct';
      heroStatusIcon.textContent = '✓';
      heroStatusTitle.textContent = `Direct Admission (${result.marks.toFixed(1)}%)`;
      heroStatusDesc.textContent = `Congratulations! You qualify for direct enrollment in ${result.course}.`;
    } else if (result.marks >= 50) {
      heroProgressFill.className = 'progress-fill counsel';
      heroResultBox.className = 'eligibility-status-box status-counsel';
      heroStatusIcon.textContent = 'ℹ';
      heroStatusTitle.textContent = `Eligible, Counselling Recommended (${result.marks.toFixed(1)}%)`;
      heroStatusDesc.textContent = `Eligible for ${result.course}. Orientation guidance session recommended.`;
    } else {
      heroProgressFill.className = 'progress-fill ineligible';
      heroResultBox.className = 'eligibility-status-box status-low';
      heroStatusIcon.textContent = '✕';
      heroStatusTitle.textContent = `Contact Admission Counsellor (${result.marks.toFixed(1)}%)`;
      heroStatusDesc.textContent = `Marks are below 50%. Please connect with our counsellor for guidance.`;
    }
  }

  if (heroMarksInput) {
    heroMarksInput.addEventListener('input', updateHeroChecker);
    if (heroNameInput) heroNameInput.addEventListener('input', updateHeroChecker);
    if (heroCourseInput) heroCourseInput.addEventListener('change', updateHeroChecker);
    updateHeroChecker();
  }

  // ----------------------------------------------------------------------------
  // 4. Standalone Student Admission Eligibility Checker (Core Feature #1)
  // ----------------------------------------------------------------------------
  const checkNameInput = document.getElementById('check-name');
  const checkMarksInput = document.getElementById('check-marks');
  const checkCourseInput = document.getElementById('check-course');
  const evaluateCheckerBtn = document.getElementById('evaluate-checker-btn');

  // Result Elements
  const checkerOutputCard = document.getElementById('checker-output-card');
  const resultStatusBadge = document.getElementById('result-status-badge');
  const resultScorePill = document.getElementById('result-score-pill');
  const resultStudentName = document.getElementById('result-student-name');
  const resultCourseName = document.getElementById('result-course-name');
  const resultCategory = document.getElementById('result-category');
  const evalProgressBar = document.getElementById('eval-progress-bar');
  const resultAdviceBox = document.getElementById('result-advice-box');
  const resultAdviceText = document.getElementById('result-advice-text');

  const copyToCalcBtn = document.getElementById('copy-to-calculator-btn');
  const copyToFormBtn = document.getElementById('copy-to-form-btn');

  function runStandaloneEligibilityCheck() {
    const name = checkNameInput.value.trim() || 'Student';
    const marks = parseFloat(checkMarksInput.value) || 0;
    const course = checkCourseInput.value;

    const result = evaluateEligibility(name, marks, course);

    // Update Output Card
    checkerOutputCard.className = `result-display-card ${result.cssClass}`;
    resultStatusBadge.className = `badge-status ${result.badgeClass}`;
    resultStatusBadge.textContent = result.status;
    resultScorePill.textContent = `Score: ${result.marks.toFixed(1)}%`;
    resultStudentName.textContent = result.name;
    resultCourseName.textContent = result.course;
    resultCategory.textContent = result.category;

    // Progress Bar Fill Color
    evalProgressBar.style.width = `${result.marks}%`;
    if (result.marks >= 70) {
      evalProgressBar.className = 'eval-progress-fill fill-green';
      resultCategory.className = 'detail-val text-success';
    } else if (result.marks >= 50) {
      evalProgressBar.className = 'eval-progress-fill fill-amber';
      resultCategory.className = 'detail-val text-warning';
    } else {
      evalProgressBar.className = 'eval-progress-fill fill-red';
      resultCategory.className = 'detail-val text-danger';
    }

    resultAdviceBox.className = `result-advice-alert ${result.alertClass}`;
    resultAdviceText.innerHTML = result.advice;

    return result;
  }

  if (evaluateCheckerBtn) {
    evaluateCheckerBtn.addEventListener('click', runStandaloneEligibilityCheck);
  }

  // Action Buttons from Eligibility Result Card
  if (copyToCalcBtn) {
    copyToCalcBtn.addEventListener('click', () => {
      const course = checkCourseInput.value;
      const calcCourseSelect = document.getElementById('calc-course');
      if (calcCourseSelect) {
        calcCourseSelect.value = course;
        updateFeeCalculator();
      }
      document.getElementById('fee-calculator-section').scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (copyToFormBtn) {
    copyToFormBtn.addEventListener('click', () => {
      const name = checkNameInput.value.trim();
      const marks = checkMarksInput.value;
      const course = checkCourseInput.value;

      const formName = document.getElementById('applicant-name');
      const formMarks = document.getElementById('form-marks');
      const formCourse = document.getElementById('form-course-select');

      if (formName && name) formName.value = name;
      if (formMarks && marks) formMarks.value = marks;
      if (formCourse && course) formCourse.value = course;

      updateAdmissionFormLive();
      document.getElementById('admission-form-section').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // ----------------------------------------------------------------------------
  // 5. Course Fee Calculator (Core Feature #2)
  // ----------------------------------------------------------------------------
  const calcCourseSelect = document.getElementById('calc-course');
  const durationButtons = document.querySelectorAll('.duration-btn');
  let selectedDurationMonths = 3; // Default 3 months

  // Fee Display Elements
  const calcCourseLabel = document.getElementById('calc-course-label');
  const calcDurationLabel = document.getElementById('calc-duration-label');
  const calcMonthlyRate = document.getElementById('calc-monthly-rate');
  const calcMonthsCount = document.getElementById('calc-months-count');
  const calcOriginalFee = document.getElementById('calc-original-fee');
  const calcDiscountPercent = document.getElementById('calc-discount-percent');
  const calcDiscountAmount = document.getElementById('calc-discount-amount');
  const calcFinalFee = document.getElementById('calc-final-fee');
  const calcEffectiveMonthly = document.getElementById('calc-effective-monthly');

  // Step Chain Elements: Original -> Discount -> Final
  const chainOriginal = document.getElementById('chain-original');
  const chainDiscount = document.getElementById('chain-discount');
  const chainFinal = document.getElementById('chain-final');
  const applyWithFeeBtn = document.getElementById('apply-with-fee-btn');

  function updateFeeCalculator() {
    const course = calcCourseSelect ? calcCourseSelect.value : 'Web Development';
    const months = selectedDurationMonths;

    const feeBreakdown = calculateCourseFee(course, months);

    // Update labels and math
    if (calcCourseLabel) calcCourseLabel.textContent = feeBreakdown.courseName;
    if (calcDurationLabel) calcDurationLabel.textContent = `${feeBreakdown.numMonths} Month${feeBreakdown.numMonths > 1 ? 's' : ''} Plan`;
    if (calcMonthlyRate) calcMonthlyRate.textContent = `Rs. ${feeBreakdown.monthlyRate.toLocaleString()} / mo`;
    if (calcMonthsCount) calcMonthsCount.textContent = feeBreakdown.numMonths;
    if (calcOriginalFee) calcOriginalFee.textContent = `Rs. ${feeBreakdown.originalFee.toLocaleString()}`;
    if (calcDiscountPercent) calcDiscountPercent.textContent = `${feeBreakdown.discountPercent}%`;

    if (calcDiscountAmount) {
      calcDiscountAmount.textContent = feeBreakdown.discountAmount > 0
        ? `- Rs. ${feeBreakdown.discountAmount.toLocaleString()}`
        : 'Rs. 0';
    }

    if (calcFinalFee) calcFinalFee.textContent = `Rs. ${feeBreakdown.finalFee.toLocaleString()}`;
    if (calcEffectiveMonthly) calcEffectiveMonthly.textContent = `Rs. ${feeBreakdown.effectiveMonthly.toLocaleString()} / mo`;

    // Update 3-Step Visual Chain: Original Fee -> Discount -> Final Fee
    if (chainOriginal) chainOriginal.textContent = `Rs. ${feeBreakdown.originalFee.toLocaleString()}`;
    if (chainDiscount) {
      chainDiscount.textContent = feeBreakdown.discountPercent > 0
        ? `- Rs. ${feeBreakdown.discountAmount.toLocaleString()} (${feeBreakdown.discountPercent}%)`
        : 'Rs. 0 (0%)';
    }
    if (chainFinal) chainFinal.textContent = `Rs. ${feeBreakdown.finalFee.toLocaleString()}`;

    return feeBreakdown;
  }

  // Duration button clicks
  durationButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      durationButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      selectedDurationMonths = parseInt(btn.getAttribute('data-months'), 10) || 1;
      updateFeeCalculator();
    });
  });

  if (calcCourseSelect) {
    calcCourseSelect.addEventListener('change', updateFeeCalculator);
  }

  // Apply with calculated plan -> transfers course and duration to Admission Form
  if (applyWithFeeBtn) {
    applyWithFeeBtn.addEventListener('click', () => {
      const course = calcCourseSelect.value;
      const formCourse = document.getElementById('form-course-select');
      const formDuration = document.getElementById('form-duration-select');

      if (formCourse) formCourse.value = course;
      if (formDuration) formDuration.value = selectedDurationMonths.toString();

      updateAdmissionFormLive();
      document.getElementById('admission-form-section').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Course Cards "Select & Calculate Fee" Buttons
  const selectCourseButtons = document.querySelectorAll('.select-course-action');
  selectCourseButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const courseName = btn.getAttribute('data-course');
      if (calcCourseSelect) {
        calcCourseSelect.value = courseName;
        updateFeeCalculator();
      }
      const formCourse = document.getElementById('form-course-select');
      if (formCourse) formCourse.value = courseName;
      updateAdmissionFormLive();
      document.getElementById('fee-calculator-section').scrollIntoView({ behavior: 'smooth' });
    });
  });

  // ----------------------------------------------------------------------------
  // 6. Admission Application Form & Live Sidebar Sync
  // ----------------------------------------------------------------------------
  const admissionForm = document.getElementById('admission-form');
  const applicantNameInput = document.getElementById('applicant-name');
  const applicantEmailInput = document.getElementById('applicant-email');
  const applicantPhoneInput = document.getElementById('applicant-phone');
  const applicantCityInput = document.getElementById('applicant-city');
  const formMarksInput = document.getElementById('form-marks');
  const formCourseSelect = document.getElementById('form-course-select');
  const formDurationSelect = document.getElementById('form-duration-select');

  // Live Eligibility Gate inside Form
  const formGateBanner = document.getElementById('form-eligibility-gate');
  const formGateBadge = document.getElementById('form-gate-badge');
  const formGateHeading = document.getElementById('form-gate-heading');
  const formGateMessage = document.getElementById('form-gate-message');

  // Sidebar Summary Elements
  const sumName = document.getElementById('sum-name');
  const sumMarks = document.getElementById('sum-marks');
  const sumEligibility = document.getElementById('sum-eligibility');
  const sumCourse = document.getElementById('sum-course');
  const sumDuration = document.getElementById('sum-duration');
  const sumOriginalFee = document.getElementById('sum-original-fee');
  const sumDiscount = document.getElementById('sum-discount');
  const sumFinalFee = document.getElementById('sum-final-fee');

  function updateAdmissionFormLive() {
    const name = applicantNameInput ? applicantNameInput.value.trim() : 'Student';
    const marks = formMarksInput ? parseFloat(formMarksInput.value) || 0 : 70;
    const course = formCourseSelect ? formCourseSelect.value : 'Web Development';
    const duration = formDurationSelect ? parseInt(formDurationSelect.value, 10) || 3 : 3;

    // Evaluate eligibility
    const elig = evaluateEligibility(name, marks, course);

    // Update Gate inside Form
    if (formGateBanner) {
      if (elig.marks >= 70) {
        formGateBanner.className = 'live-eligibility-gate gate-pass';
        formGateBadge.className = 'gate-pill pill-pass';
        formGateBadge.textContent = 'DIRECT ADMISSION';
        formGateHeading.textContent = `Marks: ${elig.marks.toFixed(1)}% → Direct Admission Approved`;
        formGateMessage.textContent = 'Your marks qualify for direct enrollment. Complete your application below.';
      } else if (elig.marks >= 50) {
        formGateBanner.className = 'live-eligibility-gate gate-counsel';
        formGateBadge.className = 'gate-pill pill-counsel';
        formGateBadge.textContent = 'COUNSELLING TRACK';
        formGateHeading.textContent = `Marks: ${elig.marks.toFixed(1)}% → Eligible, Counselling Recommended`;
        formGateMessage.textContent = 'You qualify for admission. A brief orientation session will be scheduled.';
      } else {
        formGateBanner.className = 'live-eligibility-gate gate-fail';
        formGateBadge.className = 'gate-pill pill-fail';
        formGateBadge.textContent = 'COUNSELLOR REVIEW';
        formGateHeading.textContent = `Marks: ${elig.marks.toFixed(1)}% → Contact Admission Counsellor`;
        formGateMessage.textContent = 'Marks are below 50%. You may still submit; our counsellor will reach out.';
      }
    }

    // Calculate Fees for Sidebar
    const feeInfo = calculateCourseFee(course, duration);

    // Update Sidebar
    if (sumName) sumName.textContent = name || 'Not entered yet';
    if (sumMarks) sumMarks.textContent = `${elig.marks.toFixed(1)}%`;
    if (sumEligibility) {
      if (elig.marks >= 70) {
        sumEligibility.innerHTML = '<span class="badge-mini pass">Direct Admission</span>';
      } else if (elig.marks >= 50) {
        sumEligibility.innerHTML = '<span class="badge-mini counsel">Counselling Track</span>';
      } else {
        sumEligibility.innerHTML = '<span class="badge-mini fail">Counsellor Review</span>';
      }
    }
    if (sumCourse) sumCourse.textContent = feeInfo.courseName;
    if (sumDuration) sumDuration.textContent = `${feeInfo.numMonths} Month${feeInfo.numMonths > 1 ? 's' : ''}`;
    if (sumOriginalFee) sumOriginalFee.textContent = `Rs. ${feeInfo.originalFee.toLocaleString()}`;
    if (sumDiscount) {
      sumDiscount.textContent = feeInfo.discountAmount > 0
        ? `- Rs. ${feeInfo.discountAmount.toLocaleString()} (${feeInfo.discountPercent}%)`
        : 'Rs. 0 (0%)';
    }
    if (sumFinalFee) sumFinalFee.textContent = `Rs. ${feeInfo.finalFee.toLocaleString()}`;

    return { elig, feeInfo };
  }

  // Attach live listeners to form fields
  if (applicantNameInput) applicantNameInput.addEventListener('input', updateAdmissionFormLive);
  if (formMarksInput) formMarksInput.addEventListener('input', updateAdmissionFormLive);
  if (formCourseSelect) formCourseSelect.addEventListener('change', updateAdmissionFormLive);
  if (formDurationSelect) formDurationSelect.addEventListener('change', updateAdmissionFormLive);

  // ----------------------------------------------------------------------------
  // 7. Demo Preset Buttons (Instant Viva Testing)
  // ----------------------------------------------------------------------------
  const presetDirectBtn = document.getElementById('preset-direct');
  const presetCounselBtn = document.getElementById('preset-counsel');
  const presetCounsellorBtn = document.getElementById('preset-counsellor');

  function fillPreset(name, email, phone, marks, course, duration) {
    if (applicantNameInput) applicantNameInput.value = name;
    if (applicantEmailInput) applicantEmailInput.value = email;
    if (applicantPhoneInput) applicantPhoneInput.value = phone;
    if (formMarksInput) formMarksInput.value = marks;
    if (formCourseSelect) formCourseSelect.value = course;
    if (formDurationSelect) formDurationSelect.value = duration.toString();

    // Also sync eligibility and fee calculators
    if (checkNameInput) checkNameInput.value = name;
    if (checkMarksInput) checkMarksInput.value = marks;
    if (checkCourseInput) checkCourseInput.value = course;

    if (calcCourseSelect) calcCourseSelect.value = course;
    selectedDurationMonths = duration;
    durationButtons.forEach((btn) => {
      if (parseInt(btn.getAttribute('data-months'), 10) === duration) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    runStandaloneEligibilityCheck();
    updateFeeCalculator();
    updateAdmissionFormLive();
  }

  if (presetDirectBtn) {
    presetDirectBtn.addEventListener('click', () => {
      fillPreset('Hamza Tariq', 'hamza.tariq@student.edu.pk', '+92 300 6543210', 82, 'AI Course', 6);
    });
  }

  if (presetCounselBtn) {
    presetCounselBtn.addEventListener('click', () => {
      fillPreset('Ayesha Fatima', 'ayesha.fatima@gmail.com', '+92 321 8112233', 62, 'Web Development', 3);
    });
  }

  if (presetCounsellorBtn) {
    presetCounsellorBtn.addEventListener('click', () => {
      fillPreset('Bilal Raza', 'bilal.raza@example.com', '+92 333 9220112', 44, 'Graphic Design', 1);
    });
  }

  // ----------------------------------------------------------------------------
  // 8. Basic Form Validation & Application Submission
  // ----------------------------------------------------------------------------
  const errName = document.getElementById('err-name');
  const errEmail = document.getElementById('err-email');
  const errPhone = document.getElementById('err-phone');
  const errMarks = document.getElementById('err-marks');

  function validateAdmissionForm() {
    let isValid = true;

    // Validate Name
    const name = applicantNameInput.value.trim();
    if (!name || name.length < 3) {
      if (errName) errName.classList.add('active');
      isValid = false;
    } else {
      if (errName) errName.classList.remove('active');
    }

    // Validate Email
    const email = applicantEmailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      if (errEmail) errEmail.classList.add('active');
      isValid = false;
    } else {
      if (errEmail) errEmail.classList.remove('active');
    }

    // Validate Phone
    const phone = applicantPhoneInput.value.trim();
    if (!phone || phone.length < 10) {
      if (errPhone) errPhone.classList.add('active');
      isValid = false;
    } else {
      if (errPhone) errPhone.classList.remove('active');
    }

    // Validate Marks (0 to 100)
    const marks = parseFloat(formMarksInput.value);
    if (isNaN(marks) || marks < 0 || marks > 100) {
      if (errMarks) errMarks.classList.add('active');
      isValid = false;
    } else {
      if (errMarks) errMarks.classList.remove('active');
    }

    return isValid;
  }

  if (admissionForm) {
    admissionForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!validateAdmissionForm()) {
        return;
      }

      const { elig, feeInfo } = updateAdmissionFormLive();

      const newApplication = {
        id: `GCM-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        submittedAt: new Date().toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        name: applicantNameInput.value.trim(),
        email: applicantEmailInput.value.trim(),
        phone: applicantPhoneInput.value.trim(),
        city: applicantCityInput.value.trim() || 'Multan',
        marks: elig.marks,
        status: elig.status,
        category: elig.category,
        course: feeInfo.courseName,
        duration: `${feeInfo.numMonths} Month${feeInfo.numMonths > 1 ? 's' : ''}`,
        originalFee: feeInfo.originalFee,
        discountPercent: feeInfo.discountPercent,
        discountAmount: feeInfo.discountAmount,
        finalFee: feeInfo.finalFee
      };

      const savedApps = getSavedApplications();
      savedApps.unshift(newApplication);
      localStorage.setItem(STORAGE_KEY_APPS, JSON.stringify(savedApps));

      renderApplicationsDirectory();
      openReceiptDialog(newApplication);
    });

    admissionForm.addEventListener('reset', () => {
      setTimeout(() => {
        updateAdmissionFormLive();
      }, 10);
    });
  }

  // ----------------------------------------------------------------------------
  // 9. Extra Feature: Local Storage & Applications Directory
  // ----------------------------------------------------------------------------
  const applicationsListEl = document.getElementById('applications-list');
  const navAppCountEl = document.getElementById('nav-app-count');
  const mobileNavAppCountEl = document.getElementById('mobile-nav-app-count');
  const clearAppsBtn = document.getElementById('clear-apps-btn');

  function getSavedApplications() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_APPS);
      if (raw) return JSON.parse(raw);
    } catch (err) {
      console.error(err);
    }
    // Default seed application
    const seed = [
      {
        id: 'GCM-2026-4819',
        submittedAt: 'Sep 28, 2026, 08:30 PM',
        name: 'Zainab Qureshi',
        email: 'zainab.qureshi@student.edu.pk',
        phone: '+92 301 4506789',
        city: 'Multan',
        marks: 88.5,
        status: 'Direct Admission',
        category: 'Direct Merit Track',
        course: 'AI Course',
        duration: '6 Months',
        originalFee: 42000,
        discountPercent: 10,
        discountAmount: 4200,
        finalFee: 37800
      }
    ];
    localStorage.setItem(STORAGE_KEY_APPS, JSON.stringify(seed));
    return seed;
  }

  function renderApplicationsDirectory() {
    const apps = getSavedApplications();
    if (navAppCountEl) navAppCountEl.textContent = apps.length;
    if (mobileNavAppCountEl) mobileNavAppCountEl.textContent = apps.length;
    if (!applicationsListEl) return;

    applicationsListEl.innerHTML = '';

    if (apps.length === 0) {
      applicationsListEl.innerHTML = `
        <div class="app-record-card">
          <h4>No applications saved yet</h4>
          <p style="color: var(--text-secondary); font-size: 0.9rem;">
            Submit an admission application above to generate an official voucher record.
          </p>
        </div>
      `;
      return;
    }

    apps.forEach((app) => {
      const card = document.createElement('article');
      card.className = 'app-record-card';
      const badgeClass = app.marks >= 70 ? 'pass' : app.marks >= 50 ? 'counsel' : 'fail';

      card.innerHTML = `
        <div class="app-record-top">
          <span class="app-id-code">${app.id}</span>
          <span class="badge-mini ${badgeClass}">${app.marks.toFixed(1)}% • ${app.status}</span>
        </div>
        <div>
          <h4>${app.name}</h4>
          <p style="font-size: 0.84rem; color: var(--text-secondary);">
            <strong>${app.course}</strong> (${app.duration})
          </p>
        </div>
        <div class="app-record-meta">
          <div><span>Original Fee:</span> <strong>Rs. ${app.originalFee.toLocaleString()}</strong></div>
          <div><span>Discount:</span> <strong class="text-success">Rs. ${app.discountAmount.toLocaleString()} (${app.discountPercent}%)</strong></div>
          <div><span>Final Fee:</span> <strong>Rs. ${app.finalFee.toLocaleString()}</strong></div>
          <div><span>City:</span> <strong>${app.city}</strong></div>
        </div>
        <button type="button" class="btn btn-outline btn-sm view-receipt-btn">
          View Admission Slip
        </button>
      `;

      card.querySelector('.view-receipt-btn').addEventListener('click', () => {
        openReceiptDialog(app);
      });

      applicationsListEl.appendChild(card);
    });
  }

  if (clearAppsBtn) {
    clearAppsBtn.addEventListener('click', () => {
      localStorage.setItem(STORAGE_KEY_APPS, JSON.stringify([]));
      renderApplicationsDirectory();
    });
  }

  // ----------------------------------------------------------------------------
  // 10. Extra Feature: Printable Official Admission Slip Modal Dialog
  // ----------------------------------------------------------------------------
  const receiptDialog = document.getElementById('receipt-dialog');
  const receiptBody = document.getElementById('receipt-body');
  const receiptStamp = document.getElementById('receipt-stamp');
  const printReceiptBtn = document.getElementById('print-receipt-btn');
  const closeReceiptBtn = document.getElementById('close-receipt-btn');

  function openReceiptDialog(app) {
    if (!receiptDialog || !receiptBody) return;

    if (receiptStamp) {
      receiptStamp.textContent = app.status.toUpperCase();
      receiptStamp.className = app.marks >= 70
        ? 'receipt-status-stamp'
        : app.marks >= 50
        ? 'receipt-status-stamp badge-warning'
        : 'receipt-status-stamp badge-danger';
    }

    receiptBody.innerHTML = `
      <div class="receipt-grid">
        <div class="receipt-item">
          <span>Application Voucher ID</span>
          <strong>${app.id}</strong>
        </div>
        <div class="receipt-item">
          <span>Submission Time</span>
          <strong>${app.submittedAt}</strong>
        </div>
        <div class="receipt-item">
          <span>Student Full Name</span>
          <strong>${app.name}</strong>
        </div>
        <div class="receipt-item">
          <span>Phone / WhatsApp</span>
          <strong>${app.phone}</strong>
        </div>
        <div class="receipt-item">
          <span>Selected Course</span>
          <strong>${app.course}</strong>
        </div>
        <div class="receipt-item">
          <span>Enrolled Duration</span>
          <strong>${app.duration}</strong>
        </div>
        <div class="receipt-item">
          <span>Academic Score</span>
          <strong>${app.marks.toFixed(1)}% (${app.status})</strong>
        </div>
        <div class="receipt-item">
          <span>Admission Category</span>
          <strong>${app.category}</strong>
        </div>
        <div class="receipt-item">
          <span>Original Total Fee</span>
          <strong>Rs. ${app.originalFee.toLocaleString()}</strong>
        </div>
        <div class="receipt-item">
          <span>Duration Discount Applied</span>
          <strong class="text-success">- Rs. ${app.discountAmount.toLocaleString()} (${app.discountPercent}% Off)</strong>
        </div>
        <div class="receipt-item" style="grid-column: 1 / -1; background: var(--primary-soft); padding: 0.75rem; border-radius: 6px;">
          <span>Total Final Fee Payable</span>
          <strong style="color: var(--primary); font-size: 1.2rem;">Rs. ${app.finalFee.toLocaleString()}</strong>
        </div>
      </div>
      <p style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 0.75rem;">
        Please bring this provisional admission slip with your CNIC / B-Form and previous marksheets to the Govt College of Multan Admissions Office.
      </p>
    `;

    if (typeof receiptDialog.showModal === 'function') {
      receiptDialog.showModal();
    }
  }

  if (closeReceiptBtn && receiptDialog) {
    closeReceiptBtn.addEventListener('click', () => receiptDialog.close());
  }

  if (printReceiptBtn) {
    printReceiptBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // ----------------------------------------------------------------------------
  // 11. Initial State Setup
  // ----------------------------------------------------------------------------
  runStandaloneEligibilityCheck();
  updateFeeCalculator();
  updateAdmissionFormLive();
  renderApplicationsDirectory();
});
