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
const path = require("path");
const csv = require("csv-parse/sync");

const processXLSXFile = (filePath) => {
  try {
    // Read the file using xlsx library
    const workbook = xlsx.readFile(filePath);

    // Get the first sheet
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert the sheet to JSON format
    const jsonData = xlsx.utils.sheet_to_json(sheet);

    // Log the raw data for debugging
    console.log("Raw JSON data from XLSX:", jsonData);

    return jsonData;
  } catch (err) {
    console.error("Error processing XLSX file:", err.message);
    throw new Error("Error processing XLSX file: " + err.message);
  }
};
const processCSVFile = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];

    // Create a readable stream from the file path
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        // Push each row of the CSV data into the results array
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

const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

const addMember = async (memberData, adminClubname, adminId) => {
  // Added adminId
  try {
    const [existingMember, existingUser] = await Promise.all([
      Member.findOne({ email: memberData.email }),
      User.findOne({ email: memberData.email }),
    ]);

    if (existingMember || existingUser) {
      throw new Error("User with this email already exists");
    }

    // Ensure customFields is stored as an object
    if (
      memberData.customFields &&
      typeof memberData.customFields === "object" &&
      !Array.isArray(memberData.customFields)
    ) {
      memberData.customFields = { ...memberData.customFields };
    } else {
      memberData.customFields = {};
    }

    const newMember = await Member.create({ ...memberData, adminId }); // Include adminId
    console.log("New member created:", newMember);

    // --- User Signup Logic ---
    const generatedPassword = generateRandomPassword(12); // Implement this
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(generatedPassword, salt);

    const fullName = `${memberData.firstName} ${memberData.lastName}`;
    const lowercaseClubname = adminClubname.toLowerCase(); // Use admin's clubname

    // Check if user exists
    const userExists = await User.findOne({ email: memberData.email });

    if (!userExists) {
      const newUser = await User.create({
        fullName,
        email: memberData.email,
        clubname: lowercaseClubname,
        password: hashedPassword,
        role: "user",
        verified: true,
      });
      console.log("New user created for member:", newUser);

      // Generate token
      const { accessToken, refreshToken } = generateTokens(
        newUser._id,
        newUser.role,
        "both"
      );

      // Send email with login details
      const emailSent = await sendLoginDetailsEmail(
        memberData.email,
        fullName,
        generatedPassword,
        lowercaseClubname
      ); // Implement this

      if (!emailSent || emailSent.message !== "Queued. Thank you.") {
        console.error(
          "❌ Failed to send login details email for:",
          memberData.email,
          emailSent
        );
        // Consider whether to throw an error or just log it.  If email sending is critical, throw.
        // throw new Error("Failed to send login details email");
      } else {
        console.log(
          "✅ Login details email sent successfully to:",
          memberData.email
        );
      }
      return {
        success: true,
        message:
          "Member added and user account created successfully.  Login details sent to member's email.",
        data: {
          member: newMember,
          userId: newUser._id,
          accessToken,
          refreshToken,
        }, // Include the token
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
    const member = await Member.findByIdAndDelete(id);
    if (!member) {
      throw new Error("Member not found");
    }
    return { success: true, message: "Member deleted successfully" };
  } catch (error) {
    console.error("Delete member error:", error);
    return {
      success: false,
      message: error.message || "Error deleting member",
    };
  }
};

const getAllMembers = async (adminId, filters = {}, search = "") => {
  try {
    if (!mongoose.Types.ObjectId.isValid(adminId)) {
      return { success: false, message: "Invalid adminId" };
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
      adminId: new mongoose.Types.ObjectId(adminId), // 👈 ensure it's the correct type
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
  const { email, adminId, clubname, membershipType, team } = data;

  try {
    // Check if already invited
    const existing = await Member.findOne({ email });
    if (existing) {
      throw new Error("This member has already been invited or exists.");
    }

    // Generate a 6-digit invite code
    const inviteCode = generateRandomSixDigitCode();

    const member = await Member.create({
      email,
      adminId,
      clubname,
      membershipType,
      invited: true,
      inviteCode,
      team,
      status: "awaiting",
    });

    // Send invite email with the code
    const emailSent = await sendInviteEmail(email, clubname, inviteCode);

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
  age,
  fatherName,
  fatherContactNo,
  motherName,
  motherContactNo,
}) => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return {
        success: false,
        message: "A user already exists with this email.",
      };
    }

    // Find invited member
    const member = await Member.findOne({ email });
    if (!member || !member.invited) {
      return {
        success: false,
        message: "This email is not invited or does not exist.",
      };
    }

    // Check if invite code matches
    if (member.inviteCode !== inviteCode) {
      return {
        success: false,
        message: "Invalid invite code.",
      };
    }

    // Update member fields
    member.age = age;
    member.firstName = firstName;
    member.lastName = lastName;
    member.fatherName = fatherName || "";
    member.fatherContactNo = fatherContactNo || "";
    member.motherName = motherName || "";
    member.motherContactNo = motherContactNo || "";
    member.status = "probation";
    member.invited = false;
    member.inviteCode = null; // Invalidate the code after use
    await member.save();

    // Hash password and create user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullName: `${member.firstName || ""} ${member.lastName || ""}`.trim(),
      email,
      password: hashedPassword,
      clubname: member.clubname.toLowerCase(),
      role: "user",
      verified: true,
    });

    // Send welcome email
    await sendJoinedClubEmail(email, member.firstName, member.clubname);

    const { accessToken, refreshToken } = generateTokens(
      newUser._id,
      newUser.role,
      "both"
    );
    return {
      success: true,
      message: `Signup successful. You have joined ${member.clubname}.`,
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

    // Process the file based on its extension
    if (fileExt === ".xlsx") {
      jsonData = await processXLSXFile(filePath);
    } else if (fileExt === ".csv") {
      jsonData = await processCSVFile(filePath);
    } else {
      throw new Error("Unsupported file type");
    }

    // Log the file content after processing
    console.log("File processed successfully:", jsonData);

    // Filter out rows with missing required fields
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

const saveMembers = async (membersData, adminId, clubname) => {
  let successfulCount = 0;
  let failedMembers = [];
  let createdUsersCount = 0;
  let failedUserCreations = [];

  try {
    console.log("Saving the following members:", membersData);

    const validMembers = membersData.filter(
      (m) => m.firstName && m.lastName && m.email
    );

    if (validMembers.length === 0) {
      throw new Error("No valid members found in the file.");
    }

    for (const memberData of validMembers) {
      try {
        // Check if member or user with this email already exists
        const [existingMember, existingUser] = await Promise.all([
          Member.findOne({ email: memberData.email }),
          User.findOne({ email: memberData.email }),
        ]);

        if (existingMember || existingUser) {
          failedMembers.push({
            member: memberData,
            error: "User with this email already exists",
          });
          continue; // Skip to the next member
        }

        const newMember = await Member.create({
          adminId,
          clubname,
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

        // --- User Signup Logic (similar to addMember) ---
        const generatedPassword = generateRandomPassword(12); // Implement this
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(generatedPassword, salt);

        const fullName = `${memberData.firstName} ${memberData.lastName}`;
        const lowercaseClubname = clubname.toLowerCase(); // Use the clubname passed to saveMembers

        const newUser = await User.create({
          fullName,
          email: memberData.email,
          clubname: lowercaseClubname,
          password: hashedPassword,
          role: "user",
          verified: true,
        });
        console.log("New user created for member:", newUser);
        createdUsersCount++;

        // Send email with login details
        const emailSent = await sendLoginDetailsEmail(
          memberData.email,
          fullName,
          generatedPassword,
          lowercaseClubname
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
          console.log(
            "✅ Login details email sent successfully to:",
            memberData.email
          );
        }
      } catch (error) {
        console.error(
          `Failed to insert member: ${memberData.firstName} ${memberData.lastName} or create user:`,
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
      failedMembers: failedMembers,
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

// Upload and process the members file
const uploadMembers = async (filePath, fileExt, adminId, clubname) => {
  try {
    const membersData = await processFile(filePath, fileExt);

    const result = await saveMembers(membersData, adminId, clubname);
    return result;
  } catch (err) {
    console.error("Upload failed:", err.message);
    return { success: false, message: err.message }; // Return failure without throwing an error
  } finally {
    // Clean up file
    if (fs.existsSync(filePath)) {
      console.log("Deleting temporary file:", filePath);
      try {
        fs.unlinkSync(filePath);
      } catch (unlinkError) {
        console.error("Error deleting file:", unlinkError.message);
      }
    } else {
      console.log("File already deleted or does not exist:", filePath);
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
