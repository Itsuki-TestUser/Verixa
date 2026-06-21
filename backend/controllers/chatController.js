import Conversation from "../models/conversationModel.js";

// @desc    Get all conversations for a user (scoped to workspace)
// @route   GET /api/chat
// @access  Private
export const getConversations = async (req, res) => {
  try {
    const query = { user: req.user._id };

    // Only filter by workspaceId if it's a valid value
    if (
      req.workspaceId &&
      req.workspaceId !== "undefined" &&
      req.workspaceId !== "null"
    ) {
      query.workspaceId = req.workspaceId;
    }

    const conversations = await Conversation.find(query).sort({
      updatedAt: -1,
    });
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get a single conversation by ID
// @route   GET /api/chat/:id
// @access  Private
export const getConversationById = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);

    if (conversation) {
      if (conversation.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error("Not authorized");
      }
      res.json(conversation);
    } else {
      res.status(404);
      throw new Error("Conversation not found");
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Create or update a conversation
// @route   POST /api/chat
// @access  Private
export const saveConversation = async (req, res) => {
  try {
    const { _id, title, messages } = req.body;

    if (_id) {
      const conversation = await Conversation.findById(_id);
      if (conversation) {
        if (conversation.user.toString() !== req.user._id.toString()) {
          res.status(401);
          throw new Error("Not authorized");
        }
        conversation.messages = messages;
        if (title && title !== "New Chat") conversation.title = title;
        const updatedConversation = await conversation.save();
        return res.json(updatedConversation);
      } else {
        res.status(404);
        throw new Error("Conversation not found");
      }
    } else {
      const conversation = new Conversation({
        user: req.user._id,
        title: title || "New Chat",
        messages,
        workspaceId: req.workspaceId || null,
      });

      const createdConversation = await conversation.save();
      res.status(201).json(createdConversation);
    }
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// @desc    Delete a conversation
// @route   DELETE /api/chat/:id
// @access  Private
export const deleteConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);

    if (conversation) {
      if (conversation.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error("Not authorized");
      }
      await conversation.deleteOne();
      res.json({ message: "Conversation removed" });
    } else {
      res.status(404);
      throw new Error("Conversation not found");
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
