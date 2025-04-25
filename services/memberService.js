const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
const mongoose = require("mongoose");
const { generateTokens } = require("./authService.js");
const Member = require("../models/memberModel");
const {
  sendLoginDetailsEmail,
} = require("../utils/emailFunctions/SendLoginDetailsEmail");
const { generateRandomPassword } = require("../utils/generatePassword");
const { sendInviteEmail } = require("../utils/InviteMemberEmail.js");
const {
  sendJoinedClubEmail,
} = require("../utils/emailTemplates/sendJoinedClubEmail.js");
const {
  generateRandomSixDigitCode,
} = require("../utils/generateSixDigitCode.js");
const multer = require("multer");
const xlsx = require("xlsx");
const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");
const Club = require("../models/clubModel.js");

const processXLSXFile = (filePath) => {
  try {
    const workbook = xlsx.readFile(filePath);

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const jsonData = xlsx.utils.sheet_to_json(sheet);

    return jsonData;
  } catch (err) {
    console.error("Error processing XLSX file:", err.message);
    throw new Error("Error processing XLSX file: " + err.message);
  }
};
const processCSVFile = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        results.push(row);
      })
      .on("end", () => {
        console.log("CSV File processed successfully:", results);
        resolve(results);
      })
      .on("error", (err) => {
        console.error("Error processing CSV file:", err.message);
        reject(new Error("Error processing CSV file: " + err.message));
      });
  });
};

const addMember = async (memberData, clubId) => {
  try {
    const [existingMember, existingUser] = await Promise.all([
      Member.findOne({ email: memberData.email }),
      User.findOne({ email: memberData.email }),
    ]);

    if (existingMember || existingUser) {
      throw new Error("User with this email already exists");
    }

    if (
      memberData.customFields &&
      typeof memberData.customFields === "object" &&
      !Array.isArray(memberData.customFields)
    ) {
      memberData.customFields = { ...memberData.customFields };
    } else {
      memberData.customFields = {};
    }

    const club = await Club.findById(clubId);
    if (!club) throw new Error("Club not found");

    const newMember = await Member.create({
      ...memberData,
      club: clubId,
    });

    console.log("New member created:", newMember);

    const generatedPassword = generateRandomPassword(12);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(generatedPassword, salt);

    const fullName = `${memberData.firstName} ${memberData.lastName}`;

    const userExists = await User.findOne({ email: memberData.email });
    if (!userExists) {
      const newUser = await User.create({
        fullName,
        email: memberData.email,
        club: clubId,
        password: hashedPassword,
        role: "user",
        verified: true,
      });

      console.log("New user created for member:", newUser);

      const { accessToken, refreshToken } = generateTokens(
        newUser._id,
        newUser.role,
        "both"
      );

      const emailSent = await sendLoginDetailsEmail(
        memberData.email,
        fullName,
        generatedPassword,
        club.name
      );

      if (!emailSent || emailSent.message !== "Queued. Thank you.") {
        console.error(
          "❌ Failed to send login details email for:",
          memberData.email,
          emailSent
        );
      } else {
        console.log(
          "✅ Login details email sent successfully to:",
          memberData.email
        );
      }

      return {
        success: true,
        message:
          "Member added and user account created successfully. Login details sent to member's email.",
        data: {
          member: newMember,
          userId: newUser._id,
          accessToken,
          refreshToken,
        },
      };
    } else {
      return {
        success: true,
        message: "Member added successfully. User account already exists.",
        data: { member: newMember },
      };
    }
  } catch (error) {
    console.error("Add member error:", error);
    return { success: false, message: error.message || "Error adding member" };
  }
};

const updateMember = async (id, updateData) => {
  try {
    const member = await Member.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!member) {
      throw new Error("Member not found");
    }
    return {
      success: true,
      message: "Member updated successfully",
      data: member,
    };
  } catch (error) {
    console.error("Update member error:", error);
    return {
      success: false,
      message: error.message || "Error updating member",
    };
  }
};

