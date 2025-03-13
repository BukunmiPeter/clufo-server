const Member = require("../models/memberModel");

const addMember = async (memberData) => {
  try {
    const existingMember = await Member.findOne({ email: memberData.email });
    if (existingMember) {
      throw new Error("Member with this email already exists");
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

    const member = await Member.create(memberData);
    console.log("New member created:", member);

    return {
      success: true,
      message: "Member added successfully",
      data: member,
    };
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
const getAllMembers = async (filters = {}, search = "") => {
  try {
    const searchRegex = search ? new RegExp(search, "i") : null;

    const searchFilter = searchRegex
      ? {
          $or: [
            { firstName: searchRegex },
            { lastName: searchRegex },
            { email: searchRegex },
          ],
        }
      : {};

    const query = {
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

module.exports = {
  addMember,
  updateMember,
  deleteMember,
  getAllMembers,
  getMember,
};
