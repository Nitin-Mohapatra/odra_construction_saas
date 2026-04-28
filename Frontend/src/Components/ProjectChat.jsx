import React, { useEffect, useRef, useState } from "react";
import axiosInstance from "../utils/axiosInstance"
import { io } from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { canAccess } from "../utils/subscription";
import { useNavigate } from "react-router-dom";
import MessageItem from "./MessageItem";

export default function ProjectChat({ projectId, onMessageSent }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);

    // checking access and making the connection 
    useEffect(() => {
        if (!canAccess("chat")) {
            toast.error("Upgrade to Business Plan to unlock Attendance.");
            navigate("/site-engineer/projects")
            return;
        }
    }, []);

    // 🔐 get current user id from JWT
    const token = localStorage.getItem("token");
    if (!token) return null;
    const decoded = jwtDecode(token);
    const currentUserId = decoded.User_id;

    /* -------------------------
       1️⃣ Load old chat messages
    -------------------------- */
    const fetchChats = async (pageNumber = 0,container = null) => {
        if (loading) return;

        try {
            console.log("New load call hit");
            setLoading(true);

            let prevHeight = 0;
            if (container) {
                prevHeight = container.scrollHeight;
            }

            const res = await axiosInstance.get(
                `/chat/${projectId}?page=${pageNumber}&limit=20`
            );

            const newChats = res.data.chats;

            if (pageNumber === 0) {
                setMessages(newChats) //initial load
            } else {
                setMessages(prev => [...newChats, ...prev]);
            }

            
            // setMessages(res.data.chats);
            if (newChats.length < 20) {
                setHasMore(false);
            }

            if (container) {
                setTimeout(() => {
                    container.scrollTop = container.scrollHeight - prevHeight;
                }, 0);
            }
            console.log("Show prev mesg", newChats);
        } catch (err) {
            console.error("Failed to load chats:", err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        setPage(0);
        setHasMore(true);
        fetchChats(0);
    }, [projectId]);

    /* -------------------------
       2️⃣ Setup socket connection
    -------------------------- */
    useEffect(() => {
        const socket = io(import.meta.env.VITE_API_URL, {
            transports: ["websocket"],
        });

        socketRef.current = socket;

        socket.on("connect", () => {
            console.log("Chat socket connected:", socket.id);

            socket.emit("join", {
                projectId,
                organizationId: decoded.organizationId,
                isChat: true
            });
        });

        socket.on("chat:new", (data) => {
            setMessages((prev) => [...prev, data]);
        });

        socketRef.current.on("project:deleted", (data) => {
            toast.info("Project has been deleted");
            navigate(`/site-engineer/projects`);
        });


        return () => {
            socket.emit("leave", { projectId });
            socket.off("chat:new");
            socket.disconnect();
            socketRef.current = null;
        };
    }, [projectId]);

    /* -------------------------
       3️⃣ Send message
    -------------------------- */
    const sendMessage = () => {
        if (!newMessage.trim()) return;

        socketRef.current.emit("chat:new", {
            projectId,
            senderId: currentUserId,
            message: newMessage
        });

        setNewMessage("");

        // Notify parent that a message was sent (mark as read)
        if (onMessageSent) {
            onMessageSent();
        }
    };


    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages])


    return (
        <Box sx={{ mt: 3 }}>
            <Typography variant="h4" gutterBottom>
                Project Chat
            </Typography>

            <Box
                sx={{
                    border: "1px solid #ddd",
                    p: 2,
                    height: 300,
                    overflowY: "auto",
                    mb: 2,
                    backgroundColor: "#ece5dd",
                    borderRadius:"2em"
                }}
                onScroll={(e) => {
                    const container = e.target;

                    if (container.scrollTop === 0 && hasMore && !loading) {
                        const nextPage = page + 1;
                        setPage(nextPage);

                        fetchChats(nextPage, container);
                    }
                }}
            >
                {!loading && messages.length === 0 && (
                    <Typography color="text.primary">
                        No messages yet.
                    </Typography>
                )}

                {loading && (
                    <Typography align="center" fontSize={12}>
                        Loading older messages...
                    </Typography>
                )}

                {messages.map((msg) => (
                    <MessageItem
                        key={msg._id}
                        message={msg}
                        isOwn={msg.senderId === userId}
                    />
                ))}


                <div ref={messagesEndRef}></div>
            </Box>

            <Box sx={{ display: "flex", gap: 1 }}>
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <Button variant="contained" onClick={sendMessage}>
                    Send
                </Button>
            </Box>
        </Box>
    );
}