const deleteMember = async (id) => {
  try {
    const member = await Member.findById(id);
    if (!member) {
      return { success: false, message: "Member not found" };
    }

    const user = await User.findOneAndDelete({ email: member.email });
    if (user) {
      console.log("Associated user deleted:", user);
    } else {
      console.log(
        "No associated user found for member with email:",
        member.email
      );
    }

    const deletedMember = await Member.findByIdAndDelete(id);
    if (!deletedMember) {
      return {
        success: false,
        message: "Error deleting member (member not found again)",
      };
    }

    return {
      success: true,
      message: "Member and associated user (if found) deleted successfully",
    };
  } catch (error) {
    console.error("Delete member error:", error);
    return {
      success: false,
      message: error.message || "Error deleting member and associated user",
    };
  }
};

const getAllMembers = async (clubId, filters = {}, search = "") => {
  try {
    if (!mongoose.Types.ObjectId.isValid(clubId)) {
      return { success: false, message: "Invalid clubId" };
    }

    const searchRegex = search ? new RegExp(search, "i") : null;

    const searchFilter = searchRegex
      ? {
          $or: [
            { firstName: searchRegex },
            { lastName: searchRegex },
            // { email: searchRegex },
          ],
        }
      : {};

    const query = {
      club: new mongoose.Types.ObjectId(clubId),
      ...filters,
      ...searchFilter,
    };

    const members = await Member.find(query);
    return { success: true, data: members };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const getMember = async (id) => {
  try {
    const member = await Member.findById(id);

    if (!member) throw new Error("Member not found");
    return { success: true, data: member };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
const inviteMember = async (data) => {
  const { email, clubId, membershipType, team, playerPosition } = data;

  try {
    const existing = await Member.findOne({ email });
    if (existing) {
      throw new Error("This member has already been invited or exists.");
    }

    const inviteCode = generateRandomSixDigitCode();

    const club = await Club.findById(clubId);
    if (!club) {
      throw new Error("Club not found.");
    }

    const member = await Member.create({
      email,
      club: clubId,
      membershipType,
      invited: true,
      inviteCode,
      team,
      playerPosition,
      status: "awaiting",
    });

    const emailSent = await sendInviteEmail(email, club.name, inviteCode);

    if (!emailSent) {
      throw new Error("Failed to send invitation email.");
    }

    return {
      success: true,
      message: "Invitation sent successfully.",
      data: member,
    };
  } catch (err) {
    console.error("Invite Member Error:", err);
    return {
      success: false,
      message: err.message || "Error inviting member.",
    };
  }
};

const signupInvitedMemberService = async ({
  email,
  inviteCode,
  firstName,
  lastName,
  password,
  dob,
  fatherName,
  fatherContactNo,
}) => {
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return {
        success: false,
        message: "A user already exists with this email.",
      };
    }

    const member = await Member.findOne({ email }).populate("club");
    if (!member || !member.invited) {
      return {
        success: false,
        message: "This email is not invited or does not exist.",
      };
    }

    if (member.inviteCode !== inviteCode) {
      return {
        success: false,
        message: "Invalid invite code.",
      };
    }

    member.dob = dob;
    member.firstName = firstName;
    member.lastName = lastName;
    member.fatherName = fatherName || "";
    member.fatherContactNo = fatherContactNo || "";

    member.status = "probation";
    member.invited = false;
    member.inviteCode = null;
    await member.save();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullName: `${firstName || ""} ${lastName || ""}`.trim(),
      email,
      password: hashedPassword,
      club: member.club._id,
      role: "user",
      verified: true,
    });

    await sendJoinedClubEmail(email, firstName, member.club.name);

    const { accessToken, refreshToken } = generateTokens(
      newUser._id,
      newUser.role,
      "both"
    );

    return {
      success: true,
      message: `Signup successful. You have joined ${member.club.name}.`,
      data: {
        memberId: member._id,
        userId: newUser._id,
        accessToken,
        refreshToken,
      },
    };
  } catch (error) {
    console.error("Signup Invited Member Service Error:", error);
    return {
      success: false,
      message: "Something went wrong during invited member signup.",
    };
  }
};

const upload = multer({ dest: "uploads/" });
const processFile = async (filePath, fileExt) => {
  try {
    let jsonData;

    if (fileExt === ".xlsx") {
      jsonData = await processXLSXFile(filePath);
    } else if (fileExt === ".csv") {
      jsonData = await processCSVFile(filePath);
    } else {
      throw new Error("Unsupported file type");
    }

    console.log("File processed successfully:", jsonData);

    jsonData = jsonData.filter(
      (row) => row.firstName && row.lastName && row.email
    );

    if (jsonData.length === 0) {
      throw new Error("No valid members found in the file.");
    }

    return jsonData;
  } catch (err) {
    console.error("Error processing file:", err.message);
    throw new Error("Error processing the file: " + err.message);
  }
};

