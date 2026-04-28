import React, { memo } from 'react'
import { Box } from '@mui/material'

const MessageItem = memo(({ message, isOwn }) => {
    return (
        <Box
            sx={{ textAlign: isOwn ? "right" : "left", margin: "6px 0" }}
        >
            <span
                style={{
                    padding: "8px 12px",
                    borderRadius: "10px",
                    background: isOwn ? "#dcf8c6" : "#fff",
                    color: "#111",
                    display: "inline-block",
                    borderRadius: isMine
                        ? "16px 16px 4px 16px"   // right bubble
                        : "16px 16px 16px 4px",  // left bubble
                    boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
                    wordBreak: "break-word"
                }}
            >
                {message.message}
            </span>
        </Box>
    )
})

export default MessageItem