import {
  addAddress,
  deleteAddress,
  getAddresses,
  getProfile,
  updateProfile,
} from "./user.service.js";

export const profile = async (req, res) => {
  try {
    const user = await getProfile(req.user.userId);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const user = await updateProfile(req.user.userId, req.body);

    res.status(200).json({
      success: true,
      message: "Profile updated",

      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const createAddress = async (req, res) => {
  try {
    const address = await addAddress(req.user.userId, req.body);

    res.status(201).json({
      success: true,
      data: address,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const userAddresses = async (req, res) => {
  try {
    const addresses = await getAddresses(req.user.userId);

    res.status(200).json({
      success: true,
      data: addresses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const removeAddress = async (req, res) => {
  try {
    await deleteAddress(req.params.id, req.user.userId);

    res.status(200).json({
      success: true,
      message: "Address deleted",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