const saveMembers = async (membersData, clubId) => {
  let successfulCount = 0;
  let failedMembers = [];
  let createdUsersCount = 0;
  let failedUserCreations = [];

  try {
    console.log("Saving the following members:", membersData);

    if (!Array.isArray(membersData) || membersData.length === 0) {
      throw new Error("No member data provided.");
    }

    const validMembers = membersData.filter((m) => {
      if (!m.firstName || !m.lastName || !m.email || !m.membershipType) {
        failedMembers.push({
          member: m,
          error:
            "Missing required fields: firstName, lastName, email, or membershipType",
        });
        return false;
      }
      return true;
    });

    if (validMembers.length === 0) {
      throw new Error("No valid members found in the file.");
    }

    const club = await Club.findById(clubId);
    if (!club) {
      throw new Error("Club not found.");
    }

    for (const memberData of validMembers) {
      try {
        const [existingMember, existingUser] = await Promise.all([
          Member.findOne({ email: memberData.email }),
          User.findOne({ email: memberData.email }),
        ]);

        if (existingMember || existingUser) {
          failedMembers.push({
            member: memberData,
            error: "User with this email already exists",
          });
          continue;
        }

        const newMember = await Member.create({
          club: clubId,
          firstName: memberData.firstName,
          lastName: memberData.lastName,
          email: memberData.email,
          membershipType: memberData.membershipType,
          dob: memberData.dob,
          status: memberData.status || "probation",
          customFields:
            memberData.customFields &&
            typeof memberData.customFields === "object" &&
            !Array.isArray(memberData.customFields)
              ? { ...memberData.customFields }
              : {},
        });
        console.log("New member created:", newMember);
        successfulCount++;

        const generatedPassword = generateRandomPassword(12);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(generatedPassword, salt);

        const fullName = `${memberData.firstName} ${memberData.lastName}`;

        const newUser = await User.create({
          fullName,
          email: memberData.email,
          password: hashedPassword,
          club: clubId,
          role: "user",
          verified: true,
        });
        console.log("New user created for member:", newUser);
        createdUsersCount++;

        const emailSent = await sendLoginDetailsEmail(
          memberData.email,
          fullName,
          generatedPassword,
          club.name
        );

        if (!emailSent || emailSent.message !== "Queued. Thank you.") {
          console.error(
            "❌ Failed to send login details email for:",
            memberData.email,
            emailSent
          );
          failedUserCreations.push({
            email: memberData.email,
            error: "Failed to send login details email",
          });
        } else {
          console.log("✅ Login details email sent to:", memberData.email);
        }
      } catch (error) {
        console.error(
          `Failed to process member: ${memberData.firstName} ${memberData.lastName}`,
          error.message
        );
        failedMembers.push({ member: memberData, error: error.message });
      }
    }

    return {
      success: true,
      message: `${successfulCount} members uploaded successfully. ${createdUsersCount} user accounts created and login details sent.`,
      insertedCount: successfulCount,
      createdUsersCount,
      failedMembers,
      failedUserCreations,
    };
  } catch (err) {
    console.error("Error saving members:", err.message);
    return {
      success: false,
      message: "Error saving members to the database: " + err.message,
    };
  }
};

const uploadMembers = async (filePath, fileExt, clubId) => {
  try {
    const membersData = await processFile(filePath, fileExt);

    const result = await saveMembers(membersData, clubId);
    return result;
  } catch (err) {
    console.error("Upload failed:", err.message);
    return { success: false, message: err.message };
  } finally {
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log("Deleted temporary file:", filePath);
      } catch (unlinkError) {
        console.error("Error deleting file:", unlinkError.message);
      }
    }
  }
};

module.exports = {
  inviteMember,
  upload,
  processFile,
  uploadMembers,
  signupInvitedMemberService,
  addMember,
  updateMember,
  deleteMember,
  getAllMembers,
  getMember,
};
