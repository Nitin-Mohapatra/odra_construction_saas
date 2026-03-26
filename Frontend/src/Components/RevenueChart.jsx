import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { Card, CardContent, Typography } from "@mui/material";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid
} from "recharts";

export default function RevenueChart() {

    const [data, setData] = useState([]);

    useEffect(() => {

        async function fetchRevenue() {

            try {

                const res = await axiosInstance.get("/admin/revenue-growth");
                console.log(res)
                setData(res.data.data);

            } catch (err) {

                console.log(err);

            }

        }

        fetchRevenue();

    }, [])

    return (

        // REMOVE Card wrapper completely

        <ResponsiveContainer width="100%" aspect={2}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" />

                <Tooltip
                    contentStyle={{
                        borderRadius: "10px",
                        border: "none",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
                    }}
                />

                <Bar
                    dataKey="revenue"
                    fill="#ffcc00"
                    radius={[6, 6, 0, 0]}
                />
            </BarChart>
        </ResponsiveContainer>
    )

}