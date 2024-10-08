const validator = require("validator");
const { sociallyRestrictedSkills } = require("./mockData");

module.exports.signupValidation = (req) => {
  const { firstName, lastName, emailId, password } =
    req.body;

  if (!firstName || firstName.trim() === "")
    throw new Error(
      "First name cannot be empty or contain only spaces. Please provide a valid first name."
    );

  if (!lastName || lastName.trim() === "")
    throw new Error(
      "Last name cannot be empty or contain only spaces. Please provide a valid last name."
    );

  if (!emailId || emailId.trim() === "" || !validator.isEmail(emailId))
    throw new Error("Please provide a valid email address.");

  if (
    !password ||
    password.trim() === "" ||
    !validator.isStrongPassword(password)
  )
    throw new Error(
      "Please provide a valid password with the required strength."
    );

  // if (!age || isNaN(age)) throw new Error("Please provide your age.");

  // if (!gender || gender.trim() === "")
  //   throw new Error("Please specify your gender.");

  // if (!skills || skills.length === 0) {
  //   throw new Error("Please provide at least one skill.");
  // }

  // if (skills.length > 10) throw new Error("Skills must be less than 10");

  // skills.forEach((skill) => {
  //   const isSkillPresent = sociallyRestrictedSkills.includes(
  //     skill.toLowerCase()
  //   );
  //   if (isSkillPresent) throw new Error(`You can't add skills like ${skill}`);
  // });
};

module.exports.profileUpdateValidation = (req) => {
  const data = req.body;

  if (data?.skills.length < 2 || data?.skills.length > 10) throw new Error("Skills must be 2 to 10");

  const userSkill = data?.skills;
  userSkill.forEach((skill) => {
    const isSkillPresent = sociallyRestrictedSkills.includes(
      skill.toLowerCase()
    );
    if (isSkillPresent) throw new Error(`You can't add skills like ${skill}`);
  });

  const allowedUpdates = [
    "firstName",
    "lastName",
    "skills",
    "age",
    "gender",
    "about",
    "photoUrl",
  ];
  const isAllowedUpdates = Object.keys(data).every((k) =>
    allowedUpdates.includes(k)
  );

  return isAllowedUpdates;
};
