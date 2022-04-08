import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import {
  query,
  collection,
  where,
  getDocs,
  addDoc,
  getDoc,
  doc,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore/lite";
import { db } from "../firebase";
import { Secret, sign } from "jsonwebtoken";

// @desc    Authenticate user
// @route   POST api/users/login
// @access  Public
const registerUser = expressAsyncHandler(async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  if (!firstname || !lastname || !email || !password) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  const user = await findOneUser(email);

  if (user) {
    res.status(400);
    throw new Error("User already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // create a user
  const savedUser = await addDoc(collection(db, "users"), {
    firstname,
    lastname,
    email,
    password: hashedPassword,
    createdAt: serverTimestamp(),
  });

  const newUser = await getDoc(doc(db, "users", savedUser.id));

  if (newUser && newUser.exists()) {
    const { firstname, lastname, email } = newUser.data();
    res.status(201).json({
      id: newUser.id,
      firstname,
      lastname,
      email,
      token: generateToken(newUser.id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Authenticate a user
// @route   POST api/users/login
// @access  Public
const loginUser = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await findOneUser(email);
  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      token: generateToken(user.id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }
});

// @desc    Get a user data
// @route   GET api/users/me
// @access  Private
const getMe = expressAsyncHandler(async (req, res) => {
  // @ts-ignore
  res.status(200).json(req.user);
});

// @desc    Delete a user
// @route   DELETE api/users/me
// @access  Private
const deleteMe = expressAsyncHandler(async (req, res) => {
  // @ts-ignore
  if (!req.user) {
    res.status(400);
    throw new Error("No user found");
  }

  // @ts-ignore
  if (req.user && req.user?.isAdmin) {
    res.status(401);
    throw new Error(
      "Your are not authorized to delete this account do it manually"
    );
  }

  // @ts-ignore
  await deleteDoc(doc(db, "users", req.user.id));
  res.status(200).json({
    // @ts-ignore
    id: req.user.id,
  });
});

function generateToken(id: string) {
  return sign({ id }, process.env.JWT_SECRET as Secret, {
    expiresIn: "30d",
  });
}

async function findOneUser(userEmail: string) {
  const q = query(collection(db, "users"), where("email", "==", userEmail));
  const users = await getDocs(q);
  if (users.empty) return null;
  const { firstname, lastname, email, password } = users.docs[0].data();
  return { id: users.docs[0].id, firstname, lastname, email, password };
}

export { registerUser, loginUser, getMe, deleteMe };
