const {
  addMember,
  updateMember,
  deleteMember,
  getAllMembers,
  getMember,
} = require("../services/memberService");

const addMemberController = async (req, res) => {
  const response = await addMember(req.body);
  res.status(response.success ? 201 : 400).json(response);
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

  const response = await getAllMembers(filters, search);

  res.status(response.success ? 200 : 400).json(response);
};

const getMemberController = async (req, res) => {
  const response = await getMember(req.params.id);
  res.status(response.success ? 200 : 400).json(response);
};
module.exports = {
  addMemberController,
  updateMemberController,
  deleteMemberController,
  getAllMembersController,
  getMemberController,
};
