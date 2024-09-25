const { json } = require("express");
const {sociallyRestrictedSkills} = require("../utils/user")

module.exports.updateValidation = (data) => {
    if (data?.skills.length > 10)
      throw new Error("Skills must be less than 8");
  
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
      "password",
      "photoUrl",
    ];
  
    const isAllowedUpdates = Object.keys(data).every((k) =>
      allowedUpdates.includes(k)
    );
  
    if (!isAllowedUpdates)
        throw new Error("Some fields can't allow to update!");
  };