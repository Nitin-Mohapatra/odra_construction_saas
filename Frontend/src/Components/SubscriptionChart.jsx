import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { Card, CardContent, Typography } from "@mui/material";

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

export default function SubscriptionChart() {

    const [data, setData] = useState([]);

    const COLORS = ["#ffcc00", "#222", "#999"];

    useEffect(() => {

        async function fetchStats() {

            try {

                const res = await axiosInstance.get("/admin/subscription-stats");

                const stats = res.data.data;

                const formatted = [
                    { name: "Free Users", value: stats.freeUsers },
                    { name: "Business 6M", value: stats.business6m },
                    { name: "Business 12M", value: stats.business12m }
                ];

                setData(formatted);

            } catch (err) {

                console.log(err);

            }

        }

        fetchStats();

    }, [])

    return (



        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label
                >
                    {data.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>

                <Tooltip />
                <Legend />
            </PieChart>
        </ResponsiveContainer>

    )

}