import { ThreadChannel } from "discord.js";
import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import {
  collection,
  doc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore/lite";
import { client } from "../bot";
import { db } from "../firebase";

// @desc    Get all messages of thread
// @route   GET api/thread/message
// @access  Private
const getMessages = expressAsyncHandler(async (req: Request, res: Response) => {
  const threadId = req.params.id;

  // @ts-ignore
  if (!req.user.isAdmin) {
    res.status(401);
    throw new Error("Your are not authorized for this operation");
  }

  const thread = (await client.channels.fetch(
    threadId as string
  )) as ThreadChannel;

  if (!thread) {
    res.status(404);
    throw new Error("Thread with this id not found");
  }
  const messages = await thread.messages.fetch();

  res.status(200).json({
    messages: messages || [],
  });
});

// @desc    Send message in thread
// @route   POST api/thread/message
// @access  Private
const sendMessages = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const threadId = req.params.id;
    const { text } = req.body;
    if (!text) {
      res.status(400);
      throw new Error("Please provide text");
    }

    // @ts-ignore
    if (!req.user.isAdmin) {
      res.status(401);
      throw new Error("Your are not authorized for this operation");
    }

    const thread = (await client.channels.fetch(
      threadId as string
    )) as ThreadChannel;

    if (!thread) {
      res.status(404);
      throw new Error("Thread with this id not found");
    }
    await thread.send(text);
    res.status(200).json({
      message: "Message sent",
    });
  }
);

// @desc    Thread is resolved and archive this thread
// @route   POST api/thread/resolve
// @access  Private
const resolveThread = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const threadId = req.params.id;

    // @ts-ignore
    if (!req.user?.isAdmin) {
      res.status(401);
      throw new Error("Your are not authorized for this operation");
    }

    const thread = (await client.channels.fetch(
      threadId as string
    )) as ThreadChannel;

    if (!thread) {
      res.status(404);
      throw new Error("Thread with this id not found");
    }

    if (thread.archived) {
      res.status(400);
      throw new Error("Thread is already archived");
    }

    await thread.send(
      "Conversation marked as resolved and this thread will be archived"
    );

    await thread.setArchived(true);

    getDocs(
      query(
        collection(db, "tickets"),
        where("threadId", "==", threadId),
        limit(1)
      )
    )
      .then((snapshot) => {
        const foundThread = snapshot.docs[0];
        setDoc(
          doc(db, "tickets", foundThread.id),
          {
            archived: true,
            closedAt: serverTimestamp(),
          },
          { merge: true }
        ).catch(() => {});
      })
      .catch(() => {});

    res.status(200).json({
      message: "Thread resolved",
    });
  }
);

// @desc    Get all thread tickets
// @route   GET api/thread/tickets
// @access  Private
const getThreadTickets = expressAsyncHandler(async (req, res) => {
  // @ts-ignore
  if (!req.user || !req.user.isAdmin) {
    res.status(401);
    throw new Error("Not authorized");
  }

  const data = await getDocs(collection(db, "tickets"));
  const tickets = data.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  res.status(200).json({
    tickets: tickets || [],
  });
});

export { getMessages, sendMessages, resolveThread, getThreadTickets };
