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
                    background: isOwn ? "#1976d2" : "#eee",
                    color: isOwn ? "#fff" : "#000",
                    display: "inline-block"
                }}
            >
                {message.message}
            </span>
        </Box>
    )
})

export default MessageItem