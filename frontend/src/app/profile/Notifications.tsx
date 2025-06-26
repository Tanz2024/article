"use client";
import { useEffect, useState } from "react";
import { fetchNotifications } from "../../lib/profileApi";

const mockNotifications = [
	{
		id: 1,
		type: "info",
		message: "Your article 'AI in 2025' was approved!",
		date: "2025-06-20",
	},
	{
		id: 2,
		type: "success",
		message: "You earned a badge: Top Contributor!",
		date: "2025-06-18",
	},
	{
		id: 3,
		type: "warning",
		message: "Profile incomplete. Add your bio for more visibility.",
		date: "2025-06-15",
	},
];

export default function Notifications() {
	const [notifications, setNotifications] = useState<any[]>([]);

	useEffect(() => {
		fetchNotifications().then(setNotifications);
	}, []);

	if (!notifications.length) return null;

	return (
		<div className="my-6">
			<h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2">
				Notifications
			</h2>
			<ul className="space-y-2">
				{notifications.map((n) => (
					<li
						key={n.id}
						className={`rounded-lg px-3 sm:px-4 py-2 sm:py-3 shadow bg-${
							n.type === "success"
								? "green"
								: n.type === "warning"
								? "yellow"
								: "blue"
						}-50 dark:bg-${
							n.type === "success"
								? "green"
								: n.type === "warning"
								? "yellow"
								: "blue"
						}-900/20 border-l-4 border-${
							n.type === "success"
								? "green"
								: n.type === "warning"
								? "yellow"
								: "blue"
						}-400 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-0`}
					>
						<span className="text-xs sm:text-sm font-medium">{n.message}</span>
						<span className="text-xs text-gray-400 ml-0 sm:ml-4">
							{n.date}
						</span>
					</li>
				))}
			</ul>
		</div>
	);
}
