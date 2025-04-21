const {
  addMember,
  updateMember,
  deleteMember,
  getAllMembers,
  getMember,
  inviteMember,
  signupInvitedMemberService,
  processFile,
  uploadMembers,
} = require("../services/memberService");
const path = require("path");
const fs = require("fs");

const addMemberController = async (req, res) => {
  try {
    const { clubId, ...memberData } = req.body;

    const response = await addMember(memberData, clubId);

    res.status(response.success ? 201 : 400).json(response);
  } catch (error) {
    console.error("Add Member Controller Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateMemberController = async (req, res) => {
  const { id } = req.params;
  const response = await updateMember(id, req.body);
  res.status(response.success ? 200 : 400).json(response);
};

const deleteMemberController = async (req, res) => {
  const { id } = req.params;
  const response = await deleteMember(id);
  res.status(response.success ? 200 : 400).json(response);
};
const getAllMembersController = async (req, res) => {
  const { search, ...filters } = req.query;
  const clubId = req.headers.clubid;

  if (!clubId) {
    return res
      .status(400)
      .json({ success: false, message: "clubId is required" });
  }

  const response = await getAllMembers(clubId, filters, search);
  res.status(response.success ? 200 : 400).json(response);
};

const getMemberController = async (req, res) => {
  const response = await getMember(req.params.id);
  res.status(response.success ? 200 : 400).json(response);
};

const inviteMemberController = async (req, res) => {
  const data = req.body;
  const result = await inviteMember(data);
  if (!result.success) {
    return res.status(400).json({ success: false, message: result.message });
  }

  return res.status(200).json(result);
};

const signupInvitedMemberController = async (req, res) => {
  try {
    const response = await signupInvitedMemberService(req.body);
    res.status(response.success ? 201 : 400).json(response);
  } catch (error) {
    console.error("Signup Invited Member Controller Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const uploadFileController = async (req, res) => {
  try {
    const file = req.file;
    const clubId = req.headers.clubid; // Use clubId from headers

    console.log("Uploaded file object:", file);
    console.log("clubId:", clubId);

    if (!file) {
      console.log("No file was uploaded.");
      return res.status(400).json({ error: "No file uploaded" });
    }

    if (!clubId) {
      console.log("No clubId provided.");
      return res.status(400).json({ error: "clubId is required" });
    }

    const filePath = file.path;
    const fileExt = path.extname(file.originalname || "").toLowerCase();

    console.log("File path:", filePath);
    console.log("File extension:", fileExt);

    if (!filePath || !fileExt) {
      console.log("Invalid file path or extension.");
      return res.status(400).json({ error: "Invalid file path or extension" });
    }

    const result = await uploadMembers(filePath, fileExt, clubId); // Pass clubId only

    console.log("File processing result:", result);

    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log("Temporary file deleted:", filePath);
      } else {
        console.log("File not found for deletion:", filePath);
      }
    } catch (deleteError) {
      console.error("Error deleting temporary file:", deleteError.message);
    }

    if (result.success) {
      return res.status(200).json({
        message: result.message,
        insertedCount: result.insertedCount,
        failedMembers: result.failedMembers,
      });
    } else {
      console.log("File processing failed:", result.message);
      return res.status(500).json({ error: result.message });
    }
  } catch (error) {
    console.error("Upload Error:", error);
    return res
      .status(500)
      .json({ error: "Something went wrong", details: error.message });
  }
};

module.exports = {
  uploadFileController,

  signupInvitedMemberController,
  inviteMemberController,
  addMemberController,
  updateMemberController,
  deleteMemberController,
  getAllMembersController,
  getMemberController,
};
