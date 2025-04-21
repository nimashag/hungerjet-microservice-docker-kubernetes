import { Request, Response } from 'express';
import UserModel, { IUser } from '../models/users.model';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// REGISTER
export const registerUser = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      password,
      role,
      phone,
      address,
      restaurantName,
      restaurantAddress,
      vehicleType,
      licenseNumber,
    } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    if (role === 'restaurantAdmin' && (!restaurantName || !restaurantAddress)) {
      return res.status(400).json({ message: 'Restaurant details are required' });
    }

    if (role === 'deliveryPersonnel' && (!vehicleType || !licenseNumber)) {
      return res.status(400).json({ message: 'Vehicle and license details are required' });
    }

    const newUser = new UserModel({
      name,
      email,
      password,
      role,
      phone,
      address,
      restaurantName,
      restaurantAddress,
      vehicleType,
      licenseNumber,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Registration failed', error: err });
  }
};

// LOGIN
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Login failed', error: err });
  }
};

// GET CURRENT USER /me
export const getMyProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const user = await UserModel.findById(userId).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    console.error('Get /me error:', err);
    res.status(500).json({ message: 'Failed to fetch user', error: err });
  }
};

// GET ALL USERS – Admin Only
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserModel.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err });
  }
};

// UPDATE USER BY ID – Admin Only
export const updateUserById = async (req: Request, res: Response) => {
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).select('-password');

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User updated successfully', user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update user', error: err });
  }
};

// DELETE USER BY ID – Admin Only
export const deleteUserById = async (req: Request, res: Response) => {
  try {
    const deletedUser = await UserModel.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user', error: err });
  }
};
