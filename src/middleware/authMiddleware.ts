import expressAsyncHandler from "express-async-handler";
import { doc, getDoc } from "firebase/firestore/lite";
import { Secret, verify } from "jsonwebtoken";
import { db } from "../firebase";

const protect = expressAsyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // get token
      token = req.headers.authorization.split(" ")[1];
      const decode = verify(token, process.env.JWT_SECRET as Secret);
      // @ts-ignore
      req.user = await findByID(decode.id);
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized");
    }
  }
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

async function findByID(id: string) {
  const user = await getDoc(doc(db, "users", id));
  if (!user.exists() || !user.data()) return null;
  const { firstname, lastname, email, createdAt, isAdmin } = user.data();
  return { id: user.id, firstname, lastname, email, createdAt, isAdmin };
}

export { protect };
