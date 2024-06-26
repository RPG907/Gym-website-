export var validationModifyDetails = function (infoToValidate) {
  let errorName = document.getElementById("errorName");
  let errorFirstName = document.getElementById("errorFirstName");
  let errorEmail = document.getElementById("errorEmail");
  let errorPhone = document.getElementById("errorPhone");
  let errorOldPassword = document.getElementById("oldPassword");
  let errorNewPassword = document.getElementById("errorNewPassword");
  let errorStreet = document.getElementById("errorStreet");
  let errorCity = document.getElementById("errorCity");
  let errorPostalCode = document.getElementById("errorPostalCode");

  errorName.innerText = "";
  errorFirstName.innerText = "";
  errorEmail.innerText = "";
  errorPhone.innerText = "";
  errorOldPassword.innerText = "";
  errorNewPassword.innerText = "";
  errorStreet.innerText = "";
  errorCity.innerText = "";
  errorPostalCode.innerText = "";

  let nameValid = validateName(infoToValidate.name);
  if (nameValid === false) {
    errorName.innerText = "Entrez un nom valide.";
  }

  let firstNameValid = validateName(infoToValidate.firstName);
  if (firstNameValid === false) {
    errorFirstName.innerText = "Entrez un prenom valide.";
  }

  let emailValid = isValidEmail(infoToValidate.email);
  if (emailValid === false) {
    errorEmail.innerText = "Entrez un courriel valide.";
  }

  let phoneValid = isValidPhoneNumber(infoToValidate.phone);
  if (phoneValid === false) {
    errorPhone.innerText = "Entrez un numéro valide (8196585495).";
  }

  let oldPsswdValid = isValidOldPassword(infoToValidate.oldPassword);
  if (oldPsswdValid === false) {
    errorOldPassword.innerText = "Mauvais mot de passe.";
  }

  let errorMessageForPassword = validatePassword(infoToValidate.newPassword);
  if (errorMessageForPassword !== "") {
    errorNewPassword.innerHTML = errorMessageForPassword;
  }

  let streetValid = validateName(infoToValidate.street);
  if (streetValid === false) {
    errorStreet.innerHTML = "Entrez le numéro civique et la rue.";
  }

  let cityValid = validateName(infoToValidate.city);
  if (cityValid === false) {
    errorCity.innerText = "Entrez une ville valide.";
  }

  let postalCodeValid = validateName(infoToValidate.countryCode);
  if (postalCodeValid === false) {
    errorPostalCode.innerText = "Entrez un code postal valide";
  }

  return (
    nameValid &&
    firstNameValid &&
    emailValid &&
    phoneValid &&
    oldPsswdValid &&
    errorMessageForPassword === "" &&
    streetValid &&
    cityValid &&
    postalCodeValid
  );
};

function validateName(name) {
  const trimmedName = name.trim();

  // Check if the name is empty or null after trimming
  if (trimmedName === "" || name === null) {
    return false;
  }
  return true;
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email);
}

function isValidPhoneNumber(phoneNumber) {
  const phoneRegex = /^(?:\d{10}|\d{11})$/;

  return phoneRegex.test(phoneNumber);
}

function isValidOldPassword(oldPassword) {
  if (oldPassword === "" || oldPassword === null) {
    return true;
  }
  //TODO: VALIDATE OLD PASSWD ON SERVER
  return true;
}

/**
 * Validates a password based on specified criteria and returns a message explaining why it is invalid.
 * @param {string} password - The password to validate.
 * @returns {string} - Returns an empty string if the password is valid, otherwise an error message.
 */
function validatePassword(password) {
  password = password.trim();
  if (password !== "") {
    // Minimum password length
    const minLength = 8;

    // Regular expressions to check for different criteria
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[\W_]/.test(password); // \W matches non-word characters; _ is explicitly added

    // Check the length of the password
    if (password.length < minLength) {
      return `Doit avoir au moins ${minLength} charactères.`;
    }

    // Check for at least one uppercase letter
    if (!hasUppercase) {
      return "Doit avoir au moins une lettre majuscule.";
    }

    // Check for at least one lowercase letter
    if (!hasLowercase) {
      return "Doit avoir au moins une lettre minuscule.";
    }

    // Check for at least one digit
    if (!hasDigit) {
      return "Doit avoir au moins un chiffre.";
    }

    // Check for at least one special character
    if (!hasSpecialChar) {
      return "Doit avoir au moins un charactère spécial.";
    }
  }

  // If all criteria are met, return an empty string (password is valid)
  return "";
}

export default validationModifyDetails;
