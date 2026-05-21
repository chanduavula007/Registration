// ===== Validation Helpers =====

function showError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(fieldId + 'Error');
  if (field) {
    field.classList.add('invalid');
    field.classList.remove('valid');
  }
  if (error) error.textContent = message;
}

function showValid(fieldId) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(fieldId + 'Error');
  if (field) {
    field.classList.add('valid');
    field.classList.remove('invalid');
  }
  if (error) error.textContent = '';
}

function clearState(fieldId) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(fieldId + 'Error');
  if (field) {
    field.classList.remove('valid', 'invalid');
  }
  if (error) error.textContent = '';
}

// ===== Individual Field Validators =====

function validateField(id, rules) {
  const el = document.getElementById(id);
  if (!el) return true;
  const value = el.value.trim();

  for (const rule of rules) {
    if (rule.type === 'required' && !value) {
      showError(id, rule.message || 'This field is required.');
      return false;
    }
    if (rule.type === 'minLength' && value.length < rule.value) {
      showError(id, rule.message || `Minimum ${rule.value} characters required.`);
      return false;
    }
    if (rule.type === 'pattern' && !rule.value.test(value)) {
      showError(id, rule.message || 'Invalid format.');
      return false;
    }
  }

  showValid(id);
  return true;
}

// ===== Full Form Validation =====

function validateForm() {
  let isValid = true;

  // First Name
  if (!validateField('firstName', [
    { type: 'required', message: 'First name is required.' },
    { type: 'minLength', value: 2, message: 'Must be at least 2 characters.' }
  ])) isValid = false;

  // Last Name
  if (!validateField('lastName', [
    { type: 'required', message: 'Last name is required.' },
    { type: 'minLength', value: 2, message: 'Must be at least 2 characters.' }
  ])) isValid = false;

  // Date of Birth
  const dobEl = document.getElementById('dob');
  if (!dobEl.value) {
    showError('dob', 'Date of birth is required.');
    isValid = false;
  } else {
    const dob = new Date(dobEl.value);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    if (age < 5 || age > 100) {
      showError('dob', 'Please enter a valid date of birth.');
      isValid = false;
    } else {
      showValid('dob');
    }
  }

  // Gender
  if (!validateField('gender', [{ type: 'required', message: 'Please select a gender.' }])) isValid = false;

  // Email
  if (!validateField('email', [
    { type: 'required', message: 'Email is required.' },
    { type: 'pattern', value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address.' }
  ])) isValid = false;

  // Phone
  if (!validateField('phone', [
    { type: 'required', message: 'Phone number is required.' },
    { type: 'pattern', value: /^[\+]?[\d\s\-\(\)]{7,15}$/, message: 'Enter a valid phone number.' }
  ])) isValid = false;

  // Address
  if (!validateField('address', [{ type: 'required', message: 'Address is required.' }])) isValid = false;

  // City
  if (!validateField('city', [{ type: 'required', message: 'City is required.' }])) isValid = false;

  // Enrollment Year
  if (!validateField('enrollmentYear', [{ type: 'required', message: 'Please select an enrollment year.' }])) isValid = false;

  // Department
  if (!validateField('department', [{ type: 'required', message: 'Please select a department.' }])) isValid = false;

  // Program
  if (!validateField('program', [{ type: 'required', message: 'Please select a program.' }])) isValid = false;

  // Emergency Name
  if (!validateField('emergencyName', [{ type: 'required', message: 'Emergency contact name is required.' }])) isValid = false;

  // Relationship
  if (!validateField('relationship', [{ type: 'required', message: 'Please select a relationship.' }])) isValid = false;

  // Emergency Phone
  if (!validateField('emergencyPhone', [
    { type: 'required', message: 'Emergency phone is required.' },
    { type: 'pattern', value: /^[\+]?[\d\s\-\(\)]{7,15}$/, message: 'Enter a valid phone number.' }
  ])) isValid = false;

  // Terms
  const terms = document.getElementById('terms');
  const termsError = document.getElementById('termsError');
  if (!terms.checked) {
    termsError.textContent = 'You must agree to the terms and conditions.';
    isValid = false;
  } else {
    termsError.textContent = '';
  }

  return isValid;
}

// ===== Generate Student ID =====

function generateStudentId() {
  const year = new Date().getFullYear();
  const random = Math.floor(10000 + Math.random() * 90000);
  return `STU-${year}-${random}`;
}

// ===== Modal =====

function showModal(name) {
  const modal = document.getElementById('successModal');
  const msg = document.getElementById('modalMessage');
  msg.textContent = `Welcome, ${name}! Your registration has been submitted successfully. Your Student ID: ${generateStudentId()}`;
  modal.classList.add('active');
}

function closeModal() {
  document.getElementById('successModal').classList.remove('active');
}

// Close modal on overlay click
document.getElementById('successModal').addEventListener('click', function (e) {
  if (e.target === this) closeModal();
});

// ===== Form Submit =====

document.getElementById('registrationForm').addEventListener('submit', function (e) {
  e.preventDefault();

  if (validateForm()) {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    showModal(`${firstName} ${lastName}`);
  } else {
    // Scroll to first error
    const firstInvalid = document.querySelector('.invalid');
    if (firstInvalid) {
      firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      firstInvalid.focus();
    }
  }
});

// ===== Live Validation on Blur =====

const liveFields = [
  'firstName', 'lastName', 'email', 'phone', 'address',
  'city', 'emergencyName', 'emergencyPhone',
  'gender', 'dob', 'enrollmentYear', 'department', 'program', 'relationship'
];

liveFields.forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener('blur', () => {
      // Trigger mini-validation on blur
      if (el.value.trim()) {
        showValid(id);
      }
    });
    el.addEventListener('input', () => {
      if (el.classList.contains('invalid') && el.value.trim()) {
        el.classList.remove('invalid');
        el.classList.add('valid');
        const err = document.getElementById(id + 'Error');
        if (err) err.textContent = '';
      }
    });
  }
});

// ===== Reset clears validation states =====

document.getElementById('registrationForm').addEventListener('reset', function () {
  setTimeout(() => {
    liveFields.forEach(id => clearState(id));
    document.getElementById('termsError').textContent = '';
  }, 0);
});
